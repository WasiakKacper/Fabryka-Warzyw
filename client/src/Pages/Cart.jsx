import React from "react";
import Navbar from "../Components/Navbar";
import CartElement from "../Components/CartElement.jsx";
import Footer from "../Components/Footer.jsx";

import { Link } from "react-router";

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
        <Link to="/order" className="mx-auto w-[30%]">
          <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer">
            Zamów
          </button>
        </Link>
      </section>
      <Footer />
    </article>
  );
};

export default Cart;
