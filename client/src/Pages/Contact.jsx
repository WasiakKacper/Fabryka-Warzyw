import React, { useState } from "react";

const Contact = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <article>
      <h1 className="pt-45 text-[10vw] md:text-[8vw] lg:text-[6vw] font-medium text-center">
        Kontakt
      </h1>
      <section className="flex flex-col w-[90%] h-[100%] lg:h-[32vw] mx-auto py-10 lg:flex-row justify-center items-center gap-10 *:flex *:flex-col *:justify-evenly *:items-center *:bg-(--background) *:w-[100%] *:h-[100%] lg:*:w-[30%] *:text-center *:p-5 *:rounded-3xl">
        <div>
          <i className="icon-phone text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          <p className="text-[6vw] md:text-[5vw] lg:text-[2.5vw]">
            000-000-000
          </p>
        </div>
        <div>
          <i className="icon-mail-alt text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          <p className="text-[6vw] md:text-[5vw] lg:text-[1.5vw]">
            kontakt@fabrykawarzyw.pl
          </p>
        </div>
        <div>
          <i className="icon-location text-[8vw] md:text-[7vw] lg:text-[4vw]"></i>
          {!isLoaded && <p className="text-gray-600">Ładowanie mapy...</p>}
          <iframe
            width="400"
            height="200"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            className="mx-auto w-[100%] rounded-2xl"
            src="https://maps.google.com/maps?width=400&amp;height=200&amp;hl=en&amp;q=Cedry%204,%2091-129%20%C5%81%C3%B3d%C5%BA+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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
      </section>
    </article>
  );
};

export default Contact;
