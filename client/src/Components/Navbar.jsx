import React, { useState } from "react";
import logo from "/Images/logo.png";

const Navbar = () => {
  const [name, setName] = useState("Home");
  const [show, setShow] = useState(false);

  return (
    <header className="fixed block w-full h-auto bg-(--black) ">
      <nav className="realtive flex w-[90%] h-auto justify-between mx-auto">
        {/* Logo */}
        <img
          src={logo}
          alt="Fabryka warzyw"
          className="block w-[30%] lg:w-[10%] mb-2"
        />
        {/* For mobile devices */}
        <button
          className="lg:hidden *:hover:bg-(--darkBackgorund) *:hover:transition"
          onClick={() => {
            setShow(!show);
          }}
        >
          <i className="icon-menu p-[2%] text-(--white) text-[5vw]"></i>
        </button>

        {/* For desktops */}

        <ul
          className={`absolute w-[60%] *:w-[85%] lg:*:w-auto  h-[100vh] lg:w-auto lg:h-auto bg-(--darkBackgorund) lg:bg-transparent text-center items-center  lg:static right-0 top-[100%] flex flex-col lg:flex-row list-none text-(--white) text-[4vw] lg:text-[1.2vw] lg:gap-6 lg:items-center *:cursor-pointer *:hover:text-(--background) z-10 ${
            show ? "translate-x-0" : "translate-x-full"
          }
          transform transition-transform duration-300 ease-in-out
          lg:transition-none lg:transform-none lg:translate-x-0 `}
        >
          <h1 className="lg:hidden text-[8vw] mt-5 mb-10 text-(--accent)">
            Menu
          </h1>
          <li
            onClick={() => {
              setName("Home"), setShow(false);
            }}
          >
            Strona główna
            {name === "Home" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" rounded-lg />
            ) : (
              ""
            )}
            <hr className="block border-(--accent) border-2 lg:hidden" />
          </li>
          <li
            onClick={() => {
              setName("Gastronomy"), setShow(false);
            }}
          >
            Gastronomia
            {name === "Gastronomy" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            ) : (
              ""
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li
            onClick={() => {
              setName("Cart"), setShow(false);
            }}
          >
            Koszyk
            {name === "Cart" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            ) : (
              ""
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li
            onClick={() => {
              setName("Login"), setShow(false);
            }}
          >
            Logowanie
            {name === "Login" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            ) : (
              ""
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li
            onClick={() => {
              setName("About"), setShow(false);
            }}
          >
            O nas
            {name === "About" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            ) : (
              ""
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li
            onClick={() => {
              setName("Contact"), setShow(false);
            }}
          >
            Kontakt
            {name === "Contact" ? (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            ) : (
              ""
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
        </ul>
        {show ? (
          <div
            className="lg:hidden absolute top-[100%] right-0 w-[100%] h-[100vh] bg-transparent backdrop-blur-2xl"
            onClick={() => setShow(false)}
          ></div>
        ) : (
          <></>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
