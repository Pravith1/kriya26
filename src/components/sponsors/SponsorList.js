import React from "react";
import { motion } from "framer-motion";
import SponsorCard from "./SponsorCard";

const SponsorList = () => {
  const sponsors = [
    // {
    //   imgurl:
    //     "https://mma.prnewswire.com/media/806571/KLA_Corporation_Logo.jpg?p=twitter",
    //   title: "KLA",
    //   category: "TITLE Sponsor",
    // },
  ];

  return (
    <div className="flex flex-col items-center bg-black text-white font-poppins py-10 px-10 md:px-16 overflow-hidden">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="special-font text-center text-white text-3xl md:text-7xl font-bold tracking-tight mb-10"
      >
        <b>OUR SPONSORS</b>
      </motion.h1>

      {/* Sponsor Section */}
      {sponsors.length > 0 ? (
        <div className="flex flex-col lg:flex-row flex-wrap items-center justify-center w-full max-w-5xl gap-12">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold tracking-wide text-center mb-6">
                <span className="bg-blue-600 text-transparent bg-clip-text">
                  {sponsor.category}
                </span>
              </h2>
              <SponsorCard imgurl={sponsor.imgurl} title={sponsor.title} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-400 text-xl md:text-2xl uppercase tracking-widest text-center animate-pulse">
            Will be announced soon
          </p>
        </div>
      )}
    </div>
  );
};

export default SponsorList;
