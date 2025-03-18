import { useState } from "react";
import STLViewer from "../3D-View/STLViewer";
import { addToCartApi } from "../../api/api";
import { useCart } from "../../contexts/CartContext";
import "./BrowseItem.css";

const BrowseItem = ({ url }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (event) => {
    event.preventDefault();

    addToCartApi(url, 1, "solid");
    addToCart(1, url, 1, "solid");
    setIsAdded(true);
  };

  return (
    <div className="browse-item">
      <STLViewer stlUrl={url} cart={true} />
      <button
        onClick={handleAddToCart}
        className="submit-button"
        disabled={isAdded}
      >
        {!isAdded ? "Add to Cart" : "Item added!"}
      </button>{" "}
    </div>
  );
};

export default BrowseItem;
