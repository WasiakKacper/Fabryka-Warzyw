const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const UserModel = require("./models/User.js");
const ProductModel = require("./models/Products.js");
const OrderModel = require("./models/Order.js");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

//Endpoint for login users
/* app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("Password is incorrect");
      }
    } else {
      res.json("User not exists");
    }
  });
}); */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        // Porównanie hasła z hashem w bazie
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (isMatch) {
              res.json({
                message: "Success",
                name: user.name,
                surname: user.surname,
                email: user.email,
              });
            } else {
              res.json({ message: "Password is incorrect" });
            }
          })
          .catch((err) =>
            res
              .status(500)
              .json({ message: "Error comparing password", error: err.message })
          );
      } else {
        res.json({ message: "User not exists" });
      }
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error finding user", error: err.message })
    );
});

//Endpoint for register users
app.post("/register", (req, res) => {
  const { email, password, name, surname } = req.body;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // Generowanie soli
        bcrypt
          .genSalt(10)
          .then((salt) => {
            // Haszowanie hasła
            bcrypt
              .hash(password, salt)
              .then((hashedPassword) => {
                // Tworzenie nowego użytkownika z zaszyfrowanym hasłem
                UserModel.create({
                  email,
                  password: hashedPassword,
                  name,
                  surname,
                })
                  .then((newUser) =>
                    res.status(201).json({
                      message: "Użytkownik zarejestrowany",
                      user: {
                        email: newUser.email,
                        name: newUser.name,
                        surname: newUser.surname,
                      },
                    })
                  )
                  .catch((err) =>
                    res.status(500).json({
                      error: "Błąd przy tworzeniu użytkownika",
                      details: err.message,
                    })
                  );
              })
              .catch((err) =>
                res.status(500).json({
                  error: "Błąd podczas haszowania",
                  details: err.message,
                })
              );
          })
          .catch((err) =>
            res.status(500).json({
              error: "Błąd przy generowaniu soli",
              details: err.message,
            })
          );
      } else {
        res.status(400).json({ message: "Użytkownik już istnieje" });
      }
    })
    .catch((err) =>
      res.status(500).json({
        error: "Błąd podczas wyszukiwania użytkownika",
        details: err.message,
      })
    );
});

// Endpoint for getting all products
app.get("/products", (req, res) => {
  ProductModel.find()
    .then((products) => res.json(products))
    .catch((err) => res.json(err));
});

//Endpoint for adding product
app.post("/products", (req, res) => {
  const { name, price, category, image } = req.body;

  const newProduct = new ProductModel({
    name,
    price,
    category,
    image,
    available: true,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json(err));
});

//Adding images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Endpoint for uploading images
app.post("/upload", upload.single("image"), (req, res) => {
  if (req.file) {
    res.json({ image: `http://localhost:3001/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: "Błąd przy przesyłaniu pliku." });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Endpoint for deleting products
app.delete("/products/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await ProductModel.findByIdAndDelete(_id);
    res.status(200).json({ message: "Produkt usunięty" });
  } catch (err) {
    console.error(err); // dodaj log błędu do konsoli
    res
      .status(500)
      .json({ message: "Błąd podczas usuwania produktu", error: err });
  }
});

//Endpoint for availability
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Błąd aktualizacji", error: err });
  }
});

const today = new Date().toLocaleDateString();

// Endpoint for creating orders (pickup)
app.post("/orders", (req, res) => {
  const {
    name,
    surname,
    email,
    totalPrice,
    pickupMethod,
    phoneNumber,
    products,
    date,
    street,
    homeNumber,
    apartmentNumber,
  } = req.body;

  const newOrder = new OrderModel({
    name,
    surname,
    email,
    totalPrice,
    pickupMethod,
    street,
    homeNumber,
    apartmentNumber,
    phoneNumber,
    status: "active",
    date: today,
    products: products.map((product) => ({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    })),
  });

  newOrder
    .save()
    .then((order) =>
      res.status(201).json({ message: "Zamówienie złożone", order })
    )
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Błąd przy składaniu zamówienia", error: err })
    );
});

//Endpoint for getting orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (err) {
    console.error("Błąd przy pobieraniu zamówień:", err);
    res.status(500).json({ message: "Błąd pobierania zamówień", error: err });
  }
});

// Endpoint for updating order status
app.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("Błąd przy aktualizacji statusu:", err);
    res.status(500).json({ message: "Błąd aktualizacji statusu", error: err });
  }
});

app.listen(3001, () => console.log("Connect succesful!"));
