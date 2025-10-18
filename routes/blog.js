require('dotenv').config();
const express = require("express");
const multer = require("multer");
const path = require('path');
const streamifier = require('streamifier');
const Blog = require("../models/blog");
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Multer memory storage (no disk files)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET: Add new blog page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// POST: Create blog
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;
    let coverImageURL = null;

    // Upload to Cloudinary if a file is provided
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads',
            public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-').toLowerCase()}`
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      coverImageURL = uploadResult.secure_url;
    }

    // Create blog in MongoDB
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL
    });

    return res.redirect("/");
  } catch (error) {
    console.log(error)
    console.error("Error creating blog:", error);
    res.status(500).send("Error creating blog");
  }
});

// GET: View single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    return res.render("viewBlog", {
      user: req.user,
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching blog");
  }
});

module.exports = router;
