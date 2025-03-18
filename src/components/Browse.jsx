import { useState, useEffect } from "react";

const Browse = () => {
  const [designList, setDesignList] = useState([]);

  useEffect(() => {
    const getDesigns = () => {
      // fetch api call
    };

    const designs = getDesigns();
    setDesignList(designs);
  });

  return (
    <div>
      <h3> Browse designs</h3>
    </div>
  );
};

export default Browse;
