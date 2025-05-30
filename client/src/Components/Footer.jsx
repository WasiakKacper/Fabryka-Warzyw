import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center gap-10 py-5 px-2  bg-(--darkBackgorund) text-(--white) text-[2vw] lg:text-[1.3vw]">
      <section className="flex justify-center gap-10">
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
      </section>
      <section className="text-center">
        <p className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]">
          Odwiedź nasze profile w social mediach!
        </p>
        <div className="flex justify-center gap-10 mt-5">
          <div className="w-[90%] *:text-[10vw] *:md:text-[5vw] *:lg:text-[1.5vw] *:cursor-pointer">
            <a
              className="hover:-translate-y-1  hover:text-(--facebook) transition duration-300 p-2"
              href="https://www.facebook.com/profile.php?id=100068391292702"
              target="_blank"
            >
              Facebook <span className="icon-facebook-squared"></span>
            </a>
            <a
              className=" text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]
              hover:-translate-y-1 transition duration-300 p-2"
              href="https://www.instagram.com/fabrykawarzyw/"
              target="_blank"
            >
              Instagram <span className="icon-instagram"></span>
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
