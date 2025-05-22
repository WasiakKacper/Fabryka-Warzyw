import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center gap-10 py-5 mt-10 bg-(--darkBackgorund) text-(--white)">
      <div>
        <h2 className="text-[5vw] md:text-[3vw] lg:text-[2vw]">Kontakt:</h2>
        <p>kontakt@fabrykawarzyw.pl</p>
        <p>669-933-235</p>
      </div>
      <div>
        <h2 className="text-[5vw] md:text-[3vw] lg:text-[2vw]">Sklepy:</h2>
        <p>Cedry 4, 91-129 Łódź</p>
        <p>Belwederska 42, 99-100 Łęczyca</p>
      </div>
    </footer>
  );
};

export default Footer;
