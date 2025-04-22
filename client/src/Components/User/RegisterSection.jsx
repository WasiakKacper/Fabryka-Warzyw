import React from "react";
import { Form } from "react-router";

const style = {
  label: "text-[4vw] md:text-[3vw] lg:text-[1.5vw]",
  input:
    "bg-(--background) p-2 rounded-4xl text-[4vw] md:text-[3vw] lg:text-[1.5vw]",
};

const RegisterSection = () => {
  return (
    <form
      action=""
      className="flex flex-col w-[100%] md:w-[60%] lg:w-[40%] p-20 mx-auto *:mb-2"
    >
      <section className="flex *:flex *:flex-col *:w-[100%] *:px-1 **:w-[100%]">
        <div>
          <label htmlFor="name" className={style.label}>
            Imię:
          </label>
          <input type="text" name="name" className={style.input} />
        </div>
        <div>
          <label htmlFor="surname" className={style.label}>
            Nazwisko:
          </label>
          <input type="text" name="surname" className={style.input} />
        </div>
      </section>
      <label htmlFor="email" className={style.label}>
        Adres e-mail:
      </label>
      <input type="email" name="email" className={style.input} />
      <label htmlFor="password" className={style.label}>
        Hasło
      </label>
      <input type="password" name="password" className={style.input} />
      <label htmlFor="passwordAgain" className={style.label}>
        Powtórz hasło
      </label>
      <input type="password" name="passwordAgain" className={style.input} />
      <button
        className="bg-(--accent) text-(--white) p-2 rounded-4xl w-[60%] mx-auto mt-4 text-[5vw] md:text-[4vw] lg:text-[2vw] cursor-pointer"
        onClick={(e) => e.preventDefault()}
      >
        Zarejetruj się
      </button>
    </form>
  );
};

export default RegisterSection;
