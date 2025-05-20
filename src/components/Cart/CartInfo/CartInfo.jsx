import { useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

import { CUSTOM_PRICE, SOLID_PRICE, TEXT_PRICE } from "../../../constants";
import { useCart } from "../../../contexts/CartContext";
import global from "../../../global.module.css";
import STLViewer from "../../3D-View/STLViewer/STLViewer";
import styles from "./CartInfo.module.css";

const CartInfo = ({ setIsCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, getPrice } =
    useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(getTotal);
  }, [cartItems, getTotal]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const getType = (type) => type.charAt(0).toUpperCase() + type.slice(1);

  const getCost = (type) => {
    switch (type) {
      case "solid":
        return SOLID_PRICE;
      case "text":
        return TEXT_PRICE;
      case "custom":
        return CUSTOM_PRICE;
      default:
        return 0;
    }
  };

  return (
    <div className={styles.cart} data-testid="cart-info">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className={styles.cart_items}>
          {cartItems.map((item) => (
            <li
              key={item.stlUrl}
              className={styles.cart_item}
              data-testid="cart-item"
            >
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
                      aria-label="Decrease quantity"
                    >
                      <LuMinus />
                    </button>
                    <span data-testid={`quantity-${item.stlUrl}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.stlUrl, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      <LuPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.stlUrl)}
                    className={styles.remove_button}
                    data-testid={`remove-${item.stlUrl}`}
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
          data-testid="checkout-button"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartInfo;
