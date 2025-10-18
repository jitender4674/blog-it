require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

cloudinary.uploader.upload('./public/images/default.jpg', { folder: 'uploads' })
  .then(res => console.log("Uploaded to:", res.secure_url))
  .catch(err => console.error("Error:", err));
