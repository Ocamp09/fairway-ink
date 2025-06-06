import { useState } from "react";

import { addToCartApi } from "../../../api/checkout";
import { useCart } from "../../../contexts/CartContext";
import { useSession } from "../../../contexts/DesignContext";
import global from "../../../global.module.css";
import STLViewer from "../../3D-View/STLViewer/STLViewer";
import styles from "./PreviewTab.module.css";
import QuantityDropdown from "../QuantityDropdown/QuantityDropdown";

const DEFAULT_STL_URL = "designer/default.stl";

const PreviewTab = () => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { updateAdjustStage, stlUrl, stlKey, templateType, updateStage } =
    useSession();

  const handleBack = () => {
    updateStage("adjust");
    updateAdjustStage("scale");
  };

  const handleAddToCart = (event) => {
    event.preventDefault();

    if (stlUrl === DEFAULT_STL_URL) {
      setError("No custom design uploaded");
      return;
    }

    addToCartApi(stlUrl, quantity, templateType);
    addToCart(stlKey, stlUrl, quantity, templateType);
    setIsAdded(true);
  };

  return (
    <div className={styles.stl_viewer} data-testid="preview-tab">
      <button
        className={global.back_button}
        onClick={handleBack}
        data-testid="back-button"
      >
        Back
      </button>

      <p>3-D Render Preview</p>

      {stlUrl && <STLViewer stlUrl={stlUrl} />}

      <div className={styles.button_div}>
        <QuantityDropdown
          setQuantity={setQuantity}
          quantity={quantity}
          maxQuantity={15}
          hidden={isAdded}
        />

        <button
          onClick={handleAddToCart}
          className={global.submit_button}
          disabled={isAdded}
          data-testid="add-to-cart-button"
        >
          {!isAdded ? "Add to Cart" : "Item added!"}
        </button>

        {error && (
          <p className={global.error_message} data-testid="error-message">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default PreviewTab;
