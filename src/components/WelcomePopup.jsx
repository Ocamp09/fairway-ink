const WelcomePopup = ({ setWelcome }) => {
  return (
    <div className="view-cart-overlay">
      <div className="view-cart-popup">
        <button
          className="close-button"
          onClick={() => {
            setWelcome(false);
          }}
        >
          X
        </button>
        <h2>Welcome to Fairway Ink!</h2>
        <p>
          Note: This is currently a development project. No payments will be
          processed or items shipped
        </p>
      </div>
    </div>
  );
};

export default WelcomePopup;
