import axios from "axios";

import { API_URL } from "../constants";
import { get_ssid } from "../utils/getSsid";

export const addToCartApi = (stlUrl, quantity, templateType) => {
  const session_id = get_ssid();
  const cartItem = {
    ssid: session_id,
    stlUrl: stlUrl,
    quantity: quantity,
    templateType: templateType,
  };

  try {
    axios.post(`${API_URL}/cart`, cartItem, {
      headers: {
        "Content-Type": "application/sjon",
      },
    });
  } catch (error) {
    console.log("Err adding to cart: ", error);
    throw error;
  }
};

export const getPaymentIntent = async () => {
  let cart = {
    cart: JSON.parse(sessionStorage.getItem("cart")),
  };

  try {
    const response = await axios.post(
      `${API_URL}/create-payment-intent`,
      cart,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error getting checkout session: ", error);
    throw error;
  }
};

export const verifySuccessfulCheckout = async (
  intentId,
  name,
  email,
  address
) => {
  const browser_ssid = get_ssid();

  try {
    const response = await axios.post(
      `${API_URL}/handle-order`,
      {
        intent_id: intentId,
        browser_ssid: browser_ssid,
        address: address,
        email: email,
        name: name,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error verifying payment:", error);
    alert("Error verifying payment");
  }
};
