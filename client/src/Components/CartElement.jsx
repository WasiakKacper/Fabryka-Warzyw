import React, { useContext } from "react";
import ShopContext from "../Context/ShopContext";

const CartElement = (props) => {
  const { pricePer } = props.data;
  const { unit, value: step } = (() => {
    const per = pricePer.replace("/", "");
    if (per === "szt") return { unit: "szt", value: 1 };
    if (per.includes("kg")) {
      const val = parseFloat(per.replace("kg", "")) || 1;
      return { unit: "kg", value: val };
    }
    if (per.includes("g")) {
      const val = parseFloat(per.replace("g", "")) || 250;
      return { unit: "kg", value: val / 1000 };
    }
    return { unit: "szt", value: 1 };
  })();
  const { name, price, image, quantity } = props.data;
  const { removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(ShopContext);

  return (
    <div className="w-full flex bg-(--background) rounded-2xl p-2 my-3">
      {/* IMG */}
      <div className="w-[20%]">
        <img
          loading="lazy"
          src={image}
          alt={name}
          className="min-w-[50px] min-h-[50px] max-w-[200px] object-cover aspect-square w-[100%] rounded-2xl"
        />
      </div>
      {/* INFO */}
      <div className="w-[40%] px-3">
        <h2 className="font-medium text-[4vw] md:text-[3vw] lg:text-[2vw]">
          {name}
        </h2>
        <h3 className="text-[3vw] md:text-[2vw] lg:text-[1.5vw]">
          {price.toFixed(2)}zł
        </h3>
      </div>
      {/* BUTTONS */}
      <div className="w-[60%]">
        <div className="flex h-full *:h-[30%] gap-2 items-end">
          <div className="flex justify-between w-[40%] bg-(--accent) text-(--white) px-2 rounded-4xl *:text-[2.5vw] *:lg:text-[1.9vw] items-center hover:bg-(--hoverAccent) transition duration-400">
            <button
              className="cursor-pointer"
              onClick={() => {
                const newQty = Math.max(
                  step,
                  parseFloat((quantity - step).toFixed(2))
                );
                decreaseQuantity(props.data._id, newQty);
              }}
            >
              -
            </button>
            <h4 className=" text-center">
              {unit === "kg"
                ? quantity >= 1
                  ? quantity.toFixed(2) + " kg"
                  : Math.round(quantity * 1000) + " g"
                : quantity}
            </h4>
            <button
              className="cursor-pointer"
              onClick={() => {
                const newQty = parseFloat((quantity + step).toFixed(2));
                increaseQuantity(props.data._id, newQty);
              }}
            >
              +
            </button>
          </div>
          <button
            className="flex items-center justify-center w-[55%] h-auto p-3 bg-(--alternativeAccent) text-(--white) text-[2.5vw] lg:text-[1.5vw] rounded-4xl cursor-pointer hover:bg-(--hoverAlternativeAccent) transition duration-400"
            onClick={() => {
              removeFromCart(props.data._id);
            }}
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartElement;
