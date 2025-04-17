import Home from "./Pages/Home.jsx";
import Gastronomy from "./Pages/Gastronomy.jsx";
import Cart from "./Pages/Cart.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gastronomy" element={<Gastronomy />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
