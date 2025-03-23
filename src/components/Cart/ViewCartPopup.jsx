import React from "react";
import "./ViewCartPopup.css";

const ViewCartPopup = ({ isOpen, setIsOpen, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="view-cart-overlay">
      <div className="view-cart-popup">
        <button
          className="close-button"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default ViewCartPopup;
