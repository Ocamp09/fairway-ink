import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "./QuantityDropdown.module.css";

function QuantityDropdown({
  setQuantity,
  quantity,
  minQuantity = 1,
  maxQuantity = 15,
  labelText = "Quantity: ",
  step = 1,
  title = "Set quantity",
  hidden = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customQty, setCustomQty] = useState();
  const dropdownRef = useRef(null);

  const quantities = [];
  for (let i = minQuantity; i <= maxQuantity; i += step) {
    quantities.push(i);
  }

  const handleSelectQuantity = (value) => {
    setQuantity(value);
    setIsOpen(false);
  };

  const handleCustom = (e) => {
    const inVal = parseInt(e.target.value);
    if (!inVal || inVal <= 0) {
      return;
    }

    setCustomQty(inVal);
    setQuantity(inVal);
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

  return (
    <div
      className={styles.dropdown}
      title={title}
      ref={dropdownRef}
      hidden={hidden}
    >
      <button
        className={styles.dropdown_toggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {labelText} {quantity} <RiArrowDropDownLine size={28} />
      </button>

      {isOpen && (
        <ul className={styles.dropdown_list}>
          {quantities.map((qty) => (
            <li
              key={qty}
              className={quantity === qty ? styles.selected : ""}
              onClick={() => handleSelectQuantity(qty)}
            >
              {qty}
            </li>
          ))}
          <li className={quantity === customQty ? styles.selected : ""}>
            <input placeholder="Custom" onChange={(e) => handleCustom(e)} />
          </li>
        </ul>
      )}
    </div>
  );
}

export default QuantityDropdown;
