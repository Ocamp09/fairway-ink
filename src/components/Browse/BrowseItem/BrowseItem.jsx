import { useEffect, useState } from "react";

import { addToCartApi } from "../../../api/checkout";
import { useCart } from "../../../contexts/CartContext";
import global from "../../../global.module.css";
import STLViewer from "../../3D-View/STLViewer/STLViewer";
import SizeSelector from "../SizeSelector/SizeSelector";
import styles from "./BrowseItem.module.css";

const BrowseItem = ({ url }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [size, setSize] = useState("md");
  const [displayUrl, setDisplayUrl] = useState(url);
  const { addToCart } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();
    addToCartApi(displayUrl, 1, "solid");
    addToCart(1, displayUrl, 1, "solid");
    setIsAdded(true);
  };

  useEffect(() => {
    setDisplayUrl((prevUrl) => prevUrl.replace(/(xs|sm|md|lg|xl)/, size));
    setIsAdded(false);
  }, [size]);

  return (
    <div className={styles.browse_item}>
      <STLViewer stlUrl={displayUrl} cart zoomScale={1.75} />
      <SizeSelector size={size} setSize={setSize} />
      <button
        onClick={handleAddToCart}
        className={global.submit_button}
        disabled={isAdded}
      >
        {isAdded ? "Item added!" : "Add to Cart"}
      </button>
    </div>
  );
};

export default BrowseItem;
