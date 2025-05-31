const express = require("express");
const ProductModel = require("../models/Products");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const router = express.Router();

//Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Storage (multer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for getting all products
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  try {
    if (!page || !limit) {
      // Bez paginacji: zwróć wszystkie produkty
      const products = await ProductModel.find().sort({ name: 1 });
      return res.json({ products });
    }

    const total = await ProductModel.countDocuments();
    const products = await ProductModel.find()
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const transformedProducts = products.map((product) => {
      if (product.image && typeof product.image === "string") {
        const newImageUrl = product.image.replace(
          "/upload/",
          "/upload/f_auto/"
        );
        return {
          ...product._doc,
          image: newImageUrl,
        };
      }
      return product;
    });

    res.json({
      products: transformedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania produktów" });
  }
});

//Endpoint for adding product
router.post("/", (req, res) => {
  const { name, price, category, image, public_id, pricePer, store } = req.body;

  const newProduct = new ProductModel({
    name,
    price,
    category,
    image,
    public_id,
    available: true,
    pricePer,
    store,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json(err));
});

// Endpoint for uploading images for products
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Brak pliku do przesłania." });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "fabryka-warzyw",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    res.json({ image: result.secure_url });
  } catch (error) {
    console.error("Błąd przesyłania do Cloudinary:", error);
    res.status(500).json({ message: "Błąd przesyłania obrazu", error });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const product = await ProductModel.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }

    await ProductModel.findByIdAndDelete(_id);
    res.status(200).json({ message: "Produkt usunięty" });
  } catch (err) {
    console.error("Błąd podczas usuwania produktu:", err);
    res
      .status(500)
      .json({ message: "Błąd podczas usuwania produktu", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
