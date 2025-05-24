import { useEffect, useRef, useState } from "react";

import { uploadImage } from "../../api/designer";
import { useSession } from "../../contexts/DesignContext";
import global from "../../global.module.css";
import { drawImage, drawLine, getCoordinates } from "../../utils/canvasUtils";
import InfoPane from "./InfoPane/InfoPane";
import styles from "./TabEditor.module.css";
import CanvasEditor from "../CanvasEditor/CanvasEditor";

const TabEditor = () => {
  const {
    updateAdjustStage,
    svgData,
    prevSvgData,
    updatePrevSvgData,
    updateSvgData,
    templateType,
  } = useSession();

  const canvasRef = useRef();
  const imgCanvasRef = useRef();
  const [paths, setPaths] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackToRemove = () => {
    updateAdjustStage("remove");
    updateSvgData(prevSvgData);
  };

  const submitTabs = async () => {
    setError("");
    updatePrevSvgData(svgData);

    if (paths.lengths === 0) {
      alert(
        "We have detected unprintable surfaces and you have uploaded no tabs. This could lead to unintended printing errors."
      );
    }

    setLoading(true);

    // Create a temporary canvas to combine the image and drawings
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 500;
    tempCanvas.height = 500;
    const tempCtx = tempCanvas.getContext("2d");

    // Fill the background with white
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    tempCtx.drawImage(imgCanvasRef.current, 0, 0);
    tempCtx.drawImage(canvasRef.current, 0, 0);

    const dataURL = tempCanvas.toDataURL("image/png");
    const blob = await fetch(dataURL).then((r) => r.blob());

    try {
      // Call the uploadImage function from api.js
      const response = await uploadImage(blob, templateType);

      setLoading(false);
      updateSvgData(response.svgData);
      updateAdjustStage("scale");
    } catch (err) {
      console.error("Upload error:", err);
      setLoading(false);
      setError("Unable to connect to the server, try again later");
    }
  };

  return (
    <div className={styles.tab_main}>
      <button
        className={global.back_button}
        onClick={() => {
          handleBackToRemove();
        }}
      >
        Back
      </button>
      <p>Add tabs for printing</p>
      <div className={styles.tab}>
        <CanvasEditor
          paths={paths}
          setPaths={setPaths}
          canvasRef={canvasRef}
          imgCanvasRef={imgCanvasRef}
          tabEditor={true}
        />
        <InfoPane warnText="Indicates un-printable areas, click and draw bridges across yellow items to white areas for printing" />
      </div>
      <button
        className={global.submit_button}
        onClick={() => {
          submitTabs();
        }}
      >
        {!loading && "Add tabs"}
        {loading && "Loading"}
      </button>
      {error && <p className={global.error_message}>{error}</p>}
    </div>
  );
};

export default TabEditor;
