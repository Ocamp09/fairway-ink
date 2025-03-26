import React, { createContext, useContext, useState, useEffect } from "react";
import { SOLID_PRICE, TEXT_PRICE, CUSTOM_PRICE } from "../constants";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    const storedCart = sessionStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (key, item, quantity, type) => {
    const existingItem = cartItems.find((cartItem) => cartItem.stl === item);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.stl === item.stl
            ? { ...cartItem, quantity: cartItem.quantity + Number(quantity) }
            : cartItem
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        { id: key, stl: item, quantity: Number(quantity), type: type },
      ]);
    }
  };

  const removeFromCart = (itemStl) => {
    setCartItems(cartItems.filter((item) => item.stl !== itemStl));
  };

  const updateQuantity = (itemStl, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.stl === itemStl ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  const getPrice = (item) => {
    if (item.type === "solid") {
      return SOLID_PRICE * item.quantity;
    } else if (item.type === "text") {
      return TEXT_PRICE * item.quantity;
    } else {
      return CUSTOM_PRICE * item.quantity;
    }
  };

  const getTotal = () => {
    let total = 0.0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.type === "solid" || item.type === "text") {
        const price = 5.99;
        total += price * item.quantity;
      } else {
        const price = 7.99;
        total += price * item.quantity;
      }
    }

    return total;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getPrice,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
