import { FaCheckCircle } from "react-icons/fa";
import styles from "./SuccessfulCheckout.module.css";

const SuccessfulCheckout = ({ orderInfo }) => (
  <div className={styles.paid}>
    <h3>
      <FaCheckCircle color="4BB543" size={36} /> Your order has been submitted
    </h3>
    <hr />
    <label>Order info:</label>
    <p>Email: {orderInfo.email}</p>
    <p>Amount paid: ${orderInfo.amount / 100}</p>
    <hr />
    <label>Shipping info:</label>
    <p>Carrier: {orderInfo.shipping_info.carrier}</p>
    <p>Tracking Number: {orderInfo.shipping_info.tracking_id}</p>
    <p>
      Estimated Delivery {orderInfo.shipping_info.expected_delivery + 3}-
      {orderInfo.shipping_info.expected_delivery + 5} days
    </p>
  </div>
);

export default SuccessfulCheckout;
