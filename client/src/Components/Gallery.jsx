import React, { useState } from "react";

const Gallery = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="block justify-center w-[90%] mx-auto">
      <div className="w-full pt-45 ">
        <img
          src="/Images/image.svg"
          alt="background"
          onLoad={() => setIsLoaded(true)}
          className="hidden"
        />
        {isLoaded ? (
          <div className="bg-[url(/Images/image.svg)] bg-cover w-[80vw] h-[35vw] md:h-[35vh] lg:h-[40vh] mx-auto rounded-3xl mb-5 text-(--white) px-5 pt-2 z-0">
            <h3 className="text-[5vw] md:text-[2.5vw] ">Godziny otwarcia</h3>
            <div className="flex ">
              <ul className="*:text-[3vw] md:*:text-[2vw] lg:*:text-[24px] mr-10">
                <li>Poniedziałek 10-18</li>
                <li>Wtorek 9-18</li>
                <li>Środa 9-18</li>
                <li>Czwartek 9-18</li>
                <li>Piątek 9-18</li>
              </ul>
              <ul className="*:text-[3vw] md:*:text-[2vw] lg:*:text-[24px]">
                <li>Sobota 9-18</li>
                <li>Niedziela 9-18</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className=" bg-(--background) w-[80vw] h-[35vw] md:h-[35vh] lg:h-[40vh] mx-auto rounded-3xl mb-5 text-(--white) px-5 pt-2 z-0 flex justify-center items-center">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
