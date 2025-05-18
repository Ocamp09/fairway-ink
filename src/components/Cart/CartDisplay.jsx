import { useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

import { CUSTOM_PRICE, SOLID_PRICE, TEXT_PRICE } from "../../constants";
import { useCart } from "../../contexts/CartContext";
import global from "../../global.module.css";
import STLViewer from "../3D-View/STLViewer";
import styles from "./CartDisplay.module.css";

const CartDisplay = ({ setIsCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, getPrice } =
    useCart();
  const [total, setTotal] = useState(0.0);

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

  const getType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCost = (type) => {
    let cost = 0;
    switch (type) {
      case "solid":
        cost = SOLID_PRICE;
        break;
      case "text":
        cost = TEXT_PRICE;
        break;
      case "custom":
        cost = CUSTOM_PRICE;
    }

    return cost;
  };

  return (
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className={styles.cart_items}>
          {cartItems.map((item) => (
            <li key={item.stlUrl} className={styles.cart_item}>
              <div className={styles.stl_viewer_container}>
                <STLViewer stlUrl={item.stlUrl} cart={true} />
              </div>
              <div className={styles.item_details}>
                <div className={styles.quantity}>
                  <span className={styles.header}>Quantity:</span>

                  <div className={styles.quantity_controls}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.stlUrl, item.quantity - 1)
                      }
                    >
                      <LuMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.stlUrl, item.quantity + 1)
                      }
                    >
                      <LuPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.stlUrl)}
                    className={styles.remove_button}
                  >
                    Remove
                  </button>
                </div>
                <div className={styles.quantity}>
                  <span className={styles.header}>Template Type:</span>
                  <span>{getType(item.templateType)}</span>
                  <span>${getCost(item.templateType)} ea</span>
                </div>
                <div>
                  <span className={styles.header}>Item Total: </span>
                  <p>${getPrice(item).toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Cart Total: ${total.toFixed(2)}</h3>

        <button
          onClick={handleCheckout}
          className={global.submit_button}
          disabled={cartItems.length === 0}
        ></button>
      </div>
    </div>
  );
};

export default CartDisplay;
