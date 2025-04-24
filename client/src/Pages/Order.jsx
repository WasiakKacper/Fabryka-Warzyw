import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

const Order = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const date = new Date();
    const day = date.getDay();

    if (day === 2 || day === 5) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  return (
    <main>
      <Navbar name="Cart" />
      <section className="pt-45  mx-auto flex flex-col w-[90%]">
        <h1 className="text-center text-[8vw] md:text-[5vw] lg:text-[3vw] font-medium mb-10">
          Zamówienie
        </h1>
        <section>
          <h3 className="text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5">
            Produkty
          </h3>
          <ul className="text-[4vw] md:text-[3vw] lg:text-[2vw] text-(--alternativeBackground) mb-5 *:flex *:justify-between *:w-full">
            <li>
              <p>Kapusta biała</p>
              <p>00,00zł</p>
            </li>
          </ul>
          <h3 className="flex text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5 w-full justify-end">
            Suma: 00,00zł
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
                />
              </div>
            </section>
          </div>
          <Link
            to="/summary"
            className="mx-auto w-[60%] flex items-center justify-center"
          >
            <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer">
              Zamów
            </button>
          </Link>
        </section>
      </section>
      <Footer />
    </main>
  );
};

export default Order;
