import React, { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router";
import ShopContext from "../Context/ShopContext";
import "../App.css";

import logo from "/Images/logo.png";

const Navbar = (props) => {
  const [show, setShow] = useState(false);
  const name = props.name;

  const [headerHeight, setHeaderHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { isLogged, howManyInCart, isAdmin } = useContext(ShopContext);

  // breakpoint lg (1024px) - dopasuj jeśli masz inny w Tailwind
  const isMobile = windowWidth < 1024;

  return (
    <header
      ref={headerRef}
      className="fixed block w-full h-auto bg-(--darkBackgorund) z-1000"
    >
      <nav className="relative flex w-[90%] h-auto justify-between mx-auto">
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

        {/* Navigation menu */}
        <ul
          style={
            isMobile && show
              ? {
                  height: `calc(100vh - ${headerHeight}px)`,
                  top: `${headerHeight}px`,
                }
              : {}
          }
          className={`fixed right-0 w-[60%] bg-(--darkBackgorund) text-center text-(--white) flex flex-col list-none text-[5vw] lg:text-[1.5vw] gap-4 p-6
          transform transition-transform duration-300 ease-in-out z-50
          ${
            isMobile
              ? show
                ? "translate-x-0 overflow-y-auto"
                : "translate-x-full overflow-hidden"
              : "static h-auto w-auto flex-row bg-transparent text-[1.2vw] overflow-visible transform-none translate-x-0 p-0 z-auto"
          }
          `}
        >
          <h1 className="lg:hidden text-[8vw] mt-5 mb-10 text-(--accent)">
            Menu
          </h1>
          <li onClick={() => setShow(false)}>
            <Link to="/">Strona główna</Link>
            {name === "Home" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="block border-(--accent) border-2 lg:hidden" />
          </li>
          <li onClick={() => setShow(false)}>
            <Link to="/gastronomy">HoReCa</Link>
            {name === "Gastronomy" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li onClick={() => setShow(false)}>
            <Link to="/cart" className="relative inline-flex items-center px-2">
              Koszyk
              <span className="absolute -top-2 -right-3 bg-(--accent) text-white text-xs font-bold rounded-full min-w-[1.5vw] min-h-[1.5vw] w-[1vw] h-[1vw] hidden lg:flex items-center justify-center">
                <p>{howManyInCart}</p>
              </span>
            </Link>
            {name === "Cart" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li onClick={() => setShow(false)}>
            <Link to={!isLogged ? "/login" : isAdmin ? "/admin" : "/account"}>
              {!isLogged ? "Logowanie" : isAdmin ? "Panel" : "Konto"}
            </Link>
            {name === "Login" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li onClick={() => setShow(false)}>
            <Link to="/about">O nas</Link>
            {name === "About" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
          <li onClick={() => setShow(false)}>
            <Link to="/contact">Kontakt</Link>
            {name === "Contact" && (
              <hr className="hidden lg:block border-2 rounded-2xl" />
            )}
            <hr className="border-(--accent) border-2 lg:hidden" />
          </li>
        </ul>

        {show && isMobile && (
          <div
            className="lg:hidden absolute top-[100%] right-0 w-[100vw] h-[100vh] bg-transparent backdrop-blur-2xl"
            onClick={() => setShow(false)}
          ></div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
