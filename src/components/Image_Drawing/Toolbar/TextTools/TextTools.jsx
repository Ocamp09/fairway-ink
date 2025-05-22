import { MdTextFields } from "react-icons/md";

import ToolDropdown from "../ToolDropdown";

const TextTools = ({ fontSize, setFontSize, iconSize }) => {
  return (
    <ToolDropdown
      minQuantity={30}
      maxQuantity={80}
      labelText={<MdTextFields size={iconSize} color="white" />}
      step={10}
      quantity={fontSize}
      setQuantity={setFontSize}
      title={"Adjust font size"}
    />
  );
};

export default TextTools;
