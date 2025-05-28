import { useState } from "react";
import { IoIosCart } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";
import styles from "./Header.module.css";

const getNavClass = (path, current, baseClass, activeClass) =>
  `${baseClass} ${current === path ? activeClass : ""}`.trim();

const NavButton = ({ to, label, onClick, currentPath }) => {
  const navigate = useNavigate();
  return (
    <button
      className={getNavClass(to, currentPath, styles.nav_item, styles.active)}
      onClick={() => {
        navigate(to);
        onClick?.();
      }}
      data-testid={`nav-${label.toLowerCase()}`}
    >
      {label}
    </button>
  );
};

const Header = ({ cartPopup, setCartPopup }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.header_items}>
        <div className={styles.header_start}>
          <span className={styles.home_logo} onClick={() => navigate("/")}>
            <img
              src="/logos/logo_full.png"
              height={40}
              alt="Fairway Ink"
              className="d-inline-block align-top"
            />
          </span>
        </div>

        <nav className={styles.header_nav}>
          <NavButton
            to="/design"
            label="Design"
            currentPath={location.pathname}
          />
          <NavButton
            to="/browse"
            label="Browse"
            currentPath={location.pathname}
          />
        </nav>

        <div className={styles.header_icons}>
          <button
            className={styles.hamburger_button}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <RxHamburgerMenu size={28} />
          </button>

          <button
            className={styles.icon_button}
            onClick={() => setCartPopup(!cartPopup)}
            title="View cart"
            aria-label="View cart"
            data-testid="cart-button"
          >
            <IoIosCart size={28} /> ({getItemCount()})
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobile_nav}>
          <hr className={styles.rule} />
          <NavButton
            to="/design"
            label="Design"
            onClick={() => setMenuOpen(false)}
            currentPath={location.pathname}
          />
          <NavButton
            to="/browse"
            label="Browse"
            onClick={() => setMenuOpen(false)}
            currentPath={location.pathname}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
