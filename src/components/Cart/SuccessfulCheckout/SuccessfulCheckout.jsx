import { FaCheckCircle } from "react-icons/fa";
import styles from "./SuccessfulCheckout.module.css";

const SuccessfulCheckout = ({ orderInfo }) => {
  if (!orderInfo) return null;

  const {
    email,
    amount,
    shipping_info: {
      carrier = "N/A",
      tracking_id = "N/A",
      expected_delivery = 0,
    } = {},
  } = orderInfo;

  return (
    <div className={styles.paid} data-testid="successful-checkout">
      <h3 className={styles.successHeader}>
        <FaCheckCircle color="4BB543" size={36} /> Your order has been submitted
      </h3>
      <hr />
      <label>Order info:</label>
      <p>Email: {email}</p>
      <p>Amount paid: ${(amount / 100).toFixed(2)}</p>
      <hr />
      <label>Shipping info:</label>
      <p>Carrier: {carrier}</p>
      <p>Tracking Number: {tracking_id}</p>
      <p>
        Estimated Delivery: {expected_delivery + 3}–{expected_delivery + 5} days
      </p>
    </div>
  );
};

export default SuccessfulCheckout;
