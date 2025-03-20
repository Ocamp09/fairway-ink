import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Welcome to Fairway Ink!</h3>
      <div className="intro">
        <img src="/home.jpg" />
        <div className="home-description">
          <h3>Custom golf ball templates</h3>
          <p>Elevate your style with a custom designed logo!</p>
          <p>
            Design your own logo in our designer, or select a logo from our
            daily updating library!
          </p>
          <button className="submit-button" onClick={() => navigate("/design")}>
            Start designing
          </button>
          <button className="submit-button" onClick={() => navigate("/browse")}>
            Browse designs
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
