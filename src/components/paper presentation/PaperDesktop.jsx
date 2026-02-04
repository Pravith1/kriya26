"use client";

import React, { useState, useEffect } from "react";
import { eventService } from "../../services/eventservice";
import PaperPresentationItemDesktop from "./PaperPresentationItemDesktop";

const PaperDesktop = () => {
  const [onMouseHoverIndex, setOnMouseHoverIndex] = useState(0);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPapers = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllPapers();

        // Handle different response formats
        let papersData = [];
        if (Array.isArray(response)) {
          papersData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          papersData = response.data;
        } else if (response?.papers && Array.isArray(response.papers)) {
          papersData = response.papers;
        }

        setPapers(papersData);
        setError(null);
      } catch (error) {
        // Only log non-404 errors to avoid console spam
        if (error.response?.status !== 404) {
          console.error("Error loading papers:", error);
        }
        // Check if it's a 404 error
        if (error.response?.status === 404) {
          setError("Paper presentations API not available yet");
        } else {
          setError("Failed to load papers");
        }
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    loadPapers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white text-lg">Loading papers...</div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="text-yellow-400 text-lg mb-2">{error}</div>
          <div className="text-gray-400 text-sm">Paper presentations will be available soon</div>
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-gray-400 text-lg">No papers available</div>
      </div>
    );
  }

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
