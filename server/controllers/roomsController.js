/* eslint-disable prefer-const */
const { RoomPreferencesOutlined } = require('@mui/icons-material');
const Room = require('../models/roomModel');
const User = require('../models/userModel');
const Redis = require('redis');

const redisClient = Redis.createClient({
  host: 'redis-server',
  port: 6379
});

redisClient.connect().then(() => {
  console.log('roomsController Redis client connected');
}).catch(err => console.error(err));

process.on('exit', async () => {
  await redisClient.flushAll();
  await redisClient.close();
  console.log('Closing server...');
});

//Function to get or set a key in redis client
const redisGetOrSet = async (key, fn) => {
  try {
    //Check to see if the key already exists and return its value if it does
    const data = await redisClient.get(key);
    if (data && (data !== 'fetchAgain')) return JSON.parse(data);

    //Otherwise run callback function and set the key to that value
    else {
      const freshData = await fn();
      redisClient.set(key, JSON.stringify(freshData));
      return freshData;
    }
  } catch (err) {
    return err;
  }
};

//CONTROLLER FUNCTIONS
const roomsController = {};

roomsController.getAllRooms = async (req, res, next) => {

  try {
    let roomsList;
    roomsList = await redisGetOrSet(`getAllRooms${req.params.subject}`, async () => {
      const { subject } = req.params;

      if (subject === 'all') {
        return await Room.find({}).where('active').equals(true).populate('host');
      }
      else {
        return await Room.find({ subject: subject }).where('active').equals(true).populate('host');
      }
    });

    res.locals.rooms = roomsList;
    if (roomsList.length === 0) {
      res.locals.rooms = 'There are no active rooms for this subject';
    }

    return next();
  } catch (err) {
    return next({
      log: 'roomsController.getAllRooms' + err,
      message: { err: 'roomsController.getAllRooms: ERROR: could not get rooms'}
    });
  }

};

roomsController.getRoom = async (req, res, next) => {
  try {
    let roomDoc;
    roomDoc = await redisGetOrSet(`getRoom${res.locals.roomId}`, async () => {
      
      return await Room.findById(res.locals.roomId).populate('host');
    });
    // gets room id from cookie
    console.log('GET ROOM CONTROLLER ROOM DOC ', roomDoc);
    res.locals.roomDoc = roomDoc;
    return next();
  } catch (err) {
    return next(err);
  }
};

roomsController.openNewRoom = async (req, res, next) => {
  try {
    // getting current user id from token
    const { _id: host } = res.locals.token;
    console.log(host);
    // getting room info from request
    const { subject, restricted, allowedUsers, active } = req.body;
    const newRoom = await Room.create({
      host, subject, restricted,
      allowedUsers, active
    });

    // add new room to host user's rooms list
    const hostUser = await User.findById(host);
    hostUser.rooms.push(newRoom._id);
    await hostUser.save();

    await newRoom.populate('host');
  
    //update user information in redisClient
    await redisClient.set(`getUserById${host}`, JSON.stringify(hostUser));

    //Set both allRooms and allRoomsSubject keys to fetchAgain so the next time they are queried the correct database query will be run
    await redisClient.set('getAllRoomsall', 'fetchAgain');
    await redisClient.set(`getAllRooms${subject}`, 'fetchAgain');

    res.locals.newRoom = newRoom;
    return next();
  } catch (err) {
    return next({
      log: 'roomsController.openNewRoom' + err,
      message: { err: 'roomsController.openNewRoom: ERROR: could not create room'}
    });
  }

};

// the below controller is currently not in use as of 10-11-22
roomsController.getUserRooms = async (req, res, next) => {

  try {
    const { user_id } = req.params;

    const rooms = await Room.find({ host: user_id });
    res.locals.userRooms = rooms;

    return next();
  } catch (err) {
    return next({
      log: 'roomsController.getUserRooms' + err,
      message: { err: 'roomsController.getUserRooms: ERROR: could not get user rooms'}
    });
  }

};

roomsController.deleteRoom = async (req, res, next) => {

  try {
    const { id: _id } = req.params;
    const roomDelete = await Room.findOneAndDelete({ _id });
    res.locals.deletedRoom = roomDelete;
    
    console.log('Deleted Room: ', roomDelete);
    // updated host users rooms list
    const user = await User.findOneAndUpdate({ _id: roomDelete.host },
      { $pull: { rooms: _id } },
      { new: true });
    
    //Need to update user room array in Redis
    await redisClient.set(`getUserById${roomDelete.host}`, JSON.stringify(user));
    
    //Delete key corresponding to room ID
    await redisClient.del(`getRoom${roomDelete._id}`);
    
    //Set both allRooms and allRoomsSubject keys to fetchAgain so the next time they are queried the correct database query will be run
    await redisClient.set('getAllRoomsall', 'fetchAgain');
    await redisClient.set(`getAllRooms${roomDelete.subject}`, 'fetchAgain');

    return next();

  } catch (err) {
    return next({
      log: 'roomsController.deleteRoom' + err,
      message: { err: 'roomsController.deleteRoom: ERROR: could not delete room'}
    });
  }
};

roomsController.updateRoom = async (req, res, next) => {

  try {
    // collect room information
    const { id } = req.params;
    const { subject, restricted, maxallowed, allowedUsers } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(id, { subject, restricted, maxallowed, allowedUsers }, {new: true});
    res.locals.updatedRoom = updatedRoom;

    await redisClient.set(`getRoom${updatedRoom._id}`, JSON.stringify(updatedRoom));

    console.log('UPDATE ROOM CONTROLLER: ', updatedRoom);

    return next();
  } catch (err) {
    return next({
      log: 'roomsController.updateRoom' + err,
      message: { err: 'roomsController.updateRoom: ERROR: could not update room'}
    });
  }
};

roomsController.updateMessages = async (req, res, next) => {
  try {
    // Collect room information
    const { id } = req.params;
    const { messages } = req.body;

    console.log('RoomsController updateMessages: ', messages);

    const updatedRoom = await Room.findByIdAndUpdate(id, { messages: messages }, {new: true});
    res.locals.updatedMessages = updatedRoom.messages;

    await redisClient.set(`getRoom${updatedRoom._id}`, JSON.stringify(updatedRoom));

    console.log('UPDATE ROOM CONTROLLER: ', updatedRoom);

    return next();

  } catch (err) {
    return next({
      log: 'roomsController.updateMessages ' + err,
      message: { err: 'roomsController.updateMessages: ERROR: could not update room'}
    });
  }
};

roomsController.setActiveFile = async (req, res, next) => {
  try {
  // grab room id from res.locals
    const { roomId, fileName } = res.locals;
    // console.log('ROOM ID:',roomId)
    // grab fileName from req.params and set activefile in room doc
    const room = await Room.findByIdAndUpdate(roomId, {activeFile: fileName}, {new: true}).populate('host');
    console.log(room);
    
    //update roomid query
    await redisClient.set(`getRoom${roomId}`, JSON.stringify(room));
    
    //Set both allRooms and allRoomsSubject keys to fetchAgain so the next time they are queried the correct database query will be run
    await redisClient.set('getAllRoomsall', 'fetchAgain');
    await redisClient.set(`getAllRooms${room.subject}`, 'fetchAgain');

    return next();
    
  } catch(err) {
    return next({
      log: 'roomsController.setActiveFile' + err,
      message: { err: 'roomsController.setActiveFile: ERROR: could not set ActiveFile'}
    });
  }
};

module.exports = roomsController;