import { createContext, useContext, useState } from "react";

const DesignContext = createContext();

const createSessionState = (key, defaultValue) => {
  const sessionValue = sessionStorage.getItem(key);
  const initial =
    key === "uploadedPaths" && sessionValue
      ? JSON.parse(sessionValue)
      : sessionValue ?? defaultValue;

  const [state, setState] = useState(initial);

  const updateState = (value) => {
    sessionStorage.setItem(
      key,
      key === "uploadedPaths" ? JSON.stringify(value) : value
    );
    setState(value);
  };

  return [state, updateState];
};

export const FileProvider = ({ children }) => {
  const [stage, updateStage] = createSessionState("stage", "design");
  const [adjustStage, updateAdjustStage] = createSessionState(
    "adjustStage",
    "scale"
  );
  const [imageUrl, updateImageUrl] = createSessionState("imageUrl", "");
  const [imageType, updateImageType] = createSessionState("imageType", "");
  const [uploadedPaths, updateUploadedPaths] = createSessionState(
    "uploadedPaths",
    []
  );
  const [svgData, updateSvgData] = createSessionState("svgData", "");
  const [prevSvgData, updatePrevSvgData] = createSessionState("prevSvg", "");
  const [stlUrl, updateStl] = createSessionState(
    "stlUrl",
    "designer/default.stl"
  );
  const [stlKey, setStlKey] = useState(
    Number(sessionStorage.getItem("stlKey") || 0)
  );
  const [templateType, updateTemplateType] = createSessionState(
    "templateType",
    "solid"
  );
  const [editorMode, updateEditorMode] = createSessionState(
    "editorMode",
    "draw"
  );

  const updateStlKey = () => {
    const newKey = stlKey + 1;
    sessionStorage.setItem("stlKey", newKey);
    setStlKey(newKey);
  };

  return (
    <DesignContext.Provider
      value={{
        stage,
        updateStage,
        adjustStage,
        updateAdjustStage,
        imageUrl,
        updateImageUrl,
        imageType,
        updateImageType,
        uploadedPaths,
        updateUploadedPaths,
        svgData,
        updateSvgData,
        prevSvgData,
        updatePrevSvgData,
        stlUrl,
        updateStl,
        stlKey,
        updateStlKey,
        templateType,
        updateTemplateType,
        editorMode,
        updateEditorMode,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
};

export const useSession = () => useContext(DesignContext);
