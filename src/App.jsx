import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import CartInfo from "./components/Cart/CartInfo/CartInfo";
import Checkout from "./components/Cart/Checkout/Checkout";
import CartPopup from "./components/Popups/CartPopup/CartPopup";
import Header from "./components/Header/Header";
import WelcomePopup from "./components/Popups/WelcomePopup/WelcomePopup";
import { CartProvider } from "./contexts/CartContext";
import { FileProvider } from "./contexts/DesignContext";
import Browse from "./pages/Browse/Browse";
import Home from "./pages/Home/Home";
import StencilDesigner from "./pages/StencilDesigner/StencilDesigner";
import { apiHealthCheck } from "./api/health";
import Maintenance from "./pages/Maintenance/Maintenance";

function App() {
  const [isDown, setIsDown] = useState(false);
  const [cartPopup, setCartPopup] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const onCartClose = () => {
    setCartPopup(false);
    setIsCheckout(false);
  };

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const down = await apiHealthCheck();
        setIsDown(down);
      } catch (err) {
        setIsDown(true);
      }
    };
    healthCheck();

    const showedWelcome = sessionStorage.getItem("showedWelcome");

    if (!showedWelcome) {
      setWelcome(true);
      sessionStorage.setItem("showedWelcome", "true");
    }
  }, []);

  if (isDown) return <Maintenance />;

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
        <CartPopup isOpen={cartPopup} setIsOpen={onCartClose}>
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
