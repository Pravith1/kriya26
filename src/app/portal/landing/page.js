"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserByEmail } from "@/API/call";
import NavBar from "./NavBar";
import NavBarForMobile from "./NavBarForMobile";
import Section1 from "@/pages/Sections/Section1";
import Section2Client from "@/pages/Sections/Section2";

import Section4 from "@/pages/Sections/Section4";
import Section5 from "@/pages/Sections/Section5";
import Section6 from "@/pages/Sections/Section6";
import Section7Server from "@/pages/Sections/Section7";
import Section8 from "@/pages/Sections/Section8";
import Section10 from "@/pages/Sections/Section10";
import Section11 from "@/pages/Sections/Section11";
import Section9 from "@/pages/Sections/Section9";
import SectionCategories from "@/pages/Sections/SectionCategories";
import { IoMdClose } from "react-icons/io";

const Landing = () => {
  const [consolee, setConsolee] = useState(0);
  const [popup, setPopup] = useState();
  const [paid, setPaid] = useState();
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      fetchUserByEmail(email).then((res) => {
        if (res.data.user.isPaid) {
          setPaid(true);
        } else {
          setPaid(false);
          setPopup(true);
        }
      });
    } else {
      setPopup(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setConsolee((window.pageYOffset / window.innerHeight).toFixed(2));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (router.query?.sn) {
      const element = document.getElementById(router.query.sn);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [router.query]);

  const condition =
    parseFloat(consolee) + 0.25 >= 1 && parseFloat(consolee) + 0.25 <= 3;

  return (
    <div className="overflow-hidden">
      <NavBar consolee={consolee} />
      <NavBarForMobile consolee={consolee} />
      <main
        className={`w-screen overflow-x-hidden transition-all duration-300 ${condition ? "bg-[#121212]" : "bg-[#FFFFFF]"
          } overflow-y-scroll`}
      >
        {!paid && popup && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[100] flex items-center justify-center">
            <div className="bg-gradient-to-l from-[#eccdde] to-[#cfbaea] w-[20rem] lg:w-[36rem] h-[24rem] p-2 lg:p-8 rounded-2xl flex items-center justify-center relative">
              <button
                className="absolute text-2xl text-black right-4 top-4"
                onClick={() => setPopup(false)}
              >
                <IoMdClose />
              </button>
              <div className="flex flex-col items-center space-y-6 lg:space-y-8 w-full lg:w-[60%] z-10">
                <h1 className="text-3xl font-semibold text-center lg:text-4xl">
                  Unlock the full{" "}
                  <span className="bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-r from-[#C80067] to-[#5451B6]">
                    experience.
                  </span>
                </h1>
                <p className="text-lg text-center">
                  Pay the general registration fee and gain access to
                  participate in <b>all the exciting events</b>!
                </p>
                <button
                  className="bg-[#5451B6] text-white text-lg px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-all"
                  onClick={() => router.push("/auth/payment?type=GENERAL")}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
        <Section1 scrollYByVH={consolee} />
        {/* <Section12 scrollYByVH={consolee} /> */}
        {/* <Section2Client scrollYByVH={consolee} /> */}
        <SectionCategories />
        <Section11 scrollYByVH={consolee} />
        <Section10 scrollYByVH={consolee} />
        <Section4 scrollYByVH={consolee} />
        <Section5 scrollYByVH={consolee} />
        <Section6 scrollYByVH={consolee} />
        {/* <Section13 /> */}

        <Section7Server scrollYByVH={consolee} />
        <Section8 />
        <Section9 />
      </main>
    </div>
  );
};

export default Landing;
