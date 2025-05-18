import { FaImage } from "react-icons/fa6";
import { MdRemoveCircle } from "react-icons/md";

import styles from "./RemoveImage.module.css";

const RemoveImage = () => {
  return (
    <div className={styles.remove_img}>
      <div className={styles.img_back}>
        <FaImage size={28} />
      </div>
      <div className={styles.img_front}>
        <MdRemoveCircle fill="red" size={16} />
      </div>
    </div>
  );
};

export default RemoveImage;
