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
  const [whichStore, setWhichStore] = useState("");
  const [remember, setRemember] = useState(false);

  const [products, setProducts] = useState([]);
  const { firstEnter } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const remembered = localStorage.getItem("remember") === "true";
    const storedStore = localStorage.getItem("store");

    if (remembered && storedStore) {
      setRemember(true);
      setWhichStore(storedStore);
    }
  }, []);

  const handleStoreSelect = (storeName) => {
    setWhichStore(storeName);
    if (remember) {
      localStorage.setItem("store", storeName);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("remember") === "true") {
      setRemember(true);
      setWhichStore(localStorage.getItem("store"));
    }
  }, []);

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
    <article className="min-h-[100vh] h-[100%]">
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
      {whichStore === "" ? (
        <section className="fixed flex flex-col lg:flex-row w-[100%] min-h-[100vh] h-[100%] z-10000 text-(--white)">
          <h1 className="absolute w-[100%] text-center top-10 left-1/2 -translate-x-1/2 text-[8vw] lg:text-[6vw] z-10000 tracking-[10px]">
            Wybierz sklep
          </h1>
          <div
            className="group relative flex lg:w-[50%] h-[100%] justify-center items-center overflow-hidden cursor-pointer"
            onClick={() => {
              handleStoreSelect("Łódź");
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover transition-all duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: "url(/Images/lodz.png)" }}
            />
            <span className="relative z-10 text-[6vw] md:text-[5vw] lg:text-[4vw] text-white transition-transform duration-300 ease-in-out group-hover:scale-110 tracking-[5px]">
              Łódź
            </span>
          </div>
          <div
            className="group relative flex lg:w-[50%] h-[100%] justify-center items-center overflow-hidden cursor-pointer"
            onClick={() => {
              handleStoreSelect("Łęczyca");
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover transition-all duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: "url(/Images/leczyca.jpg)" }}
            />
            <span className="relative z-10 text-[6vw] md:text-[5vw] lg:text-[4vw] text-white transition-transform duration-300 ease-in-out group-hover:scale-110 tracking-[5px]">
              Łęczyca
            </span>
          </div>
          <div className="absolute flex w-[100%] text-center bottom-10 left-1/2 -translate-x-1/2 text-[5vw] lg:text-[2vw] z-10000 items-center justify-center gap-2">
            <label htmlFor="remember">Zapamiętaj mój wybór: </label>
            <input
              type="checkbox"
              name="remember"
              className="w-[5vw] h-[5vw] lg:w-[2vw] lg:h-[2vw] my-auto"
              checked={remember}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setRemember(isChecked);
                localStorage.setItem("remember", isChecked ? "true" : "");
                if (!isChecked) {
                  localStorage.removeItem("store");
                }
              }}
            />
          </div>
        </section>
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
