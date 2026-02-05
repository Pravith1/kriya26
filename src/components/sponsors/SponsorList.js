import React from "react";
import SponsorCard from "./SponsorCard";

const SponsorList = () => {
  const sponsor = {
    imgurl:
      "https://mma.prnewswire.com/media/806571/KLA_Corporation_Logo.jpg?p=twitter",
    title: "KLA",
    category: "TITLE Sponsor",
  };

  return (
    <div className="flex flex-col items-center bg-black text-white font-poppins py-10 px-10 md:px-16">
      {/* Heading */}
      <h1 className="text-center text-white text-3xl md:text-5xl font-bold tracking-tight mb-10">
        OUR SPONSOR
      </h1>

      {/* Sponsor Section */}
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-full max-w-5xl gap-12">
        
        {/* Kriya Logo (Left Side) */}
        <div className="flex justify-center">
          <img
            src="/assets/Logo/Kriya25whitelogo.png"
            alt="Kriya Logo"
            className="w-48 md:w-80 transition-all duration-300"
          />
        </div>

        {/* Title Sponsor (Right Side) */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold tracking-wide text-center">
            <span className="bg-pink-600 text-transparent bg-clip-text">
              {sponsor.category}
            </span>
          </h2>
          <div className="mt-6">
            <SponsorCard imgurl={sponsor.imgurl} title={sponsor.title} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SponsorList;
