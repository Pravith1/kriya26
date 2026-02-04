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
import { IoMdLogOut } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

import { eventService } from "../../services/eventservice";

const NavBarForDesktop = () => {
  const { user, loading: authLoading, logout } = useAuth();

  // State for nav data
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [papers, setPapers] = useState([]);

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

        setEvents(
          (eventsData || [])
            .map((event) => ({
              name: event.eventName,
              category: event.category,
              id: event.eventId,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
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

  const goldEvents = events
    .filter((event) => event.category === "Gold")
    .sort((a, b) => a.name.localeCompare(b.name));

  const PlatinumEvents = events.filter(
    (event) => event.category === "Platinum"
  );

  // userDetails is now replaced by user from useAuth

  const router = useRouter();

  return (
    events &&
    workshops && (
      <nav className="fixed top-0 z-50 hidden w-screen max-h-screen overflow-y-scroll bg-black shadow-md lg:block lg:w-1/4 lg:relative lg:h-screen font-poppins">
        <div className="sticky top-0 z-10 flex items-center justify-center w-full px-6 bg-black shadow-sm">
          <Link
            href={"/"}
            className="mt-5 w-16 h-16"
            style={{
              background: `url(/assets/Logo/Kriya25whitelogo.png)`,
              backgroundPosition: "left",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          ></Link>
        </div>

        <div
          className={`divide-y divide-gray-600 h-fit transition-all ease-in-out duration-300 px-6 bg-black text-white `}
        >
          <div className="flex flex-col w-full py-8">
            {/* <Link href="/auth" className="w-full py-2 text-left text-white text-gray-600 hover:text-black">
            Register
          </Link> */}
            {!user && (
              <button
                onClick={() => router.push("/auth?type=register")}
                className="px-6 py-3 mb-4 text-md text-black bg-white rounded-lg"
              >
                Register / Login
              </button>
            )}
            <Link
              href="/"
              className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-text-gray-300"
            >
              <AiOutlineHome className="text-lg" />
              <p className="">Home</p>
            </Link>
            <Link
              href="/portal/event"
              className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300"
            >
              <MdOutlineEmojiEvents className="text-lg" />
              <p className="">Events</p>
            </Link>
            <Link
              href="/#section5"
              className="flex items-center w-full py-2 space-x-4 text-left text-white  group hover:text-gray-300"
            >
              <GrWorkshop className="text-lg opacity-70 group-hover:opacity-100" />
              <p className="">Workshops</p>
            </Link>
            <Link
              href="/#section4"
              className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300"
            >
              <HiOutlinePresentationChartBar className="text-lg" />
              <p className="">Paper Presentations</p>
            </Link>
            <Link
              href="/portal/accommodation"
              className="flex items-center w-full py-2 space-x-4 text-left text-white  hover:text-gray-300 "
            >
              <BiBuildingHouse className="text-lg" />
              <p className="">Accommodations</p>
            </Link>
          </div>
          <div className="py-4">
            <div className="flex justify-between items-center space-x-4">
              <h3 className="py-3 font-semibold text-white">Workshops</h3>
              {/* <div className="p-2 rounded-lg w-fit h-fit" id="early-bird">
                //<p className="text-xs text-white font-poppins">
                  ✨ Early Bird Offer ✨
                </p>
              </div> */}
            </div>
            <WorkNav noMargin workshops={workshops} />
            <h3 className="py-3 font-semibold text-white">Events</h3>
            <h3 className="py-3 font-semibold text-white">Platinum Event</h3>

            <GoldNav noMargin goldEvents={PlatinumEvents} />

            <EventNav category="Coding" events={events} />
            <EventNav category="Science" noMargin events={events} />
            <EventNav category="Bot" events={events} />
            <EventNav category="Quiz" events={events} />
            <EventNav category="Core Engineering" events={events} />
            <EventNav category="Fashion and Textile" events={events} />
            <h3 className="py-3 font-semibold text-white">Gold Events</h3>
            <GoldNav noMargin goldEvents={goldEvents} />
            <h3 className="py-3 font-semibold text-white">
              Paper Presentations
            </h3>
            <PaperNav noMargin papers={papers} />
          </div>
        </div>

        {user && (
          <div className="sticky bottom-0 z-10 flex items-center justify-between w-full p-2 px-6 space-x-4 bg-white shadow-lg shadow-black">
            <Link
              href="/portal/profile"
              className="w-8 h-8 rounded-full aspect-square"
              style={{
                backgroundImage: `url(${user?.profilePhoto || '/assets/default-avatar.png'})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></Link>
            <Link href="/portal/profile" className="flex-1">
              <h2 className="font-semibold text-black">
                {user?.name}
              </h2>
              <h4 className="text-xs text-gray-600">{user?.uniqueId}</h4>
            </Link>
            <button
              className=""
              onClick={async () => {
                await logout();
                window.location.href = '/auth';
              }}
            >
              <IoMdLogOut size={24} />
            </button>
          </div>
        )}
      </nav>
    )
  );
};

export default NavBarForDesktop;
