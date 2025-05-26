import React from "react";
import styles from "./ScaleSlider.module.css";

const ScaleSlider = ({ scale, setScale }) => {
  const handleScaleChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  return (
    <div className={styles.scaler}>
      <label htmlFor="scale" className={styles.label}>
        Scale:
      </label>
      <input
        type="range"
        id="scale"
        min="0.1"
        max="10"
        step="0.1"
        value={scale}
        onChange={handleScaleChange}
      />
      <span className={styles.multiplier}> {scale.toFixed(1)}x</span>
    </div>
  );
};

export default ScaleSlider;
