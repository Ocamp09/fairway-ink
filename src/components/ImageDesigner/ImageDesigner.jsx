import { useRef, useState } from "react";

import { uploadImage } from "../../api/designer";
import { useSession } from "../../contexts/DesignContext";
import global from "../../global.module.css";
import { centerCanvasDrawing } from "../../utils/canvasUtils";
import styles from "./ImageDesigner.module.css";
import ModeExamples from "./ModeExamples/ModeExamples";
import TypeSelector from "./TypeSelector/TypeSelector";
import CanvasEditor from "../CanvasEditor/CanvasEditor";

function ImageDesigner() {
  const canvasRef = useRef(null);
  const imgCanvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    imageUrl,
    updateStage,
    updateAdjustStage,
    updateSvgData,
    templateType,
  } = useSession();

  const [paths, setPaths] = useState([]);

  const handleSvg = async () => {
    setError("");

    if (paths.length === 0 && !imageUrl) {
      setError("Unable to upload blank drawing");
      return;
    }

    setIsLoading(true);

    const updatedPaths = paths.map((path) => ({
      ...path,
      selected: false,
    }));
    setPaths(updatedPaths);

    // pause for the paths to reload
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await sleep(1);

    // Create a temporary canvas to combine the image and drawings
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    const tempCtx = tempCanvas.getContext("2d");

    // Fill the background with white
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    if (templateType !== "text") {
      // Draw the image canvas onto the temporary canvas
      tempCtx.drawImage(imgCanvasRef.current, 0, 0);
    }

    let dataURL;

    if (imageUrl !== "" && templateType !== "text") {
      // Draw the drawing canvas onto the temporary canvas
      tempCtx.drawImage(canvasRef.current, 0, 0);
      dataURL = tempCanvas.toDataURL("image/png");
    } else {
      // Center the combined canvas content
      const centeredCanvas = centerCanvasDrawing(canvasRef.current);
      dataURL = centeredCanvas.toDataURL("image/png");
    }

    const blob = await fetch(dataURL).then((r) => r.blob());

    try {
      // Call the uploadImage function from api.js
      const response = await uploadImage(blob, templateType);
      const svgData = response.svgData;
      if (!svgData.includes("path")) {
        if (templateType === "solid") {
          setError("Unable to process drawing, make sure lines are connected");
        } else {
          setError("Error processing drawing, make sure drawing is");
        }
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      updateSvgData(svgData);
      if (templateType === "custom") {
        updateAdjustStage("remove");
      } else {
        updateAdjustStage("scale");
      }

      updateStage("adjust");
    } catch (err) {
      console.error("Upload error:", err);
      setIsLoading(false);
      setError("Unable to connect to the server, try again later");
    }
  };

  return (
    <div className={styles.designer}>
      <p className={styles.desc}>
        {templateType === "text" &&
          `Click inside the editor and type a message to get started`}
        {templateType === "solid" &&
          ` Upload an image (button or drag and drop), or draw with your mouse to
        get started`}
        {templateType === "custom" &&
          `Upload an image (button or drag and drop), or select an editor mode to get started`}
      </p>
      <div className={styles.modes_top}>
        <ModeExamples small={true} />
      </div>
      <TypeSelector />
      <div className={styles.displays}>
        <CanvasEditor
          paths={paths}
          setPaths={setPaths}
          canvasRef={canvasRef}
          imgCanvasRef={imgCanvasRef}
        />
        <div className={styles.modes_bottom}>
          <ModeExamples />
        </div>
        <div className={styles.editor_spacer}></div>
      </div>
      <button
        className={global.submit_button}
        onClick={handleSvg}
        disabled={isLoading}
      >
        {!isLoading && "Proceed to Scale"}
        {isLoading && "Loading"}
      </button>
      {error && <p className={global.error_message}>{error}</p>}
    </div>
  );
}

export default ImageDesigner;
