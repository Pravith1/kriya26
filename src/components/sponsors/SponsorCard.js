"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const SponsorCard = ({ imgurl, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center w-48 lg:w-64"
    >
      <div className="flex items-center justify-center p-6 bg-gray-800 rounded-2xl shadow-lg h-32 lg:h-40">
        <Image src={imgurl} alt={title} width={300} height={300} className="object-contain" />
      </div>
      <p className="mt-4 text-2xl md:text-[40px] text-gray-300 uppercase tracking-wider text-center">
        {title}
      </p>
    </motion.div>
  );
};

export default SponsorCard;
