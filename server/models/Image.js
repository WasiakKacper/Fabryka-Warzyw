const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});
const ImageModel = mongoose.model("Image", imageSchema);
module.exports = ImageModel;
