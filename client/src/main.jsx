import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ShopProvider } from "./Context/ShopProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ShopProvider>
    <App />
  </ShopProvider>
);
