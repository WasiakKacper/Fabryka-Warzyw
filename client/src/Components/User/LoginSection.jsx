import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext";

const LoginSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin } = useContext(ShopContext);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, password })
      /*       .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/account");
          handleLogin(email, password);
        }
      }) */
      .then((result) => {
        if (result.data.message === "Success") {
          handleLogin(result.data.name, result.data.surname, result.data.email);
          navigate("/account");
        } else {
          alert(result.data.message);
        }
      })
      .catch((err) => alert("Błąd komunikacji z bazą danych: ", err));
  };
  return (
    <form
      className="flex flex-col w-[100%] md:w-[60%] lg:w-[40%] p-20 mx-auto *:mb-2"
      onSubmit={handleSubmit}
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
        onChange={(e) => {
          setEmail(e.target.value);
        }}
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
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[5vw] md:text-[4vw] lg:text-[2vw] cursor-pointer">
        Zaloguj się
      </button>
    </form>
  );
};

export default LoginSection;
