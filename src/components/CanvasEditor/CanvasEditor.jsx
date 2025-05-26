import styles from "./CanvasEditor.module.css";
import { useEffect, useState } from "react";

import { useSession } from "../../contexts/DesignContext";
import { useCanvasEvents } from "../../hooks/useCanvasEvents";
import { useCanvasScaling } from "../../hooks/useCanvasScaling";
import { useFontLoader } from "../../hooks/useFontLoader";
import {
  calculateBbox,
  drawImage,
  drawPaths,
  drawLine,
  getCoordinates,
} from "../../utils/canvasUtils";
import Toolbar from "./Toolbar/Toolbar";

const CanvasEditor = ({
  canvasRef,
  imgCanvasRef,
  paths,
  setPaths,
  tabEditor,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currPath, setCurrPath] = useState(null);
  const [reloadPaths, setReloadPaths] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [lineWidth, setLineWidth] = useState(5);
  const [fontSize, setFontSize] = useState(80);

  const { imageUrl, stage, templateType, editorMode, svgData } = useSession();

  const effectiveEditorMode = tabEditor ? "line" : editorMode;
  const lineColor = tabEditor ? "#FFFFFF" : "#000000";

  useFontLoader();
  useCanvasScaling(canvasRef, setCanvasScale);

  const handleStartDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e, canvasRef, canvasScale);
    if (!coords) return;

    setIsDrawing(true);
    var { x, y, pressure } = coords;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (effectiveEditorMode === "select") {
      paths.forEach((path, index) => {
        if (path.type === "text") {
          // get the bounding box for text selection
          const boundingBox = path.bbox;

          // Check if the click is within the bounding box
          if (
            x >= boundingBox.x1 &&
            x <= boundingBox.x2 &&
            y >= boundingBox.y2 &&
            y <= boundingBox.y1
          ) {
            if (path.selected) {
              setIsDragging(true);
              return;
            }

            setPaths((prevPaths) => {
              const updatedPaths = [...prevPaths];
              updatedPaths[index] = {
                ...updatedPaths[index],
                selected: true,
              };
              return updatedPaths;
            });
            setReloadPaths(true);
          } else {
            setPaths((prevPaths) => {
              const updatedPaths = [...prevPaths];
              updatedPaths[index] = {
                ...updatedPaths[index],
                selected: false,
              };
              return updatedPaths;
            });
            setReloadPaths(true);
          }
        }
      });
      return;
    }

    if (effectiveEditorMode === "type") {
      var inputText = prompt("Enter text: ");
      if (inputText) {
        context.font = fontSize + "px stencil";
        const textMetrics = context.measureText(inputText);

        if (templateType === "text") {
          var offset = 0;
          paths.forEach((path) => {
            offset += path.width;
          });

          const textHeight =
            textMetrics.actualBoundingBoxAscent +
            textMetrics.actualBoundingBoxDescent;

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2 - 150;

          x = centerX;
          y = centerY + textHeight / 2 + offset;
        }

        const bbox = calculateBbox(x, y, textMetrics);

        setPaths((prevPaths) => {
          return [
            ...prevPaths,
            {
              points: [[x, y, 1]],
              lineColor,
              width: fontSize,
              type: "text",
              text: inputText,
              templateType: templateType,
              selected: false,
              bbox: bbox,
            },
          ];
        });
      }
      return;
    }

    if (effectiveEditorMode === "line") {
      setCurrPath({
        start: [x, y],
        end: [x, y],
        width: lineWidth,
        type: "line",
      });

      return;
    }

    // if not one of the prior options, draw
    setPaths((prevPaths) => {
      return [
        ...prevPaths,
        {
          points: [[x, y, pressure]],
          lineColor,
          width: lineWidth,
          type: "draw",
        },
      ];
    });
  };

  const handleMoveDrawing = (e) => {
    e.preventDefault();
    // Skip for text typing mode or if not drawing
    if (effectiveEditorMode === "type" && !isDrawing) return;

    const coords = getCoordinates(e, canvasRef, canvasScale);
    if (!coords || !isDrawing) return;

    const { x, y, pressure } = coords;

    if (effectiveEditorMode === "select" && isDragging) {
      setPaths((prevPaths) => {
        return prevPaths.map((path) => {
          if (path.selected) {
            const updatedPath = { ...path };

            // Calculate the offset based on the initial position of the path
            const xOffset = x - path.points[0][0]; // x position offset
            const yOffset = y - path.points[0][1]; // y position offset

            // Update the points of the selected path by moving them based on the offset
            updatedPath.points = updatedPath.points.map(([px, py, pz]) => [
              px + xOffset,
              py + yOffset,
              pz, // keep the pressure unchanged
            ]);

            // Update the bounding box if the path is of type "text"
            if (path.type === "text") {
              const canvas = canvasRef.current;
              const context = canvas.getContext("2d");
              context.font = path.width + "px stencil"; // Ensure to match the font size
              const textMetrics = context.measureText(path.text);
              updatedPath.bbox = calculateBbox(
                updatedPath.points[0][0], // x position of the text
                updatedPath.points[0][1], // y position of the text
                textMetrics
              );
            }
            return updatedPath;
          }
          return path;
        });
      });
      setReloadPaths(true);
      return;
    }

    if (effectiveEditorMode === "line") {
      setCurrPath((prevPath) => ({
        ...prevPath,
        end: [x, y],
      }));
      return;
    }

    // draw
    setPaths((prevPaths) => {
      const updatedPaths = [...prevPaths];
      const lastPath = updatedPaths[updatedPaths.length - 1];

      if (lastPath) {
        lastPath.points.push([x, y, pressure]);
        return updatedPaths;
      } else {
        return [];
      }
    });
  };

  const handleStopDrawing = () => {
    setIsDrawing(false);
    setIsDragging(false);

    if (effectiveEditorMode === "line") {
      setPaths((prevPaths) => {
        return [...prevPaths, currPath];
      });
      setCurrPath(null);
    }
  };

  // handles new image upload
  useEffect(() => {
    if (tabEditor) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(canvasScale, canvasScale);

    drawImage(
      false,
      imageUrl,
      imgCanvasRef,
      setPaths,
      setReloadPaths,
      templateType
    );
  }, [imageUrl]);

  // Load the SVG onto the canvas if tabEditor
  useEffect(() => {
    if (!tabEditor) return;
    const canvas = imgCanvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const placeholder = () => {};
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    if (canvasRef.current) {
      drawImage(false, url, imgCanvasRef, placeholder, setReloadPaths, "solid");
    }
  }, [svgData, reloadPaths]);

  //will only run when paths or lineWidth changes
  useEffect(() => {
    if (!imageUrl && reloadPaths) {
      const canvas = imgCanvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (reloadPaths) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      setReloadPaths(false);
    }
    drawPaths(canvasRef, paths, templateType);
  }, [paths, lineWidth, reloadPaths]);

  useCanvasEvents(
    canvasRef,
    handleStartDrawing,
    handleMoveDrawing,
    handleStartDrawing
  );

  useEffect(() => {
    if (tabEditor) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (imageUrl) {
      drawImage(
        true,
        imageUrl,
        imgCanvasRef,
        setPaths,
        setReloadPaths,
        templateType
      );
    }
    setPaths([]);
  }, [templateType, stage]);

  useEffect(() => {
    if (effectiveEditorMode !== "line") return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!paths) return;
    paths.forEach((path) => {
      if (path.type === "line") {
        const startX = path.start[0];
        const startY = path.start[1];
        const endX = path.end[0];
        const endY = path.end[1];
        drawLine(canvasRef, startX, startY, endX, endY, path.width);
      }
    });

    if (currPath) {
      const { start, end } = currPath;
      drawLine(canvasRef, start[0], start[1], end[0], end[1], currPath.width);
    }
  }, [currPath, paths, reloadPaths]);

  useEffect(() => {
    if ((effectiveEditorMode === "line" || tabEditor) && lineWidth !== 22) {
      setLineWidth(22);
    }
  }, [effectiveEditorMode, lineWidth, tabEditor]);

  return (
    <div className={styles.editor}>
      <div className={styles.tool}>
        <Toolbar
          paths={paths}
          setPaths={setPaths}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          setReloadPaths={setReloadPaths}
          imgCanvasRef={imgCanvasRef}
          canvasRef={canvasRef}
          fontSize={fontSize}
          setFontSize={setFontSize}
          tabEditor={tabEditor}
        ></Toolbar>
      </div>
      <div className={styles.canvas_container}>
        <canvas
          ref={imgCanvasRef}
          width={500}
          height={500}
          className={styles.img_canvas}
          hidden={templateType === "text"}
        />
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className={styles.drawing_canvas}
          onMouseDown={handleStartDrawing}
          onMouseMove={handleMoveDrawing}
          onMouseUp={handleStopDrawing}
        />
      </div>
    </div>
  );
};

export default CanvasEditor;
