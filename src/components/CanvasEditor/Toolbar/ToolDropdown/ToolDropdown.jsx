import { useEffect, useRef, useState } from "react";

import styles from "./ToolDropdown.module.css";

function ToolDropdown({
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
  const [customQty, setCustomQty] = useState("");
  const dropdownRef = useRef(null);

  const quantities = Array.from(
    { length: Math.floor((maxQuantity - minQuantity) / step) + 1 },
    (_, i) => minQuantity + i * step
  );

  const handleSelectQuantity = (value) => {
    setQuantity(value);
    setIsOpen(false);
  };

  const handleCustom = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomQty(value);
      setQuantity(value);
    }
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
      data-testid="tool-dropdown"
    >
      <button
        className={styles.dropdown_toggle}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="dropdown-toggle"
      >
        {labelText} {quantity}
      </button>

      {isOpen && (
        <ul className={styles.dropdown_list} data-testid="dropdown-list">
          {quantities.map((qty) => (
            <li
              key={qty}
              className={quantity === qty ? styles.selected : ""}
              onClick={() => handleSelectQuantity(qty)}
              data-testid={`option-${qty}`}
            >
              {qty}
            </li>
          ))}
          <li className={quantity === customQty ? styles.selected : ""}>
            <input
              placeholder="size"
              value={customQty}
              onChange={handleCustom}
              data-testid="custom-input"
            />
          </li>
        </ul>
      )}
    </div>
  );
}

export default ToolDropdown;
