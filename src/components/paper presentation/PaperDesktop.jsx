"use client";

import React, { useState, useEffect } from "react";
import { fetchNavPapers, fetchPapers } from "../../API/call";
import PaperPresentationItemDesktop from "./PaperPresentationItemDesktop";

const PaperDesktop = () => {
  const [onMouseHoverIndex, setOnMouseHoverIndex] = useState(0);
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const papersData = await fetchNavPapers();
        setPapers(papersData || []);
      } catch (error) {
        console.error("Error loading papers:", error);
        setPapers([]);
      }
    };
    loadPapers();
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full md:pr-16 space-x-2">
      {papers.map((data, index) => {
        return (
          <PaperPresentationItemDesktop
            key={index}
            index={index}
            onMouseHoverIndex={onMouseHoverIndex}
            setOnMouseHoverIndex={setOnMouseHoverIndex}
            data={data}
          />
        );
      })}
    </div>
  );
};

export default PaperDesktop;

