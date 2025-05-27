import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

import { getPaymentIntent } from "../../../api/checkout";
import { useCart } from "../../../contexts/CartContext";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import styles from "./Checkout.module.css";
import Loading from "../../Feedback/Loading/Loading";
import PopupError from "../../Feedback/PopupError/PopupError";

// Replace this with an environment variable in production
const Checkout = ({ setIsCheckout }) => {
  const { getTotal } = useCart();

  const [stripePromise, setStripePromise] = useState(null);
  const [stripeError, setStripeError] = useState(null);

  const [clientSecret, setClientSecret] = useState("");
  const [intentId, setIntentId] = useState("");
  const [successfulOrder, setSuccessfulOrder] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLI_KEY);
        if (!stripe) throw new Error("Stripe failed to load");
        setStripePromise(stripe);
      } catch (err) {
        console.error("Stripe load failed:", err);
        setStripeError(
          "We're unable to load payment services. Please try again or come back later."
        );
      }
    };
    load();
  }, []);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const intent = await getPaymentIntent();
        setClientSecret(intent.client_secret);
        setIntentId(intent.payment_intent);
      } catch (error) {
        console.error("Error fetching client secret", error);
        setStripeError(
          "We're unable to load payment services. Please try again or come back later."
        );
      }
    };

    if (getTotal() > 0) {
      fetchClientSecret();
    }
  }, [getTotal]);

  if (stripeError) {
    return <PopupError error={stripeError} />;
  }

  if (!stripePromise || !clientSecret) {
    return <Loading />;
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
