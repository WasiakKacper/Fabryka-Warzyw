import React, { useContext, useEffect, useState } from "react";
import CartElement from "../Components/CartElement.jsx";
import ShopContext from "../Context/ShopContext.jsx";

import { Link } from "react-router";

const Cart = () => {
  const [showError, setShowError] = useState(false);
  const { cart, howManyInCart } = useContext(ShopContext);
  const total = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(total));
  }, [total]);

  return (
    <article className="min-h-[100vh] h-[100%]">
      {showError ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl text-(--white)">
          <section className="bg-(--background) w-[90%] lg:w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Koszyk jest pusty!
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
      <section className=" flex flex-col pt-45 justify-center text-(--white)">
        <h1 className="text-center text-[10vw] lg:text-[5.5vw] font-medium mb-10">
          Koszyk
        </h1>
        <div className="w-[90%] mx-auto">
          {howManyInCart > 0 ? (
            <div>
              {cart.map((item) => (
                <CartElement key={item._id} data={item} />
              ))}
            </div>
          ) : (
            <h1 className="text-center text-(--darkBackground) text-[4vw] md:text-[3.5vw] lg:text-[2vw]">
              Twój koszyk jest pusty.
            </h1>
          )}
        </div>
        <h1 className="text-center text-[5vw] md:text-[4vw] lg:text-[3vw] font-medium my-10">
          Suma: {total}zł
        </h1>
        <Link
          to={howManyInCart > 0 ? "/order" : ""}
          className="mx-auto w-[40%]"
          onClick={() => {
            if (howManyInCart <= 0) {
              setShowError(true);
            }
          }}
        >
          <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto py-2 rounded-4xl text-(--white) cursor-pointer">
            Zamów
          </button>
        </Link>
      </section>
    </article>
  );
};

export default Cart;
