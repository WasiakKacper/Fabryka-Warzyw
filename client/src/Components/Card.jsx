import React, { useState, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ShopContext from "../Context/ShopContext.jsx";
import "../App.css";

const Card = (props) => {
  const parseUnit = (pricePer) => {
    const per = pricePer.replace("/", "");
    if (per === "szt") return { unit: "szt", value: 1, displayUnit: "" };
    if (per.includes("kg")) {
      const val = parseFloat(per.replace("kg", "")) || 1;
      return { unit: "kg", value: val, displayUnit: "kg" };
    }
    if (per.includes("g")) {
      const val = parseFloat(per.replace("g", "")) || 250;
      return { unit: "kg", value: val / 1000, displayUnit: "g" };
    }
    return { unit: "szt", value: 1, displayUnit: "" };
  };

  const { name, price, image, pricePer, available, description } = props.data;
  const { unit, value: unitValue, displayUnit } = parseUnit(pricePer);
  const isWeightBased = unit === "kg";

  const [howMany, setHowMany] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const { addToCart } = useContext(ShopContext);
  const [add, setAdd] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "100px",
  });

  useEffect(() => {
    setIsAvailable(available);
  }, [available]);

  useEffect(() => {
    setHowMany(unitValue);
  }, [pricePer]);

  useEffect(() => {
    setIsLoaded(false);
    setImgError(false);
  }, [image]);

  const addAnimation = () => {
    setAdd(true);
    setTimeout(() => setAdd(false), 500);
  };

  const handleSubtraction = () => {
    setHowMany((prev) => {
      const newVal = parseFloat((prev - unitValue).toFixed(2));
      return newVal >= unitValue ? newVal : unitValue;
    });
  };

  const handleAddition = () => {
    setHowMany((prev) => parseFloat((prev + unitValue).toFixed(2)));
  };

  return (
    <div
      className="relative w-full h-full"
      style={{ perspective: "1500px" }}
      ref={ref}
    >
      <div
        className={`transition-transform duration-700 w-full h-full relative`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="bg-[var(--background)] rounded-3xl p-2 drop-shadow-2xl flex lg:flex-col overflow-hidden w-full h-full">
            <div className="w-[50%] md:w-[50%] lg:w-[100%] aspect-square lg:aspect-auto mr-auto relative">
              {!isLoaded && !imgError && (
                <div className="loader mx-auto absolute inset-0.5 text-white"></div>
              )}
              {inView && !imgError ? (
                <img
                  src={image}
                  alt={name}
                  onLoad={() => setIsLoaded(true)}
                  onError={() => {
                    setIsLoaded(true);
                    setImgError(true);
                  }}
                  className={`rounded-2xl w-full h-full object-cover lg:aspect-video transition-opacity duration-500 ease-in-out ${
                    isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                  }`}
                />
              ) : (
                imgError && (
                  <div className="rounded-2xl w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700">Brak zdjęcia</span>
                  </div>
                )
              )}
              <button
                onClick={() => setFlipped(true)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-sm hover:bg-black/80"
              >
                ℹ️
              </button>
            </div>

            <div className="flex flex-col justify-between w-[55%] lg:w-full p-2 text-white">
              <div>
                <h1 className="text-[4vw] md:text-[4vw] lg:text-[2vw] lg:h-[10vh] font-medium w-full mb-5">
                  {name}
                </h1>
                <h3 className="text-[3vw] md:text-[2.5vw] lg:text-[1.6vw] mb-10">
                  {price.toFixed(2)}zł{pricePer}
                </h3>
              </div>

              {isAvailable ? (
                <div className="flex justify-between w-full h-[20%]">
                  <div className="flex justify-between w-[40%] bg-[var(--accent)] text-white px-2 rounded-4xl *:text-[2.5vw] *:md:text-[2vw] *:lg:text-[1.6vw] items-center hover:bg-[var(--hoverAccent)] transition duration-400">
                    <button className="cursor-pointer" onClick={handleSubtraction}>
                      -
                    </button>
                    <h4>
                      {isWeightBased
                        ? displayUnit === "g"
                          ? `${(howMany * 1000).toFixed(0)} g`
                          : `${howMany.toFixed(2)} kg`
                        : howMany}
                    </h4>
                    <button className="cursor-pointer" onClick={handleAddition}>
                      +
                    </button>
                  </div>

                  <button
                    className="flex items-center justify-center w-[55%] h-auto p-3 bg-[var(--accent)] text-white text-[2.8vw] lg:text-[1.5vw] rounded-4xl cursor-pointer hover:bg-[var(--hoverAccent)] transition duration-400"
                    onClick={() => {
                      addToCart(props.data, howMany);
                      addAnimation();
                    }}
                  >
                    {add ? "Dodano!" : "Do koszyka"}
                  </button>
                </div>
              ) : (
                <h3 className="text-right text-[4vw] md:text-[3vw] lg:text-[2vw] text-white">
                  Produkt niedostępny
                </h3>
              )}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute w-full h-full bg-[var(--background)] text-white rounded-3xl p-4 flex flex-col justify-center items-center"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <h2 className="text-xl mb-4">Opis produktu</h2>
          <p className="text-sm text-center px-2">
            {description || "Brak opisu dla tego produktu."}
          </p>
          <button
            onClick={() => setFlipped(false)}
            className="mt-6 bg-[var(--accent)] text-white px-4 py-2 rounded-full hover:bg-[var(--hoverAccent)]"
          >
            Wróć
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
