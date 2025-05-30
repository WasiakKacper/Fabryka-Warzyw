import React, { useState, useEffect } from "react";

const ScrollBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200); // pokaż przycisk po przewinięciu 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOnClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      onClick={handleOnClick}
      className={`icon-up-big w-[11vw] h-[11vw] md:w-[8vw] md:h-[8vw] lg:w-[4vw] lg:h-[4vw]  fixed bottom-10 right-10 bg-(--accent) cursor-pointer hover:scale-110 transition-all z-10000 flex items-center justify-center rounded-full text-white text-[24px] ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    ></div>
  );
};

export default ScrollBtn;
