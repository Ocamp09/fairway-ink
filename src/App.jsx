import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import CartInfo from "./components/Cart/CartInfo/CartInfo";
import Checkout from "./components/Cart/Checkout/Checkout";
import CartPopup from "./components/Cart/CartPopup/CartPopup";
import Header from "./components/Header/Header";
import WelcomePopup from "./components/WelcomePopup";
import { CartProvider } from "./contexts/CartContext";
import { FileProvider } from "./contexts/DesignContext";
import Browse from "./pages/Browse/Browse";
import Home from "./pages/Home/Home";
import StencilDesigner from "./pages/StencilDesigner/StencilDesigner";

function App() {
  const [cartPopup, setCartPopup] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  useEffect(() => {
    const showedWelcome = sessionStorage.getItem("showedWelcome");

    if (!showedWelcome) {
      setWelcome(true);
      sessionStorage.setItem("showedWelcome", "true");
    }
  }, []);

  return (
    <FileProvider>
      <CartProvider>
        {welcome && <WelcomePopup setWelcome={setWelcome} />}
        <Header cartPopup={cartPopup} setCartPopup={setCartPopup} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<StencilDesigner />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
        <CartPopup isOpen={cartPopup} setIsOpen={setCartPopup}>
          {isCheckout ? (
            <Checkout setIsCheckout={setIsCheckout} />
          ) : (
            <CartInfo setIsCheckout={setIsCheckout} />
          )}
        </CartPopup>
      </CartProvider>
    </FileProvider>
  );
}

export default App;
