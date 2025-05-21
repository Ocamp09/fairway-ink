import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

import { getPaymentIntent } from "../../../api/checkout";
import { useCart } from "../../../contexts/CartContext";
import CheckoutForm from "../CheckoutForm";
import styles from "./Checkout.module.css";

// Replace this with an environment variable in production
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = ({ setIsCheckout }) => {
  const { getTotal } = useCart();

  const [clientSecret, setClientSecret] = useState("");
  const [intentId, setIntentId] = useState("");
  const [successfulOrder, setSuccessfulOrder] = useState(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const intent = await getPaymentIntent();
        setClientSecret(intent.client_secret);
        setIntentId(intent.payment_intent);
      } catch (error) {
        console.error("Error fetching client secret", error);
      }
    };

    if (getTotal() > 0) {
      fetchClientSecret();
    }
  }, [getTotal]);

  if (!clientSecret) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div data-testid="checkout-component">
      <div className={styles.back_div} hidden={successfulOrder}>
        <button
          className={styles.back_cart}
          onClick={() => setIsCheckout(false)}
          data-testid="back-button"
        >
          Back
        </button>
        <h3>Cart Total: ${getTotal().toFixed(2)}</h3>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          intentId={intentId}
          clientSecret={clientSecret}
          setSuccessfulOrder={setSuccessfulOrder}
          successfulOrder={successfulOrder}
        />
      </Elements>
    </div>
  );
};

export default Checkout;
