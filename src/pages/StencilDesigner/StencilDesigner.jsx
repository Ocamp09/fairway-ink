import ImageEditor from "../../components/Image_Drawing/ImageEditor";
import PreviewTab from "../../components/Preview/PreviewTab";
import ScaleSvg from "../../components/Scale/ScaleSvg";
import TabMenu from "../../components/TabMenu";
import { useSession } from "../../contexts/DesignContext";
import styles from "./StencilDesigner.module.css";

const StencilDesigner = () => {
  const { stage } = useSession();

  const stageComp = {
    design: <ImageEditor />,
    adjust: <ScaleSvg />,
    preview: <PreviewTab />,
  };

  return (
    <main className={styles.designer}>
      <TabMenu />
      {stageComp[stage] ?? null}
    </main>
  );
};

export default StencilDesigner;
