"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import "./globals.css";
import React, { useState, useRef, useEffect } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";

import { useRouter, useParams } from "next/navigation";
import {
  fetchWorkshopById,
  fetchWorkshopStats,
  registerForWorkshop,
  fetchUserRegisteredWorkshops,
} from "../../../../API/call";
import { useAuth } from "../../../../context/AuthContext";

const toTitleCase = (phrase) => {
  const wordsToIgnore = ["of", "in", "for", "and", "an", "or"];
  const wordsToCapitalize = ["it", "cad"];

  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (wordsToIgnore.includes(word)) {
        return word;
      }
      if (wordsToCapitalize.includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
// Summary Table
// Condition	Text Displayed
// User is already registered	"Registered"
// 50% or more seats filled, but not full	"Registrations Closing Soon!"
// All seats are filled	"Registrations Closed!"
// Seats are available, and the user isn’t registered	"Register Here!"

export default function Home({ params }) {
  const [showDetails, setShowDetails] = useState(false);
  const geeksForGeeksRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();

  // Use AuthContext for authentication
  const { user, loading: authLoading } = useAuth();

  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [earlyBird, setEarlyBird] = useState(true);
  const { id } = useParams();
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  const [workshopDetail, setWorkshopDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (showDetails && geeksForGeeksRef.current) {
      geeksForGeeksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDetails]);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  // Fetch user's registered workshops when authenticated
  useEffect(() => {
    if (user) {
      fetchUserRegisteredWorkshops()
        .then((res) => {
          setRegisteredWorkshops(res.data?.workshops || res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching user workshops:", err);
          setRegisteredWorkshops([]);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchWorkshopStats().then((res) => {
      if (res.data?.workshopWiseCount.find((i) => i._id === id)?.count) {
        setCurrentCount(
          res.data?.workshopWiseCount.find((i) => i._id === id)?.count
        );
      }
      // setCurrentCount(
      //   res.data?.workshopWiseCount.find((i) => i._id === id)?.count
      // );
      else {
        setCurrentCount(0);
      }
    });
  }, [id]);

  // useEffect(() => {
  //   console.log(ref.current)
  //   if (ref.current) {
  //     console.log(`${ref.current.clientHeight}px`)
  //     setHeight(`${ref.current.clientHeight}px`);
  //   }
  // }, [ref.current]);

  // useEffect(() => {
  //   if (currentCount >= Number((workshopDetail?.maxCount / 100) * 20)) {
  //     setEarlyBird(0);
  //   } else if (id === "WKSP0014") {
  //     setEarlyBird(0);
  //   } else {
  //     setEarlyBird(0);
  //   }
  // }, [currentCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWorkshopById(id);
        // New API returns workshop in res.data.workshop
        const workshopData = res.data.workshop || res.data;

        // Transform the data to match existing component expectations
        if (workshopData) {
          // Extract date from ISO string (get day of month)
          const dateObj = workshopData.date ? new Date(workshopData.date) : null;
          const dayOfMonth = dateObj ? dateObj.getDate().toString() : "";

          // Transform contacts array to flat structure
          const transformedWorkshop = {
            ...workshopData,
            date: dayOfMonth,
            workName: workshopData.workshopName || workshopData.workName,
            wid: workshopData.workshopId || workshopData.wid,
            desc: workshopData.description || workshopData.desc,
            // Map contacts array to c1Name/c1Num format
            c1Name: workshopData.contacts?.[0]?.name || "",
            c1Num: workshopData.contacts?.[0]?.mobile || "",
            c2Name: workshopData.contacts?.[1]?.name || "",
            c2Num: workshopData.contacts?.[1]?.mobile || "",
            // Transform agenda format if needed
            agenda: workshopData.agenda ? [workshopData.agenda.map(item => ({
              time: item.time,
              description: item.description ? item.description.split('\n').filter(d => d.trim()) : []
            }))] : [],
          };
          setWorkshopDetail(transformedWorkshop);
        }
      } catch (error) {
        console.error("Failed to fetch workshop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRegister = async () => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth?type=login");
      return;
    }

    setRegistering(true);
    try {
      await registerForWorkshop(id);
      // Refresh the page to show updated registration status
      window.location.reload();
    } catch (error) {
      console.error("Workshop registration failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      alert(errorMessage);
    } finally {
      setRegistering(false);
    }
  };
  useEffect(() => {
    if (showDetails) {
      const targetDiv = document.getElementById("info");
      if (targetDiv) {
        targetDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [showDetails]);

  return loading ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg font-semibold text-gray-600 animate-pulse">
        Loading workshop...
      </p>
    </div>
  ) : (
    <div
      className={`flex-1 h-[calc(100vh-40px)] lg:h-screen mt-10 flex flex-col overflow-y-auto bg-[#F4BBFE] z-20 relative lg:mt-0`}
    >
      <div
        ref={ref}
        className="sticky top-0 z-20 flex items-center justify-between w-full p-4 mt-2 md:px-6 lg:px-8 lg:mt-0 backdrop-blur-2xl"
      >
        <div className="flex flex-col lg:gap-2 lg:flex-row lg:items-center">
          <h1 className="text-2xl font-semibold text-black">Workshop</h1>
          {workshopDetail?.earlyBirdActive && (
            <div
              className="p-1 rounded-lg w-fit h-fit bg-blue-500 hover:bg-blue-600 transition-all duration-300 cursor-pointer group"
              id="early-bird"
            >
              <p className="text-xs text-white font-poppins">
                ✨ Early Bird Offer ✨
              </p>
              <p className="absolute top-12 bg-black p-2 rounded-lg hidden group-hover:block text-sm text-white font-poppins">
                Early registrations receive a 20% discount!
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center md:gap-4 gap-2">
          <button
            className="lg:px-4 lg:py-2 px-2 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
            disabled={
              registering ||
              workshopDetail.closed ||
              currentCount >= workshopDetail?.maxCount ||
              registeredWorkshops?.some(
                (w) => w.workshopId === id
              )
            }
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {registering
              ? "Registering..."
              : workshopDetail.closed || currentCount >= workshopDetail?.maxCount
                ? "Registrations Closed"
                : registeredWorkshops?.some(
                  (w) => w.workshopId === id
                )
                  ? "Registered"
                  : "Register"}
          </button>

          {workshopDetail.youtubeUrl && (
            <button
              className="lg:px-4 lg:py-2 px-2 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              onClick={() => setShowVideo(true)}
            >
              OVERVIEW
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full mb-5 md:mb-10 lg:mb-20">
        {/* <div className="sticky top-0 z-20 flex items-center justify-between w-full p-4 mt-2 md:px-6 lg:px-8 lg:mt-0 backdrop-blur-2xl">

          <div className="flex flex-col lg:gap-2 lg:flex-row lg:items-center">
            <h1 className="text-2xl font-semibold text-black">Workshop</h1>
            {workshopDetail?.earlyBirdActive && (
              <div className="p-1 rounded-lg w-fit h-fit" id="early-bird">
                <p className="text-xs text-white font-poppins">
                  ✨ Early Bird Offer ✨
                </p>
              </div>
            )}
          </div>


          <div className="flex items-center gap-4">


            <button
              className="px-4 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              disabled={
                workshopDetail.closed ||
                currentCount >= workshopDetail?.maxCount ||
                paymentDetails?.some(
                  (w) =>
                    w.type === "WORKSHOP" &&
                    w.status === "SUCCESS" &&
                    w.eventId === id
                )}
              onClick={() => {
                setIsModalOpen(true);
              }}

            >
              {workshopDetail.closed ||
                currentCount >= workshopDetail?.maxCount
                ? "Closed"
                : paymentDetails?.some(
                  (w) =>
                    w.type === "WORKSHOP" &&
                    w.status === "SUCCESS" &&
                    w.eventId === id
                )
                  ? "Registered"
                  : "Register"}


            </button>



            <button
              className="px-4 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              onClick={() => setShowVideo(true)}
            >
              DEMO
            </button>

          </div>

        </div> */}

        <div
          className={`flex flex-col w-full lg:flex-row lg:h-[calc(100vh-68px)]`}
        >
          <div className="h-full relative w-full lg:w-[75%] flex flex-col lg:justify-end">
            {/* Image */}

            <div
              className={`w-full relative lg:absolute lg:top-0 aspect-[1000/723] self-end -z-10`}
            >
              <Image
                src={`/workshopdetails/${id}.jpg`}
                fill
                sizes="400"
                alt="cover"
                className=""
              />

              {/* <div className="absolute flex-col hidden w-full gap-1 px-4 py-2 -bottom-[12%]  lg:flex md:px-6 lg:px-8">

                <div className="flex gap-4">

                  <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">{workshopDetail.date}</h1>

                  <div className="flex flex-col">
                    <p className="text-2xl font-bold">MARCH</p>
                    <p className="text-2xl font-bold">(2025)</p>
                  </div>

                </div>



                <h2
                  className={`font-bold text-black ${workshopDetail.workName.length > 15 ? "text-3xl md:text-6xl" : "text-5xl md:text-8xl"
                    }`}
                >
                  {workshopDetail.workName}
                </h2>


                <button onClick={() => {
                  setShowDetails(true);
                  const targetDiv = document.getElementById('info');
                  targetDiv.scrollIntoView({
                    behavior: 'smooth',  // Smooth scrolling
                    block: 'start'       // Align to the top of the viewport
                  });

                }}
                  className="self-start px-4 py-2 mt-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins">
                  Learn More
                </button>

              </div> */}
            </div>

            <div
              className={`relative flex-col hidden w-full gap-1 px-4 py-2 lg:flex md:px-6 lg:px-8 `}
            >
              <div className="flex gap-4 ">
                <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl  bg-[#F4BBFE] ">
                  {workshopDetail.date}
                </h1>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold  bg-[#F4BBFE]">MARCH</p>
                  <p className="text-2xl font-bold  bg-[#F4BBFE]">(2025)</p>
                </div>
              </div>

              <h2
                className={`font-bold text-black md:w-[80%] bg-[#F4BBFE] ${workshopDetail.wid === "WKSP12"
                  ? "text-2xl md:text-3xl lg:text-4xl " // Further reduced size
                  : workshopDetail.workName.length > 15
                    ? "text-3xl md:text-4xl lg:text-5xl"
                    : "text-5xl md:text-6xl lg:text-7xl"
                  }`}
              >
                {workshopDetail.workName}
              </h2>

              <button
                onClick={() => {
                  setShowDetails(true);
                  const targetDiv = document.getElementById("info");
                  targetDiv.scrollIntoView({
                    behavior: "smooth", // Smooth scrolling
                    block: "start", // Align to the top of the viewport
                  });
                }}
                className="self-start px-4 py-2 mt-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              >
                Learn More
              </button>
            </div>

            <div className="flex flex-col w-full px-4 py-2 gasp-1 lg:hidden md:px-6 lg:px-8">
              <div className="flex gap-4">
                <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">
                  {workshopDetail.date}
                </h1>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold">MARCH</p>
                  <p className="text-2xl font-bold">(2025)</p>
                </div>
              </div>

              <h2
                className={`font-bold text-black ${workshopDetail.workName.length > 15
                  ? "text-3xl md:text-7xl"
                  : "text-5xl md:text-8xl"
                  }`}
              >
                {workshopDetail.workName}
              </h2>
              <div className="flex justify-between w-full">
                {workshopDetail?.alteredFee && workshopDetail?.actualFee && (
                  <div className="flex flex-col justify-center items-center">
                    {workshopDetail?.earlyBirdActive ? (
                      <div>
                        <p className="text-4xl lg:text-3xl font-semibold text-[#3c4043] flex items-center">
                          <span className="inline-flex items-center">
                            <BiRupee />
                          </span>
                          {workshopDetail?.alteredFee}
                          <span className="ml-2 text-2xl font-normal text-gray-500 line-through lg:text-lg flex items-center">
                            <span className="inline-flex items-center">
                              <BiRupee />
                            </span>
                            {workshopDetail?.actualFee}
                          </span>
                        </p>
                        <p className="text-xl font-medium text-green-600">
                          * Early bird offer
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="flex justify-center text-4xl lg:text-3xl font-semibold text-[#3c4043]">
                          <span className="inline-flex items-center">
                            <BiRupee />
                          </span>
                          {workshopDetail.actualFee}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col py-2 gap-1 ">
                  <h3 className="text-xl font-bold">Convenors</h3>

                  <div className="flex flex-col gap-2 pl-5">
                    {[workshopDetail.c1Name, workshopDetail.c2Name].map(
                      (contact, index) =>
                        contact && (
                          <div key={index} className="">
                            <p className="text-lg font-semibold">
                              {toTitleCase(contact)} <br />
                              <span className="flex items-center space-x-2">
                                <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                                <span>
                                  {index === 0
                                    ? workshopDetail.c1Num
                                    : workshopDetail.c2Num}
                                </span>
                              </span>
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  {
                    setShowDetails(true);
                    function scroll() {
                      const targetDiv = document.getElementById("info");
                      targetDiv.scrollIntoView({
                        behavior: "smooth", // Smooth scrolling
                        block: "start", // Align to the top of the viewport
                      });
                    }
                    scroll();
                  }
                }}
                className="self-start px-4 py-2 mt-4 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right */}

          <div className="h-full hidden lg:flex w-full lg:w-[25%] flex-col justify-between p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-stretch w-full mt-[20%] text-3xl xl:text-4xl font-semibold uppercase justify-evenly">
                <h1>{workshopDetail.closed ? "Closed " : "Live* "}</h1>

                <div className="w-1 bg-black" />

                {workshopDetail?.alteredFee && workshopDetail?.actualFee && (
                  <div className="flex flex-col">
                    {workshopDetail?.earlyBirdActive ? (
                      <div className="group relative cursor-pointer ">
                        <p className="text-4xl lg:text-3xl font-semibold text-[#3c4043] flex items-center ">
                          <span className="inline-flex items-center">
                            <BiRupee />
                          </span>
                          {workshopDetail?.alteredFee}
                          <span className="ml-2 text-2xl font-normal text-gray-500 line-through lg:text-lg flex items-center">
                            <span className="inline-flex items-center">
                              <BiRupee />
                            </span>
                            {workshopDetail?.actualFee}
                          </span>
                        </p>

                        {/* Text appears on hover */}
                        <p className="hidden group-hover:block absolute top-full mt-2 text-xs font-medium text-green-600">
                          * Early bird offer
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className=" flex text-2xl lg:text-3xl font-semibold text-[#3c4043]">
                          <span className="inline-flex items-center">
                            <BiRupee />
                          </span>{" "}
                          {workshopDetail.actualFee}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Venue */}

              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center gap-4">
                  <div className="  text-2xl  text-black font-semibold">
                    <MdAccessTime />
                  </div>

                  <p className="text-xl   text-black font-semibold">
                    {workshopDetail.time}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="  text-2xl font-semibold text-black">
                    <MdOutlineLocationOn />
                  </div>
                  <p className="text-xl font-semibold text-black">
                    {workshopDetail.hall}
                  </p>
                </div>
              </div>
            </div>

            {/* Convennors */}

            <div className="flex flex-col self-center gap-2 ">
              <h3 className="text-3xl font-bold">Convenors</h3>

              <div className="flex flex-col gap-2">
                {[workshopDetail.c1Name, workshopDetail.c2Name].map(
                  (contact, index) =>
                    contact && (
                      <div key={index} className="">
                        <p className="text-lg font-semibold">
                          {toTitleCase(contact)} <br />
                          <span className="flex items-center space-x-2">
                            <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                            <span>
                              {index === 0
                                ? workshopDetail.c1Num
                                : workshopDetail.c2Num}
                            </span>
                          </span>
                        </p>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          {showVideo && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="relative w-full max-w-2xl">
                {workshopDetail.youtubeUrl && (
                  <iframe
                    className="w-full h-[400px] rounded-lg z-50"
                    src={
                      workshopDetail.youtubeUrl
                        ? workshopDetail.youtubeUrl
                        : "https://www.youtube.com/embed/YeFJPRFhmCM?si=gg31c7VicKYd8Lv-"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
                <button
                  className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-full"
                  onClick={() => setShowVideo(false)}
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full" id="info">
          {showDetails && (
            <div className="w-full p-2 text-black lg:p-8">
              <div className="flex flex-col items-start justify-between lg:flex-row">
                <div>
                  <h2 className="mt-2 text-lg font-semibold">
                    {"( "}
                    {workshopDetail.wid}
                    {" )"}
                  </h2>
                  <h3
                    className={`font-semibold mt-1 text-black ${workshopDetail.workName.length > 15
                      ? "text-4xl"
                      : "text-6xl"
                      }`}
                  >
                    {workshopDetail.workName}
                  </h3>
                </div>

                <div className="text-3xl font-bold lg:text-right sm:text-left flex flex-col items-end lg:mt-[-1rem]">
                  <div className="hidden items-center sm:mr-8=10 xl:text-right sm:text-left sm:mt-0 mt-2 mr-2 lg:flex">
                    <span className="mr-2 font-bold text-7xl sm:text-left">
                      {workshopDetail.date}
                    </span>
                    <div className="mb-3 sm:text-left">
                      <p className="text-xl font-bold leading-tight">MARCH</p>
                      <p className="-mt-1 text-lg font-bold">
                        {"("}2025{")"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full gap-2 lg:justify-end">
                <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row">
                  <p className="py-3 text-xl font-semibold text-gray-600 lg:text-2xl lg:px-3">
                    <MdAccessTime />
                  </p>
                  <p className="text-xs font-semibold text-gray-600">
                    {workshopDetail.time}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row ">
                  <p className="py-3 text-xl font-semibold text-gray-600 lg:text-2xl lg:px-3">
                    <MdOutlineLocationOn />
                  </p>
                  <p className="text-xs font-semibold text-black">
                    {workshopDetail.hall}
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-gray-500 flex w-full"></div>
              <p className="pt-4 m-2 mt-1 text-gray-700 text-sm/6 text-pretty">
                {workshopDetail.desc}
              </p>

              <div className="flex flex-col w-full gap-8 py-12 lg:flex-row">
                {/* Agenda Section */}
                <div className="w-full px-2 ">
                  <div className="text-4xl font-bold mb-8 text-[#3c4043]">
                    Agenda
                  </div>
                  {workshopDetail?.agenda.length > 0 && (
                    <div>
                      {workshopDetail?.agenda[0]?.map((item, index) => (
                        <div className="ml-8" key={index}>
                          <div className="flex flex-row items-center gap-4">
                            <div className="w-6 h-6 z-10 rounded-full bg-[#3c4043]"></div>
                            <div className="text-lg font-semibold text-[#3c4043]">
                              {item.time}
                            </div>
                          </div>
                          <ol className="list-disc pt-2 border-l-[#3c4043] border-l-2 border-dashed ml-3 pl-12 pb-8 space-y-2 text-sm/6">
                            {item.description.map((desc, descIndex) => (
                              <li key={`${index}-${descIndex}`}>{desc}</li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {showVideo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="relative w-full max-w-2xl">
                    {workshopDetail.youtubeUrl && (
                      <iframe
                        className="w-full h-[400px] rounded-lg z-50"
                        src={
                          workshopDetail.youtubeUrl
                            ? workshopDetail.youtubeUrl
                            : "https://www.youtube.com/embed/YeFJPRFhmCM?si=gg31c7VicKYd8Lv-"
                        }
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                    <button
                      className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-full"
                      onClick={() => setShowVideo(false)}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConfirmationModal
          onConfirm={handleRegister}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
