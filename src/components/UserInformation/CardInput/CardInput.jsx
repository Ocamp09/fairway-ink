import { CardElement } from "@stripe/react-stripe-js";
import styles from "./CardInput.module.css";
import input_styles from "../UserInformation.module.css";

const CardInput = ({ setComplete }) => (
  <div className={input_styles.input_item}>
    <label className={input_styles.input_label}>Card Information</label>
    <div className={styles.card}>
      <CardElement
        options={{ hidePostalCode: true }}
        onChange={(e) => setComplete(e.complete)}
        id="card"
      />
    </div>
  </div>
);

export default CardInput;
