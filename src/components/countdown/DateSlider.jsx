"use client";

import React from "react";
import { motion } from "framer-motion";

const DateSlider = () => {
  const dates = [
    { date: 10, day: "TUE" },
    { date: 11, day: "WED" },
    { date: 12, day: "THU" },
    { date: 13, day: "FRI" },
    { date: 14, day: "SAT" },
    { date: 15, day: "SUN" },
    { date: 16, day: "MON" },
    { date: 17, day: "TUE" },
    { date: 18, day: "WED" },
    { date: 19, day: "THU" }
  ];

  const highlightedDates = dates.filter((item) =>
    [13, 14, 15].includes(item.date)
  );

  const dateVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={dateVariant}
      initial="visible"
      animate="visible"
      className="relative top-0 w-full text-white z-10 min-h-[80px] py-4"
    >
      {/* Mobile View - Only Highlighted Dates */}
      <div className="w-full md:hidden">
        <div className={`flex items-center justify-evenly w-full`}>
          {highlightedDates.map((item) => (
            <div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center p-1"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span className="text-5xl font-bold" style={{ color: '#9146FF' }}>
                    {item.date}
                  </span>
                  <span className="absolute font-bold -top-0 left-full text-white">
                    {item.day}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - All Dates */}
      <div className="hidden w-full md:flex">
        <div className={`flex justify-evenly w-full items-center`}>
          {dates.map((item) => (
            <div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span
                    className={`${[13, 14, 15].includes(item.date)
                      ? "text-5xl lg:text-6xl xl:text-7xl font-bold"
                      : "text-4xl lg:text-5xl xl:text-6xl font-bold hover:opacity-100 transition-opacity"
                      }`}
                    style={{
                      color: [13, 14, 15].includes(item.date) ? '#9146FF' : '#D9D9D9'
                    }}
                  >
                    {item.date}
                  </span>
                  <span
                    className={`absolute -top-0 left-full ${[13, 14, 15].includes(item.date)
                      ? "text-xl font-bold"
                      : "text-sm font-bold hover:opacity-100 transition-opacity"
                      }`}
                    style={{
                      color: [13, 14, 15].includes(item.date) ? '#FFFFFF' : '#D9D9D9'
                    }}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DateSlider;
