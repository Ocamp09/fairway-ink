import React, { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import "./Checkout.css";
import { verifySuccessfulCheckout } from "../../api/api";

const CheckoutForm = ({ clientSecret, intentId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [emailComplete, setEmailComplete] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const [successfulOrder, setSuccessfulOrder] = useState(null);
  const [orderInfo, setOrderInfo] = useState();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Check if email is complete and matches the regex
    if (emailRegex.test(emailValue)) {
      setEmailComplete(true);
    } else {
      setEmailComplete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const cardElement = elements.getElement(CardElement);

    const addressElement = elements.getElement(AddressElement);
    const addressData = await addressElement.getValue();

    const { line1, line2, city, state, postal_code, country } =
      addressData.value.address;

    if (!addressData.complete) {
      setMessage("Please fill in all required address fields.");
      setIsLoading(false);
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: email,
            address: {
              line1: line1,
              line2: line2,
              city: city,
              state: state,
              postal_code: postal_code,
              country: country,
            },
          },
        },
      }
    );

    if (error) {
      setMessage(error.message);
    }

    let orderResponse = await verifySuccessfulCheckout(
      intentId,
      addressData.value.name,
      email,
      addressData.value.address
    );

    if (orderResponse.data.success) {
      // show success popup
      const orderInfo = orderResponse.data.order;
      setOrderInfo(orderInfo);
      setSuccessfulOrder(true);
    } else {
      // show fail popup
      setSuccessfulOrder(false);
    }
    setIsLoading(false);
  };

  if (successfulOrder === null) {
    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <AddressElement
          options={{ mode: "shipping" }}
          onChange={(e) => {
            setAddressComplete(e.complete);
          }}
        />
        <div className="email">
          <label className="email-label">Email</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="email top">
          <label className="email-label">Card Information</label>
          <div className="card">
            <CardElement
              options={{ hidePostalCode: true }}
              onChange={(e) => {
                setCardComplete(e.complete);
              }}
            />
          </div>
        </div>
        {message && <div id="payment-message">{message}</div>}
        <button
          disabled={
            !stripe ||
            !addressComplete ||
            !emailComplete ||
            !cardComplete ||
            isLoading
          }
          id="submit"
          className="submit-button"
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>
      </form>
    );
  } else if (successfulOrder === true) {
    return (
      <div>
        <h1>Your payment was successful</h1>
        <p>Email: {orderInfo.email}</p>
        <p>Total: ${orderInfo.amount / 100}</p>
      </div>
    );
  } else {
    alert("checkout failed, you were not charged");
  }
};

export default CheckoutForm;
