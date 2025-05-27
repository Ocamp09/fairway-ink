import styles from "./Loading.module.css";

const Loading = ({
  type = "spinner",
  text = "Loading...",
  overlay = false,
}) => {
  const containerClass = `${styles.loading_container}${
    overlay ? ` ${styles.loading_overlay}` : ""
  }`;

  return (
    <div className={containerClass} data-testid="loading-component">
      {type === "spinner" ? (
        <div className={styles.spinner} />
      ) : (
        <div className={styles.loading_bar}>
          <div className={styles.bar_progress} />
        </div>
      )}
      <p className={styles.loading_text}>{text}</p>
    </div>
  );
};

export default Loading;
