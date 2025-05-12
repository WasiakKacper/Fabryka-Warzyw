import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "../OrderCard";

const Admin = () => {
  const [isClicked, setIsClicked] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const name = import.meta.env.VITE_ADMIN_NAME;
    const password = import.meta.env.VITE_ADMIN_PASSWORD;
    if (adminName === name && adminPassword === password) {
      localStorage.setItem("admin", true);
      setIsAdmin(true);
    } else {
      alert("Błędne dane!");
    }
  };

  const handleAdminLogOut = () => {
    localStorage.removeItem("admin");
    setIsAdmin(false);
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("admin");
    if (token === "true") {
      setIsAdmin(true);
    }
  }, []);

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

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Vegetables",
    pricePer: "/szt",
  });

  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState("");

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

    const res = await axios.post("http://localhost:3001/upload", data);
    return res.data.image;
  };

  const handleSumbit = async () => {
    if (imageFile && formData.name !== "" && formData.price !== "") {
      try {
        let uploadedImage = "";

        if (imageFile) {
          uploadedImage = await uploadImage();
          setImage(uploadedImage);
        }

        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          available: true,
          image: uploadedImage, // Dodajemy URL obrazu
        };

        // Wysyłamy dane produktu na backend
        const res = await axios.post(
          "http://localhost:3001/products",
          productData
        );
        setProducts((prevProducts) => [...prevProducts, res.data]);
        setFormData({
          name: "",
          price: "",
          category: "Vegetables",
          pricePer: "/szt",
        });
        setImageFile(null);
        setImage("");
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
        await axios.delete(`http://localhost:3001/products/${id}`);
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
      await axios.put(`http://localhost:3001/products/${id}`, {
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
      .get("http://localhost:3001/orders")
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

  return (
    <article className="pt-45 lg:pt-35 min-h-[100vh] h-[100%] px-5">
      <h1 className="w-[100%] text-[8vw] md:text-[6vw] lg:text-[4vw] font-medium text-center">
        Panel administracyjny
      </h1>
      {isAdmin ? (
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
          </ul>
          <article>
            {isClicked === 1 ? (
              <section>
                {" "}
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
                    className="p-2 w-[8%] rounded-4xl"
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
                  </select>
                  <button className="bg-(--accent) text-(--white) p-2 w-[10%] rounded-4xl cursor-pointer hover:bg-(--hoverAccent) transition">
                    Dodaj produkt
                  </button>
                </form>
                <ul>
                  {products.map((product, index) => (
                    <li
                      key={index}
                      className="flex justify-center gap-3 *:text-[4vw] *:md:text-[3vw] *:lg:text-[2vw]"
                    >
                      <p>
                        {product.name}--{product.price}zł{product.pricePer}--
                        {product.category}--Dostępny:
                        <input
                          type="checkbox"
                          checked={product.available}
                          onChange={() =>
                            handleAvailabilityToggle(
                              product._id,
                              !product.available
                            )
                          }
                        />
                      </p>
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
            ) : (
              <section>
                <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
                  Aktywne:
                </h1>
                <ul className="flex flex-row flex-wrap justify-evenly text-left">
                  {orders
                    .filter((order) => order.status !== "completed")
                    .map((order, index) => (
                      <OrderCard
                        key={index}
                        order={order}
                        products={order.products}
                        onStatusUpdate={updateOrderStatus}
                      />
                    ))}
                </ul>

                <h1 className="text-[5vw] md:text-[4vw] lg:text-[3vw]">
                  Zakończone:
                </h1>
                <ul className="flex flex-row flex-wrap justify-evenly text-left">
                  {orders
                    .filter((order) => order.status === "completed")
                    .map((order, index) => (
                      <OrderCard
                        key={index}
                        order={order}
                        onStatusUpdate={updateOrderStatus}
                      />
                    ))}
                </ul>
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
      ) : (
        <form
          className="flex flex-col w-[100%] md:w-[60%] lg:w-[40%] p-20 mx-auto *:mb-2"
          onSubmit={handleAdminLogin}
        >
          <label
            htmlFor="email"
            className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
          >
            Nazwa użytkownika:
          </label>
          <input
            type="text"
            name="adminName"
            className="bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
            onChange={(e) => {
              setAdminName(e.target.value);
            }}
          />
          <label
            htmlFor="password"
            className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
          >
            Hasło:
          </label>
          <input
            type="password"
            name="password"
            className="bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
            onChange={(e) => {
              setAdminPassword(e.target.value);
            }}
          />
          <button className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[5vw] md:text-[4vw] lg:text-[2vw] cursor-pointer">
            Zaloguj się
          </button>
        </form>
      )}
    </article>
  );
};

export default Admin;
