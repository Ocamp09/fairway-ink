import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import STLViewer from "../3D-View/STLViewer";
import { LuPlus, LuMinus } from "react-icons/lu";
import global from "../../global.module.css";
import styles from "./CartDisplay.module.css";

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
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className={styles.cart_items}>
          {cartItems.map((item) => (
            <li key={item.stl} className={styles.cart_item}>
              <div className={styles.stl_viewer_container}>
                <STLViewer stlUrl={item.stl} cart={true} />
              </div>
              <div className={styles.item_details}>
                <div className={styles.details}>
                  <p>Quantity:</p>

                  <div className={styles.quantity_controls}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.stl, item.quantity - 1)
                      }
                    >
                      <LuMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.stl, item.quantity + 1)
                      }
                    >
                      <LuPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.stl)}
                    className={styles.remove_button}
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
      <div>
        <h3>Cart Total: ${total.toFixed(2)}</h3>
        {errorMessage && <p className={global.error_message}>{errorMessage}</p>}

        <button
          onClick={handleCheckout}
          className={global.submit_button}
          disabled={cartItems.length === 0}
        >
          {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CartDisplay;
