import React from "react";

const About = () => {
  return (
    <div className="bg-[url('/Images/background.png')] bg-cover bg-fixed min-h-[100dvh] h-[100vh]">
      <main className="flex flex-col w-full min-h-screen justify-evenly text-white">
        <h1 className="pt-20 text-[10vw] md:text-[8vw] lg:text-[6vw] font-medium text-center">
          O nas
        </h1>
        <p className="w-[90%] md:w-[80%] lg:w-[60%] mt-2 mx-auto text-[2.8vw] md:text-[2vw] lg:text-[1.5vw] mb-20">
          Nasza historia zaczyna się na rodzinnym, wielopokoleniowym
          gospodarstwie, które od lat z troską prowadzą nasi rodzice. To właśnie
          tam, wśród pól i szklarni, dojrzewają pierwsze warzywa trafiające do
          naszego warzywniaka. Z czasem pasja do zdrowej, lokalnej żywności
          przerodziła się w coś więcej – dziś oprócz sklepu stacjonarnego
          zajmujemy się także sprzedażą hurtową warzyw i owoców.
          <br />
          <br />
          Naszym celem jest promowanie tego, co najlepsze z polskiej ziemi.
          Dlatego współpracujemy z lokalnymi rolnikami i producentami, którzy –
          podobnie jak my – stawiają na jakość, świeżość i naturalne metody
          upraw. Dzięki temu w naszym sklepie internetowym znajdziesz produkty,
          które mają smak prawdziwego ogrodu.
          <br />
          <br />
          Tworzymy miejsce, gdzie tradycja spotyka się z nowoczesnością –
          bezpośrednio z pola prosto do Twojego domu lub firmy.
        </p>
      </main>
    </div>
  );
};

export default About;
