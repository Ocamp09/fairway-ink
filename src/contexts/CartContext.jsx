import { createContext, useContext, useEffect, useState } from "react";
import { CUSTOM_PRICE, SOLID_PRICE, TEXT_PRICE } from "../constants";

const CartContext = createContext();

const getPriceByType = (templateType, quantity) => {
  switch (templateType) {
    case "solid":
      return SOLID_PRICE * quantity;
    case "text":
      return TEXT_PRICE * quantity;
    default:
      return CUSTOM_PRICE * quantity;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (id, stlUrl, quantity, templateType) => {
    setCartItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.stlUrl === stlUrl);
      if (index !== -1) {
        const updated = [...prevItems];
        updated[index].quantity += Number(quantity);
        return updated;
      }
      return [
        ...prevItems,
        {
          id,
          stlUrl,
          quantity: Number(quantity),
          templateType,
        },
      ];
    });
  };

  const removeFromCart = (stlUrl) => {
    setCartItems((items) => items.filter((item) => item.stlUrl !== stlUrl));
  };

  const updateQuantity = (stlUrl, quantity) => {
    setCartItems((items) =>
      items.map((item) =>
        item.stlUrl === stlUrl ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => cartItems.length;

  const getPrice = (item) => getPriceByType(item.templateType, item.quantity);

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + getPriceByType(item.templateType, item.quantity),
      0
    );

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

export const useCart = () => useContext(CartContext);
