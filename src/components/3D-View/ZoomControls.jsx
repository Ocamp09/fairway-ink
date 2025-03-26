import React from "react";
import { BiSolidZoomIn, BiSolidZoomOut } from "react-icons/bi";
import styles from "./ZoomControls.module.css";

const ZoomControls = ({ onZoomIn, onZoomOut }) => {
  return (
    <div className={styles.zoom_body}>
      <button onClick={onZoomIn}>
        <BiSolidZoomIn color="black" size={32} />
      </button>
      <button onClick={onZoomOut}>
        <BiSolidZoomOut color="black" size={32} />
      </button>
    </div>
  );
};

export default ZoomControls;
