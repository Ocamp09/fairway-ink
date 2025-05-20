import { createContext, useContext, useEffect, useState } from "react";

import { CUSTOM_PRICE, SOLID_PRICE, TEXT_PRICE } from "../constants";
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
    const existingItem = cartItems.find((cartItem) => cartItem.stlUrl === item);
    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.stlUrl === item.stlUrl
            ? { ...cartItem, quantity: cartItem.quantity + Number(quantity) }
            : cartItem
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: key,
          stlUrl: item,
          quantity: Number(quantity),
          templateType: type,
        },
      ]);
    }
  };

  const removeFromCart = (itemStl) => {
    setCartItems(cartItems.filter((item) => item.stlUrl !== itemStl));
  };

  const updateQuantity = (itemStl, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.stlUrl === itemStl ? { ...item, quantity } : item
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
    if (item.templateType === "solid") {
      return SOLID_PRICE * item.quantity;
    } else if (item.templateType === "text") {
      return TEXT_PRICE * item.quantity;
    } else {
      return CUSTOM_PRICE * item.quantity;
    }
  };

  const getTotal = () => {
    let total = 0.0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.templateType === "solid") {
        total += SOLID_PRICE * item.quantity;
      } else if (item.templateType === "text") {
        total += TEXT_PRICE * item.quantity;
      } else {
        total += CUSTOM_PRICE * item.quantity;
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
