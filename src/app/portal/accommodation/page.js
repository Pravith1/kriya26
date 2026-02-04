import React from "react";
import Details from "@/components/Enquiry/Accomodation/Details";

function Accomodation() {
  const fromDates = [
    "22nd February Night",
    "23rd February Morning",
    "24th February Morning",
    "24th February Morning",
  ];
  const toDates = [
    "23rd February Night",
    "24th February Night",
    "25th February Evening",
  ];
  const roomCost = {
    "Common Free Hall": 0,
    Room: 125,
    "Two Sharing": 125,
    "Two Sharing with common bathroom": 250,
  };
  return (
    <main className="w-full h-screen p-8 pt-16 bg-white lg:py-8 lg:px-20 font-poppins overflow-hidden">
      <section className="w-full h-full pb-12 pr-2 overflow-y-auto">
        <div className="w-fit">
          <h1 className="relative z-10 mt-1 text-4xl font-bold">
            Apply for Accommodation
          </h1>
          <div className="w-[60%] lg:w-[80%] ml-8 lg:ml-0 mt-2 h-[4px] bg-gradient-to-r rounded-[2px] from-[#3b82f6] to-[#8b5cf6]"></div>
        </div>
        <Details />
      </section>
    </main>
  );
}

export default Accomodation;
