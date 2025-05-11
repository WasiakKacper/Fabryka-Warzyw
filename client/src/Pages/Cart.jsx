import React, { useContext, useEffect } from "react";
import CartElement from "../Components/CartElement.jsx";
import ShopContext from "../Context/ShopContext.jsx";

import { Link } from "react-router";

const Cart = () => {
  const { cart } = useContext(ShopContext);
  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);

  return (
    <article>
      <section className=" flex flex-col pt-45 justify-center">
        <h1 className="text-center text-[10vw] lg:text-[5.5vw] font-medium mb-10">
          Koszyk
        </h1>
        <div className="w-[90%] mx-auto">
          {cart.map((item) => (
            <CartElement key={item._id} data={item} />
          ))}
        </div>
        <h1 className="text-center text-[5vw] md:text-[4vw] lg:text-[3vw] font-medium my-10">
          Suma: {total}zł
        </h1>
        <Link to="/order" className="mx-auto w-[30%]">
          <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer">
            Zamów
          </button>
        </Link>
      </section>
    </article>
  );
};

export default Cart;
