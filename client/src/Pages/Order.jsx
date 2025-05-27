import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Order = () => {
  const [isActive, setIsActive] = useState(false);
  const [option, setOption] = useState("store");

  const [cart, setCart] = useState([]);
  const [baseTotal, setBaseTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    const date = new Date();
    const day = date.getDay();

    if (day === 2 || day === 5) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  const calculateItemPrice = (item) => {
    // item.price - cena za pricePer jednostek
    // item.pricePer - np "/1kg", "/250g", "/szt"
    const quantity = item.quantity;
    const price = item.price;
    const pricePer = item.pricePer || "/1kg"; // załóżmy domyślnie 1kg

    if (pricePer.includes("kg")) {
      // Cena za kilogram
      return price * quantity; // quantity w kg, więc bez zmian
    } else if (pricePer.includes("g")) {
      // Cena za X gramów
      const grams = parseFloat(pricePer.replace(/[^\d]/g, "")); // np 250
      // quantity w kg, więc przelicz na ilość jednostek bazowych
      const quantityInGrams = quantity * 1000;
      return price * (quantityInGrams / grams);
    } else if (pricePer.includes("szt")) {
      // cena za sztukę
      return price * quantity;
    }
    // fallback
    return price * quantity;
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    const sum = savedCart.reduce(
      (acc, item) => acc + calculateItemPrice(item),
      0
    );
    setBaseTotal(Number(sum.toFixed(2)));
  }, []);

  useEffect(() => {
    let total = baseTotal;

    if (option === "delivery") {
      if (baseTotal < 99) {
        total += 5;
      }
    }

    setFinalTotal(Number(total.toFixed(2)));
    localStorage.setItem("total", JSON.stringify(total));
  }, [option, baseTotal]);

  const handleDeliveryChange = (e) => {
    if (e.target.checked) {
      setOption("delivery");
    } else {
      setOption("store");
    }
  };

  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(finalTotal));
  }, [finalTotal]);

  return (
    <main className="w-[90%] lg:w-[60%] h-[100%] mx-auto text-(--white) mb-20">
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
                  {item.price}zł x{Number(item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="flex text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5 w-full justify-end">
              Suma: {finalTotal}zł
            </h3>
          </div>
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
              <div className="flex flex-col items-end">
                {!isActive ? (
                  <p className="mb-4">niedostępna</p>
                ) : (
                  <input
                    type="checkbox"
                    name="delivery"
                    className="scale-200 mt-2 cursor-pointer"
                    onChange={(e) => {
                      setOption("delivery");
                      handleDeliveryChange(e);
                    }}
                  />
                )}
                <p>(5zł, dla zamówień {<br />} powyżej 99zł darmowa.)</p>
              </div>
            </section>
            <hr className="my-2 border-(--alternativeBackgroud)" />
            <section className="flex justify-between w-[100%]">
              <div>
                <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                  Odbiór w sklepie
                </h3>
                <p className="flex text-[3vw] md:text-[2vw] lg:text-[1vw]  w-[50%]">
                  (Cedry 4, 91-129 Łódź | Belwederska 42, 99-100 Łęczyca)
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
            <div className="flex items-start space-x-2 mt-10">
              <input
                type="checkbox"
                id="terms"
                onChange={(e) => {
                  if (e.target.checked) {
                    setTerms(true);
                  } else {
                    setTerms(false);
                  }
                }}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-(--white)">
                Akceptuję
                <Link to="/terms" className="underline text-blue-600 ml-2">
                  regulamin sklepu
                </Link>
                .
              </label>
            </div>
          </div>
          {terms ? (
            <Link
              to={option === "store" ? "/pickupstore" : "/pickupdelivery"}
              className="mx-auto w-[60%] flex items-center justify-center"
            >
              <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer hover:bg-(--hoverAccent) transition duration-400">
                Dalej
              </button>
            </Link>
          ) : (
            <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--background) mx-auto w-[60%] flex justify-center rounded-4xl text-(--white)">
              Dalej
            </button>
          )}
        </section>
      </section>
    </main>
  );
};

export default Order;
