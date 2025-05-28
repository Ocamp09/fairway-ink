import styles from "./SizeSelector.module.css";

const sizes = ["xs", "sm", "md", "lg", "xl"];

const SizeSelector = ({ size, setSize }) => {
  return (
    <div className={styles.size_menu} role="group" aria-label="Size selector">
      {sizes.map((s) => (
        <button
          key={s}
          data-testid={`size-${s}`}
          className={size === s ? styles.active : ""}
          onClick={() => setSize(s)}
          aria-pressed={size === s}
        >
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
