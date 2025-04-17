import React, { useState } from "react";
import Navbar from "../Components/Navbar.jsx";
import FilterBtn from "../Components/FilterBtn.jsx";
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

  return (
    <article>
      <Navbar name="Gastronomy" />
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
