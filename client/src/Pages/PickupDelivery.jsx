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

const PickupDelivery = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [homeNumber, setHomeNumber] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [place, setPlace] = useState("");

  const { setCart } = useContext(ShopContext);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const checkPostalCode = (code) => {
    const cleaned = code.replace(/\s|-/g, "");
    if (!/^\d{5}$/.test(cleaned)) return false;

    const prefix = cleaned.slice(0, 2);
    return ["90", "91", "92", "93", "94"].includes(prefix);
  };

  const getDeliveryDay = () => {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();

    if (
      (day === 4 && hour >= 20) ||
      day === 5 ||
      day === 6 ||
      day === 0 ||
      (day === 1 && hour < 20)
    ) {
      return "wtorek";
    } else {
      return "piatek";
    }
  };

  function isValidPhoneNumber(phone) {
    const polishPhoneRegex = /^(\+48)?\d{9}$/;
    return polishPhoneRegex.test(phone);
  }

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !street || !homeNumber || !place || !postalCode) {
      setErrorMessage("Żadne wymagane pole nie może pozostać puste!");
      setShowError(true);
      return;
    } else {
      if (isValidPhoneNumber(phoneNumber)) {
        const normalizedPlace = place.trim().toLowerCase();
        if (
          ["łódź", "lodz"].includes(normalizedPlace) &&
          checkPostalCode(postalCode)
        ) {
          const deliveryDay = getDeliveryDay();
          const orderData = {
            email: localStorage.getItem("email"),
            surname: localStorage.getItem("surname"),
            totalPrice: JSON.parse(localStorage.getItem("total")),
            pickupMethod: "Dostawa",
            street: street,
            homeNumber: homeNumber,
            apartmentNumber: apartmentNumber,
            phoneNumber: phoneNumber,
            store: "Łódź",
            deliveryDay,
            products: JSON.parse(localStorage.getItem("cart")),
          };

          await submitOrder(orderData);
          localStorage.setItem("cart", "[]");
          localStorage.setItem("total", "00.00");
          setCart(JSON.parse(localStorage.getItem("cart")));
          setOrderComplete(true);
        } else {
          setShowError(true);
          setErrorMessage("Dostawa możliwa tylko na terenie Łodzi!");
        }
      } else {
        setErrorMessage("Błędny numer telefonu!");
        setShowError(true);
      }
    }
  };

  return (
    <main className="min-h-[100vh] h-[100%] lg:h-auto text-(--white) mb-20">
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
          <section className="bg-(--background) w-[90%] lg:w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[3.5vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
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
            Dostawa
          </h3>
          <p className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw]">
            (Cedry 4, 91-129 Łódź)
          </p>
          <p className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] text-(--alternativeBackground) py-3">
            * - wymagane
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center w-[100%]"
          onSubmit={handleStoreSubmit}
        >
          <div className="flex justify-between w-[100%] *:flex *:flex-col *:text-[2.5vw] *:md:text-[2vw] *:lg:text-[1.5vw]">
            <div className="w-[59%]">
              <label htmlFor="street">Ulica*</label>
              <input
                type="text"
                name="street"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
                onChange={(e) => {
                  setStreet(e.target.value);
                }}
              />
            </div>
            <div className="w-[19%]">
              <label htmlFor="homeNumber">Nr budynku*</label>
              <input
                type="text"
                name="homeNumber"
                className="bg-(--background) px-4 py-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
                onChange={(e) => {
                  setHomeNumber(e.target.value);
                }}
              />
            </div>
            <div className="w-[19%]">
              <label htmlFor="apartmentNumber">Nr lokalu</label>
              <input
                type="text"
                name="apartmentNumber"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
                onChange={(e) => {
                  setApartmentNumber(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            className="flex w-[100%] justify-between
            *:flex *:flex-col *:text-[2.5vw] *:md:text-[2vw] *:lg:text-[1.5vw]"
          >
            <div className="w-[38%]">
              <label htmlFor="postalCode">Kod pocztowy*</label>
              <input
                type="text"
                name="postalCode"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
              />
            </div>
            <div className="w-[58%]">
              <label htmlFor="place">Miejscowosc*</label>
              <input
                type="text"
                name="place"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
                onChange={(e) => {
                  setPlace(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-col w-[100%]">
            <label
              htmlFor="number"
              className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw]"
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
          </div>
          <p className="text-[4vw] md:text-[3vw] lg:text-[2vw] py-10 font-medium">
            Płatność tylko gotówka lub blik!
          </p>

          <div className="flex items-center justify-center gap-10 w-full mb-10">
            <Link
              to="/order"
              className="flex items-center justify-center text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer hover:bg-(--hoverAccent) transition duration-400"
            >
              Wróć
            </Link>
            <button
              type="submit"
              className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer hover:bg-(--hoverAccent) transition duration-400"
            >
              Zamów
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default PickupDelivery;
