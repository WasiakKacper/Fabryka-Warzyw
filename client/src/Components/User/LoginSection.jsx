import React from "react";

const LoginSection = () => {
  return (
    <form
      action=""
      className="flex flex-col w-[100%] md:w-[60%] lg:w-[40%] p-20 mx-auto *:mb-2"
    >
      <label
        htmlFor="email"
        className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
      >
        Adres e-mail:
      </label>
      <input
        type="email"
        name="email"
        className="bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
      />
      <label
        htmlFor="password"
        className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
      >
        Hasło:
      </label>
      <input
        type="password"
        name="password"
        className="bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]"
      />
      <button
        className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[5vw] md:text-[4vw] lg:text-[2vw] cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Zaloguj się
      </button>
    </form>
  );
};

export default LoginSection;
