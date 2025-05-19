import ImageEditor from "../components/Image_Drawing/ImageEditor";
import PreviewTab from "../components/Preview/PreviewTab";
import ScaleSvg from "../components/Scale/ScaleSvg";
import TabMenu from "../components/TabMenu";
import { useSession } from "../contexts/DesignContext";
import styles from "./StencilDesigner.module.css";

const StencilDesigner = () => {
  const { stage } = useSession();

  return (
    <div className={styles.golf_ball_display}>
      <TabMenu />
      {stage === "design" && <ImageEditor />}

      {stage === "adjust" && <ScaleSvg />}
      {stage === "preview" && <PreviewTab />}
    </div>
  );
};

export default StencilDesigner;
