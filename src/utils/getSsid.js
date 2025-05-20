import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const get_ssid = () => {
  let sessionId = Cookies.get("session_id");

  if (!sessionId) {
    sessionId = uuidv4();
    Cookies.set("session_id", sessionId, { expires: 1 }); // Expires in 1 day
  }

  return sessionId;
};
