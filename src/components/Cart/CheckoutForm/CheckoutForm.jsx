import {
  AddressElement,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { verifySuccessfulCheckout } from "../../../api/checkout";
import global from "../../../global.module.css";
import styles from "./CheckoutForm.module.css";
import EmailInput from "../../UserInformation/EmailInput/EmailInput";
import CardInput from "../../UserInformation/CardInput/CardInput";
import SuccessfulCheckout from "../SuccessfulCheckout/SuccessfulCheckout";

const CheckoutForm = ({
  clientSecret,
  intentId,
  successfulOrder,
  setSuccessfulOrder,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [emailComplete, setEmailComplete] = useState(false);
  const [addressComplete, setAddressComplete] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [orderInfo, setOrderInfo] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError("");
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

    const { payError } = await stripe.confirmCardPayment(clientSecret, {
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
    });

    if (payError) {
      setMessage(error.message);
    }

    try {
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
    } catch (err) {
      console.error("Error processing order: ", err);
      setError("Unable to process order, try again later");
      setIsLoading(false);
    }
  };

  if (successfulOrder === true) {
    return <SuccessfulCheckout orderInfo={orderInfo} />;
  } else if (successfulOrder === false) {
    alert("checkout failed, you were not charged");
    return null;
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <AddressElement
        options={{ mode: "shipping" }}
        onChange={(e) => {
          setAddressComplete(e.complete);
        }}
      />
      <EmailInput
        value={email}
        setValue={setEmail}
        setComplete={setEmailComplete}
      />
      <CardInput setComplete={setCardComplete} />
      {message && <div className={styles.payment_message}>{message}</div>}
      <button
        disabled={
          !stripe ||
          !addressComplete ||
          !emailComplete ||
          !cardComplete ||
          isLoading
        }
        id="submit"
        className={global.submit_button}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </button>
      {error && <p className={global.error_message}>{error}</p>}
    </form>
  );
};

export default CheckoutForm;
