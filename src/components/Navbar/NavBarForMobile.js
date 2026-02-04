"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineHome } from "react-icons/ai";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlinePresentationChartBar } from "react-icons/hi";
import { BiBuildingHouse } from "react-icons/bi";
import WorkNav from "./WorkNav";
import EventNav from "./EventNav";
import GoldNav from "./GoldNav";
import PaperNav from "./PaperNav";
import { eventService } from "../../services/eventservice";
import MenuToggle from "./MenuToggle";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

const NavBarForMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();

  // State for nav data
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [papers, setPapers] = useState([]);
  const [goldEvents, setGoldEvents] = useState([]);
  const [PlatinumEvents, setPlatinumEvents] = useState([]);

  // Fetch nav data on component mount
  useEffect(() => {
    const loadNavData = async () => {
      try {
        const [eventsResponse, workshopsResponse, papersResponse] = await Promise.all([
          eventService.getAllEvents(),
          eventService.getAllWorkshops(),
          eventService.getAllPapers()
        ]);

        // Handle events data
        let eventsData = [];
        if (Array.isArray(eventsResponse)) {
          eventsData = eventsResponse;
        } else if (eventsResponse?.data && Array.isArray(eventsResponse.data)) {
          eventsData = eventsResponse.data;
        } else if (eventsResponse?.events && Array.isArray(eventsResponse.events)) {
          eventsData = eventsResponse.events;
        }

        const formattedEvents = (eventsData || [])
          .map((event) => ({
            name: event.eventName,
            category: event.category,
            id: event.eventId,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setEvents(formattedEvents);

        setGoldEvents(
          formattedEvents
            .filter((event) => event.category === "Gold")
            .sort((a, b) => a.name.localeCompare(b.name))
        );

        setPlatinumEvents(
          formattedEvents.filter((event) => event.category === "Platinum")
        );

        // Handle workshops data
        let workshopsData = [];
        if (Array.isArray(workshopsResponse)) {
          workshopsData = workshopsResponse;
        } else if (workshopsResponse?.data && Array.isArray(workshopsResponse.data)) {
          workshopsData = workshopsResponse.data;
        } else if (workshopsResponse?.workshops && Array.isArray(workshopsResponse.workshops)) {
          workshopsData = workshopsResponse.workshops;
        }

        setWorkshops(
          (workshopsData || [])
            .map((workshop) => ({
              name: workshop.workshopName || workshop.workName,
              id: workshop.workshopId || workshop.wid,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );

        // Handle papers data
        let papersData = [];
        if (Array.isArray(papersResponse)) {
          papersData = papersResponse;
        } else if (papersResponse?.data && Array.isArray(papersResponse.data)) {
          papersData = papersResponse.data;
        } else if (papersResponse?.papers && Array.isArray(papersResponse.papers)) {
          papersData = papersResponse.papers;
        }

        setPapers(
          (papersData || [])
            .map((paper) => ({
              name: paper.eventName,
              id: paper.paperId || paper.ppid,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error loading nav data:", error);
      }
    };
    loadNavData();
  }, []);

  // User is now from useAuth context - no need to fetch from localStorage
  useEffect(() => {
    const navOpen = document.querySelector("#navOpen");
    const elements = document.querySelectorAll("#navElements");

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        elements.forEach((tag) => {
          tag.classList.add("animate-fade-in-slow");
        });
      }
    });

    observer.observe(navOpen);
  });

  return (
    <nav className="fixed top-0 z-50 w-screen max-h-screen overflow-y-auto bg-black shadow-md lg:hidden lg:w-1/4 lg:relative lg:h-screen font-poppins">
      <div className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-black">
        <MenuToggle isOpen={isOpen} setIsOpen={setIsOpen} className="" />
        <div className="flex justify-center">
          <Link
            href={"/"}
            className="w-[3.5rem] h-[2.25rem]"
            style={{
              background: `url(/assets/Logo/Kriya25whitelogo.png)`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          ></Link>
        </div>
        <div className="flex justify-end">
          {user ? (
            <Link
              href={"/portal/profile"}
              className="w-8 h-8 rounded-full"
              style={{
                backgroundImage: `url(${user?.profilePhoto || '/assets/default-avatar.png'})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></Link>
          ) : (
            <Link
              href={"/auth?type=login"}
              className="text-white rounded-lg w-fit"
            >
              <FaRegUserCircle size={32} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`divide-y divide-gray-600 ${isOpen ? "h-fit" : "h-0 overflow-hidden"
          } transition-all ease-in-out duration-300`}
      >
        <div className="flex flex-col w-full px-6 py-8">
          <Link
            href="/"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Home
          </Link>
          {user ? (
            <Link
              href="/portal/profile"
              className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth?type=register"
              className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
            >
              Register / Login
            </Link>
          )}
          <Link
            href="/#section3"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Events
          </Link>
          <Link
            href="/#section5"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Workshops
          </Link>
          <Link
            href="/#section4"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Paper Presentations
          </Link>
          <Link
            href="/portal/accommodation"
            id="navElements"
            className="w-full py-2 text-left text-white text-gray-600 hover:text-gray-300"
          >
            Accommodations
          </Link>
        </div>
        <div className="px-6 py-8 pb-16" id="navOpen">
          <div className="flex items-center space-x-4">
            <h3 className="py-3 font-semibold text-white" id="navElements">
              Workshops
            </h3>
            {/* <div className="p-2 rounded-lg w-fit h-fit"
              id="early-bird"
            >
              <p className="text-xs text-white font-poppins">✨ Early Bird Offer ✨</p>
            </div> */}
          </div>
          <WorkNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            workshops={workshops}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Events
          </h3>
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Platinum Event
          </h3>
          <GoldNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            goldEvents={PlatinumEvents}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Quiz"
            noMargin
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Bot"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Coding"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Fashion and Textile"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Core Engineering"
            events={events}
          />
          <EventNav
            openState={[isOpen, setIsOpen]}
            isMobile
            category="Science"
            events={events}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Gold Events
          </h3>
          <GoldNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            goldEvents={goldEvents}
          />
          <h3 className="py-3 font-semibold text-white" id="navElements">
            Paper Presentations
          </h3>
          <PaperNav
            openState={[isOpen, setIsOpen]}
            isMobile
            noMargin
            papers={papers}
          />
        </div>

        {user && (
          <div className="sticky bottom-0 z-10 flex items-center justify-between w-full bg-white shadow-lg">
            <button
              onClick={async () => {
                await logout();
                window.location.href = '/auth';
              }}
              className="flex flex-row items-center px-6 py-4 gap-x-4"
            >
              <IoMdLogOut className="text-2xl" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarForMobile;
