import { useEffect, useState, useRef } from "react";
import { verifySuccessfulCheckout } from "../api/api";

const SuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const hasVerifiedPayment = useRef(false); // This will track if the payment has been verified

  useEffect(() => {
    const verifyPayment = async (sessionId) => {
      // Prevent duplicate API calls
      if (hasVerifiedPayment.current) return;
      hasVerifiedPayment.current = true;

      const verify = await verifySuccessfulCheckout(sessionId);
      setOrderDetails(verify.order);
      console.log(verify.order);
    };

    // Get session_id from URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("session_id");
    console.log(sessionId);

    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, []);

  return (
    <div>
      {orderDetails ? (
        <div>
          <h1>Your payment was successful</h1>
          <p>Email: {orderDetails.email}</p>
          <p>Total: ${orderDetails.total}</p>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default SuccessPage;
