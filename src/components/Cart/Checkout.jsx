import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getPaymentIntent } from "../../api/api";
import CheckoutForm from "./CheckoutForm";
import { useCart } from "../../contexts/CartContext";

const stripePromise = loadStripe(
  "pk_test_51Qs6WuACPDsvvNfxem8wieeIWOMf7FDRdwepMv7kSRJ9h80oegevnSUyxwEhyq7BbCU5KEwjxdOFptaDUFyeo7s400o1D8zBSi"
);

const Checkout = ({ setIsCheckout }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [intentId, setIntentId] = useState("");

  const { getTotal } = useCart();

  useEffect(() => {
    console.log("load");
    const fetchClientSecret = async () => {
      try {
        // Call your API to create a payment intent with the cart total
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
  }, []);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-form">
      <div className="back-div">
        <button
          className="back-cart"
          onClick={() => {
            setIsCheckout(false);
          }}
        >
          Back
        </button>
        <h3>Cart Total: ${getTotal().toFixed(2)}</h3>
      </div>
      <Elements stripe={stripePromise}>
        <CheckoutForm intentId={intentId} clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default Checkout;
