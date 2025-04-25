import React, { useState } from "react";
import { Link } from "react-router";

const PickupStore = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleSubmit = () => {
    if (phoneNumber === "") setShowError(true);
    else setOrderComplete(true);
  };

  return (
    <main>
      {showError ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Pole nie może pozostać puste
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
            (Cedry 4, 91-129 Łódź)
          </p>
          <p className="text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] text-(--alternativeBackground) py-3">
            * - wymagane
          </p>
        </div>
        <div className="flex flex-col mt-5">
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
              console.log(e.target.value);
            }}
          />
        </div>
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
            className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer"
            onClick={handleSubmit}
          >
            Zamów
          </button>
        </div>
      </section>
    </main>
  );
};

export default PickupStore;
