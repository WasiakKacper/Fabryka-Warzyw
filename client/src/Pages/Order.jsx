import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Order = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const date = new Date();
    const day = date.getDay();

    if (day === 2 || day === 5) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, []);

  return (
    <main>
      <h1>Zamówienie</h1>
      <section>
        <h3>Produkty</h3>
        <ul>
          <li>
            <p>Kapusta biała</p>
            <p>00,00zł</p>
          </li>
        </ul>
        <h3>Suma: 00zł</h3>
      </section>
      <section>
        <h3>Sposób odbioru</h3>
        <div>
          <div>
            <h3>Dostawa</h3>
            <p>(Dostępna tylko wtorek i piątek na terenie Łodzi)</p>
          </div>
          <div>
            {!isActive ? (
              "niedostępna"
            ) : (
              <input type="checkbox" name="delivery" />
            )}
          </div>
          <hr />
          <div>
            <div>
              <h3>Odbiór w sklepie</h3>
              <p>(Cedry 4, 91-129 Łódź)</p>
            </div>
            <div>
              <input type="checkbox" name="collection" />
            </div>
          </div>
        </div>
        <Link to="/summary" className="mx-auto w-[30%]">
          <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer">
            Zamów
          </button>
        </Link>
      </section>
    </main>
  );
};

export default Order;
