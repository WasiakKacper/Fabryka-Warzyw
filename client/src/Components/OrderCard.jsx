import React, { useState } from "react";
import axios from "axios";

const OrderCard = ({ order, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const adminToken = localStorage.getItem("admin");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleMarkAsCompleted = async (orderId) => {
    if (!orderId) {
      setError("Brak ID zamówienia!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${apiUrl}/orders/${orderId}`, {
        status: "completed",
      });

      if (response.status === 200) {
        console.log("Zamówienie zaktualizowane:", response.data);
        onStatusUpdate(orderId, "completed");
      }
    } catch (error) {
      console.error("Błąd przy aktualizacji statusu:", error);
      setError("Wystąpił problem przy aktualizacji statusu zamówienia.");
    } finally {
      setLoading(false);
    }
  };

  const products = order.products;
  const orderStatus = order.status;
  const pickupMethod = order.pickupMethod;

  return (
    <div
      className="md:w-[50%] lg:w-[30%] text-(--white) p-4 rounded-4xl mb-10"
      style={
        orderStatus !== "completed"
          ? { backgroundColor: "var(--accent)" }
          : { backgroundColor: "var(--alternativeBackground)" }
      }
    >
      <div>
        <div className="mb-5">
          <h2 className="text-[2vw]">Zamówienie nr:</h2>
          <p>{order._id}</p>
        </div>
        <div>
          <h2>
            E-mail: <span>{order.email}</span>
          </h2>
          <h2>
            Numer telefonu: <span>{order.phoneNumber}</span>
          </h2>
        </div>
        <p>Status: {orderStatus !== "completed" ? "Aktywne" : "Zakończone"}</p>
        <h2>Odbiór: {pickupMethod}</h2>
        {pickupMethod !== "Sklep" ? (
          <h2>
            Adres: {order.street} {order.homeNumber}
            {order.apartmentNumber !== "" ? "/" : ""}
            {order.apartmentNumber}
          </h2>
        ) : (
          <></>
        )}
        <h2>Dzień dostawy: {order.deliveryDay}</h2>
        <h2>Produkty:</h2>
        <ul className="mb-3">
          {products.map((product, index) => (
            <li key={index}>
              {product.name} x{product.quantity} - {product.price}zł
            </li>
          ))}
        </ul>
      </div>
      {orderStatus !== "completed" && adminToken === "true" ? (
        <button
          onClick={() => handleMarkAsCompleted(order._id)}
          disabled={loading}
          className="bg-(--alternativeAccent) py-2 px-4 rounded-4xl cursor-pointer hover:bg(--hoverAlternativeAccent)"
        >
          {loading ? "Ładowanie..." : "Zakończ zamówienie"}
        </button>
      ) : (
        <></>
      )}
      {error && <p className="error">{error}</p>}
      <p className="text-[2vw]">{order.date}</p>
    </div>
  );
};

export default OrderCard;
