import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Order = () => {
  const [isActive, setIsActive] = useState(false);
  const [option, setOption] = useState("store");
  const [dzien, setDzien] = useState("");

  const [cart, setCart] = useState([]);
  const [baseTotal, setBaseTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [terms, setTerms] = useState(false);
  const [isInvoice, setIsInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vatId, setVatId] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = now.getDay(); // 0 - niedziela, ..., 6 - sobota
    const hour = now.getHours();
    const minutes = now.getMinutes();

    let canOrderFor = null;

    if (
      (day === 4 && hour >= 20) || // czwartek po 20
      day === 5 || // piątek cały dzień
      day === 6 || // sobota cały dzień
      day === 0 || // niedziela cały dzień
      (day === 1 && (hour < 20 || (hour === 20 && minutes === 0))) // poniedziałek do 20
    ) {
      canOrderFor = "wtorek";
    } else if (
      (day === 1 && hour >= 20) || // poniedziałek po 20
      day === 2 || // wtorek cały dzień
      day === 3 || // środa cały dzień
      (day === 4 && (hour < 20 || (hour === 20 && minutes === 0))) // czwartek do 20
    ) {
      canOrderFor = "piatek";
    } else {
      canOrderFor = "wtorek";
    }

    setIsActive(true);
    setOption(canOrderFor);
    setDzien(canOrderFor === "wtorek" ? "wtorek" : "piątek");
  }, []);

  const calculateItemPrice = (item) => {
    const quantity = item.quantity;
    const price = item.price;
    const pricePer = item.pricePer || "/1kg";

    if (pricePer.includes("kg")) {
      return price * quantity;
    } else if (pricePer.includes("g")) {
      const grams = parseFloat(pricePer.replace(/[^\d]/g, ""));
      const quantityInGrams = quantity * 1000;
      return price * (quantityInGrams / grams);
    } else if (pricePer.includes("szt")) {
      return price * quantity;
    }
    return price * quantity;
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    const sum = savedCart.reduce(
      (acc, item) => acc + calculateItemPrice(item),
      0
    );
    setBaseTotal(Number(sum.toFixed(2)));
  }, []);

  useEffect(() => {
    let total = baseTotal;

    if (option === "delivery") {
      if (baseTotal < 99) {
        total += 5;
      }
    }

    setFinalTotal(Number(total.toFixed(2)));
    localStorage.setItem("total", JSON.stringify(total));
  }, [option, baseTotal]);

  const handleDeliveryChange = (e) => {
    if (e.target.checked) {
      setOption("delivery");
    } else {
      setOption("store");
    }
  };

  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(finalTotal));
  }, [finalTotal]);

  //Get vat data
  useEffect(() => {
    const name = localStorage.getItem("companyname");
    const address = localStorage.getItem("companyaddress");
    const nip = localStorage.getItem("vatid");

    if (name) setCompanyName(name);
    if (address) setCompanyAddress(address);
    if (nip) setVatId(nip);
  }, []);

  const handleSave = () => {
    if (isInvoice) {
      if (companyAddress !== "" || (companyName !== "" && vatId !== "")) {
        localStorage.setItem("companyname", companyName);
        localStorage.setItem("vatid", vatId);
        localStorage.setItem("companyaddress", companyAddress);
      } else {
        alert("Podaj wszystkie dane do faktury!");
        localStorage.setItem("companyname", "");
        localStorage.setItem("vatid", "");
        localStorage.setItem("companyaddress", "");
      }
    }
  };

  return (
    <main className="w-[90%] lg:w-[60%] h-[100%] mx-auto text-(--white) mb-20">
      <section className="pt-45  mx-auto flex flex-col w-[90%]">
        <h1 className="text-center text-[8vw] md:text-[5vw] lg:text-[3vw] font-medium mb-10">
          Zamówienie
        </h1>
        <section>
          <h3 className="text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5">
            Produkty
          </h3>
          <ul className="text-[4vw] md:text-[3vw] lg:text-[2vw] text-(--alternativeBackground) mb-5 *:flex *:justify-between *:w-full">
            {cart.map((item, index) => (
              <li key={index}>
                <p>{item.name}</p>
                <p>
                  {item.price.toFixed(2)}zł x{Number(item.quantity) + "kg"}
                </p>
              </li>
            ))}
          </ul>
          <div>
            <h3 className="flex text-[5vw] md:text-[4vw] lg:text-[2vw] font-medium mb-5 w-full justify-end">
              Suma: {finalTotal}zł
            </h3>
          </div>
        </section>
        <section>
          <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] font-medium mb-5">
            Sposób odbioru
          </h3>
          <div className="mb-10">
            <section className="flex justify-between">
              <div>
                <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                  Dostawa
                </h3>
                <p className="flex text-[3vw] md:text-[2vw] lg:text-[1vw]  w-[50%]">
                  (Dostępna tylko wtorek i piątek na terenie Łodzi)
                </p>
              </div>
              <div className="flex flex-col items-end">
                {!isActive ? (
                  <p className="mb-4">niedostępna</p>
                ) : (
                  <input
                    type="checkbox"
                    name="delivery"
                    className="scale-200 mt-2 cursor-pointer"
                    onChange={(e) => {
                      setOption("delivery");
                      handleDeliveryChange(e);
                    }}
                  />
                )}
                <div>
                  <p>(5zł, dla zamówień {<br />} powyżej 99zł darmowa.)</p>
                  <br />
                  <p>
                    Najbliższa dostawa:{" "}
                    <span className="font-bold">{dzien}.</span>
                  </p>
                </div>
              </div>
            </section>
            <hr className="my-2 border-(--alternativeBackgroud)" />
            <section className="flex justify-between w-[100%]">
              <div>
                <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                  Odbiór w sklepie
                </h3>
                <p className="flex text-[3vw] md:text-[2vw] lg:text-[1vw]  w-[50%]">
                  (Cedry 4, 91-129 Łódź | Belwederska 42, 99-100 Łęczyca)
                </p>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="collection"
                  className="scale-200 mt-2 cursor-pointer"
                  onChange={() => {
                    setOption("store");
                  }}
                />
              </div>
            </section>
            <hr className="my-2 border-(--alternativeBackgroud)" />
            <section className="flex flex-col justify-between w-[100%]">
              <div className="flex pt-10 w-[100%] justify-between">
                <div>
                  <h3 className="flex text-[3.6vw] md:text-[2.6vw] lg:text-[1.6vw] mb-2">
                    Zamawiam na fakturę
                  </h3>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="collection"
                    className="scale-200 mt-2 cursor-pointer"
                    onChange={() => {
                      setIsInvoice(!isInvoice);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row pt-5 w-[100%] *:w-[100%] gap-2 justify-center *:border-1 *:rounded-2xl *:p-2 mb-10">
                {isInvoice && (
                  <>
                    <input
                      type="text"
                      placeholder="Nazwa firmy"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="NIP"
                      value={vatId}
                      onChange={(e) => setVatId(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Adres firmy"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                  </>
                )}
              </div>
            </section>
            <div className="flex items-start space-x-2 mt-10">
              <input
                type="checkbox"
                id="terms"
                onChange={(e) => {
                  if (e.target.checked) {
                    setTerms(true);
                  } else {
                    setTerms(false);
                  }
                }}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-(--white)">
                Akceptuję
                <Link to="/terms" className="underline text-blue-600 ml-2">
                  regulamin sklepu
                </Link>
                .
              </label>
            </div>
          </div>
          {terms ? (
            <Link
              to={
                !isInvoice || (companyName && vatId && companyAddress)
                  ? option === "store"
                    ? "/pickupstore"
                    : "/pickupdelivery"
                  : "#"
              }
              onClick={(e) => {
                if (isInvoice) {
                  if (!companyName || !vatId || !companyAddress) {
                    e.preventDefault();
                    alert("Podaj wszystkie dane do faktury!");
                    return;
                  }
                }
                handleSave();
              }}
              className="mx-auto w-[60%] flex items-center justify-center"
            >
              <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--accent) w-[100%] mx-auto rounded-4xl text-(--white) cursor-pointer hover:bg-(--hoverAccent) transition duration-400">
                Dalej
              </button>
            </Link>
          ) : (
            <button className="text-[5vw] md:text-[4vw] lg:text-[3vw] bg-(--background) mx-auto w-[60%] flex justify-center rounded-4xl text-(--white)">
              Dalej
            </button>
          )}
        </section>
      </section>
    </main>
  );
};

export default Order;
