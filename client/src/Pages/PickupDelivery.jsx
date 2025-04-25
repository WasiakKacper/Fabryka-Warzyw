import React from "react";
import { Link } from "react-router";

const PickupDelivery = () => {
  return (
    <main className="h-[100vh] lg:h-auto">
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
        <form
          className="flex flex-col items-center justify-center w-[100%]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex justify-between w-[100%] *:flex *:flex-col *:text-[2.5vw] *:md:text-[2vw] *:lg:text-[1.5vw]">
            <div className="w-[59%]">
              <label htmlFor="street">Ulica*</label>
              <input
                type="text"
                name="street"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
              />
            </div>
            <div className="w-[19%]">
              <label htmlFor="homeNumber">Nr budynku*</label>
              <input
                type="text"
                name="homeNumber"
                className="bg-(--background) px-4 py-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
              />
            </div>
            <div className="w-[19%]">
              <label htmlFor="apartmentNumber">Nr lokalu</label>
              <input
                type="text"
                name="apartmentNumber"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
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
              />
            </div>
            <div className="w-[58%]">
              <label htmlFor="place">Miejscowosc*</label>
              <input
                type="text"
                name="place"
                className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
              />
            </div>
          </div>
          <div className="flex flex-col w-[100%]">
            <label htmlFor="number">Numer telefonu (do kontaktu)*</label>
            <input
              type="text"
              name="number"
              className="bg-(--background) px-4 p-1 border-0 outline-0 text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] rounded-4xl"
            />
          </div>
        </form>

        <p className="text-[4vw] md:text-[3vw] lg:text-[2vw] py-10">
          Płatność tylko gotówka lub blik
        </p>

        <div className="flex items-center justify-center gap-10 w-full mb-10">
          <Link
            to="/order"
            className="flex items-center justify-center text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer"
          >
            Wróć
          </Link>
          <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[50%] rounded-4xl text-(--white) cursor-pointer">
            Zamów
          </button>
        </div>
      </section>
    </main>
  );
};

export default PickupDelivery;
