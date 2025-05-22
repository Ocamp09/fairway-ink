import { MdLineWeight } from "react-icons/md";

import ToolDropdown from "../ToolDropdown";

const DrawTools = ({ lineWidth, setLineWidth, iconSize }) => {
  return (
    <ToolDropdown
      maxQuantity={20}
      labelText={<MdLineWeight size={iconSize} color="white" />}
      step={2}
      quantity={lineWidth}
      setQuantity={setLineWidth}
      title="Adjust line width"
    />
  );
};

export default DrawTools;
