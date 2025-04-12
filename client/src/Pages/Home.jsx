import React, { useState } from "react";
import Gallery from "../Components/Gallery.jsx";
import Vegetables from "../Components/Products/Vegetables.jsx";
import Fruits from "../Components/Products/Fruits.jsx";

const Home = () => {
  const [isClicked, setIsClicked] = useState(1);

  return (
    <article>
      <Gallery />
      <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
        <li onClick={() => setIsClicked(1)}>
          Warzywa
          {isClicked == 1 ? (
            <hr className="border-(--background) border-2 rounded-2xl" />
          ) : (
            <></>
          )}
        </li>
        <li className="text-(--background)">|</li>
        <li onClick={() => setIsClicked(2)}>
          Owoce
          {isClicked == 2 ? (
            <hr className="border-(--background) border-2 rounded-2xl" />
          ) : (
            <></>
          )}
        </li>
      </ul>
      <section>{isClicked == 1 ? <Vegetables /> : <Fruits />}</section>
    </article>
  );
};

export default Home;
