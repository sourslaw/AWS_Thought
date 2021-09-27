// https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require('uuid');

const params = fileName => { // receives parameter called, 'fileName'
  const myFile = fileName.originalname.split('.');
  const fileType = myFile[myFile.length - 1]; // storing reference to the fileType . . .

  const imageParams = { // must define all three properties of imageParams
    Bucket: 'user-images',
    Key: `${uuidv4()}.${fileType}`, // uuidv4() is used to ensure unique file name of this file
    Body: fileName.buffer // the temporary storage container of the image. once buffer has been used, temp. storage space is removed by multer middleware
  };

  return imageParams;
};


module.exports = params;