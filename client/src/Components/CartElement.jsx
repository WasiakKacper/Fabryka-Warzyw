import React, { useContext } from "react";
import ShopContext from "../Context/ShopContext";

const CartElement = (props) => {
  const { name, price, image, quantity } = props.data;
  const { removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(ShopContext);

  return (
    <div className="w-full flex bg-(--background) rounded-2xl p-2 my-3">
      {/* IMG */}
      <div className="w-[20%]">
        <img
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
        <h3 className="text-[3vw] md:text-[2vw] lg:text-[1.5vw]">{price}zł</h3>
      </div>
      {/* BUTTONS */}
      <div className="w-[40%]">
        <div className="flex h-full *:h-[30%] gap-2 items-end">
          <div className="flex items-center justify-center gap-2 px-3 bg-(--accent) rounded-4xl text-(--white) text-[4vw] md:text-[3vw] lg:text-[2vw]">
            <button
              className="cursor-pointer"
              onClick={() => decreaseQuantity(props.data._id)}
            >
              -
            </button>
            <h4 className="w-[40px] text-center">{quantity}</h4>
            <button
              className="cursor-pointer"
              onClick={() => increaseQuantity(props.data._id)}
            >
              +
            </button>
          </div>
          <button
            className="bg-(--alternativeAccent) w-full rounded-4xl text-(--white) text-[4vw] md:text-[3vw] lg:text-[2vw] cursor-pointer"
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
