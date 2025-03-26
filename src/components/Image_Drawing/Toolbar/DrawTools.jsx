import ToolDropdown from "./ToolDropdown";
import { MdLineWeight } from "react-icons/md";

const DrawTools = ({ lineWidth, setLineWidth, iconSize }) => {
  const lineLabel = <MdLineWeight size={iconSize} color="white" />;

  return (
    <>
      <ToolDropdown
        maxQuantity={20}
        labelText={lineLabel}
        step={2}
        quantity={lineWidth}
        setQuantity={setLineWidth}
        title={"Adjust line width"}
      />
    </>
  );
};

export default DrawTools;
