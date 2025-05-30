import { useEffect } from "react";
import { IoMdRedo, IoMdUndo } from "react-icons/io";
import { FaDeleteLeft } from "react-icons/fa6";

import { useSession } from "../../../../contexts/DesignContext";
import { TOOL_ICON_SIZE } from "../../../../constants";

const UndoRedoDel = ({
  paths,
  setPaths,
  setReloadPaths,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
}) => {
  const { templateType } = useSession();

  useEffect(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, [templateType]);

  const handleUndo = () => {
    if (paths.length === 0) return;
    const lastPath = paths[paths.length - 1];
    setPaths(paths.slice(0, -1));
    setUndoStack([...undoStack, lastPath]);
    setRedoStack([lastPath, ...redoStack]);
    setReloadPaths(true);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextPath = redoStack[0];
    setPaths([...paths, nextPath]);
    setUndoStack([...undoStack, nextPath]);
    setRedoStack(redoStack.slice(1));
    setReloadPaths(true);
  };

  const handleClear = () => {
    setUndoStack([...undoStack, ...paths]);
    setRedoStack([]);
    setPaths([]);
    setReloadPaths(true);
  };

  return (
    <>
      <button
        title="Undo"
        onClick={handleUndo}
        disabled={paths.length === 0}
        data-testid="undo-button"
      >
        <IoMdUndo size={TOOL_ICON_SIZE} />
      </button>
      <button
        title="Redo"
        onClick={handleRedo}
        disabled={redoStack.length === 0}
        data-testid="redo-button"
      >
        <IoMdRedo size={TOOL_ICON_SIZE} />
      </button>
      <button
        title="Delete drawings"
        onClick={handleClear}
        disabled={paths.length === 0}
        data-testid="btn-delete-drawings"
      >
        <FaDeleteLeft size={TOOL_ICON_SIZE} />
      </button>
    </>
  );
};

export default UndoRedoDel;
