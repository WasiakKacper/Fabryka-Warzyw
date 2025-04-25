import React, { useState } from "react";
import FilterBtn from "../Components/FilterBtn.jsx";

import { Link } from "react-router";
import "../App.css";

const categories = [
  "Miody",
  "Konfitury",
  "Mąki",
  "Suszone owoce",
  "Makarony",
  "Soki",
  "Przyprawy",
];

const Gastronomy = () => {
  const [isClicked, setIsClicked] = useState(0);

  const [isLogged, setIsLogged] = useState(false);

  return (
    <article>
      {!isLogged ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Treść tylko dla zalogowanych klientów!
            </h3>
            <button className="mt-20 py-1 w-[30%] rounded-4xl mx-auto text-[4vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer">
              <Link path="/login">Zaloguj się</Link>
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
      <nav className="w-[90%] lg:w-full overflow-x-auto lg:overflow-hidden pt-45 mx-auto">
        <ul className="flex lg:justify-center w-full text-[4vw] md:text-[3vw] lg:text-[1.6vw] *:px-1">
          {categories.map((item, index) => (
            <React.Fragment key={item}>
              <li
                onClick={() => {
                  setIsClicked(index);
                }}
                className={
                  item === "Suszone owoce"
                    ? "whitespace-nowrap cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {item}
                {isClicked == index ? (
                  <hr className="border-(--background) border-2 rounded-2xl" />
                ) : (
                  <></>
                )}
              </li>
              {index < categories.length - 1 && (
                <li className="text-(--background)">|</li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>
      <section className="flex flex-row w-[90%] mx-auto mt-15">
        <FilterBtn />
        <div></div>
      </section>
    </article>
  );
};

export default Gastronomy;
