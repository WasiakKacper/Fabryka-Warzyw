import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import OrderCard from "../OrderCard";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext.jsx";

const Admin = () => {
  const [isClicked, setIsClicked] = useState(1);
  const [whatStore, setWhatStore] = useState(1);
  /*const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); */
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Vegetables",
    pricePer: "/szt",
    store: "Łęczyca",
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const { setIsAdmin, isAdmin, setIsLogged } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  /*   const handleAdminLogin = (e) => {
    e.preventDefault();
    const name = import.meta.env.VITE_ADMIN_NAME;
    const password = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminName === name && adminPassword === password) {
      localStorage.setItem("admin", true);
      setIsAdmin(true);
    } else {
      alert("Błędne dane!");
    }
  }; */

  const handleAdminLogOut = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("surname");
    localStorage.removeItem("username");
    setIsAdmin(false);
    setIsLogged(false);
    navigate("/login");
  };

  const [products, setProducts] = useState([]);
  /* 
  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token === "true") {
      setIsAdmin(true);
    }
  }, []); */

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

  const handleSumbit = async () => {
    if (imageFile && formData.name !== "" && formData.price !== "") {
      try {
        let uploadedImage = "";

        if (imageFile) {
          uploadedImage = await uploadImage();
        }

        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          available: true,
          image: uploadedImage,
        };

        const res = await axios.post(`${apiUrl}/products`, productData);
        setProducts((prevProducts) => [...prevProducts, res.data]);
        setFormData({
          name: "",
          price: "",
          category: "Vegetables",
          pricePer: "/szt",
          store: "Łęczyca",
        });
        setImageFile(null);
        alert("Produkt dodany!");
        console.log(res.data);
      } catch (err) {
        console.error(err);
        alert("Błąd przy dodawaniu produktu.");
      }
    } else {
      alert("Pola nie mogą pozostać puste!");
    }
  };

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

  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios
      .get(`${apiUrl}/orders`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Brak połączenia z bazą danych!");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (whatStore === 1) return order.store === "Łódź";
    if (whatStore === 2) return order.store === "Łęczyca";
    return false;
  });

  const activeOrders = filteredOrders.filter(
    (order) => order.status !== "completed"
  );
  const completedOrders = filteredOrders.filter(
    (order) => order.status === "completed"
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Adding image to gallery
  const [images, setImages] = useState([]);

  const previewImages = [
    { _id: "local1", url: "/Images/image.svg" },
    { _id: "local2", url: "/Images/image1.jpg" },
    { _id: "local3", url: "/Images/warzywa.jpg" },
  ];

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Wybierz zdjęcie do przesłania");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(`${apiUrl}/images`, formData);
      const newImage = res.data;

      setImages((prevImages) => [...prevImages, newImage]);

      setUploadedUrl(newImage.url);
      setImage(null);
      setPreview(null);

      alert("Zdjęcie zostało dodane do galerii!");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas dodawania zdjęcia");
    }
  };

  //Getting images from db
  const fetchImages = () => {
    axios
      .get(`${apiUrl}/images`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setImages(data);
        } else {
          setImages(previewImages);
        }
      })
      .catch((err) => {
        console.error(err);
        setImages(previewImages);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  //Replacing images
  const handleReplaceImage = async (id) => {
    if (!image) {
      alert("Najpierw wybierz nowe zdjęcie do podmiany");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.put(`${apiUrl}/images/${id}`, formData);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img._id === id ? { ...img, url: res.data.image.url } : img
        )
      );
      alert("Zdjęcie zaktualizowane");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas aktualizacji zdjęcia");
    }
  };

  //Deleting image
  const handleDeleteImage = async (id) => {
    const confirmed = window.confirm(
      "Czy napewno chcesz usunąć zdjęcie z galerii?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${apiUrl}/images/${id}`);
      setImages((prevImages) => prevImages.filter((img) => img._id !== id));
      alert("Zdjęcie usunięte");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania zdjęcia");
    }
  };

  return isAdmin ? (
    <article className="pt-45 lg:pt-35 min-h-[100vh] h-[100%] px-5 text-(--white)">
      <h1 className="w-[100%] text-[8vw] md:text-[6vw] lg:text-[4vw] font-medium text-center">
        Panel administracyjny
      </h1>
      <section className="flex flex-col *:text-center *:my-3">
        <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
          <li
            onClick={() => {
              setIsClicked(1);
            }}
          >
            Produkty
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
            }}
          >
            Zamówienia
            {isClicked == 2 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
          <li className="text-(--background)">|</li>
          <li
            onClick={() => {
              setIsClicked(3);
            }}
          >
            Galeria
            {isClicked == 3 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
        </ul>
        <article>
          {isClicked === 1 && (
            <section>
              <form
                className="flex gap-2 justify-center *:border-1 mb-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSumbit();
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
                  className="p-2 w-[8%] rounded-4xl"
                >
                  <option value="/szt">za sztuke</option>
                  <option value="/kg">za kilogram</option>
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
                  Dodaj produkt
                </button>
              </form>
              {/* Search */}
              <input
                type="text"
                placeholder="Wyszukaj produkt"
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 w-[70%] rounded-4xl mb-3 border-1 outline-0"
              />
              <ul className="h-[50vh] overflow-y-scroll">
                {filteredProducts.map((product, index) => (
                  <li
                    key={index}
                    className="flex justify-between gap-3 *:text-[4vw] *:md:text-[3vw] *:lg:text-[2vw] bg-(--background) rounded-2xl py-3 px-5 mb-5"
                  >
                    <img
                      src={product.image}
                      alt="Zdjęcie produktu"
                      className="w-10"
                    />
                    <p className="text-[3vw] md:text-[4vw] lg:text-[3vw]">
                      {product.name}--{product.price}zł{product.pricePer}--
                      {product.category}--Dostępny:
                      <input
                        type="checkbox"
                        checked={product.available}
                        className="w-10"
                        onChange={() =>
                          handleAvailabilityToggle(
                            product._id,
                            !product.available
                          )
                        }
                      />
                    </p>
                    <p>{product.store}</p>
                    <button
                      className="text-(--alternativeAccent) hover:text-(--hoverAlternativeAccent) font-medium cursor-pointer"
                      onClick={() => handleDelete(product._id)}
                    >
                      Usuń
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {isClicked === 2 && (
            <section className="h-[50vh] overflow-y-scroll">
              <nav className="mb-5">
                <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
                  <li onClick={() => setWhatStore(1)}>
                    Łódź
                    {whatStore === 1 ? (
                      <hr className="border-(--background) border-2 rounded-2xl" />
                    ) : (
                      <></>
                    )}
                  </li>
                  <li className="text-(--background)"> | </li>
                  <li onClick={() => setWhatStore(2)}>
                    Łęczyca
                    {whatStore === 2 ? (
                      <hr className="border-(--background) border-2 rounded-2xl" />
                    ) : (
                      <></>
                    )}
                  </li>
                </ul>
              </nav>
              <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
                Aktywne:
              </h1>
              <ul className="flex flex-row flex-wrap justify-evenly text-left">
                {activeOrders.length > 0 ? (
                  activeOrders.map((order, index) => (
                    <OrderCard
                      key={index}
                      order={order}
                      onStatusUpdate={updateOrderStatus}
                    />
                  ))
                ) : (
                  <p>Brak aktywnych zamówień</p>
                )}
              </ul>

              <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
                Zakończone:
              </h1>
              <ul className="flex flex-row flex-wrap justify-evenly text-left">
                {completedOrders.length > 0 ? (
                  completedOrders.map((order, index) => (
                    <OrderCard
                      key={index}
                      order={order}
                      onStatusUpdate={updateOrderStatus}
                    />
                  ))
                ) : (
                  <p>Brak aktywnych zamówień</p>
                )}
              </ul>
            </section>
          )}
          {isClicked === 3 && (
            <section className="flex flex-col items-center">
              <h2 className="text-[5vw] md:text-[4vw] lg:text-[3vw] mb-5">
                Galeria zdjęć
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={img._id} className="relative">
                    <img
                      src={img.url}
                      alt={`Zdjęcie ${index}`}
                      className="rounded-2xl w-[100%] h-[300px]"
                    />
                    <button
                      className="absolute top-1 right-1 bg-(--alternativeAccent) hover:bg-(--hoverAlternativeAccent) cursor-pointer transition text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteImage(img._id)}
                    >
                      Usuń
                    </button>
                    <button
                      className="absolute bottom-1 right-1 bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition text-white px-2 py-1 rounded"
                      onClick={() => handleReplaceImage(img._id)}
                    >
                      Zastąp
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-[30%] mt-3 mr-5 text-white px-4 py-2 rounded bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Podgląd"
                    className="mt-3 w-40 h-auto"
                  />
                )}
                <button
                  onClick={handleUpload}
                  className="mt-3 text-white px-4 py-2 rounded bg-(--accent) hover:bg-(--hoverAccent) cursor-pointer transition"
                >
                  Dodaj do galerii
                </button>
              </div>
            </section>
          )}
        </article>
        <button
          onClick={handleAdminLogOut}
          className="w-[50%] md:w-[40%] lg:w-[30%] py-2 px-4 bg-(--alternativeAccent) text-(--white) mx-auto rounded-3xl cursor-pointer hover:bg-(--hoverAlternativeAccent) transition-all text-[5vw] md:text-[4vw] lg:text-[2vw]"
        >
          Wyloguj się
        </button>
      </section>
    </article>
  ) : (
    <h2>Zaloguj się!</h2>
  );
};

export default Admin;
