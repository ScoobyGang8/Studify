const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
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

// initializing S3Client object with id and accesskey as credentials
const s3 = new S3Client({
  credentials: {
    accessKeyId: awsKey,
    secretAccessKey: awsSecret
  },
  region: region,
});

exports.sendFile = async (req, res, next) => {
  
  console.log('SEND FILE MIDDLEWARE ', req.file);
  
  try {
    //Create readstream from the req.file object
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

    //delete file on the server once it is successfully uploaded to bucket
    unlinkFile(req.file.path);

    res.status(200).json(awsResponse);
  } catch (err) {
    
    return next({
      log: 'Error in sendFile middleware',
      message: {
        err: err.message
      },
    });
  }
  
};

exports.getUserFiles = async(req, res, next) => {
  const key = req.params.imageKey;

  const params = {
    Bucket: bucket,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  //   const response = await s3.send(command).promise()
  //     .then(res => {
  //       return res.Body.toString('utf-8');
  //     })
  //     .catch(err => {
  //       return err; 
  //     });
  
  const url = await getSignedUrl(s3, command, { expiresIn: 36000 });

  res.status(200).send(url);
};
