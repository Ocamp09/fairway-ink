import { ReactSVG } from "react-svg";
import { useSession } from "../../../contexts/DesignContext";
import InfoPane from "../InfoPane/InfoPane";
import global from "../../../global.module.css";
import styles from "./SelectPreview.module.css";
import { useRef } from "react";

const SelectPreview = () => {
  const {
    updateStage,
    adjustStage,
    updateAdjustStage,
    svgData,
    updateSvgData,
    updatePrevSvgData,
  } = useSession();

  const selectedRef = useRef(new Set());

  const handlePathClick = (e) => {
    if (e.target.localName !== "path") return;

    const path = e.target;
    const fill = path.getAttribute("fill");

    if (fill === "#00004d") {
      path.setAttribute("fill-opacity", 1);
    }

    if (!fill || fill !== "red") {
      path.setAttribute("fill", "red");
      selectedRef.current.add(path);
    } else {
      const fillOpacity = path.getAttribute("fill-opacity");
      path.setAttribute("fill", fillOpacity === "1" ? "#00004d" : "black");
      selectedRef.current.delete(path);
    }
  };

  const removeSelectedPaths = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgData, "image/svg+xml");
    const originalSvg = doc.documentElement;
    const paths = doc.querySelectorAll("path");

    const newSvg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("width", originalSvg.getAttribute("width"));
    newSvg.setAttribute("height", originalSvg.getAttribute("height"));

    paths.forEach((path) => {
      const isSelected = Array.from(selectedRef.current).some(
        (selected) => selected.getAttribute("d") === path.getAttribute("d")
      );
      if (!isSelected) {
        newSvg.appendChild(path.cloneNode());
      }
    });

    return new XMLSerializer().serializeToString(newSvg);
  };

  const handleSubmit = () => {
    updatePrevSvgData(svgData);

    if (selectedRef.current.size > 0) {
      const newSvg = removeSelectedPaths();
      updateSvgData(newSvg);
    }

    updateAdjustStage("tab");
  };

  return (
    <div className={styles.select_preview}>
      <button
        className={global.back_button}
        onClick={() => updateStage("design")}
      >
        Back
      </button>

      <h3 className={styles.header}>Select any curves to remove from design</h3>

      <div className={styles.select}>
        {svgData && adjustStage === "remove" && (
          <ReactSVG
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`}
            onClick={handlePathClick}
          />
        )}

        <InfoPane
          warnText="May be problematic to print, remove or create tabs"
          redText="Items to be removed from design"
        />
      </div>

      <button className={global.submit_button} onClick={handleSubmit}>
        Remove selected items
      </button>
    </div>
  );
};

export default SelectPreview;
