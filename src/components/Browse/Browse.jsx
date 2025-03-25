import { useState, useEffect } from "react";
import { getDesigns } from "../../api/api";
import BrowseItem from "./BrowseItem";
import "./Browse.css";

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

      <div className="browse-grid">
        {designList.map((item, index) => (
          <BrowseItem key={index} url={item} />
        ))}
      </div>
    </div>
  );
};

export default Browse;
