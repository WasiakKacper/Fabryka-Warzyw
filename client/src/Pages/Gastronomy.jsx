import React, { useState, useContext, useEffect } from "react";
/* import FilterBtn from "../Components/FilterBtn.jsx"; */
import ShopContext from "../Context/ShopContext.jsx";
import axios from "axios";
import Card from "../Components/Card.jsx";

import { Link } from "react-router";
import "../App.css";

const categories = [
  { pl: "Warzywa", en: "VegetablesHoReCa" },
  { pl: "Owoce", en: "FruitsHoReCa" },
  { pl: "Warzywa obierane", en: "Peeled vegetablesHoReCa" },
];

const Gastronomy = () => {
  const [isClicked, setIsClicked] = useState(0);
  const { isLogged } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");

  const [whatCategory, setWhatCategory] = useState("VegetablesHoReCa");

  const [products, setProducts] = useState([]);
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

  //search
  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category === whatCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <article className="min-h-[100vh] h-[100%] text-(--white) mb-20">
      {!isLogged ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[90%] lg:w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Treść tylko dla zalogowanych klientów!
            </h3>
            <button className="mt-20 py-2 px-2 w-[40%] rounded-4xl mx-auto text-[3.6vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer hover:bg-(--hoverAccent) transition duration-400">
              <Link to="/login">Zaloguj się</Link>
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
      <div className="w-[90%] mx-auto text-white pt-45">
        <input
          type="text"
          placeholder="Szukaj produktu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border-2 border-white outline-0"
        />
      </div>
      <nav className="w-full overflow-x-auto lg:overflow-hidden pt-5 mx-auto">
        <ul className="flex justify-center mx-auto w-[100%] text-[4vw] md:text-[3vw] lg:text-[1.6vw] *:px-1">
          {categories.map((item, index) => (
            <React.Fragment key={item.en}>
              <li
                onClick={() => {
                  setIsClicked(index);
                  setWhatCategory(item.en);
                }}
                className={
                  item.pl === "Warzywa obierane"
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

export default Gastronomy;
