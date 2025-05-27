import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext.jsx";

import Products from "./Products.jsx";
import AdminGallery from "./AdminGallery.jsx";
import Orders from "./Orders.jsx";

const Admin = () => {
  const [isClicked, setIsClicked] = useState(1);
  /*const [adminName, setAdminName] = useState("");
      const [adminPassword, setAdminPassword] = useState(""); */
  const { setIsAdmin, isAdmin, setIsLogged, isLoaded } =
    useContext(ShopContext);
  const navigate = useNavigate();

  /*   const handleAdminLogin = (e) => {
        e.preventDefault();
        const name = import.meta.env.VITE_ADMIN_NAME;
        const password = import.meta.env.VITE_ADMIN_PASSWORD;
        if (adminName === name && adminPassword === password) {
          localStorage.setItem("admin", true);
          setIsAdmin(true);
        } else {
          alert("Błędne dane!");
        }
      }; */

  const handleAdminLogOut = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("surname");
    localStorage.removeItem("username");
    setIsAdmin(false);
    setIsLogged(false);
    navigate("/login");
  };

  /* 
      useEffect(() => {
        const token = localStorage.getItem("admin");
        if (token === "true") {
          setIsAdmin(true);
        }
      }, []); */

  return isAdmin ? (
    <>
      {isLoaded && (
        <section className="fixed flex justify-center items-center top-0 backdrop-blur-[5px] backdrop-brightness-50 left-0  w-[100%] h-[100vh] z-10000">
          <div className="loader text-white"></div>
        </section>
      )}
      <article className="pt-45 lg:pt-35 min-h-[100vh] h-[100%] px-5 text-(--white) mb-20">
        <h1 className="w-[100%] text-[8vw] md:text-[6vw] lg:text-[4vw] font-medium text-center">
          Panel administracyjny
        </h1>
        <section className="flex flex-col *:text-center *:my-3">
          <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
            <li
              onClick={() => {
                setIsClicked(1);
              }}
            >
              Produkty
              {isClicked == 1 ? (
                <hr className="border-(--background) border-2 rounded-2xl" />
              ) : (
                <></>
              )}
            </li>
            <li className="text-(--background)">|</li>
            <li
              onClick={() => {
                setIsClicked(2);
              }}
            >
              Zamówienia
              {isClicked == 2 ? (
                <hr className="border-(--background) border-2 rounded-2xl" />
              ) : (
                <></>
              )}
            </li>
            <li className="text-(--background)">|</li>
            <li
              onClick={() => {
                setIsClicked(3);
              }}
            >
              Galeria
              {isClicked == 3 ? (
                <hr className="border-(--background) border-2 rounded-2xl" />
              ) : (
                <></>
              )}
            </li>
          </ul>
          <article>
            {isClicked === 1 && <Products />}
            {isClicked === 2 && <Orders />}
            {isClicked === 3 && <AdminGallery />}
          </article>
          <button
            onClick={handleAdminLogOut}
            className="w-[50%] md:w-[40%] lg:w-[30%] py-2 px-4 bg-(--alternativeAccent) text-(--white) mx-auto rounded-3xl cursor-pointer hover:bg-(--hoverAlternativeAccent) transition-all text-[5vw] md:text-[4vw] lg:text-[2vw]"
          >
            Wyloguj się
          </button>
        </section>
      </article>
    </>
  ) : (
    <h2>Zaloguj się!</h2>
  );
};

export default Admin;
