import { useSession } from "../../../contexts/DesignContext";
import styles from "./TypeSelector.module.css";

const TypeSelector = () => {
  const { templateType, updateTemplateType, updateEditorMode } = useSession();

  const handleTypeChange = (type, mode) => {
    updateTemplateType(type);
    updateEditorMode(mode);
  };

  const handleSolid = () => handleTypeChange("solid", "draw");

  // const handleText = () => handleTypeChange("text", "type");

  const handleCustom = () => handleTypeChange("custom", "draw");

  return (
    <div className={styles.type_selector}>
      <button
        className={templateType === "solid" ? styles.active : ""}
        onClick={handleSolid}
      >
        Solid
      </button>

      {/* <button
        className={templateType === "text" ? styles.active : ""}
        onClick={handleText}
      >
        Text Only
      </button> */}

      <button
        className={templateType === "custom" ? styles.active : ""}
        onClick={handleCustom}
      >
        Custom
      </button>
    </div>
  );
};

export default TypeSelector;
