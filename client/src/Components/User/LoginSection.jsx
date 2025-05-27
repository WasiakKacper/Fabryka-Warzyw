import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import ShopContext from "../../Context/ShopContext";

const LoginSection = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { handleLogin } = useContext(ShopContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminName = import.meta.env.VITE_ADMIN_NAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      if (email === adminName && password === adminPassword) {
        handleLogin("Admin", "Admin", email, true);
        navigate("/admin");
      } else {
        axios
          .post(`${apiUrl}/users/login`, { email, password })
          /*       .then((result) => {
        console.log(result);
        if (result.data === "Success") {
          navigate("/account");
          handleLogin(email, password);
        }
      }) */
          .then((result) => {
            if (result.data.message === "Success") {
              handleLogin(
                result.data.name,
                result.data.surname,
                result.data.email,
                false
              );
              navigate("/account");
            } else {
              setError(true);
              setErrorMessage(result.data.message);
            }
          })
          .catch((err) => alert("Błąd komunikacji z bazą danych: ", err));
      }
    } else {
      setError(true);
      setErrorMessage("Żadne pole nie może pozostać puste!");
    }
  };

  return (
    <section className="text-(--white)">
      {error ? (
        <div className="fixed top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-xl">
          <section className="bg-(--background) w-[60%] h-[60%] mt-45 mx-auto flex flex-col justify-center rounded-3xl">
            <h3 className="text-[4vw] md:text-[3vw] lg:text-[2vw] font-medium text-center">
              {errorMessage}
            </h3>
            <button
              className="mt-20 py-1 w-[30%] rounded-4xl mx-auto text-[4vw] md:text-[3vw] lg:text-[2vw] bg-(--accent) text-(--white) cursor-pointer"
              onClick={() => setError(false)}
            >
              Ok
            </button>
          </section>
        </div>
      ) : (
        <></>
      )}
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
        <button className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[5vw] md:text-[4vw] lg:text-[2vw] cursor-pointer hover:bg-(--hoverAccent) transition duration-400">
          Zaloguj się
        </button>
      </form>
    </section>
  );
};

export default LoginSection;
