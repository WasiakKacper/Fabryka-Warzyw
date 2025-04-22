import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer.jsx";

const About = () => {
  return (
    <>
      <Navbar name="About" />
      <main className="flex flex-col w-full justify-evenly">
        <h1 className="pt-45 text-[10vw] md:text-[8vw] lg:text-[6vw] font-medium text-center">
          O nas
        </h1>
        <p className=" w-[50%] mt-5 mx-auto text-[3vw] md:text-[2vw] lg:text-[1.5vw]">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem
          voluptate, necessitatibus dolores asperiores obcaecati vel consectetur
          nulla. Vero quod optio velit accusantium molestias culpa dolorem
          impedit porro, voluptates quos expedita? Autem voluptate ipsa,
          deserunt, repellendus doloribus aliquid voluptatibus delectus
          architecto eveniet officiis praesentium optio vitae sapiente quam
          voluptatem similique nobis expedita! Voluptatibus excepturi iure eum
          corporis dolor maiores, doloremque non.
        </p>
        <Footer />
      </main>
    </>
  );
};

export default About;
