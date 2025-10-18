require('dotenv').config();
const express = require("express");
const multer = require("multer");
const path = require('path');
const Blog = require("../models/blog")
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require("dotenv")

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads',  // Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],

    // 🔥 Custom filename logic
    public_id: (req, file) => {
      // Example: userID + timestamp
      const filename = `${Date.now()}-${file.originalname.split('.')[0]}`;
      return filename;
    }
  },
});

const upload = multer({
    storage:storage
});

router.get("/add-new", (req,res) =>{
    return res.render("addBlog", {
        user: req.user,
    });
});

router.post("/", upload.single("coverImage"), async (req,res) =>{
    // console.log(req.body);
    // console.log(req.file);
    const {title,body} = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: req.file.path,
    });


    return res.redirect("/");
});

// 
router.get("/:id", async(req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");


    return res.render("viewBlog",{
        user: req.user,
        blog: blog,
    })
})




module.exports = router;