import React from "react";
import Accregister from "@/components/Enquiry/Accregister/Accregister";
function AccountRegister() {
  return (
    <main className="h-screen w-screen p-8 pt-16 lg:py-8 lg:px-20 font-poppins bg-[#181818] text-white">
      <section className="w-full h-full pb-12 pr-2">
        <div className="w-fit">
          <h1 className="relative z-10 mt-1 text-4xl font-bold">
            Accomodation Details
          </h1>
          <div className="w-[60%] lg:w-[80%] ml-8 lg:ml-0 mt-2 h-[4px] bg-gradient-to-r rounded-[2px] from-[#C80067] to-[#7470ff]"></div>
        </div>
        <Accregister />
      </section>
    </main>
  );
}

export default AccountRegister;
