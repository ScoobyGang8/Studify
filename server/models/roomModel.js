const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  subject: { type: String, required: true },
  active: { type: Boolean },
  host: { type: Schema.Types.ObjectId, ref: 'User' },
  allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  pendingUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maxallowed: { type: Number, max: 6 },
  restricted: { type: Boolean, required: true },
  activeFile: { type: String },
  messages: [
    {
      from: { type: String },
      msg: { type: String } 
    }
  ]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
