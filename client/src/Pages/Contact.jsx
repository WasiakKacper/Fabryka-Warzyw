import React, { useState } from "react";

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article className="text-(--white) mb-20">
      <h1 className="pt-45 text-[10vw] md:text-[8vw] lg:text-[6vw] font-medium text-center">
        Kontakt
      </h1>
      <section className="flex flex-col w-[90%] h-[100%] lg:h-[32vw] mx-auto py-10 lg:flex-row justify-center items-center gap-10 *:flex *:flex-col *:justify-evenly *:items-center *:bg-(--background) *:w-[100%] *:h-[100%] lg:*:w-[30%] *:text-center *:p-5 *:rounded-3xl">
        <div>
          <i className="icon-phone text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          <p className="text-[6vw] md:text-[5vw] lg:text-[2.5vw]">
            669-933-235
          </p>
        </div>
        <div>
          <i className="icon-mail-alt text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          <p className="text-[6vw] md:text-[5vw] lg:text-[1.5vw]">
            kontakt@fabrykawarzyw.pl
          </p>
        </div>
        <div>
          <div className="flex justify-evenly w-[90%] *:text-[10vw] *:md:text-[8vw] *:lg:text-[4vw] *:cursor-pointer">
            <a
              className="icon-facebook-squared hover:-translate-y-4  hover:text-(--facebook) transition duration-300 p-2"
              href="https://www.facebook.com/profile.php?id=100068391292702"
              target="_blank"
            ></a>
            <a
              className="icon-instagram text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]
              hover:-translate-y-4 transition duration-300 p-2"
              href="https://www.instagram.com/fabrykawarzyw/"
              target="_blank"
            ></a>
          </div>
          <p className="text-[4vw] md:text-[3vw] lg:text-[1.5vw]">
            Odwiedź nasze profile w social mediach!
          </p>
          <p className="text-[3vw] md:text-[2vw] lg:text-[1vw]">
            (Kliknij ikonę, aby przejść do profilu.)
          </p>
        </div>
      </section>
      <section className="h-[100%]">
        <div className="bg-(--background) w-[90%] h-[100%] lg:w-[60%] text-center p-5 pb-10 lg:pb-0 rounded-3xl mx-auto">
          <i className="icon-location text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          {!isLoaded && <p className="text-gray-600">Ładowanie map...</p>}
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
            <div className="w-[100%] lg:w-[50%] h-[300px]">
              <iframe
                width="400"
                height="200"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                className="mx-auto w-[100%] rounded-2xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2468.1433559414627!2d19.386627476487547!3d51.78526607187777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471bb55037a2bff3%3A0xeec34acabfbc33db!2zQ2VkcnkgNCwgOTEtMTI5IMWBw7Nkxbo!5e0!3m2!1spl!2spl!4v1747493634219!5m2!1spl!2spl"
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
              >
                <a href="https://www.gps.ie/collections/personal-trackers/">
                  real-time gps tracker,
                </a>
              </iframe>
              <p className="text-[6vw] md:text-[5vw] lg:text-[2vw]">
                Cedry 4, 91-129 Łódź
              </p>
            </div>
            <div className="w-[100%] lg:w-[50%] h-[300px]">
              <iframe
                width="400"
                height="200"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                className="mx-auto w-[100%] rounded-2xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2453.2897328165905!2d19.190778776504793!3d52.056247871943384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ba6a0cf15eae5%3A0xb9c4a3010808887c!2sBelwederska%2042%2C%2099-100%20%C5%81%C4%99czyca!5e0!3m2!1spl!2spl!4v1747491772964!5m2!1spl!2spl"
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
              >
                <a href="https://www.gps.ie/collections/personal-trackers/">
                  real-time gps tracker,
                </a>
              </iframe>
              <p className="text-[6vw] md:text-[5vw] lg:text-[2vw]">
                Belwederska 42, 99-100 Łęczyca
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Contact;
