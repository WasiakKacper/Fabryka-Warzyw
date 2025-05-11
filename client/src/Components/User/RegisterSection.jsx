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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordAgain) {
      axios
        .post("http://localhost:3001/register", {
          name,
          surname,
          email,
          password,
        })
        .then(() => {
          alert("Zarejestrowno!");
          setIsClicked(1);
        })
        .catch((err) => {
          alert("Błąd komunikacji z bazą danych.");
          console.log(err);
        });
    } else {
      alert("Hasła są różne!");
    }
  };

  return (
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
      <button className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[4.5vw] md:text-[3.5vw] lg:text-[2vw] cursor-pointer">
        Zarejestruj się
      </button>
    </form>
  );
};

export default RegisterSection;
