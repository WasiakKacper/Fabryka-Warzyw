import React, { useState } from "react";
import { motion } from "motion/react";

import Navbar from "../Components/Navbar.jsx";
import Gallery from "../Components/Gallery.jsx";
import Vegetables from "../Components/Products/Vegetables.jsx";
import Fruits from "../Components/Products/Fruits.jsx";
import Footer from "../Components/Footer.jsx";

const Home = () => {
  const [isClicked, setIsClicked] = useState(1);

  return (
    <article>
      <motion.section
        className="fixed flex justify-center items-center w-[100vw] h-[100vh] bg-(--white) z-10000"
        initial={{ translateY: 0 }}
        animate={{ translateY: -1000 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <img src="/Images/loading.png" alt="Fabryka warzyw" />
      </motion.section>
      <Navbar name="Home" />
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
      <Footer />
    </article>
  );
};

export default Home;
