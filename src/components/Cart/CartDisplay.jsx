import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import STLViewer from "../3D-View/STLViewer";
import "./ViewCartPopup.css";

const CartDisplay = ({ setIsCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, getPrice } =
    useCart();
  const [total, setTotal] = useState(0.0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setTotal(getTotal);
  }, [cartItems]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  return (
    <div>
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
        >
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CartDisplay;
