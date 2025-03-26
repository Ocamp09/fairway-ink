import ImageEditor from "./Image_Drawing/ImageEditor";
import TabMenu from "./TabMenu";
import ScaleSvg from "./Scale/ScaleSvg";
import PreviewTab from "./Preview/PreviewTab";
import { useSession } from "../contexts/DesignContext";
import styles from "./GolfBallDisplay.module.css";

const GolfBallDisplay = () => {
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

export default GolfBallDisplay;
