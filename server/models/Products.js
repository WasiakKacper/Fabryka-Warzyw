const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  public_id: String,
  available: Boolean,
  category: String,
  pricePer: String,
  store: String,
  description: {
    type: String,
    default: "",
  }
});

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
