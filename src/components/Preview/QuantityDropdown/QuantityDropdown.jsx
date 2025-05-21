import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "./QuantityDropdown.module.css";

const QuantityDropdown = ({
  setQuantity,
  quantity,
  minQuantity = 1,
  maxQuantity = 15,
  labelText = "Quantity: ",
  step = 1,
  title = "Set quantity",
  hidden = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customQty, setCustomQty] = useState(null);
  const dropdownRef = useRef(null);

  const generateQuantities = () => {
    const quantities = [];
    for (let i = minQuantity; i <= maxQuantity; i += step) {
      quantities.push(i);
    }
    return quantities;
  };

  const quantities = generateQuantities();

  const handleSelectQuantity = (value) => {
    setQuantity(value);
    setIsOpen(false);
  };

  const handleCustom = (e) => {
    const inputValue = parseInt(e.target.value);
    if (!inputValue || inputValue <= 0) return;

    setCustomQty(inputValue);
    setQuantity(inputValue);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (hidden) return null;

  return (
    <div
      className={styles.dropdown}
      title={title}
      ref={dropdownRef}
      data-testid="quantity-dropdown"
    >
      <button
        className={styles.dropdown_toggle}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="dropdown-toggle"
      >
        {labelText} {quantity} <RiArrowDropDownLine size={28} />
      </button>

      {isOpen && (
        <ul className={styles.dropdown_list} data-testid="dropdown-list">
          {quantities.map((qty) => (
            <li
              key={qty}
              className={quantity === qty ? styles.selected : ""}
              onClick={() => handleSelectQuantity(qty)}
              data-testid={`quantity-option-${qty}`}
            >
              {qty}
            </li>
          ))}
          <li
            className={quantity === customQty ? styles.selected : ""}
            data-testid="custom-quantity-option"
          >
            <input
              placeholder="Custom"
              onChange={handleCustom}
              data-testid="custom-quantity-input"
            />
          </li>
        </ul>
      )}
    </div>
  );
};

export default QuantityDropdown;
