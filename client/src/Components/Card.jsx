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
    <div className="perspective w-full aspect-[3/4] md:aspect-[4/5]">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-3xl overflow-hidden ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div
          className="absolute w-full h-full backface-hidden bg-(--background) p-4 drop-shadow-2xl flex flex-col justify-between"
          ref={ref}
        >
          <div className="w-full aspect-square relative mb-4">
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
                className={`rounded-2xl w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
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

          <div className="text-(--white)">
            <h1 className="text-[5vw] md:text-[3.5vw] lg:text-[2vw] font-medium mb-2">
              {name}
            </h1>
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[1.6vw] mb-4">
              {price.toFixed(2)}zł{pricePer}
            </h3>

            {isAvailable ? (
              <div className="flex justify-between items-center gap-2">
                <div className="flex justify-between items-center w-1/2 bg-(--accent) text-(--white) px-2 py-1 rounded-full *:text-[4vw] md:*:text-[2.5vw] lg:*:text-[1.4vw]">
                  <button onClick={handleSubtraction}>-</button>
                  <h4>
                    {isWeightBased
                      ? displayUnit === "g"
                        ? `${(howMany * 1000).toFixed(0)} g`
                        : `${howMany.toFixed(2)} kg`
                      : howMany}
                  </h4>
                  <button onClick={handleAddition}>+</button>
                </div>

                <button
                  className="w-1/2 py-2 bg-(--accent) text-(--white) text-[4vw] md:text-[2.5vw] lg:text-[1.4vw] rounded-full hover:bg-(--hoverAccent) transition duration-300"
                  onClick={() => {
                    addToCart(props.data, howMany);
                    addAnimation();
                  }}
                >
                  {add ? "Dodano!" : "Do koszyka"}
                </button>
              </div>
            ) : (
              <h3 className="text-[4vw] md:text-[3vw] lg:text-[1.8vw] mt-2">
                Produkt niedostępny
              </h3>
            )}
          </div>
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-(--background) p-6 flex flex-col items-center justify-center text-white text-center">
          <h2 className="text-lg md:text-xl mb-4">Opis produktu</h2>
          <p className="text-sm md:text-base">
            {description || "Brak opisu dla tego produktu."}
          </p>
          <button
            className="mt-6 bg-(--accent) text-white px-4 py-2 rounded-full hover:bg-(--hoverAccent)"
            onClick={() => setFlipped(false)}
          >
            Wróć
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
