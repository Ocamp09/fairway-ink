import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import STLViewer from "../3D-View/STLViewer";
import "./ViewCartPopup.css";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";

const ViewCartPopup = ({ isOpen, setIsOpen }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [total, setTotal] = useState(0.0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    let newTotal = 0;
    cartItems.forEach((item) => {
      newTotal +=
        item.type === "solid" || item.type === "text"
          ? 5.99 * item.quantity
          : 7.99 * item.quantity;
    });
    setTotal(newTotal);
  }, [cartItems]); // Crucial: Add cartItems as a dependency

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const getPrice = (item) => {
    if (item.type === "solid" || item.type === "text") {
      const price = 5.99;
      return price * item.quantity;
    } else {
      const price = 7.99;
      return price * item.quantity;
    }
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="view-cart-overlay">
      <div className="view-cart-popup">
        <button
          className="close-button"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </button>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.stl} className="cart-item">
                <div className="stl-viewer-container">
                  <STLViewer stlUrl={item.stl} cart={true} />{" "}
                </div>
                <div className="item-details">
                  <div className="quantity">
                    <p>Quantity:</p>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.stl, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.stl, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.stl)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>

                  <p>Item Total: ${getPrice(item).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="checkout">
          <h3>Cart Total: ${total.toFixed(2)}</h3>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            onClick={handleCheckout}
            className="checkout-button"
            disabled={cartItems.length === 0}
            hidden={isCheckout}
          >
            {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
          </button>
        </div>
        {isCheckout && <Checkout cartTotal={total.toFixed(2)} />}
      </div>
    </div>
  );
};

export default ViewCartPopup;
