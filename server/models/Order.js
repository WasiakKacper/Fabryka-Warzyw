const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  totalPrice: Number,
  pickupMethod: String,
  phoneNumber: String,
  status: { type: String, default: "active" },
  date: String,
  street: String,
  homeNumber: String,
  apartmentNumber: String,
  store: String,
  products: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
});

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;
