import React, { useState, useEffect, useContext } from "react";
import ShopContext from "../../Context/ShopContext";
import axios from "axios";

const Products = () => {
  const { setIsLoaded } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [edit, setEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    price: "",
    category: "Vegetables",
    pricePer: "/szt",
    store: "Łęczyca",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const [categoriesStandard, setCategoriesStandard] = useState([]);
  const [categoriesHoReCa, setCategoriesHoReCa] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("standard");

  const defaultCategoriesStandard = [
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

  const defaultCategoriesHoReCa = [
    { pl: "Warzywa", en: "VegetablesHoReCa" },
    { pl: "Owoce", en: "FruitsHoReCa" },
    { pl: "Warzywa obierane", en: "Peeled vegetablesHoReCa" },
  ];

  //Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch both types
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resStandard = await axios.get(
          `${apiUrl}/categories?type=standard`
        );
        const resHoReCa = await axios.get(`${apiUrl}/categories?type=horeca`);

        setCategoriesStandard(resStandard.data.map((c) => c.name));
        setCategoriesHoReCa(resHoReCa.data.map((c) => c.name));
      } catch (err) {
        console.error("Błąd pobierania kategorii", err);
      }
    };
    fetchCategories();
  }, []);

  // Add category
  const addCategory = async () => {
    if (!newCategory.trim()) return alert("Podaj nazwę kategorii");
    const allCategories = [...categoriesStandard, ...categoriesHoReCa];
    if (allCategories.includes(newCategory))
      return alert("Kategoria już istnieje");

    try {
      const res = await axios.post(`${apiUrl}/categories`, {
        name: newCategory,
        type: newCategoryType,
      });

      if (res.data.type === "horeca") {
        setCategoriesHoReCa((prev) => [...prev, res.data.name]);
      } else {
        setCategoriesStandard((prev) => [...prev, res.data.name]);
      }
      setFormData((prev) => ({ ...prev, category: res.data.name }));
      setNewCategory("");
    } catch (err) {
      alert(err.response?.data?.message || "Błąd serwera");
    }
  };

  //Getting products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/products?page=${currentPage}&search=${encodeURIComponent(
            debouncedQuery
          )}`
        );

        const newProducts = res.data.products;

        if (currentPage === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }

        setHasMore(newProducts.length > 0 && currentPage < res.data.totalPages);
      } catch (err) {
        console.error(err);
        alert("Błąd połączenia z bazą danych");
      }
    };

    fetchProducts();
  }, [currentPage, debouncedQuery]);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
  }, [debouncedQuery]);

  //Inserting form data to states
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("image", imageFile);

    const res = await axios.post(`${apiUrl}/products/upload`, data);
    return res.data.image;
  };

  //Add product
  const handleSubmit = async () => {
    if (formData.name !== "" && formData.price !== "") {
      try {
        setIsLoaded(true);
        let uploadedImage = "";

        if (imageFile) {
          uploadedImage = await uploadImage();
        }

        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          available: true,
          image:
            uploadedImage ||
            products.find((p) => p._id === formData._id)?.image,
        };

        if (edit && formData._id) {
          // Edycja
          await axios.put(`${apiUrl}/products/${formData._id}`, productData);
          setProducts((prev) =>
            prev.map((p) => (p._id === formData._id ? productData : p))
          );
          alert("Produkt zaktualizowany!");
        } else {
          // Dodawanie nowego
          const res = await axios.post(`${apiUrl}/products`, productData);
          setProducts((prevProducts) => [...prevProducts, res.data]);
          alert("Produkt dodany!");
        }

        setFormData({
          _id: null,
          name: "",
          price: "",
          category: "Vegetables",
          pricePer: "/szt",
          store: "Łęczyca",
        });
        setImageFile(null);
        setEdit(false);
        setIsLoaded(false);
      } catch (err) {
        console.error(err);
        setIsLoaded(false);
        alert("Błąd przy dodawaniu/edycji produktu.");
      }
    } else {
      alert("Pola nie mogą pozostać puste!");
    }
  };

  //Delete product
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Czy napewno chcesz usunąć produkt?");
    if (confirmed) {
      try {
        await axios.delete(`${apiUrl}/products/${id}`);
        setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
        alert("Produkt usunięty");
      } catch (err) {
        console.error(err);
        alert("Błąd podczas usuwania produktu");
      }
    } else {
      return 0;
    }
  };

  //Change product availability
  const handleAvailabilityToggle = async (id, newAvailability) => {
    console.log(`Zmiana dostępności produktu ${id}: ${newAvailability}`);
    try {
      await axios.put(`${apiUrl}/products/${id}`, {
        available: newAvailability,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id
            ? { ...product, available: newAvailability }
            : product
        )
      );
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zmiany dostępności produktu");
    }
  };

  //Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Edit
  const handleEditClick = (product) => {
    setFormData({
      _id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      pricePer: product.pricePer,
      store: product.store,
      description: product.description || "",
    });
    setEdit(true);
  };

  //Observer
  useEffect(() => {
    if (debouncedQuery.length > 0) return; // nie nasłuchuj scrolla przy aktywnym wyszukiwaniu

    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (bottom && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, debouncedQuery]);

  return (
    <section>
      {edit ? <section></section> : <></>}
      <form
        className="flex flex-col gap-6 mb-10 max-w-4xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Zdjęcie produktu */}
        <input
          type="file"
          onChange={handleImageChange}
          className="bg-[var(--accent)] text-[var(--white)] p-2 rounded-4xl cursor-pointer hover:bg-[var(--hoverAccent)] transition w-full"
        />

        {/* Dane produktu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nazwa produktu"
            className="p-2 rounded-4xl border"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Cena produktu (bez zł)"
            className="p-2 rounded-4xl border"
          />
          <select
            name="pricePer"
            value={formData.pricePer}
            onChange={handleChange}
            className="p-2 rounded-4xl border *:text-black"
          >
            <option value="/szt">za sztukę</option>
            <option value="/250g">za 250g</option>
            <option value="/500g">za 500g</option>
            <option value="/750g">za 750g</option>
            <option value="/1kg">za 1kg</option>
            <option value="/1.25kg">za 1.25kg</option>
            <option value="/1.5kg">za 1.5kg</option>
            <option value="/2kg">za 2kg</option>
            <option value="/2.5kg">za 2.5kg</option>
            <option value="/5kg">za 5kg</option>
          </select>
          <select
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="p-2 rounded-4xl border *:text-black"
          >
            <option value="Łęczyca">Łęczyca</option>
            <option value="Łódź">Łódź</option>
            <option value="Oba">Oba</option>
          </select>
        </div>

        {/* Kategoria produktu */}
        <div className="flex flex-col gap-2">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="p-2 rounded-4xl border *:text-black"
          >
            <optgroup label="Standardowe (domyślne)">
              {defaultCategoriesStandard.map(({ pl, en }) => (
                <option key={en} value={en}>
                  {pl}
                </option>
              ))}
            </optgroup>
            {categoriesStandard.length > 0 && (
              <optgroup label="Standardowe (dodane)">
                {categoriesStandard.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="HoReCa (domyślne)">
              {defaultCategoriesHoReCa.map(({ pl, en }) => (
                <option key={en} value={en}>
                  {pl}
                </option>
              ))}
            </optgroup>
            {categoriesHoReCa.length > 0 && (
              <optgroup label="HoReCa (dodane)">
                {categoriesHoReCa.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Dodawanie nowej kategorii */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nowa kategoria"
              className="p-2 rounded-4xl border"
            />
            <select
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
              className="p-2 rounded-4xl border *:text-black"
            >
              <option value="standard">Standardowa</option>
              <option value="horeca">HoReCa</option>
            </select>
            <button
              type="button"
              onClick={addCategory}
              className="p-2 bg-[var(--accent)] text-white rounded-4xl hover:bg-[var(--hoverAccent)]"
            >
              Dodaj kategorię
            </button>
          </div>
        </div>

        {/* Opis produktu */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Opis produktu"
          className="p-2 rounded-4xl border outline-none w-full min-h-[120px]"
        />

        {/* Przycisk */}
        <button
          type="submit"
          className="bg-[var(--accent)] text-white p-3 rounded-4xl hover:bg-[var(--hoverAccent)] w-full md:w-1/2 mx-auto transition"
        >
          {edit ? "Zapisz zmiany" : "Dodaj produkt"}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Wyszukaj produkt"
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 w-[100%] lg:w-[70%] rounded-4xl mb-3 border-1 outline-0"
      />
      <ul className="w-[100%] lg:w-[90%] h-[80vh] overflow-y-scroll mx-auto">
        {filteredProducts.map((product) => (
          <li
            key={product._id}
            className="flex justify-between gap-3 text-[4vw] md:text-[3vw] lg:text-[2vw] bg-[var(--background)] rounded-2xl py-3 px-5 mb-5 items-center"
          >
            <img
              loading="lazy"
              src={product.image}
              alt="Zdjęcie produktu"
              className="w-[30%] md:w-[20%] lg:w-[10%] aspect-square object-cover rounded-lg"
            />
            <div className="text-left w-[60%]">
              <h4 className="font-medium">
                {product.name} {product.price}zł{product.pricePer}
              </h4>
              <p>Opis: {product.description}</p>

              <p>Kategoria - {product.category}</p>
              <p className="flex items-center">
                Dostępny:
                <input
                  type="checkbox"
                  checked={product.available}
                  className="w-10 h-10 ml-2"
                  onChange={() =>
                    handleAvailabilityToggle(product._id, !product.available)
                  }
                />
              </p>
              <p>Sklep - {product.store}</p>
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-10">
              <button
                className="w-[50%] text-[var(--accent)] hover:text-[var(--hoverAccent)] font-medium cursor-pointer transition-all"
                onClick={() => handleEditClick(product)}
              >
                Edytuj
              </button>
              <button
                className="w-[50%] text-[var(--alternativeAccent)] hover:text-[var(--hoverAlternativeAccent)] font-medium cursor-pointer transition-all"
                onClick={() => handleDelete(product._id)}
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Products;
