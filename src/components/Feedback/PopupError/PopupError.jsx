import styles from "./PopupError.module.css";
import global from "../../../global.module.css";

const PopupError = ({ error }) => {
  return (
    <div className={styles.error_box}>
      <h2>Oops!</h2>
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className={global.submit_button}
      >
        Refresh
      </button>
    </div>
  );
};

export default PopupError;
