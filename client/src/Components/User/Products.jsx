import React, { useState, useEffect, useContext } from "react";
import ShopContext from "../../Context/ShopContext";
import axios from "axios";

const Products = () => {
  const { setIsLoaded } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [edit, setEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    price: "",
    category: "Vegetables",
    pricePer: "/szt",
    store: "Łęczyca",
  });
  const [imageFile, setImageFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  //Getting products
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

    const res = await axios.post(`${apiUrl}/upload`, data);
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
    });
    setEdit(true);
  };

  return (
    <section>
      {edit ? <section></section> : <></>}
      <form
        className="flex flex-col lg:flex-row  w-[100%] *:w-[100%] gap-2 justify-center *:border-1 mb-10"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="file"
          onChange={handleImageChange}
          className="bg-(--accent) text-(--white) p-2 w-[10%] rounded-4xl cursor-pointer hover:bg-(--hoverAccent) transition"
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nazwa produktu"
          className="p-2 w-[20%] rounded-4xl"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Cena produktu (bez zł)"
          className="p-2 w-[10%] rounded-4xl"
        />
        <select
          name="pricePer"
          value={formData.pricePer}
          onChange={handleChange}
          className="p-2 w-[8%] rounded-4xl *:text-black relative *:absolute *:top-1 max-h-[200px]"
        >
          <option value="/szt">za sztuke</option>
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
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 w-[12%] rounded-4xl *:text-black"
        >
          <option value="Vegetables">Warzywa</option>
          <option value="Fruits">Owoce</option>
          <option value="Honey">Miód</option>
          <option value="Jam">Konfitury</option>
          <option value="Dried fruits">Suszone owoce</option>
          <option value="Pasta">Makarony</option>
          <option value="Juice">Soki</option>
          <option value="Spices">Przyprawy</option>
          <option value="Flour">Mąki</option>
          <option value="VegetablesHoReCa">Warzywa HoReCa</option>
          <option value="FruitsHoReCa">Owoce HoReCa</option>
          <option value="Peeled vegetablesHoReCa">
            Warzywa obierane HoReCa
          </option>
        </select>
        <select
          name="store"
          value={formData.store}
          onChange={handleChange}
          className="p-2 w-[10%] rounded-4xl *:text-black"
        >
          <option value="Łęczyca">Łęczyca</option>
          <option value="Łódź">Łódź</option>
        </select>
        <button className="bg-(--accent) text-(--white) p-2 w-[10%] rounded-4xl cursor-pointer hover:bg-(--hoverAccent) transition">
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
        {filteredProducts.map((product, index) => (
          <li
            key={index}
            className="flex justify-between gap-3 text-[4vw] md:text-[3vw] lg:text-[2vw] bg-[var(--background)] rounded-2xl py-3 px-5 mb-5 items-center"
          >
            <img
              src={product.image}
              alt="Zdjęcie produktu"
              className="w-[30%] md:w-[20%] lg:w-[10%] aspect-square object-cover rounded-lg"
            />
            <div className="text-left w-[60%]">
              <h4 className="font-medium">
                {product.name} {product.price}zł{product.pricePer}
              </h4>
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
