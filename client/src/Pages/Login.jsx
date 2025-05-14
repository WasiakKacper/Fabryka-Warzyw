import React, { useState } from "react";
import LoginSection from "../Components/User/LoginSection.jsx";
import RegisterSection from "../Components/User/RegisterSection.jsx";

const Login = () => {
  const [isClicked, setIsClicked] = useState(1);
  return (
    <article className="min-h-[120vh] h-[100%] ">
      <section className="pt-45 h-[90vh] mb-20">
        <ul className="flex gap-2 w-full justify-center pr-3 *:cursor-pointer *:text-[4vw] md:*:text-[3vh] lg:*:text-[2vw]">
          <li onClick={() => setIsClicked(1)}>
            Logowanie
            {isClicked == 1 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
          <li className="text-(--background)">|</li>
          <li onClick={() => setIsClicked(2)}>
            Rejestracja
            {isClicked == 2 ? (
              <hr className="border-(--background) border-2 rounded-2xl" />
            ) : (
              <></>
            )}
          </li>
        </ul>
        {isClicked == 1 ? (
          <LoginSection />
        ) : (
          <RegisterSection setIsClicked={setIsClicked} />
        )}
      </section>
    </article>
  );
};

export default Login;
