import React from "react";

const Gallery = () => {
  return (
    <div className="block justify-center w-[90%] mx-auto">
      <div className="w-full pt-45 ">
        <div className="bg-[url(/Images/image.svg)] bg-cover w-[80vw] h-[35vw] md:h-[35vh] lg:h-[40vh] mx-auto rounded-3xl mb-5 text-(--white) px-5 pt-2 z-0">
          <h3 className="text-[5vw] md:text-[4vw] ">Godziny otwarcia</h3>
          <ul className="*:text-[3vw] md:*:text-[2vw] lg:*:text-[24px]">
            <li>Poniedziałek 12-20</li>
            <li>Wtorek 12-20</li>
            <li>Środa 12-20</li>
            <li>Czwartek 12-20</li>
            <li>Piątek 12-20</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
