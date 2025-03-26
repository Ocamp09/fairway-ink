import {
  BsFill1CircleFill,
  BsFill2CircleFill,
  BsFill3CircleFill,
} from "react-icons/bs";
import { useSession } from "../contexts/DesignContext";
import styles from "./TabMenu.module.css";

const TabMenu = () => {
  const { stage, updateStage } = useSession();
  return (
    <div className={styles.tab_menu}>
      <div className={stage === "design" ? styles.active : ""}>
        <h3
          onClick={() => {
            updateStage("design");
          }}
        >
          <BsFill1CircleFill size={24} className={styles.tab_number} />
          Design
        </h3>
      </div>
      <div className={stage === "adjust" ? styles.active : ""}>
        <h3
          onClick={() => {
            updateStage("adjust");
          }}
        >
          <BsFill2CircleFill size={24} className={styles.tab_number} />
          Adjust
        </h3>
      </div>
      <div className={stage === "preview" ? styles.active : ""}>
        <h3
          onClick={() => {
            updateStage("preview");
          }}
        >
          <BsFill3CircleFill size={24} className={styles.tab_number} />
          Preview
        </h3>
      </div>
    </div>
  );
};

export default TabMenu;
