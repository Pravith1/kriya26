'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { BsLinkedin, BsInstagram } from "react-icons/bs";
import { SiGmail, SiYoutube } from "react-icons/si";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const NavBarForMobile = ({ consolee }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const condition =
    parseFloat(consolee) + 0.25 >= 1 && parseFloat(consolee) + 0.25 <= 3;

  // User is now from useAuth context - no need to fetch from localStorage

  useEffect(() => {
    const navOpen = document.querySelector("#landingNavOpen");
    const elements = document.querySelectorAll("#landingNavElements");

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        elements.forEach((tag) => {
          tag.classList.add("animate-fade-in-slow");
        });
      }
    });

    observer.observe(navOpen);
  }, []);

  return (
    <nav
      className={`${consolee >= 0.25 ? "block" : "hidden"
        } lg:hidden z-50 w-screen lg:w-1/4 ${!condition ? "bg-white" : "bg-black"
        } fixed lg:relative top-0 max-h-screen lg:h-screen overflow-y-scroll px-4 font-poppins shadow-md`}
    >
      <div className="flex w-full justify-between items-center sticky top-0 h-[3.25rem]">
        <MenuToggle isOpen={isOpen} setIsOpen={setIsOpen} />
        <button
          onClick={() => {
            document
              .getElementById("section1")
              .scrollIntoView({ behavior: "smooth" });
          }}
          className={`w-[4.5rem] h-[3.25rem] ${condition && "hidden"}`}
          style={{
            background: `url(/assets/Logo/Final_black_kriya_logo.png)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
          aria-label="Scroll to Section 1"
        ></button>
        <div className="flex justify-end">
          {user ? (
            <Link href="/portal/profile">
              <div className="relative w-8 h-8 overflow-hidden rounded-full">
                <Image src={user?.profilePhoto || '/assets/default-avatar.png'} fill className="object-fit" sizes="32" alt="profile" />
              </div>
            </Link>
          ) : (
            <Link href="/auth?type=login">
              <FaRegUserCircle
                className={`text-3xl opacity-80 ${condition ? "text-white" : "text-black"
                  }`}
              />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`divide-y divide-gray-600 ${isOpen ? "h-fit" : "h-0 overflow-hidden"
          } transition-all w-5/6 ease-in-out duration-300`}
        id="landingNavOpen"
      >
        <div className="flex flex-col w-full py-8 pl-4" id="landingNavElements">
          {[
            { id: "section3", label: "Events" },
            { id: "section4", label: "Paper Presentations" },
            { id: "section5", label: "Workshops" },
            { id: "section7", label: "Our Team" },
            { id: "section8", label: "FAQs" },
            { id: "section9", label: "Contact Us" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsOpen(false);
                document
                  .getElementById(item.id)
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full ${condition ? "text-gray-200" : "text-gray-600"
                } text-left text-base py-2`}
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/portal/profile");
                }}
                className={`w-full ${condition ? "text-gray-200" : "text-gray-600"
                  } text-left text-base py-2`}
              >
                Dashboard
              </button>
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                  router.push('/auth');
                }}
                className={`w-full ${condition ? "text-gray-200" : "text-gray-600"
                  } text-left text-base py-2`}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/auth?type=register");
              }}
              className={`w-full ${condition ? "text-gray-200" : "text-gray-600"
                } text-left text-base py-2`}
            >
              Register / Login
            </button>
          )}
          <div className="flex flex-row space-x-8 pt-14">
            {[
              {
                href: "https://www.linkedin.com/company/studentsunion-psgtech/",
                icon: BsLinkedin,
              },
              {
                href: "https://www.instagram.com/kriya_psgtech/",
                icon: BsInstagram,
              },
              {
                href: "mailto:events@psgkriya.in",
                icon: SiGmail,
              },
              {
                href: "https://youtube.com/c/StudentsUnionPSGTech",
                icon: SiYoutube,
              },
            ].map((item, index) => (
              <button
                key={index}
                className="transition-all duration-500 ease-in-out hover:-translate-y-2"
                onClick={() => window.open(item.href, "_blank")}
                aria-label={`Visit ${item.href}`}
              >
                <item.icon
                  size={24}
                  className={`${condition ? "text-gray-400" : "text-gray-500"
                    } hover:text-black`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const MenuToggle = ({ isOpen, setIsOpen }) => {
  return (
    <button
      className="flex items-center p-1 text-gray-500 lg:hidden lg:hover:text-gray-300"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle Menu"
    >
      {isOpen ? (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  );
};

export default NavBarForMobile;
