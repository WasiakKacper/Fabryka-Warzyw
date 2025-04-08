import React from "react";

const Card = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-(--background)">
      <img src="" alt="product name" />
      <div>
        <h1>Name</h1>
        <h3>Price</h3>
        <div>
          <div className="flex flex-row">
            <button>-</button>
            <h4>0</h4>
            <button>+</button>
          </div>
          <button>Do koszyka</button>
        </div>
      </div>
    </div>
  );
};

const Vegetables = () => {
  return (
    <div className="flex justify-center w-[100%]">
      <div className="flex flex-wrap w-auto">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Vegetables;
