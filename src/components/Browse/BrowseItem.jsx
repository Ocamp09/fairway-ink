import { useEffect, useState } from "react";
import STLViewer from "../3D-View/STLViewer";
import { addToCartApi } from "../../api/api";
import { useCart } from "../../contexts/CartContext";
import SizeSelector from "./SizeSelector";
import global from "../../global.module.css";
import styles from "./BrowseItem.module.css";

const BrowseItem = ({ url }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [size, setSize] = useState("medium");
  const [displayUrl, setDisplayUrl] = useState(url);
  const { addToCart } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();

    addToCartApi(displayUrl, 1, "solid");
    addToCart(1, displayUrl, 1, "solid");
    setIsAdded(true);
  };

  useEffect(() => {
    setDisplayUrl((prevUrl) => {
      return prevUrl.replace(/(small|medium|large)/, size);
    });
    setIsAdded(false);
  }, [size]);

  return (
    <div className={styles.browse_item}>
      <STLViewer stlUrl={displayUrl} cart={true} zoomScale={1.75} />
      <SizeSelector size={size} setSize={setSize} />
      <button
        onClick={handleAddToCart}
        className={global.submit_button}
        disabled={isAdded}
      >
        {!isAdded ? "Add to Cart" : "Item added!"}
      </button>
    </div>
  );
};

export default BrowseItem;
