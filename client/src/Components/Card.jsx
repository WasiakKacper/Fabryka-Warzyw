import React, { useState, useContext } from "react";
import ShopContext from "../Context/ShopContext.jsx";

const Card = (props) => {
  const [howMany, setHowMany] = useState(1);
  const { name, price, image } = props.data;
  const { addToCart } = useContext(ShopContext);

  const handleSubtraction = () => {
    if (howMany - 1 < 1) setHowMany(1);
    else setHowMany(howMany - 1);
  };

  const handleAddition = () => {
    setHowMany(howMany + 1);
  };

  return (
    <div className="flex lg:flex-col w-[100%] lg:w-[30%] bg-(--background) rounded-3xl p-2">
      <div className="w-[50%] md:w-[35%] h-full h-20% lg:w-[100%] aspect-square lg:aspect-auto l mr-auto">
        <img
          src={image}
          alt={name}
          className="rounded-2xl w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between w-[55%] lg:w-full p-2">
        <div>
          <h1 className="text-[4vw] md:text-[4w] lg:text-[2vw] font-medium w-full mb-5">
            {name}
          </h1>
          <h3 className="text-[3vw] md:text-[2.5vw] lg:text-[1.6vw] mb-10">
            {price}zł
          </h3>
        </div>
        <div className="flex justify-between w-full h-[20%]">
          <div className="flex justify-between w-[40%] bg-(--accent) text-(--white) px-2 rounded-4xl *:text-[3vw] *:lg:text-[2vw] items-center">
            <button className="cursor-pointer" onClick={handleSubtraction}>
              -
            </button>
            <h4>{howMany}</h4>
            <button className="cursor-pointer" onClick={handleAddition}>
              +
            </button>
          </div>
          <button
            className="flex items-center justify-center w-[55%] h-auto p-3 bg-(--accent) text-(--white) text-[3vw] lg:text-[2vw] rounded-4xl cursor-pointer"
            onClick={() => {
              addToCart(props.data, howMany);
            }}
          >
            Do koszyka
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
