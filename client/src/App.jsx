import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Gastronomy from "./Pages/Gastronomy.jsx";
import { motion } from "motion/react";
import "./App.css";

function App() {
  return (
    <main>
      <motion.section
        className="fixed flex justify-center items-center w-[100vw] h-[100vh] bg-(--white) z-10000"
        initial={{ translateY: 0 }}
        animate={{ translateY: -1000 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <img src="/Images/loading.png" alt="Fabryka warzyw" />
      </motion.section>
      <Navbar />
      <Home />
      <Gastronomy />
    </main>
  );
}

export default App;
