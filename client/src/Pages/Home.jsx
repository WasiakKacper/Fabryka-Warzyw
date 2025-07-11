import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import ShopContext from "../Context/ShopContext.jsx";

import Card from "../Components/Card.jsx";
import Gallery from "../Components/Gallery.jsx";

/* import Vegetables from "../Components/Products/Vegetables.jsx";
  import Fruits from "../Components/Products/Fruits.jsx"; */
/* import FilterBtn from "../Components/FilterBtn.jsx"; */

const Home = () => {
  const { firstEnter, whichStore } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isClicked, setIsClicked] = useState(0);
  const [whatCategory, setWhatCategory] = useState("Vegetables");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [products, setProducts] = useState([]);

  const initialCategories = [
    { pl: "Warzywa", en: "Vegetables" },
    { pl: "Owoce", en: "Fruits" },
    { pl: "Miody", en: "Honey" },
    { pl: "Konfitury", en: "Jam" },
    { pl: "Mąki", en: "Flour" },
    { pl: "Suszone owoce", en: "Dried fruits" },
    { pl: "Makarony", en: "Pasta" },
    { pl: "Soki", en: "Juice" },
    { pl: "Przyprawy", en: "Spices" },
    { pl: "Jaja", en: "Eggs" },
  ];

  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiUrl}/categories?type=standard`);
        const fetchedCategories = res.data || [];

        // Zamień `name` z backendu na { pl, en }
        const mapped = fetchedCategories.map((cat) => ({
          pl: cat.name,
          en: cat.name,
        }));

        setCategories((prev) => {
          const newCats = mapped.filter(
            (cat) => !prev.some((p) => p.en === cat.en)
          );
          return [...prev, ...newCats];
        });
      } catch (err) {
        console.error("Błąd pobierania kategorii", err);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/products?page=${page}&limit=20`);
        const data = res.data;

        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(page < data.totalPages);
      } catch (err) {
        console.log(err);
        alert("Błąd połączenia z bazą danych");
      }
    };

    fetchProducts();
  }, [page]);

  //Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, page]);

  //search
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = product.category === whatCategory;
      const matchesStore = whichStore
        ? product.store === whichStore || product.store === "Oba"
        : true;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStore && matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <article className="min-h-[100vh] h-[100%] mb-20">
      <Gallery />
      <div className="w-[90%] mx-auto text-white pt-5">
        <input
          type="text"
          placeholder="Szukaj produktu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-(--background) otuline-white drop-shadow-2xl"
        />
      </div>
      <nav className="w-[90%] lg:w-full overflow-x-auto lg:overflow-hidden pt-5 mx-auto">
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
        <div className="flex flex-col justify-center items-center w-[full] mt-5 mx-auto">
          <div className="flex flex-col lg:flex-row flex-wrap w-[90%] justify-center gap-[4vw]">
            {filteredProducts.map((product) => (
              <Card key={product._id} data={product} />
            ))}
          </div>
          <div ref={loader} className="text-center mt-10 text-white">
            {hasMore ? "Ładowanie..." : "Wszystkie produkty załadowane"}
          </div>
        </div>
      </section>
    </article>
  );
};

export default Home;
