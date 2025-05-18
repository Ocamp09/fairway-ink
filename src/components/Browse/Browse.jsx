import { useEffect, useState } from "react";

import { getDesigns } from "../../api/api";
import styles from "./Browse.module.css";
import BrowseItem from "./BrowseItem";

const Browse = () => {
  const [designList, setDesignList] = useState([]);

  useEffect(() => {
    const fetchDesigns = async () => {
      const designs = await getDesigns();
      if (designs) {
        setDesignList(designs);
      }
    };
    fetchDesigns();
  }, []);

  return (
    <div>
      <h3> Pre-generated designs</h3>

      <div className={styles.browse_grid}>
        {designList.map((item, index) => (
          <BrowseItem key={index} url={item} />
        ))}
      </div>
    </div>
  );
};

export default Browse;
