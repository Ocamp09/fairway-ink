import { useEffect, useState } from "react";

import { getDesigns } from "../../api/browse";
import BrowseItem from "../../components/Browse/BrowseItem/BrowseItem";
import styles from "./Browse.module.css";
import global from "../../global.module.css";

const Browse = () => {
  const [designList, setDesignList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const designs = await getDesigns();
      if (Array.isArray(designs)) {
        setDesignList(designs);
      }
    } catch (err) {
      console.error("Failed to fetch designs:", err);
      setError("Failed to load designs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.browse}>
      <h1>Pre-generated designs</h1>

      {isLoading && <p>Loading designs...</p>}

      {error && (
        <p role="alert" className={global.error_message}>
          {error}
        </p>
      )}

      {!isLoading && designList.length === 0 && !error && (
        <p>No designs found. Check back soon!</p>
      )}

      <section className={styles.browse_grid}>
        {designList.map((design, index) => (
          <BrowseItem key={index} design={design} />
        ))}
      </section>
    </main>
  );
};

export default Browse;
