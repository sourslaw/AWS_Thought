const express = require('express');
const router = express.Router();
const multer = require('multer'); // middleware for handling mulitpart/form-data for uploading files
const paramsConfig = require('../utils/params-config');
const AWS = require('aws-sdk');

const storage = multer.memoryStorage({ // using multer to create temp. storage container until ready to upload to S3 bucket
  destination: function(req, file, callback) {
    callback(null, '');
  }
});
// declaring upload object (contains storage destination key, image). image is the key
const upload = multer({storage}).single('image');
// instantiating service object to communicate with S3 service
const s3 = new AWS.S3({ 
  apiVersion: '2006-03-01'
})

// POST image-upload route
router.post('/image-upload', upload, (req, res) => {
  console.log("post('/api/image-upload'", req.file);
  // set up params config
  const params = paramsConfig(req.file); // retrieve file object (req.file) from route using multer. assign returned object from paramsConfig to params object
  // set up S3 service call
  s3.upload(params, (err, data) => {
    if(err) {
      console.log(err); 
      res.status(500).send(err);
    }
    res.json(data); // send retrived data back to client. data contains; image file's metadata (url, bucket name, file name, more . ..)
  });
});


module.exports = router;