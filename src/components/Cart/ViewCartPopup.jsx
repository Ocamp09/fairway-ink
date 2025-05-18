import { IoCloseSharp } from "react-icons/io5";

import global from "../../global.module.css";
import styles from "./ViewCartPopup.module.css";

const ViewCartPopup = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.view_cart_overlay}>
      <div className={styles.view_cart_popup}>
        <button
          className={global.close_button}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <IoCloseSharp size={28} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default ViewCartPopup;
