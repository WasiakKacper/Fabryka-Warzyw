const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

//Get all categories
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.type) {
    filter.type = req.query.type;
  }

  try {
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Add new category
router.post("/", async (req, res) => {
  const { name, type } = req.body;
  if (!name)
    return res.status(400).json({ message: "Nazwa kategorii wymagana" });
  if (type && !["standard", "horeca"].includes(type))
    return res.status(400).json({ message: "Nieprawidłowy typ kategorii" });

  try {
    const existing = await Category.findOne({ name });
    if (existing)
      return res.status(400).json({ message: "Kategoria już istnieje" });

    const newCategory = new Category({ name, type: type || "standard" });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
