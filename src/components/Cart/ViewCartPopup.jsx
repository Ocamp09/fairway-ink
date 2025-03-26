import React from "react";
import styles from "./ViewCartPopup.module.css";

const ViewCartPopup = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.view_cart_overlay}>
      <div className={styles.view_cart_popup}>
        <button
          className={styles.close_button}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default ViewCartPopup;
