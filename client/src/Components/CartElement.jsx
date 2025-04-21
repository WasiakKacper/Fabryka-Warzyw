import React, { useState } from "react";

const CartElement = () => {
  const [howMany, setHowMany] = useState(0);

  const handleSubtraction = () => {
    if (howMany > 0) setHowMany(howMany - 1);
  };

  const handleAddition = () => {
    setHowMany(howMany + 1);
  };

  return (
    <div className="w-full flex bg-(--background) rounded-2xl p-2">
      {/* IMG */}
      <div className="w-[20%]">
        <img
          src="/Images/kapusta.png"
          alt="product name"
          className="min-w-[50px] min-h-[50px] max-w-[200px] object-cover aspect-square w-[100%] rounded-2xl"
        />
      </div>
      {/* INFO */}
      <div className="w-[40%] px-3">
        <h2 className="font-medium text-[4vw] md:text-[3vw] lg:text-[2vw]">
          Name
        </h2>
        <h3 className="text-[3vw] md:text-[2vw] lg:text-[1.5vw]">00,00zł</h3>
      </div>
      {/* BUTTONS */}
      <div className="w-[40%]">
        <div className="flex h-full *:h-[30%] gap-2 items-end">
          <div className="flex gap-2 px-3 bg-(--accent) rounded-4xl text-(--white) text-[4vw] md:text-[3vw] lg:text-[2vw]">
            <button className="cursor-pointer" onClick={handleSubtraction}>
              -
            </button>
            <h4 className="w-[40px] text-center">{howMany}</h4>
            <button className="cursor-pointer" onClick={handleAddition}>
              +
            </button>
          </div>
          <button className="bg-(--alternativeAccent) w-full rounded-4xl text-(--white) text-[4vw] md:text-[3vw] lg:text-[2vw] cursor-pointer">
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartElement;
