import React from "react";
import Link from "next/link";
import Image from "next/image";

const PaperPresentationItemMobile = ({ data }) => {
  return (
    <Link
      href={`/portal/paper/${data.ppid}`}
      className="w-64 h-[90%] relative flex items-end rounded-xl p-4 overflow-hidden group
        border-2 border-white transition-all duration-300
        hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
    >
      {/* Gradient overlay - black and white theme */}
      <div className="w-full h-full absolute top-0 left-0 z-20 
        bg-gradient-to-t from-black via-black/40 to-transparent
        group-hover:from-black/90 transition-all duration-300"
      />

      {/* Image */}
      <div className="absolute top-0 left-0 z-10 w-full h-full rounded-xl overflow-hidden">
        <Image
          src={data.image}
          fill
          sizes="256px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          alt={data.eventName || "Paper Presentation"}
        />
      </div>

      {/* Title */}
      <p className="relative z-30 text-xl font-semibold text-white font-poppins drop-shadow-lg
        line-clamp-2 leading-tight">
        {data.eventName}
      </p>

      {/* Explore indicator */}
      <div className="absolute bottom-4 right-4 z-30 px-2 py-1 
        bg-transparent border border-white/50 rounded-md text-white text-xs font-medium
        opacity-0 group-hover:opacity-100 transition-all duration-300
        hover:bg-white hover:text-black">
        Explore →
      </div>
    </Link>
  );
};

export default PaperPresentationItemMobile;
