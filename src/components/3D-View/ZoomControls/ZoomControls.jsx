import { BiSolidZoomIn, BiSolidZoomOut } from "react-icons/bi";

import styles from "./ZoomControls.module.css";

const ZoomControls = ({ onZoomIn, onZoomOut }) => (
  <div className={styles.zoom_body}>
    <button
      onClick={onZoomIn}
      aria-label="Zoom in"
      className={styles.zoom_button}
    >
      <BiSolidZoomIn color="black" size={32} />
    </button>
    <button
      onClick={onZoomOut}
      aria-label="Zoom out"
      className={styles.zoom_button}
    >
      <BiSolidZoomOut color="black" size={32} />
    </button>
  </div>
);

export default ZoomControls;
