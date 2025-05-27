import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="flex justify-center gap-10 py-5 px-2  bg-(--darkBackgorund) text-(--white) text-[2vw] lg:text-[1.3vw]">
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
      <div>
        <h2 className="text-[5vw] md:text-[3vw] lg:text-[2vw] mb-3">
          Regulamin:
        </h2>
        <Link to="/terms">
          <p className="text-blue-500 underline">Regulamin sklepu</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
