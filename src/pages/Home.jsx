import { useNavigate } from "react-router-dom";

import global from "../global.module.css";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  const handleStartDesigning = () => navigate("/design");
  const handleBrowseDesigns = () => navigate("/browse");

  return (
    <main>
      <h1>Welcome to Fairway Ink!</h1>

      <section className={styles.intro}>
        <img src="/home/home.jpg" alt="Golf balls with stencil designs" />

        <div className={styles.home_desc}>
          <h2>Custom golf ball templates</h2>
          <p>Elevate your style with a custom designed logo!</p>
          <p>
            Design your own logo in our designer, or select a logo from our
            daily updating library!
          </p>
          <button
            className={global.submit_button}
            onClick={handleStartDesigning}
          >
            Start designing
          </button>
          <button
            className={global.submit_button}
            onClick={handleBrowseDesigns}
          >
            Browse designs
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
