import global from "../global.module.css";
import styles from "../components/Cart/ViewCartPopup.module.css";

const WelcomePopup = ({ setWelcome }) => {
  return (
    <div className={styles.view_cart_overlay}>
      <div className={styles.view_cart_popup}>
        <button
          className={styles.close_button}
          onClick={() => {
            setWelcome(false);
          }}
        >
          X
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
