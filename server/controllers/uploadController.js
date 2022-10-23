const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const fs = require('fs');
const utils = require('node:util');
require('dotenv').config();
const unlinkFile = utils.promisify(fs.unlink);

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const awsKey = process.env.AWS_BUCKET_ACCESS_KEY;
const awsSecret  = process.env.AWS_BUCKET_SECRET_KEY;

const uploadController = {};

// initializing S3Client object with id and accesskey as credentials
const s3 = new S3Client({
  credentials: {
    accessKeyId: awsKey,
    secretAccessKey: awsSecret
  },
  region: region,
});


uploadController.sendFile = async (req, res, next) => {
  
  // console.log('SEND FILE MIDDLEWARE ', req.file);
  
  try {
    //Create readstream from the req.file object
    // console.log('SENDFILE REQ', req.cookies);
    const filestream = await fs.createReadStream(req.file.path);

    //Define PutObjectCommand params
    const params = {
      Bucket: bucket,
      Key: req.file.filename,
      Body: filestream,
      ContentType: req.file.mimetype
    };

    //Create the PutObject command object and send it with the s3 client instance
    const command = new PutObjectCommand(params);
    const awsResponse = await s3.send(command);

    // console.log('SENDFILE RESPONSE', awsResponse, 'FILENAME', req.file.filename);
    
    //if $metadata.httpStatusCode is 200
    //save req.file.filename to res.locals.fileName
    //ese send back the httpStatusCode
    if(awsResponse.$metadata.httpStatusCode == 200) res.locals.fileName = req.file.filename;
    else return res.status(awsResponse.$metadata.httpStatusCode).send('File could not be uploaded to aws');
    //delete file on the server once it is successfully uploaded to bucket
    unlinkFile(req.file.path);

    return next();
    // res.status(200).json(awsResponse);
  } catch (err) {
    
    return next({
      log: 'Error in sendFile middleware',
      message: {
        err: err.message
      },
    });
  }
  
};

uploadController.getUserFiles = async(req, res, next) => {
  try{
    const key = req.params.fileKey;
    
    if (!key) return res.status(400).json('Please provide doc Id');

    const params = {
      Bucket: bucket,
      Key: key,
    };
  
    const command = new GetObjectCommand(params);
    
    res.locals.fileURL = await getSignedUrl(s3, command, { expiresIn: 36000 });
    res.locals.fileName = key;
    return next();
  } catch (err) {
    
    return next({
      log: 'Error in sendFile middleware',
      message: {
        err: err.message
      },
    });
  }



  // res.status(200).send(url);
};

uploadController.deleteUserFiles = async(req, res, next) => {
  try{
    const key = req.params.fileKey;
    if (!key) return res.status(400).json('Please provide doc Id');
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);

    const deleteResult = await s3.send(command);
    // console.log('DELETE OBJECT', deleteResult);

    res.locals.fileName = key;
    return next();
  } catch (err) {  
    return next({
      log: 'Error in deleteUserFiles middleware',
      message: {
        err: err.message
      },
    });
  }};

module.exports = uploadController;