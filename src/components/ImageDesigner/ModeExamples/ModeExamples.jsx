import {
  CUSTOM_PRICE,
  SOLID_PRICE /*, TEXT_PRICE */,
} from "../../../constants";
import styles from "./ModeExamples.module.css";

const ModeExamples = ({ small }) => {
  const renderTemplate = ({ label, price, src, width }) => (
    <div className={small ? styles.mode_item_small : styles.mode_item}>
      <p className={styles.mode_desc}>{label}:</p>
      <p className={styles.mode_desc}>${price} ea</p>
      <div className={small ? styles.ball_display_small : styles.ball_display}>
        <img
          src={src}
          alt={label}
          className={styles.display_img}
          style={{ width: `${width}px` }}
        />
      </div>
    </div>
  );

  return (
    <>
      {renderTemplate({
        label: "Solid template",
        price: SOLID_PRICE,
        src: "/designer/solid.svg",
        width: 40,
      })}

      {/* {renderTemplate({
        label: "Text template",
        price: TEXT_PRICE,
        src: "/designer/text.svg",
        width: small ? 86 : 100,
      })} */}

      {renderTemplate({
        label: "Custom template",
        price: CUSTOM_PRICE,
        src: "/designer/custom.svg",
        width: small ? 75 : 80,
      })}
    </>
  );
};

export default ModeExamples;
