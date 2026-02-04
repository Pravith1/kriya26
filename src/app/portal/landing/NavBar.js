"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavBar = ({ consolee }) => {
  const condition =
    parseFloat(consolee) + 0.25 >= 1 && parseFloat(consolee) + 0.25 <= 3;
  const router = useRouter();

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [token, setToken] = useState(null);

  useEffect(() => {
    const to = localStorage.getItem("token");
    setToken(to);
  }, []);

  return (
    <nav
      className={`${
        consolee >= 0.97 ? "fixed lg:flex" : "lg:hidden"
      } hidden top-0 w-full left-0 right-0 px-3 items-center justify-between lg:justify-evenly space-x-4 lg:space-x-8 z-[100] h-14 lg:h-12 shadow-md
      ${condition ? "bg-[#121212]" : "bg-white"} `}
    >
      <button
        onClick={() => handleScrollToSection("section3")}
        className={`hidden lg:block text-xs w-1/12 ${
          condition ? "text-gray-300" : "text-gray-500"
        } leading-5 font-poppins ${
          condition ? "hover:text-white" : "hover:text-black"
        } transition-all`}
      >
        Events
      </button>
      <button
        onClick={() => handleScrollToSection("section4")}
        className={`hidden lg:block text-xs w-1/12 ${
          condition ? "text-gray-300" : "text-gray-500"
        } leading-5 font-poppins ${
          condition ? "hover:text-white" : "hover:text-black"
        } transition-all`}
      >
        Paper Presentations
      </button>
      <button
        onClick={() => handleScrollToSection("section5")}
        className={`hidden lg:block text-xs w-1/12 ${
          condition ? "text-gray-300" : "text-gray-500"
        } leading-5 font-poppins ${
          condition ? "hover:text-white" : "hover:text-black"
        } transition-all`}
      >
        Workshops
      </button>
     
      {condition ? (
        <div
          className="w-[4.5rem] h-[3rem] relative cursor-pointer"
          onClick={() => handleScrollToSection("section1")}
        >
          <Image
            src={"/assets/Logo/Kriya25whitelogo.png"}
            fill
            sizes="48"
            className="object-contain"
            alt="logo"
          />
        </div>
      ) : (
        <div
          className="w-[4.5rem] h-[3rem] relative cursor-pointer"
          onClick={() => handleScrollToSection("section1")}
        >
          <Image
            src={"/assets/Logo/Final_black_kriya_logo.png"}
            fill
            sizes="48"
            className="object-contain"
            alt="logo"
          />
        </div>
      )}
      <button
        onClick={() => handleScrollToSection("section7")}
        className={`hidden lg:block text-xs w-1/12 ${
          condition ? "text-gray-300" : "text-gray-500"
        } leading-5 font-poppins ${
          condition ? "hover:text-white" : "hover:text-black"
        } transition-all`}
      >
        Our Team
      </button>
      
      <button
        onClick={() => handleScrollToSection("section9")}
        className={`hidden lg:block text-xs w-1/12 ${
          condition ? "text-gray-300" : "text-gray-500"
        } leading-5 font-poppins ${
          condition ? "hover:text-white" : "hover:text-black"
        } transition-all`}
      >
        Contact Us
      </button>
      {token !== null ? (
        <button
          onClick={() => router.push("/portal/profile")}
          className={`hidden lg:block text-xs w-1/12 ${
            condition ? "text-gray-300" : "text-gray-500"
          } leading-5 font-poppins ${
            condition ? "hover:text-white" : "hover:text-black"
          } transition-all`}
        >
          Dashboard
        </button>
      ) : (
        <button
          onClick={() => router.push("/auth?type=signup")}
          className={`hidden lg:block text-xs w-1/12 ${
            condition ? "text-gray-300" : "text-gray-500"
          } leading-5 font-poppins ${
            condition ? "hover:text-white" : "hover:text-black"
          } transition-all`}
        >
          Register
        </button>
      )}
    </nav>
  );
};

export default NavBar;
