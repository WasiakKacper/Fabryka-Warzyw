import React, { useContext } from "react";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext";

const Account = () => {
  const { handleLogOut } = useContext(ShopContext);

  const handleOnClick = () => {
    handleLogOut();
  };

  const navigate = useNavigate();

  return (
    <article className="pt-45 lg:pt-35 h-[100vh] px-5">
      <h1 className="w-[100%] text-[8vw] md:text-[6vw] lg:text-[4vw} font-medium">
        Witaj user123
      </h1>
      <section className="flex flex-col *:text-center *:my-3">
        <p className="text-[5vw] md:text-[4vw] lg:text-[2vw]">
          Moje zamówienia
        </p>
        <article></article>
        <button
          onClick={() => {
            handleOnClick();
            navigate("/login");
          }}
          className="w-[50%] md:w-[40%] lg:w-[30%] py-2 px-4 bg-(--alternativeAccent) text-(--white) mx-auto rounded-3xl cursor-pointer hover:bg-(--hoverAlternativeAccent) transition-all text-[5vw] md:text-[4vw] lg:text-[2vw]"
        >
          Wyloguj się
        </button>
      </section>
    </article>
  );
};

export default Account;
