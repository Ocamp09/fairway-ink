import { CUSTOM_PRICE, SOLID_PRICE } from "../../constants";
import styles from "./ModeExamples.module.css";

const ModeExamples = ({ small }) => {
  return (
    <>
      <div className={small ? styles.mode_item_small : styles.mode_item}>
        <p className={styles.mode_desc}>Solid template:</p>
        <p className={styles.mode_desc}>${SOLID_PRICE} ea</p>
        <div
          className={small ? styles.ball_display_small : styles.ball_display}
        >
          <img
            src="/designer/solid.svg"
            alt="Uploaded"
            className={styles.display_img}
            style={{
              width: small ? `40px` : `40px`,
            }}
          />
        </div>
      </div>
      {/* <div className={small ? styles.mode_item_small : styles.mode_item}>
        <p className={styles.mode_desc}>Text template:</p>
        <p className={styles.mode_desc}>${TEXT_PRICE} ea</p>
        <div className={small ? styles.ball_display_small : styles.ball_display}>
          <img
            src="/designer/text.svg"
            alt="Uploaded"
            className={styles.display_img}
            style={{
              width: small ? `86px` : `100px`,
            }}
          />
        </div>
      </div> */}
      <div className={small ? styles.mode_item_small : styles.mode_item}>
        <p className={styles.mode_desc}>Custom template:</p>
        <p className={styles.mode_desc}>${CUSTOM_PRICE} ea</p>
        <div
          className={small ? styles.ball_display_small : styles.ball_display}
        >
          <img
            src="/designer/custom.svg"
            alt="Uploaded"
            className={styles.display_img}
            style={{
              width: small ? `75px` : `80px`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ModeExamples;
