import { useEffect, useState } from "react";

import { generateStl } from "../../api/designer";
import { useSession } from "../../contexts/DesignContext";
import global from "../../global.module.css";
import styles from "./ScaleSvg.module.css";
import SelectPreview from "./SelectPreview/SelectPreview";
import TabEditor from "./TabEditor";
import ScaleSlider from "./ScaleSlider/ScaleSlider";

const ScaleSvg = () => {
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [svgUrl, setSvgUrl] = useState("");

  const {
    adjustStage,
    updateStage,
    updateAdjustStage,
    svgData,
    prevSvgData,
    updateSvgData,
    updateStl,
    stlKey,
    updateStlKey,
    templateType,
  } = useSession();

  let canvasSizePx;
  if (templateType === "text") {
    canvasSizePx = 110 * scale * 2.5;
  } else {
    canvasSizePx = 110 * scale;
  }

  const handleBackToTab = () => {
    updateAdjustStage("tab");
    updateSvgData(prevSvgData);
  };

  const handleBackToDesigner = () => {
    updateStage("design");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!svgData) {
      setError("Please draw an image and convert it");
      return;
    }

    setIsLoading(true);
    updateStl("designer/default.stl");

    try {
      const response = await generateStl(svgData, scale, stlKey, templateType);

      updateStl(response.stlUrl);
      updateStlKey();
      updateStage("preview");
    } catch (err) {
      setError("An error occurred while uploading the file, try again later");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const blobSvg = new Blob([svgData], {
      type: "image/svg+xml",
    });

    const url = URL.createObjectURL(blobSvg);
    setSvgUrl(url);
  }, [svgData]);

  return (
    <div className={styles.scale_svg}>
      {templateType === "custom" && adjustStage === "remove" && (
        <SelectPreview setPrevSvg={updateSvgData} />
      )}
      {templateType === "custom" && adjustStage === "tab" && <TabEditor />}

      {adjustStage === "scale" && (
        <div className={styles.scale}>
          <button
            className={global.back_button}
            onClick={() => {
              if (templateType !== "custom") {
                handleBackToDesigner();
              } else {
                handleBackToTab();
              }
            }}
          >
            Back
          </button>
          <p>Scale the image to the desired size</p>
          <div className={styles.ball_displays}>
            <div className={styles.golf_template}>
              <img
                src={svgUrl}
                alt="Uploaded"
                className={styles.upload_img}
                style={{
                  width: `${canvasSizePx}px`,
                }}
              />
            </div>
            <div className={styles.life_size}>
              <p>Life Size</p>
              <div className={styles.golf_real_size}>
                <img
                  src={svgUrl}
                  alt="Uploaded"
                  className={styles.upload_img}
                  style={{
                    width: `${(canvasSizePx * 210) / 500}px`,
                  }}
                />
              </div>
            </div>
          </div>
          <ScaleSlider scale={scale} setScale={setScale}></ScaleSlider>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className={global.submit_button}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "3-D Preview"}
            </button>
            {error && <p className={global.error_message}>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ScaleSvg;
