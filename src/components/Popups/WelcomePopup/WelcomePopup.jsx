import { IoCloseSharp } from "react-icons/io5";

import styles from "../Popup.module.css";
import global from "../../../global.module.css";

const WelcomePopup = ({ setWelcome }) => {
  return (
    <div className={styles.popup_overlay} data-testid="welcome-overlay">
      <div className={styles.popup}>
        <button
          className={global.close_button}
          data-testid="close-button"
          onClick={() => {
            setWelcome(false);
          }}
        >
          <IoCloseSharp size={28} />
        </button>
        <h2>Welcome to Fairway Ink!</h2>
        <p>
          Note: This is currently a development project. No payments will be
          processed or items shipped
        </p>
      </div>
    </div>
  );
};

export default WelcomePopup;
