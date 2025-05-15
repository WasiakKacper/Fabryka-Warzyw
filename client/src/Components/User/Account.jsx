import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext";
import axios from "axios";
import OrderCard from "../OrderCard";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("email");
  const apiUrl = import.meta.env.VITE_API_URL;

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

  const { handleLogOut, username } = useContext(ShopContext);

  const handleOnClick = () => {
    handleLogOut();
  };

  const navigate = useNavigate();

  const activeOrders = orders.filter(
    (order) => order.status !== "completed" && order.email === email
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed" && order.email === email
  );

  return (
    <article className="pt-45 lg:pt-35 min-h-[100vh] h-[100%] px-5">
      <h1 className="w-[100%] text-[8vw] md:text-[6vw] lg:text-[4vw] font-medium">
        Witaj <span className="text-(--accent)">{username}</span>.
      </h1>
      <section className="flex flex-col *:text-center *:my-3">
        <div>
          <p className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
            Moje zamówienia
          </p>
        </div>

        <article className="overflow-y-scroll h-[50vh]">
          <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">Aktywne:</h1>
          <ul className="flex flex-col md:flex-row flex-wrap justify-evenly text-left">
            {activeOrders.length > 0 ? (
              activeOrders.map((order, index) => (
                <OrderCard key={index} order={order} />
              ))
            ) : (
              <p>Brak aktywnych zamówień</p>
            )}
          </ul>

          <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
            Zakończone:
          </h1>
          <ul className="flex flex-col md:flex-row flex-wrap justify-evenly text-left">
            {completedOrders.length > 0 ? (
              completedOrders.map((order, index) => (
                <OrderCard key={index} order={order} />
              ))
            ) : (
              <p>Brak zakończonych zamówień</p>
            )}
          </ul>
        </article>
        <button
          onClick={() => {
            handleOnClick();
            navigate("/login");
          }}
          className="w-[50%] md:w-[40%] lg:w-[30%] py-2 px-4 bg-(--alternativeAccent) text-(--white) mx-auto rounded-3xl cursor-pointer hover:bg-(--hoverAlternativeAccent) transition-all text-[5vw] md:text-[4vw] lg:text-[2vw] mt-10"
        >
          Wyloguj się
        </button>
      </section>
    </article>
  );
};

export default Account;
