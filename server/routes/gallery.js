const express = require("express");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const multer = require("multer");
const ImageModel = require("../models/Image.js");

const router = express.Router();
const upload = multer();

// Endpoint for uploading images for gallery
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "my-gallery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const newImage = new ImageModel({
      url: result.secure_url,
      public_id: result.public_id,
    });

    await newImage.save();
    res.status(200).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload nie powiódł się" });
  }
});

// Get all images in gallery
router.get("/", async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update image by id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image)
      return res.status(404).json({ message: "Zdjęcie nie znalezione" });

    await cloudinary.uploader.destroy(image.public_id);

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "my-gallery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    image.url = result.secure_url;
    image.public_id = result.public_id;
    await image.save();

    res.json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete image by id
router.delete("/:id", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image)
      return res.status(404).json({ message: "Zdjęcie nie znalezione" });

    await cloudinary.uploader.destroy(image.public_id);

    await image.deleteOne();

    res.json({ success: true, message: "Zdjęcie usunięte" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
