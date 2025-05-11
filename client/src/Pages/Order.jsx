import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Order = () => {
  const [isActive, setIsActive] = useState(false);
  const [option, setOption] = useState("store");

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState("00.00");

  useEffect(() => {
    const date = new Date();
    const day = date.getDay();

    if (day === 2 || day === 5) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")));
    setTotal(JSON.parse(localStorage.getItem("total")));
  }, []);

  return (
    <main className="w-[90%] lg:w-[60%] h-[100%] mx-auto">
      <section className="pt-45  mx-auto flex flex-col w-[90%]">
        <h1 className="text-center text-[8vw] md:text-[5vw] lg:text-[3vw] font-medium mb-10">
          Zamówienie
        </h1>
        <section>
          <h3 className="text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5">
            Produkty
          </h3>
          <ul className="text-[4vw] md:text-[3vw] lg:text-[2vw] text-(--alternativeBackground) mb-5 *:flex *:justify-between *:w-full">
            {cart.map((item, index) => (
              <li key={index}>
                <p>{item.name}</p>
                <p>
                  {item.price}zł x{item.quantity}
                </p>
              </li>
            ))}
          </ul>
          <h3 className="flex text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5 w-full justify-end">
            Suma: {total}zł
          </h3>
        </section>
        <section>
          <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] font-medium mb-5">
            Sposób odbioru
          </h3>
          <div className="mb-10">
            <section className="flex justify-between">
              <div>
                <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                  Dostawa
                </h3>
                <p className="flex text-[3vw] md:text-[2vw] lg:text-[1vw]  w-[50%]">
                  (Dostępna tylko wtorek i piątek na terenie Łodzi)
                </p>
              </div>
              <div>
                {!isActive ? (
                  "niedostępna"
                ) : (
                  <input
                    type="checkbox"
                    name="delivery"
                    className="scale-200 mt-2 cursor-pointer"
                    onChange={() => {
                      setOption("delivery");
                    }}
                  />
                )}
              </div>
            </section>
            <hr className="my-2 border-(--alternativeBackgroud)" />
            <section className="flex justify-between w-[100%]">
              <div>
                <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                  Odbiór w sklepie
                </h3>
                <p className="flex text-[3vw] md:text-[2vw] lg:text-[1vw]  w-[50%]">
                  (Cedry 4, 91-129 Łódź)
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="collection"
                  className="scale-200 mt-2 cursor-pointer"
                  onChange={() => {
                    setOption("store");
                  }}
                />
              </div>
            </section>
          </div>
          <Link
            to={option === "store" ? "/pickupstore" : "/pickupdelivery"}
            className="mx-auto w-[60%] flex items-center justify-center"
          >
            <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer">
              Dalej
            </button>
          </Link>
        </section>
      </section>
    </main>
  );
};

export default Order;
