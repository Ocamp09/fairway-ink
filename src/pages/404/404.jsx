import global from "../../global.module.css";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <main>
      <h1>Oops! Page not found.</h1>
      <p>We couldn't find what you're looking for.</p>
      <button onClick={() => navigate("/")} className={global.submit_button}>
        Go Home
      </button>
    </main>
  );
};

export default Page404;
