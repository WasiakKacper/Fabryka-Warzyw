const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const usersRouter = require("./routes/users.js");
const productsRouter = require("./routes/products.js");
const galleryRouter = require("./routes/gallery.js");
const ordersRouter = require("./routes/orders.js");
const categoriesRouter = require("./routes/categories");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://fabrykawarzyw.pl",
      "https://fabrykawarzyw.netlify.app",
      "http://localhost:4173",
      "http://localhost:5173",
    ],
  })
);

mongoose.connect(process.env.MONGODB_URI);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/gallery", galleryRouter);
app.use("/orders", ordersRouter);
app.use("/categories", categoriesRouter);

//Pinging
app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log("Connect succesful!"));
