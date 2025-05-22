const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  available: Boolean,
  category: String,
  pricePer: String,
  store: String,
});

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
