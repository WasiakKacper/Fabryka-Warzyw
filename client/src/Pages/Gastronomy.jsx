import React, { useState, useContext, useEffect } from "react";
/* import FilterBtn from "../Components/FilterBtn.jsx"; */
import ShopContext from "../Context/ShopContext.jsx";
import axios from "axios";
import Card from "../Components/Card.jsx";

import { Link } from "react-router";
import "../App.css";

const categories = [
  { pl: "Miody", en: "Honey" },
  { pl: "Konfitury", en: "Jam" },
  { pl: "Mąki", en: "Flour" },
  { pl: "Suszone owoce", en: "Dried fruits" },
  { pl: "Makarony", en: "Pasta" },
  { pl: "Soki", en: "Juice" },
  { pl: "Przyprawy", en: "Spices" },
];

const Gastronomy = () => {
  const [isClicked, setIsClicked] = useState(0);
  const { isLogged } = useContext(ShopContext);

  const [whatCategory, setWhatCategory] = useState("Honey");

  const [products, setProducts] = useState([]);

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
    <article className="min-h-[100vh] h-[100%]">
      {!isLogged ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              Treść tylko dla zalogowanych klientów!
            </h3>
            <button className="mt-20 py-1 w-[30%] rounded-4xl mx-auto text-[4vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer">
              <Link to="/login">Zaloguj się</Link>
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
      <nav className="w-[90%] lg:w-full overflow-x-auto lg:overflow-hidden pt-45 mx-auto">
        <ul className="flex lg:justify-center w-full text-[4vw] md:text-[3vw] lg:text-[1.6vw] *:px-1">
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

export default Gastronomy;
