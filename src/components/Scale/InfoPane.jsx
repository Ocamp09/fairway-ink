import styles from "./InfoPane.module.css";

const InfoPane = ({ warnText, redText }) => {
  return (
    <div className={styles.info_main} hidden={!warnText && !redText}>
      {warnText && (
        <div
          className={
            redText ? `${styles.info_item} ${styles.hr}` : styles.info_item
          }
        >
          <div className={styles.warning}></div>
          <p>{warnText}</p>
        </div>
      )}
      {redText && (
        <div className={styles.info_item}>
          <div className={styles.remove}></div>
          <p>{redText}</p>
        </div>
      )}
    </div>
  );
};

export default InfoPane;
