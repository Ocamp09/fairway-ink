import { IoCloseSharp } from "react-icons/io5";
import { IoIosInformationCircle, IoIosWarning } from "react-icons/io";
import styles from "./NotificationBanner.module.css";

const NotificationBanner = ({ message, type = "info", setBanner }) => {
  if (!message) return null;

  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      {type === "info" ? (
        <IoIosInformationCircle size={24} />
      ) : (
        <IoIosWarning size={24} />
      )}
      <span>{message}</span>
      <button
        className={styles.close_button}
        onClick={() => setBanner(false)}
        data-testid="close-button"
        aria-label="Close cart popup"
      >
        <IoCloseSharp size={28} />
      </button>
    </div>
  );
};

export default NotificationBanner;
