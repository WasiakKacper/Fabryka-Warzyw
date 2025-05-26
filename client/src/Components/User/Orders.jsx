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
    </section>
  );
};

export default Orders;
