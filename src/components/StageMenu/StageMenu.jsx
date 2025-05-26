import {
  BsFill1CircleFill,
  BsFill2CircleFill,
  BsFill3CircleFill,
} from "react-icons/bs";

import { useSession } from "../../contexts/DesignContext";
import styles from "./StageMenu.module.css";

const stages = ["design", "adjust", "preview"];
const stageInfo = {
  design: { title: "Design", Icon: BsFill1CircleFill },
  adjust: { title: "Adjust", Icon: BsFill2CircleFill },
  preview: { title: "Preview", Icon: BsFill3CircleFill },
};

const StageMenu = () => {
  const { stage, updateStage } = useSession();

  return (
    <div className={styles.tab_menu} role="group" aria-label="Stage selector">
      {stages.map((s) => {
        const { title, Icon } = stageInfo[s];
        return (
          <div
            key={s}
            className={stage === s ? styles.active : ""}
            data-testid={`stage-${s}`}
          >
            <h3 onClick={() => updateStage(s)}>
              <Icon size={24} className={styles.tab_number} />
              {title}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default StageMenu;
