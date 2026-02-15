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

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div
      className="relative top-0 w-full text-white z-10 min-h-[80px] py-4"
    >
      {/* Mobile View - Only Highlighted Dates */}
      <div className="w-full md:hidden">
        <motion.div
          className={`flex items-center justify-evenly w-full`}
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {highlightedDates.map((item) => (
            <motion.div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center p-1"
              variants={itemVariant}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span className="text-5xl font-bold" style={{ color: '#3B82F6' }}>
                    {item.date}
                  </span>
                  <span className="absolute font-bold -top-0 left-full text-white">
                    {item.day}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Desktop View - All Dates */}
      <div className="hidden w-full md:flex">
        <motion.div
          className={`flex justify-evenly w-full items-center`}
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {dates.map((item) => (
            <motion.div
              key={`${item.date}-${item.day}`}
              className="flex items-center justify-center"
              variants={itemVariant}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <span
                    className={`${[13, 14, 15].includes(item.date)
                      ? "text-5xl lg:text-6xl xl:text-7xl font-bold"
                      : "text-4xl lg:text-5xl xl:text-6xl font-bold hover:opacity-100 transition-opacity opacity-50"
                      }`}
                    style={{
                      color: [13, 14, 15].includes(item.date) ? '#3B82F6' : '#D9D9D9'
                    }}
                  >
                    {item.date}
                  </span>
                  <span
                    className={`absolute -top-0 left-full ${[13, 14, 15].includes(item.date)
                      ? "text-xl font-bold"
                      : "text-sm font-bold hover:opacity-100 transition-opacity opacity-50"
                      }`}
                    style={{
                      color: [13, 14, 15].includes(item.date) ? '#FFFFFF' : '#D9D9D9'
                    }}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DateSlider;
