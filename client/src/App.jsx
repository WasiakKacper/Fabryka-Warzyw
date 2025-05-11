import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

import Home from "./Pages/Home.jsx";
import Gastronomy from "./Pages/Gastronomy.jsx";
import Cart from "./Pages/Cart.jsx";
import Login from "./Pages/Login.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";

import Order from "./Pages/Order.jsx";
import PickupStore from "./Pages/PickupStore.jsx";
import PickupDelivery from "./Pages/PickupDelivery.jsx";
import Account from "./Components/User/Account.jsx";
import Admin from "./Components/User/Admin.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./App.css";

function App() {
  return (
    <main>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gastronomy" element={<Gastronomy />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
          <Route path="/pickupstore" element={<PickupStore />} />
          <Route path="/pickupdelivery" element={<PickupDelivery />} />
        </Routes>
        <Footer />
      </Router>
    </main>
  );
}

export default App;
