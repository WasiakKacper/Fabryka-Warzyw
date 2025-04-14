import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center gap-10 py-5 bg-(--black) text-(--white)">
      <div>
        <h2 className="text-[5vw] md:text-[3vw] lg:text-[2vw]">Kontakt:</h2>
        <p>kontakt@fabrykawarzyw.pl</p>
        <p>000-000-000</p>
      </div>
      <div>
        <h2 className="text-[5vw] md:text-[3vw] lg:text-[2vw]">Adres:</h2>
        <p>Cedry 4, 91-129 Łódź</p>
      </div>
    </footer>
  );
};

export default Footer;
