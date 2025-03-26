import { useSession } from "../../contexts/DesignContext";
import styles from "./TypeSelector.module.css";

const TypeSelector = ({ paths }) => {
  const {
    updateUploadedPaths,
    templateType,
    updateTemplateType,
    updateEditorMode,
  } = useSession();

  const handleSolid = () => {
    updateTemplateType("solid");
    updateEditorMode("draw");
    updateUploadedPaths(paths);
  };

  const handleText = () => {
    updateTemplateType("text");
    updateEditorMode("type");
    updateUploadedPaths(paths);
  };

  const handleCustom = () => {
    updateTemplateType("custom");
    updateEditorMode("draw");
    updateUploadedPaths(paths);
  };

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
