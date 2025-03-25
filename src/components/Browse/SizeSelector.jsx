import styles from "./SizeSelector.module.css";

const SizeSelector = ({ size, setSize, setPrevSize }) => {
  return (
    <div className={styles.size_menu}>
      <button
        className={`${size === "small" ? styles.active : ""}`}
        onClick={() => {
          setPrevSize(size);
          setSize("small");
        }}
      >
        Small
      </button>
      <button
        className={`${size === "medium" ? styles.active : ""}`}
        onClick={() => {
          setPrevSize(size);
          setSize("medium");
        }}
      >
        Medium
      </button>
      <button
        className={`${size === "large" ? styles.active : ""}`}
        onClick={() => {
          setPrevSize(size);
          setSize("large");
        }}
      >
        Large
      </button>
    </div>
  );
};

export default SizeSelector;
