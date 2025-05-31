const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ["standard", "horeca"], default: "standard" },
});

module.exports = mongoose.model("Category", categorySchema);
