const express = require("express");
const OrderModel = require("../models/Order.js");

const router = express.Router();

// Endpoint for creating orders (pickup)
router.post("/", (req, res) => {
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
    deliveryDay,
  } = req.body;

  const formatDateToPL = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const today = formatDateToPL();

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
    deliveryDay,
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

// Endpoint for getting orders
router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (err) {
    console.error("Błąd przy pobieraniu zamówień:", err);
    res.status(500).json({ message: "Błąd pobierania zamówień", error: err });
  }
});

// Endpoint for updating order status
router.put("/:id", async (req, res) => {
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

// Endpoint for deleting orders older than 30 days (by id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Zamówienie nie znalezione" });
    }
    res.status(200).json({ message: "Zamówienie usunięte" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera", error });
  }
});

module.exports = router;
