import React, { useState, useEffect } from "react";
import ShopContext from "./ShopContext.jsx";

export const ShopProvider = ({ children }) => {
  const [howManyInCart, setHowManyInCart] = useState(0);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || ""
  );
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [surname, setSurname] = useState(
    () => localStorage.getItem("surname") || ""
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === "true") {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
  }, [username, email]);

  const handleLogin = (nameValue, surnameValue, emailValue) => {
    localStorage.setItem("token", "true");
    localStorage.setItem("username", nameValue);
    localStorage.setItem("surname", surnameValue);
    localStorage.setItem("email", emailValue);
    setUsername(nameValue);
    setSurname(surnameValue);
    setEmail(emailValue);
    setIsLogged(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("surname");
    localStorage.removeItem("email");
    setUsername("");
    setSurname("");
    setEmail("");
    setIsLogged(false);
  };

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    setHowManyInCart(cart.length);
  }, [cart]);

  const addToCart = (item, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const [firstEnter, setFirstEnter] = useState(true);

  useEffect(() => {
    const enter = localStorage.getItem("firstEnter");
    if (enter === "false") setFirstEnter(false);
    else {
      localStorage.setItem("firstEnter", "false");
      setFirstEnter(true);
    }
  }, []);

  return (
    <ShopContext.Provider
      value={{
        isLogged,
        handleLogin,
        handleLogOut,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        howManyInCart,
        increaseQuantity,
        decreaseQuantity,
        username,
        surname,
        email,
        setUsername,
        setSurname,
        setEmail,
        firstEnter,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
