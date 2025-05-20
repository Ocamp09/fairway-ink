import styles from "./SizeSelector.module.css";

const SizeSelector = ({ size, setSize }) => {
  return (
    <div className={styles.size_menu}>
      <button
        className={`${size === "small" ? styles.active : ""}`}
        onClick={() => {
          setSize("small");
        }}
      >
        Small
      </button>
      <button
        className={`${size === "medium" ? styles.active : ""}`}
        onClick={() => {
          setSize("medium");
        }}
      >
        Medium
      </button>
      <button
        className={`${size === "large" ? styles.active : ""}`}
        onClick={() => {
          setSize("large");
        }}
      >
        Large
      </button>
    </div>
  );
};

export default SizeSelector;
