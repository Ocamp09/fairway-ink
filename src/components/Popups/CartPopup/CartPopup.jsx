import { IoCloseSharp } from "react-icons/io5";

import global from "../../../global.module.css";
import styles from "../Popup.module.css";

const CartPopup = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.popup_overlay} data-testid="view-cart-overlay">
      <div className={styles.popup}>
        <button
          className={global.close_button}
          onClick={() => setIsOpen(false)}
          data-testid="close-button"
          aria-label="Close cart popup"
        >
          <IoCloseSharp size={28} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default CartPopup;
