import React, { useState } from "react";
import axios from "axios";

const style = {
  label: "text-[4vw] md:text-[3vw] lg:text-[1.5vw]",
  input:
    "bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]",
};

const RegisterSection = ({ setIsClicked }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      name !== "" &&
      surname !== "" &&
      email !== "" &&
      password !== "" &&
      passwordAgain !== ""
    ) {
      if (password === passwordAgain) {
        if (password.length >= 8) {
          axios
            .post(`${apiUrl}/users/register`, {
              name,
              surname,
              email,
              password,
            })
            .then(() => {
              setError(true);
              setErrorMessage("Zarejestrowno!");
              setIsClicked(1);
            })
            .catch((err) => {
              alert("Błąd komunikacji z bazą danych.");
              console.log(err);
            });
        } else {
          setError(true);
          setErrorMessage("Hasło musi mieć co najmniej 8 znaków!");
        }
      } else {
        setError(true);
        setErrorMessage("Hasła są różne!");
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
        onSubmit={handleSubmit}
        className="flex flex-col w-[100%] md:w-[60%] lg:w-[40%] p-20 mx-auto *:mb-2"
      >
        <section className="flex *:flex *:flex-col *:w-[100%] *:px-1 **:w-[100%]">
          <div>
            <label htmlFor="name" className={style.label}>
              Imię:
            </label>
            <input
              type="text"
              name="name"
              className={style.input}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="surname" className={style.label}>
              Nazwisko:
            </label>
            <input
              type="text"
              name="surname"
              className={style.input}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
        </section>
        <label htmlFor="email" className={style.label}>
          Adres e-mail:
        </label>
        <input
          type="email"
          name="email"
          className={style.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className={style.label}>
          Hasło
        </label>
        <input
          type="password"
          name="password"
          className={style.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordAgain" className={style.label}>
          Powtórz hasło
        </label>
        <input
          type="password"
          name="passwordAgain"
          className={style.input}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />
        <button className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[4.5vw] md:text-[3.5vw] lg:text-[2vw] cursor-pointer hover:bg-(--hoverAccent) transition duration-400">
          Zarejestruj się
        </button>
      </form>
    </section>
  );
};

export default RegisterSection;
