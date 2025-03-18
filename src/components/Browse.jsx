import { useState, useEffect } from "react";
import { getDesigns } from "../api/api";

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

  console.log(designList);

  return (
    <div>
      <h3> Browse designs</h3>
    </div>
  );
};

export default Browse;
