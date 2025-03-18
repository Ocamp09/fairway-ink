import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Welcome!</h3>

      <button onClick={() => navigate("/design")}>Start designing</button>
      {/* <button>
                    Browse templates
                </button> */}
    </div>
  );
};

export default HomePage;
