const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.js");

const router = express.Router();

// Endpoint for login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Użytkownik nie istnieje!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Nie prawidłowe hasło!" });
    }

    res.json({
      message: "Success",
      name: user.name,
      surname: user.surname,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

// Endpoint for register users
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      surname,
    });

    res.status(201).json({
      message: "Użytkownik zarejestrowany",
      user: {
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
});

module.exports = router;
