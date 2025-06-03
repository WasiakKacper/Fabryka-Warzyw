import { useEffect, useState, useContext } from "react";
import ShopContext from "./Context/ShopContext.jsx";

const stores = [
  { name: "Łódź", src: "/Images/lodz.png" },
  { name: "Łęczyca", src: "/Images/leczyca.jpg" },
];

const SelectStore = () => {
  const { whichStore, setWhichStore } = useContext(ShopContext);
  const [remember, setRemember] = useState(false);
  const [loadedImages, setLoadedImages] = useState({}); // { "Łódź": true, "Łęczyca": false }

  useEffect(() => {
    const remembered = localStorage.getItem("remember") === "true";
    const storedStore = localStorage.getItem("store");

    if (remembered && storedStore) {
      setRemember(true);
      setWhichStore(storedStore);
    }
  }, []);

  // Ładowanie obrazków programowo i ustawianie loadedImages
  useEffect(() => {
    stores.forEach(({ name, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [name]: true }));
      };
      img.onerror = () => {
        setLoadedImages((prev) => ({ ...prev, [name]: false }));
      };
    });
  }, []);

  const handleStoreSelect = (storeName) => {
    setWhichStore(storeName);
    if (remember) {
      localStorage.setItem("store", storeName);
    }
  };

  const handleRememberChange = (e) => {
    const isChecked = e.target.checked;
    setRemember(isChecked);
    if (isChecked) {
      localStorage.setItem("remember", "true");
      localStorage.setItem("store", whichStore);
    } else {
      localStorage.removeItem("remember");
      localStorage.removeItem("store");
    }
  };

  if (whichStore !== "") return null;

  return (
    <section className="fixed flex flex-col lg:flex-row w-[100%] min-h-[100vh] h-[100%] z-10000 text-(--white)">
      <h1 className="absolute w-[100%] text-center top-10 left-1/2 -translate-x-1/2 text-[8vw] lg:text-[6vw] z-10000 tracking-[10px]">
        Wybierz sklep
      </h1>

      {stores.map(({ name, src }) => (
        <div
          key={name}
          className="group relative flex lg:w-[50%] h-[100%] justify-center items-center overflow-hidden cursor-pointer"
          onClick={() => handleStoreSelect(name)}
        >
          <div
            className="absolute inset-0 bg-center bg-cover transition-all duration-500 ease-in-out group-hover:scale-110"
            style={{
              backgroundImage: `url(${src})`,
              filter: loadedImages[name] ? "none" : "blur(10px)",
              transform: loadedImages[name] ? "scale(1)" : "scale(1.1)",
              transition: "filter 0.5s ease, transform 0.5s ease",
            }}
          />
          <span className="relative z-10 text-[6vw] md:text-[5vw] lg:text-[4vw] text-white transition-transform duration-300 ease-in-out group-hover:scale-110">
            {name}
          </span>
        </div>
      ))}

      <div className="absolute flex w-[100%] text-center bottom-10 left-1/2 -translate-x-1/2 text-[5vw] lg:text-[2vw] z-10000 items-center justify-center gap-2">
        <label htmlFor="remember">Zapamiętaj mój wybór: </label>
        <input
          type="checkbox"
          name="remember"
          className="w-[5vw] h-[5vw] lg:w-[2vw] lg:h-[2vw] my-auto"
          checked={remember}
          onChange={handleRememberChange}
        />
      </div>
    </section>
  );
};

export default SelectStore;
