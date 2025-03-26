import { IoCloseSharp } from "react-icons/io5";
import global from "../global.module.css";
import styles from "../components/Cart/ViewCartPopup.module.css";

const WelcomePopup = ({ setWelcome }) => {
  return (
    <div className={styles.view_cart_overlay}>
      <div className={styles.view_cart_popup}>
        <button
          className={global.close_button}
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
