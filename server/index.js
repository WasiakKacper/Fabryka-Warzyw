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

const UserModel = require("./models/User.js");
const ProductModel = require("./models/Products.js");
const OrderModel = require("./models/Order.js");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "https://dulcet-daffodil-bbc936.netlify.app" }));

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
              res.json({ message: "Nie prawidłowe hasło!" });
            }
          })
          .catch((err) =>
            res
              .status(500)
              .json({ message: "Błąd porównywania haseł!", error: err.message })
          );
      } else {
        res.json({ message: "Użytkownik nie istnieje!" });
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
  const { name, price, category, image, pricePer } = req.body;

  const newProduct = new ProductModel({
    name,
    price,
    category,
    image,
    available: true,
    pricePer,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json(err));
});

//Adding images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for uploading images
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Brak pliku do przesłania." });
    }

    const streamUpload = (req) => {
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
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    res.json({ image: result.secure_url });
  } catch (error) {
    console.error("Błąd przesyłania do Cloudinary:", error);
    res.status(500).json({ message: "Błąd przesyłania obrazu", error });
  }
});

//Endpoint for deleting products
app.delete("/products/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    // Znajdź produkt w bazie danych
    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

    // Usuń produkt z bazy danych
    await ProductModel.findByIdAndDelete(_id);
    res.status(200).json({ message: "Produkt usunięty" });
  } catch (err) {
    console.error("Błąd podczas usuwania produktu:", err);
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
const PORT = process.env.PORT || 3001;

//Pinging
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.listen(PORT, () => console.log("Connect succesful!"));
