import React from "react";
import Card from "../Card.jsx";

const Fruits = () => {
  return (
    <div className="flex justify-center w-[full] mt-5 mx-auto">
      <div className="flex flex-col lg:flex-row flex-wrap w-[90%] gap-[4vw]">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Fruits;
