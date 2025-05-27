import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "../OrderCard";

const Orders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [whatStore, setWhatStore] = useState(1);
  const [orders, setOrders] = useState([]);

  //Geting orders
  const fetchOrders = () => {
    axios
      .get(`${apiUrl}/orders`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Brak połączenia z bazą danych!");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (whatStore === 1) return order.store === "Łódź";
    if (whatStore === 2) return order.store === "Łęczyca";
    return false;
  });

  const activeOrders = filteredOrders.filter(
    (order) => order.status !== "completed"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );

  //Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  //Delete order older then 30days
  useEffect(() => {
    const deleteOldOrders = async () => {
      try {
        const { data: orders } = await axios.get(`${apiUrl}/orders`);

        const today = new Date();

        for (const order of orders) {
          const parts = order.date.split(".");
          const orderDate = new Date(parts[2], parts[1] - 1, parts[0]);

          const diffTime = today - orderDate; // różnica w ms
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          if (diffDays > 30) {
            await axios.delete(`${apiUrl}/orders/${order._id}`);
            console.log(`Usunięto zamówienie o ID: ${order._id}`);
          }
        }
      } catch (error) {
        console.error("Błąd podczas usuwania starych zamówień:", error);
      }
    };

    deleteOldOrders();
  }, []);

  //SUMMARY
  const parseDate = (dateStr) => {
    const parts = dateStr.split(".");
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const sumProductsByDate = (orders, targetDate) => {
    const productSums = {};

    orders.forEach((order) => {
      const orderDate = parseDate(order.date);
      if (isSameDay(orderDate, targetDate)) {
        order.products.forEach((prod) => {
          if (!productSums[prod.name]) {
            productSums[prod.name] = { quantity: 0, unit: prod.unit };
          }
          productSums[prod.name].quantity += prod.quantity;
        });
      }
    });

    return productSums;
  };

  const currentStoreName = whatStore === 1 ? "Łódź" : "Łęczyca";

  const soldToday = sumProductsByDate(
    completedOrders.filter((order) => order.store === currentStoreName),
    today
  );
  const soldYesterday = sumProductsByDate(
    completedOrders.filter((order) => order.store === currentStoreName),
    yesterday
  );

  return (
    <section className="h-[50vh] overflow-y-scroll">
      <nav className="mb-5">
        <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
          <li onClick={() => setWhatStore(1)}>
            Łódź
            {whatStore === 1 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
          <li className="text-(--background)"> | </li>
          <li onClick={() => setWhatStore(2)}>
            Łęczyca
            {whatStore === 2 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
        </ul>
      </nav>
      <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">Aktywne:</h1>
      <ul className="flex flex-col lg:flex-row flex-wrap w-[90%] gap-[4vw]">
        {activeOrders.length > 0 ? (
          activeOrders.map((order, index) => (
            <OrderCard
              key={index}
              order={order}
              onStatusUpdate={updateOrderStatus}
            />
          ))
        ) : (
          <p>Brak aktywnych zamówień</p>
        )}
      </ul>

      <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">Zakończone:</h1>
      <ul className="flex flex-col lg:flex-row flex-wrap w-[90%] gap-[4vw]">
        {completedOrders.length > 0 ? (
          completedOrders.map((order, index) => (
            <OrderCard
              key={index}
              order={order}
              onStatusUpdate={updateOrderStatus}
            />
          ))
        ) : (
          <p>Brak aktywnych zamówień</p>
        )}
      </ul>
      <div className="flex justify-around mb-10">
        <div>
          <h2>Wczoraj</h2>
          {Object.keys(soldYesterday).length === 0 ? (
            <p>Brak sprzedaży</p>
          ) : (
            Object.entries(soldYesterday).map(([name, { quantity, unit }]) => (
              <p key={name}>
                {name}: {quantity} {unit}
              </p>
            ))
          )}
        </div>

        <div>
          <h2>Dziś</h2>
          {Object.keys(soldToday).length === 0 ? (
            <p>Brak sprzedaży</p>
          ) : (
            Object.entries(soldToday).map(([name, { quantity, unit }]) => (
              <p key={name}>
                {name}: {quantity.toFixed(2)} {unit}
              </p>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Orders;
