import "./App.css";
import GolfBallDisplay from "./components/GolfBallDisplay";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { CartProvider } from "./contexts/CartContext";
import { FileProvider } from "./contexts/DesignContext";
import { useState, useEffect } from "react";
import ViewCartPopup from "./components/Cart/ViewCartPopup";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Use Routes instead of Switch
import SuccessPage from "./components/SuccessPage"; // Import the SuccessPage component
import WelcomePopup from "./components/WelcomePopup";
import HomePage from "./components/HomePage";
import Browse from "./components/Browse/Browse";
import CartDisplay from "./components/Cart/CartDisplay";
import Checkout from "./components/Cart/Checkout";

function App() {
  const [cartPopup, setCartPopup] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  let sessionId = Cookies.get("session_id");

  if (!sessionId) {
    sessionId = uuidv4();
    Cookies.set("session_id", sessionId, { expires: 1 }); // Expires in 1 day
  }

  useEffect(() => {
    const showedWelcome = sessionStorage.getItem("showedWelcome");

    if (!showedWelcome) {
      setWelcome(true);
      sessionStorage.setItem("showedWelcome", "true");
    }
  }, []);

  return (
    <Router>
      <FileProvider>
        <CartProvider>
          {welcome && <WelcomePopup setWelcome={setWelcome} />}
          <Header cartPopup={cartPopup} setCartPopup={setCartPopup} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/design" element={<GolfBallDisplay />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
          <ViewCartPopup isOpen={cartPopup} setIsOpen={setCartPopup}>
            {isCheckout ? (
              <Checkout setIsCheckout={setIsCheckout} />
            ) : (
              <CartDisplay setIsCheckout={setIsCheckout} />
            )}
          </ViewCartPopup>
        </CartProvider>
      </FileProvider>
    </Router>
  );
}

export default App;
