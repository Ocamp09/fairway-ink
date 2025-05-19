import { useNavigate } from "react-router-dom";

import global from "../global.module.css";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Welcome to Fairway Ink!</h3>
      <div className={styles.intro}>
        <img src="/home/home.jpg" />
        <div className={styles.home_desc}>
          <h3>Custom golf ball templates</h3>
          <p>Elevate your style with a custom designed logo!</p>
          <p>
            Design your own logo in our designer, or select a logo from our
            daily updating library!
          </p>
          <button
            className={global.submit_button}
            onClick={() => navigate("/design")}
          >
            Start designing
          </button>
          <button
            className={global.submit_button}
            onClick={() => navigate("/browse")}
          >
            Browse designs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
