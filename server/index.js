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
const ImageModel = require("./models/Image.js");

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
//Endpoint for login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
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
        bcrypt
          .genSalt(10)
          .then((salt) => {
            bcrypt
              .hash(password, salt)
              .then((hashedPassword) => {
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
  const { name, price, category, image, pricePer, store } = req.body;

  const newProduct = new ProductModel({
    name,
    price,
    category,
    image,
    available: true,
    pricePer,
    store,
  });

  newProduct
    .save()
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json(err));
});

//Adding images
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for uploading images for products
app.post("/images", upload.single("image"), async (req, res) => {
  try {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "my-gallery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const newImage = new ImageModel({
      url: result.secure_url,
      public_id: result.public_id,
    });

    await newImage.save();
    res.status(200).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload nie powiódł się" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/images/:id", upload.single("image"), async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image)
      return res.status(404).json({ message: "Zdjęcie nie znalezione" });

    await cloudinary.uploader.destroy(image.public_id);

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "my-gallery" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    image.url = result.secure_url;
    image.public_id = result.public_id;
    await image.save();

    res.json({ success: true, image });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/images/:id", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image)
      return res.status(404).json({ message: "Zdjęcie nie znalezione" });

    await cloudinary.uploader.destroy(image.public_id);

    await image.deleteOne();

    res.json({ success: true, message: "Zdjęcie usunięte" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//Endpoint for deleting products
app.delete("/products/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Produkt nie istnieje" });
    }

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
    store,
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
    store,
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
