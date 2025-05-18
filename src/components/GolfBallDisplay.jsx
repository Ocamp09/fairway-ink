import { useSession } from "../contexts/DesignContext";
import styles from "./GolfBallDisplay.module.css";
import ImageEditor from "./Image_Drawing/ImageEditor";
import PreviewTab from "./Preview/PreviewTab";
import ScaleSvg from "./Scale/ScaleSvg";
import TabMenu from "./TabMenu";

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
