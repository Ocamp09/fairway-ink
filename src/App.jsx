import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import CartDisplay from "./components/Cart/CartDisplay";
import Checkout from "./components/Cart/Checkout";
import ViewCartPopup from "./components/Cart/ViewCartPopup";
import Header from "./components/Header";
import WelcomePopup from "./components/WelcomePopup";
import { CartProvider } from "./contexts/CartContext";
import { FileProvider } from "./contexts/DesignContext";
import Browse from "./pages/Browse";
import Home from "./pages/Home";
import StencilDesigner from "./pages/StencilDesigner";

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
            <Route path="/" element={<Home />} />
            <Route path="/design" element={<StencilDesigner />} />
            <Route path="/browse" element={<Browse />} />
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
