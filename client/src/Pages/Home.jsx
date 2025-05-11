import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "motion/react";
import ShopContext from "../Context/ShopContext.jsx";

import Card from "../Components/Card.jsx";
import Gallery from "../Components/Gallery.jsx";
/* import Vegetables from "../Components/Products/Vegetables.jsx";
  import Fruits from "../Components/Products/Fruits.jsx"; */
/* import FilterBtn from "../Components/FilterBtn.jsx"; */

const Home = () => {
  const [isClicked, setIsClicked] = useState(1);
  const [whatCategory, setWhatCategory] = useState("Vegetables");

  const [products, setProducts] = useState([]);
  const { firstEnter } = useContext(ShopContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((products) => {
        setProducts(products.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Błąd połączenia z bazą danych");
      });
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category === whatCategory
  );

  return (
    <article>
      {firstEnter ? (
        <motion.section
          className="fixed flex justify-center items-center w-[100vw] h-[100vh] bg-(--white) z-10000"
          initial={{ translateY: 0 }}
          animate={{ translateY: -1000 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <img src="/Images/loading.png" alt="Fabryka warzyw" />
        </motion.section>
      ) : (
        <></>
      )}
      <Gallery />
      <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
        <li
          onClick={() => {
            setIsClicked(1);
            setWhatCategory("Vegetables");
          }}
        >
          Warzywa
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
            setWhatCategory("Fruits");
          }}
        >
          Owoce
          {isClicked == 2 ? (
            <hr className="border-(--background) border-2 rounded-2xl" />
          ) : (
            <></>
          )}
        </li>
      </ul>
      <div className="w-[90%] mx-auto"></div>
      <section>
        <div className="flex justify-center w-[full] mt-5 mx-auto">
          <div className="flex flex-col lg:flex-row flex-wrap w-[90%] gap-[4vw]">
            {filteredProducts.map((product, index) => (
              <Card key={index} data={product} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};

export default Home;
