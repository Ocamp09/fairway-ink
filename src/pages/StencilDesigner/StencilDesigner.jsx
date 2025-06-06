import ImageDesigner from "../../components/ImageDesigner/ImageDesigner";
import PreviewTab from "../../components/Preview/PreviewTab/PreviewTab";
import ScaleSvg from "../../components/Scale/ScaleSvg";
import StageMenu from "../../components/StageMenu/StageMenu";
import { useSession } from "../../contexts/DesignContext";
import styles from "./StencilDesigner.module.css";

const StencilDesigner = () => {
  const { stage } = useSession();

  const stageComp = {
    design: <ImageDesigner />,
    adjust: <ScaleSvg />,
    preview: <PreviewTab />,
  };

  return (
    <main className={styles.designer}>
      <StageMenu />
      {stageComp[stage] ?? null}
    </main>
  );
};

export default StencilDesigner;
