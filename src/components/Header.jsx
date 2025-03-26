// import { LuSun } from "react-icons/lu";
import { IoIosCart } from "react-icons/io";
import { useCart } from "../contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ cartPopup, setCartPopup }) => {
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_items}>
          <div className={styles.header_start}>
            <span
              className={styles.home_logo}
              onClick={() => {
                navigate("/");
              }}
            >
              <img
                src="/logo_full.png"
                height={40}
                className="d-inline-block align-top"
                alt="Fairway Ink"
              />
            </span>
          </div>
          <div className={styles.header_nav}>
            <button
              className={`${styles.nav_item} ${
                location.pathname === "/design" ? styles.active : ""
              }`}
              onClick={() => {
                navigate("/design");
              }}
            >
              Design
            </button>
            <button
              className={`${styles.nav_item} ${
                location.pathname === "/browse" ? styles.active : ""
              }`}
              onClick={() => {
                navigate("browse");
              }}
            >
              Browse
            </button>
          </div>
          <div className={styles.header_icons}>
            {/* <button className="icon-button">Login</button> */}
            <div>
              <button
                className={styles.icon_button}
                onClick={() => {
                  setCartPopup(!cartPopup);
                }}
                title="View cart"
              >
                <IoIosCart size={28} /> ({getItemCount()})
              </button>
            </div>
            {/* <LuSun size={32} color="yellow" fill="#242424" /> */}
          </div>
        </div>
        <hr />
      </div>
    </>
  );
};

export default Header;
