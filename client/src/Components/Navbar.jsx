import React, { useState } from "react";
import logo from "/Images/logo.png";

const Navbar = () => {
  const [name, setName] = useState("Home");

  return (
    <header className="fixed w-full h-auto bg-(--black)">
      <div className="flex w-[90%] h-auto justify-between mx-auto">
        {/* Logo */}
        <img src={logo} alt="Fabryka warzyw" className="w-[30%] lg:w-[10%]" />
        {/* For mobile devices */}
        <button className="lg:hidden *:hover:bg-(--darkBackgorund) *:hover:transition">
          <i className="icon-menu p-[2%] text-(--white) text-[3vw]"></i>
        </button>
        {/* For desktops */}
        <ul className="hidden lg:flex list-none text-(--white) text-[1.2vw] gap-6 items-center *:cursor-pointer *:hover:text-(--background)">
          <li onClick={() => setName("Home")}>
            Strona główna
            {name === "Home" ? (
              <hr className="border-2 rounded-lg" rounded-lg />
            ) : (
              ""
            )}
          </li>
          <li onClick={() => setName("Gastronomy")}>
            Gastronomia
            {name === "Gastronomy" ? (
              <hr className="border-2 rounded-lg" />
            ) : (
              ""
            )}
          </li>
          <li onClick={() => setName("Cart")}>
            Koszyk
            {name === "Cart" ? <hr className="border-2 rounded-lg" /> : ""}
          </li>
          <li onClick={() => setName("Login")}>
            Logowanie
            {name === "Login" ? <hr className="border-2 rounded-lg" /> : ""}
          </li>
          <li onClick={() => setName("About")}>
            O nas
            {name === "About" ? <hr className="border-2 rounded-lg" /> : ""}
          </li>
          <li onClick={() => setName("Contact")}>
            Kontakt
            {name === "Contact" ? <hr className="border-2 rounded-lg" /> : ""}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
