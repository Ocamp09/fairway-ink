import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

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
import Page404 from "./pages/404/404";
import NotificationBanner from "./components/Feedback/NotificationBanner/NotificationBanner";

function App() {
  const [isDown, setIsDown] = useState(false);
  const [banner, setBanner] = useState(true);
  const [bannerInfo, setBannerInfo] = useState(null);
  const [cartPopup, setCartPopup] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const BANNER_CONFIG_URL =
    "https://fairway-ink-banner.s3.us-east-2.amazonaws.com/banner-config.json";

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

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(BANNER_CONFIG_URL, {
          headers: {
            "Cache-Control": "no-cache", // optional, disable caching
          },
        });
        if (response.data.enabled) {
          setBannerInfo(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch banner config:", error);
      }
    };

    fetchBanner();
    const interval = setInterval(fetchBanner, 60 * 60 * 1000); // refetch every 60 mins
    return () => clearInterval(interval);
  });

  if (isDown) return <Maintenance />;

  return (
    <FileProvider>
      <CartProvider>
        {welcome && <WelcomePopup setWelcome={setWelcome} />}
        <Header cartPopup={cartPopup} setCartPopup={setCartPopup} />
        {banner && bannerInfo && (
          <NotificationBanner
            message={bannerInfo.message}
            setBanner={setBanner}
            type={bannerInfo.type}
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<StencilDesigner />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="*" element={<Page404 />} />
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
