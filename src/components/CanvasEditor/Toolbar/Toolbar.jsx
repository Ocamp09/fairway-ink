import { useState } from "react";
import { FiDownload } from "react-icons/fi";

import { useSession } from "../../../contexts/DesignContext";
import FileUpload from "./FileUpload/FileUpload";
import DrawTools from "./DrawTools/DrawTools";
import RemoveImage from "./RemoveImage/RemoveImage";
import TextTools from "./TextTools/TextTools";
import UndoRedoDel from "./UndoRedoDel/UndoRedoDel";
import { saveCanvas } from "../../../utils/canvasUtils";
import { TOOL_ICON_SIZE } from "../../../constants";

import styles from "./Toolbar.module.css";
import ToolSelector from "./ToolSelector/ToolSelector";

const Toolbar = ({
  paths,
  setPaths,
  lineWidth,
  setLineWidth,
  setReloadPaths,
  imgCanvasRef,
  canvasRef,
  fontSize,
  setFontSize,
}) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const { imageUrl, updateImageUrl, templateType, editorMode } = useSession();

  // Derived flags for readability
  const isTextTemplate = templateType === "text";
  const isSolidTemplate = templateType === "solid";
  const isCustomTemplate = templateType === "custom";

  const handleRemoveImage = () => {
    updateImageUrl("");
    setReloadPaths(true);
  };

  return (
    <div className={styles.tools} data-testid="toolbar">
      <ToolSelector
        isSolidTemplate={isSolidTemplate}
        isTextTemplate={isTextTemplate}
        isCustomTemplate={isCustomTemplate}
      />
      <div className={styles.toolbar} data-testid="toolbar-main">
        {!isTextTemplate && (
          <>
            <FileUpload />
            <button
              title="Remove image"
              onClick={handleRemoveImage}
              disabled={imageUrl === ""}
              data-testid="btn-remove-image"
            >
              <RemoveImage />
            </button>
          </>
        )}

        <UndoRedoDel
          paths={paths}
          setPaths={setPaths}
          iconSize={TOOL_ICON_SIZE}
          setReloadPaths={setReloadPaths}
          undoStack={undoStack}
          setUndoStack={setUndoStack}
          redoStack={redoStack}
          setRedoStack={setRedoStack}
        />

        {editorMode === "draw" && (
          <DrawTools
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            iconSize={TOOL_ICON_SIZE}
          />
        )}

        {editorMode === "type" && (isTextTemplate || isCustomTemplate) && (
          <TextTools
            fontSize={fontSize}
            setFontSize={setFontSize}
            iconSize={TOOL_ICON_SIZE}
          />
        )}

        <button
          title="Download drawings"
          onClick={() => saveCanvas(canvasRef.current, imgCanvasRef.current)}
          data-testid="btn-download"
        >
          <FiDownload size={TOOL_ICON_SIZE} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
