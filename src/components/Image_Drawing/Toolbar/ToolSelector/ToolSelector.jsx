import styles from "./ToolSelector.module.css";
import tool_styles from "../Toolbar.module.css";
import { BiSolidPencil } from "react-icons/bi";
import { FaRegHandPaper } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { useSession } from "../../../../contexts/DesignContext";
import { TOOL_ICON_SIZE } from "../../../../constants";
import { useState, useEffect } from "react";

const ToolSelector = ({
  isSolidTemplate,
  isTextTemplate,
  isCustomTemplate,
}) => {
  const { editorMode, updateEditorMode } = useSession();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleText = () => updateEditorMode("type");
  const handleDraw = () => updateEditorMode("draw");
  const handleSelect = () => updateEditorMode("select");

  const shouldHideTools =
    (isSolidTemplate || isTextTemplate) && screenWidth < 750;

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (shouldHideTools) return null;

  return (
    <div className={styles.tool_top} data-testid="tool-top">
      <button
        title="Activate drawing mode"
        onClick={handleDraw}
        className={
          editorMode === "draw"
            ? tool_styles.editor_but_active
            : tool_styles.editor_but
        }
        hidden={isTextTemplate}
        data-testid="btn-draw"
      >
        <BiSolidPencil
          size={TOOL_ICON_SIZE}
          color={editorMode === "draw" ? "white" : "black"}
        />
      </button>

      <button
        title="Activate text mode"
        onClick={handleText}
        className={
          editorMode === "type"
            ? tool_styles.editor_but_active
            : tool_styles.editor_but
        }
        hidden={isSolidTemplate || isCustomTemplate}
        data-testid="btn-text"
      >
        <IoText
          size={TOOL_ICON_SIZE}
          color={editorMode === "type" ? "white" : "black"}
        />
      </button>

      <button
        title="Activate select mode"
        onClick={handleSelect}
        className={
          editorMode === "select" && isTextTemplate
            ? tool_styles.editor_but_active
            : tool_styles.editor_but
        }
        hidden={isSolidTemplate || isCustomTemplate}
        data-testid="btn-select"
      >
        <FaRegHandPaper
          size={TOOL_ICON_SIZE}
          color={editorMode === "select" ? "white" : "black"}
        />
      </button>
    </div>
  );
};

export default ToolSelector;
