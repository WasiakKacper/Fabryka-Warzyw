import React, { useState, useContext } from "react";
import { Link } from "react-router";
import axios from "axios";
import ShopContext from "../Context/ShopContext";

const apiUrl = import.meta.env.VITE_API_URL;

const submitOrder = async (orderData) => {
  try {
    await axios.post(`${apiUrl}/orders`, orderData);
  } catch (err) {
    alert("Błąd przy składaniu zamówienia" + err.message);
  }
};

const PickupStore = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [store, setStore] = useState("Łęczyca");
  const [showError, setShowError] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setCart } = useContext(ShopContext);

  function isValidPhoneNumber(phone) {
    const polishPhoneRegex = /^(\+48)?\d{9}$/;
    return polishPhoneRegex.test(phone);
  }

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setErrorMessage("Pole nie może być puste!");
      setShowError(true);
      return;
    }

    if (isValidPhoneNumber(phoneNumber)) {
      const orderData = {
        email: localStorage.getItem("email"),
        surname: localStorage.getItem("surname"),
        totalPrice: JSON.parse(localStorage.getItem("total")),
        pickupMethod: "Sklep",
        phoneNumber: phoneNumber,
        store: store,
        products: JSON.parse(localStorage.getItem("cart")),
      };

      await submitOrder(orderData);
      localStorage.setItem("cart", "[]");
      localStorage.setItem("total", "00.00");
      setCart(JSON.parse(localStorage.getItem("cart")));
      setOrderComplete(true);
    } else {
      setErrorMessage("Błędny numer telefonu!");
      setShowError(true);
    }
  };

  return (
    <main className="text-(--white)">
      {showError ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl text-(--white)">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              {errorMessage}
            </h3>
            <button
              className="mt-20 py-1 w-[30%] rounded-4xl mx-auto text-[4vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer"
              onClick={() => setShowError(false)}
            >
              Ok
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
      {orderComplete ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Dziękujemy za złożenie zamówienia!
            </h3>
            <button className="mt-20 py-1 w-[30%] rounded-4xl mx-auto text-[4vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer">
              <Link to="/">Strona główna</Link>
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
      <section className="w-[90%] lg:w-[60%] mx-auto pt-45">
        <h1 className="text-center text-[8vw] md:text-[5vw] lg:text-[4vw] font-medium mb-10">
          Zamówienie
        </h1>
        <div>
          <h3 className="flex text-[5vw] md:text-[4vw] lg:text-[3vw] font-medium mb-1 w-full">
            Odbiór w sklepie
          </h3>
          <p className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw]">
            (Cedry 4, 91-129 Łódź | Belwederska 42, 99-100 Łęczyca)
          </p>
          <p className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] text-(--alternativeBackground) py-3">
            * - wymagane
          </p>
        </div>
        <form className="flex flex-col mt-5" onSubmit={handleStoreSubmit}>
          <label
            htmlFor="number"
            className="text-[3vw] md:text-[2vw] lg:text-[1.5vw]"
          >
            Numer telefonu (do kontaktu)*
          </label>
          <input
            type="text"
            name="number"
            className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <label
            htmlFor="place"
            className="text-[3vw] md:text-[2vw] lg:text-[1.5vw]"
          >
            Wybierz sklep*
          </label>
          <select
            name="place"
            className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
            value={store}
            onChange={(e) => {
              setStore(e.target.value);
            }}
          >
            <option value="Łęczyca">Łęczyca</option>
            <option value="Łódź">Łódź</option>
          </select>

          <p className="text-[4vw] md:text-[3vw] lg:text-[2vw] py-20">
            Płatność tylko gotówka lub blik
          </p>
          <div className="flex items-center justify-center gap-10 w-full mb-10">
            <Link
              to="/order"
              className="flex items-center justify-center text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer"
            >
              Wróć
            </Link>
            <button
              type="submit"
              className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer"
            >
              Zamów
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default PickupStore;
