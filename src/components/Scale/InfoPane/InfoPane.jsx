import styles from "./InfoPane.module.css";

const InfoPane = ({ warnText, redText }) => {
  if (!warnText && !redText) return null;

  return (
    <div className={styles.info_main}>
      {warnText && (
        <div
          className={`${styles.info_item} ${redText ? styles.hr : ""}`}
          data-testid="warn-section"
        >
          <div className={styles.warning} />
          <p>{warnText}</p>
        </div>
      )}

      {redText && (
        <div className={styles.info_item} data-testid="red-section">
          <div className={styles.remove} />
          <p>{redText}</p>
        </div>
      )}

      {warnText && !redText && (
        <div className={styles.info_item} data-testid="note-section">
          <p>NOTE: tabs that are too small may cause template issues</p>
        </div>
      )}
    </div>
  );
};

export default InfoPane;
