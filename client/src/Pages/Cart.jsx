import React from "react";
import Navbar from "../Components/Navbar";
import CartElement from "../Components/CartElement.jsx";

const Cart = () => {
  return (
    <article>
      <Navbar name="Cart" />
      <section className=" flex flex-col pt-45 justify-center">
        <h1 className="text-center text-[10vw] lg:text-[5.5vw] font-medium mb-10">
          Koszyk
        </h1>
        <div className="w-[90%] lg:w-[70%] mx-auto">
          <CartElement />
        </div>
        <h1 className="text-center text-[5vw] md:text-[4vw] lg:text-[3vw] font-medium my-10">
          Suma: 00,00zł
        </h1>
        <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[30%] mx-auto rounded-4xl text-(--white)">
          Zamów
        </button>
      </section>
    </article>
  );
};

export default Cart;
