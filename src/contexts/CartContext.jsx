import React, { createContext, useContext, useState, useEffect } from "react";

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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
