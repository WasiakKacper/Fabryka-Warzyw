import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "motion/react";
import ShopContext from "../Context/ShopContext.jsx";

import Card from "../Components/Card.jsx";
import Gallery from "../Components/Gallery.jsx";
/* import Vegetables from "../Components/Products/Vegetables.jsx";
  import Fruits from "../Components/Products/Fruits.jsx"; */
/* import FilterBtn from "../Components/FilterBtn.jsx"; */

const categories = [
  { pl: "Warzywa", en: "Vegetables" },
  { pl: "Owoce", en: "Fruits" },
  { pl: "Miody", en: "Honey" },
  { pl: "Konfitury", en: "Jam" },
  { pl: "Mąki", en: "Flour" },
  { pl: "Suszone owoce", en: "Dried fruits" },
  { pl: "Makarony", en: "Pasta" },
  { pl: "Soki", en: "Juice" },
  { pl: "Przyprawy", en: "Spices" },
];

const Home = () => {
  const [isClicked, setIsClicked] = useState(0);
  const [whatCategory, setWhatCategory] = useState("Vegetables");

  const [products, setProducts] = useState([]);
  const { firstEnter, whichStore } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/products`)
      .then((products) => {
        setProducts(products.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Błąd połączenia z bazą danych");
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    return product.category === whatCategory && product.store === whichStore;
  });

  return (
    <article className="min-h-[100vh] h-[100%] mb-20">
      {firstEnter ? (
        <motion.section
          className="fixed flex justify-center items-center w-[100vw] h-[100vh] bg-(--white) z-10000"
          initial={{ translateY: 0 }}
          animate={{ translateY: -1000 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <img src="/Images/loading.png" alt="Fabryka warzyw" />
        </motion.section>
      ) : (
        <></>
      )}
      <Gallery />
      <nav className="w-[90%] lg:w-full overflow-x-auto lg:overflow-hidden pt-20 mx-auto">
        <ul className="flex lg:justify-center w-full text-[4vw] md:text-[3vw] lg:text-[1.6vw] text-(--white) *:px-1">
          {categories.map((item, index) => (
            <React.Fragment key={item.en}>
              <li
                onClick={() => {
                  setIsClicked(index);
                  setWhatCategory(item.en);
                }}
                className={
                  item.pl === "Suszone owoce"
                    ? "whitespace-nowrap cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {item.pl}
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
