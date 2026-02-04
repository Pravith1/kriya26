"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { useRouter } from "next/navigation";
import "./globals.css";
import { useState, useRef, useEffect } from "react";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import {
  fetchPaperById,
  registerForPaper,
  fetchUserRegisteredPapers,
} from "../../../../API/call";
import { SiGmail } from "react-icons/si";
import ConfirmationModal from "@/components/ConfirmationModal";
import Image from "next/image";
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
  weight: ["400", "500", "600", "700"], // Adjust weights as per your needs
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Adjust weights as per your needs
});

export default function Home({ params }) {
  const [showDetails, setShowDetails] = useState(false);
  const geeksForGeeksRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Use AuthContext for authentication
  const { user, loading: authLoading } = useAuth();

  const [userPaperDetails, setUserPaperDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [paperDetail, setPaperDetail] = useState(null);

  // Fetch user's registered papers when authenticated
  useEffect(() => {
    if (user) {
      fetchUserRegisteredPapers()
        .then((res) => {
          setUserPaperDetails(res.data?.papers || res.data || []);
        })
        .catch((err) => {
          console.error("Error fetching user papers:", err);
          setUserPaperDetails([]);
        });
    }
  }, [user]);

  const handleRegister = async () => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push("/auth?type=signup");
      return;
    }

    if (!user.generalFeePaid) {
      router.push("/auth/payment?type=GENERAL");
      return;
    }

    setRegistering(true);
    try {
      await registerForPaper(id);
      // Refresh the page to show updated registration status
      window.location.reload();
    } catch (error) {
      console.error("Paper registration failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      alert(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPaperById(id);
        // New API returns paper in res.data.paper
        const paperData = res.data.paper || res.data;

        // Transform the data to match existing component expectations
        if (paperData) {
          // Extract date from ISO string (get day of month)
          const dateObj = paperData.date ? new Date(paperData.date) : null;
          const dayOfMonth = dateObj ? dateObj.getDate().toString() : "";

          // Transform contacts array to contact1/contact2 format (array of [name, mobile])
          const transformedPaper = {
            ...paperData,
            date: dayOfMonth,
            ppid: paperData.paperId || paperData.ppid,
            // Map contacts array to contact1/contact2 format [name, mobile]
            contact1: paperData.contacts?.[0] ? [paperData.contacts[0].name, paperData.contacts[0].mobile] : null,
            contact2: paperData.contacts?.[1] ? [paperData.contacts[1].name, paperData.contacts[1].mobile] : null,
            // Map eventMail (can be a string or array)
            eventMail: paperData.eventMail ? (Array.isArray(paperData.eventMail) ? paperData.eventMail : [paperData.eventMail]) : [],
            // Ensure teamSize is string for comparison
            teamSize: paperData.teamSize?.toString() || "1",
            // Map topic and rules
            topic: paperData.topic || "",
            rules: paperData.rules || "",
            // Map closed status
            closed: paperData.closed?.toString() || "false",
          };
          setPaperDetail(transformedPaper);
        }
      } catch (error) {
        console.error("Error fetching paper details:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (showDetails && geeksForGeeksRef.current) {
      geeksForGeeksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDetails]);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  const ref = useRef(null);

  const [height, setHeight] = useState(null);

  // useEffect(() => {
  //   console.log(ref.current)
  //   console.log("hello");
  //   // if (ref.current) {
  //   //   console.log(`${ref.current.clientHeight}px`)
  //   //   setHeight(`${ref.current.clientHeight}px`);
  //   // }
  //   setTimeout(() => {
  //     if (ref.current) {
  //       setHeight(`${ref.current.clientHeight}px`);
  //     }
  //   }, 20);
  // }, [ref.current]);

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

  return !paperDetail ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg font-semibold text-gray-600 animate-pulse">
        Loading research paper...
      </p>
    </div>
  ) : (
    <div
      className={`flex-1  ${inter.variable} ${jetBrainsMono.variable} h-[calc(100vh-40px)] pt-[3%] sm:pt-0 lg:h-screen mt-10 flex flex-col overflow-y-auto bg-[#D7FFFF] z-20 relative lg:mt-0`}
    >
      <div
        ref={ref}
        className="sticky top-0 z-20 flex w-full px-0 py-2 mt-2 lg:py-4 lg:mt-0 backdrop-blur-2xl"
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full px-4 md:px-6 lg:px-8">
            <h1 className="text-sm font-semibold text-black sm:hidden">
              Paper Presentation
            </h1>
            <h1 className="hidden text-2xl font-semibold text-black sm:block">
              Paper Presentation
            </h1>

            <div className="flex items-center gap-4">
              {!userPaperDetails.find((i) => i.paperId === id) ? (
                paperDetail.closed === "false" ? (
                  <button
                    className="px-1 py-1 text-xs font-light text-white uppercase bg-black lg:px-4 lg:py-2 lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
                    onClick={() => {
                      !userPaperDetails.find((i) => i.eventId === id) &&
                        setIsModalOpen(true);
                    }}
                  >
                    {"Register"}
                  </button>
                ) : (
                  <button
                    className="px-1 py-1 text-xs font-light text-white uppercase bg-black lg:px-4 lg:py-2 lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
                    disabled
                  >
                    {"Registrations Closed!"}
                  </button>
                )
              ) : (
                <div className="flex-col hidden w-full px-4 py-2 lg:flex lg:rounded-3xl">
                  <p className=" font-medium text-[#3c4043]">
                    Already Registered! You can submit the abstract to the mail
                    ID
                  </p>
                  <div className="text-xs md:text-sm xl:text-base text-[#3c4043]">
                    {paperDetail.eventMail.map((item, index) => (
                      <div
                        className="flex flex-row items-center w-full space-x-4 group"
                        key={index}
                      >
                        <SiGmail className="text-lg lg:text-2xl group-hover:text-black" />
                        <button
                          className="text-blue-700 group-hover:underline [overflow-wrap:break-word] w-[80%] text-left"
                          onClick={() => {
                            window.open(`mailto:${item}`);
                          }}
                        >
                          {item}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paperDetail.youtubeUrl && (
                <button
                  className="px-1 py-1 text-xs font-light text-white uppercase bg-black lg:px-4 lg:py-2 lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
                  onClick={() => setShowVideo(true)}
                >
                  OVERVIEW
                </button>
              )}
            </div>
          </div>

          {userPaperDetails.find((i) => i.paperId === id) && (
            <div className="bg-[#ffffff] lg:hidden w-full lg:rounded-3xl px-4 py-2 space-y-2">
              <p className="md:text-lg text-xs lg:text-xl font-medium tracking-wider text-[#3c4043]">
                Already Registered! You can submit the abstract to the mail ID:{" "}
                {paperDetail.eventMail.map((item, index) => (
                  <button
                    key={index}
                    className="text-blue-700 inline group-hover:underline [overflow-wrap:break-word] w-[80%] text-left"
                    onClick={() => {
                      window.open(`mailto:${item}`);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 w-full mb-5 md:mb-10 lg:mb-20">
        <div
          className={`flex flex-col w-full lg:flex-row lg:h-[calc(100vh-80px)]`}
        >
          <div className="h-full relative w-full lg:w-[75%] flex flex-col lg:justify-end">
            {/* Image */}

            <div
              className={`w-full relative lg:absolute lg:top-0 aspect-[1000/723] self-end -z-10`}
            >
              <Image
                src={`/paperdetails/${id}.jpg`}
                fill
                sizes="400"
                alt="cover"
                className=""
              />

              {/* <div className="absolute flex-col hidden w-full gap-1 px-4 py-2 -bottom-[12%]  lg:flex md:px-6 lg:px-8">

                <div className="flex gap-4">

                  <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">{paperDetail.date}</h1>

                  <div className="flex flex-col">
                    <p className="text-2xl font-bold">MARCH</p>
                    <p className="text-2xl font-bold">(2025)</p>
                  </div>

                </div>

                <h2
                  className={`font-bold text-black ${paperDetail.eventName.length > 15 ? "text-3xl md:text-6xl" : "text-5xl md:text-8xl"
                    }`}
                >
                  {paperDetail.eventName}
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

            <div className="relative flex-col hidden w-full gap-1 px-4 py-2 lg:flex md:px-6 lg:px-8">
              <div className="flex gap-4">
                <h1 className="text-4xl font-bold md:text-6xl xl:text-8xl ">
                  {paperDetail.date}
                </h1>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold bg-[#D7FFFF]">MARCH</p>
                  <p className="text-2xl font-bold bg-[#D7FFFF]">(2025)</p>
                </div>
              </div>

              <h2
                className={`font-bold text-black bg-[#D7FFFF] ${paperDetail.eventName.length > 30
                  ? "text-3xl md:text-4xl w-[80%]"
                  : "text-5xl md:text-6xl"
                  }`}
              >
                {paperDetail.eventName}
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
                  {paperDetail.date}
                </h1>

                <div className="flex flex-col">
                  <p className="text-2xl font-bold">MARCH</p>
                  <p className="text-2xl font-bold">(2025)</p>
                </div>
              </div>

              <h2
                className={`font-bold text-black ${paperDetail.eventName.length > 15
                  ? "text-3xl md:text-6xl"
                  : "text-5xl md:text-8xl"
                  }`}
              >
                {paperDetail.eventName}
              </h2>
              <div className="flex flex-col gap-1 py-3 ">
                <h3 className="text-xl font-bold">Convenors</h3>

                <div className="flex flex-col gap-2">
                  {[paperDetail.contact1, paperDetail.contact2].map(
                    (contact, index) =>
                      contact && (
                        <div key={index} className="pl-5 mt-2">
                          <p className="font-semibold">
                            {toTitleCase(contact[0])} <br />
                            <span className="flex items-center space-x-2">
                              <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                              <span>{contact[1]}</span>
                            </span>
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  {
                    setShowDetails(true);
                    const targetDiv = document.getElementById("info");
                    targetDiv.scrollIntoView({
                      behavior: "smooth", // Smooth scrolling
                      block: "start", // Align to the top of the viewport
                    });
                  }
                }}
                className="self-start px-4 py-2 text-xs font-light text-white uppercase bg-black lg:font-normal lg:tracking-wider lg:text-sm font-poppins"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right */}

          <div className="h-full hidden lg:flex w-full lg:w-[25%] flex-col justify-between p-4">
            <div className="flex flex-col gap-4">
              {/* Venue */}

              <div className="flex flex-col w-full gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-semibold text-black ">
                    <MdAccessTime />
                  </div>

                  <p className="text-xl font-semibold text-black">
                    {paperDetail.time}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-2xl font-semibold text-black ">
                    <MdOutlineLocationOn />
                  </div>
                  <p className="text-xl font-semibold text-black">
                    {paperDetail.hall}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-4">
                  <p className="text-2xl font-semibold text-gray-600 ">
                    {paperDetail.teamSize !== "1" ? (
                      <AiOutlineTeam size={30} />
                    ) : (
                      <AiOutlineUser size={30} />
                    )}
                  </p>
                  <p className="text-lg text-gray-600 ">
                    {paperDetail.teamSize} Member
                    {paperDetail.teamSize !== 1 ? "s" : ""}
                  </p>
                </div>
                {/* {paperDetail.teamSize !== "1" && (
                  <div>
                    <p className="text-2xl font-semibold tracking-wide text-gray-600">
                      Note
                    </p>
                    <ul className="pl-4 space-y-2 text-gray-700 list-disc">
                      <li>
                        For team events,{" "}
                        <b className="font-semibold">every member</b> of the
                        team is required to register for the event and pay the
                        general registration fee.
                      </li>
                    </ul>
                  </div>
                )} */}
                <div className="mt-10 mb-6 bg-gradient-to-r">
                  <h4 className="text-2xl font-bold text-black">
                    Abstract Submission Deadline : {paperDetail.deadline}{" "}
                    {"March "}
                    2025
                  </h4>
                </div>

                {/* <div className="flex flex-row items-center gap-4">
                  <p className="p-3 text-2xl font-semibold text-gray-600">
                    {paperDetail.teamSize !== "1" ? (
                      <AiOutlineTeam size={30} />
                    ) : (
                      <AiOutlineUser size={30} />
                    )}
                  </p>
                  <p className="mt-1 text-gray-700">
                    {paperDetail.teamSize} Member
                    {paperDetail.teamSize !== 1 ? "s" : ""}
                  </p>
                </div>
                {paperDetail.teamSize !== "1" && (
                  <div>
                    <p className="text-2xl font-semibold tracking-wide text-gray-600">
                      Note
                    </p>
                    <ul className="pl-4 space-y-2 text-gray-700 list-disc">
                      <li>
                        For team events,{" "}
                        <b className="font-semibold">every member</b> of the
                        team is required to register for the event and pay the
                        general registration fee.
                      </li>
                    </ul>
                  </div>
                )} */}
              </div>
            </div>

            {/* Convennors */}

            <div className="flex flex-col self-center gap-2 ">
              <h3 className="text-3xl font-bold">Convenors</h3>

              <div className="flex flex-col gap-2">
                {[paperDetail.contact1, paperDetail.contact2].map(
                  (contact, index) =>
                    contact && (
                      <div key={index} className="mt-2">
                        <p className="font-semibold">
                          {toTitleCase(contact[0])} <br />
                          <span className="flex items-center space-x-2">
                            <IoMdCall className=" hover:text-gray-200 lg:text-[#3c4043] lg:hover:text-[#5f6164] text-xl" />
                            <span>{contact[1]}</span>
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
                {paperDetail.youtubeUrl && (
                  <iframe
                    className="w-full h-[400px] rounded-lg z-30"
                    src={
                      paperDetail.youtubeUrl
                        ? paperDetail.youtubeUrl
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
            <div className="w-full p-8 bg-[#D7FFFF] text-black">
              <div className="flex flex-col items-start justify-between lg:flex-row">
                <div>
                  {/* <h2 className="mt-2 text-lg font-bold">
                    {"( "}
                    {paperDetail.ppid}
                    {" )"}
                  </h2> */}

                  <h3
                    className={`font-bold mt-1 text-black ${paperDetail.eventName.length > 15
                      ? "text-3xl"
                      : "text-5xl"
                      }`}
                  >
                    {paperDetail.eventName}
                  </h3>
                </div>

                <div className="text-3xl font-bold lg:text-right sm:text-left flex flex-col items-end lg:mt-[-1rem]">
                  <div className="hidden items-center sm:mr-8=10 xl:text-right sm:text-left sm:mt-0 mt-2 mr-2 lg:flex">
                    <span className="mr-2 font-bold text-7xl sm:text-left">
                      {paperDetail.date}
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
              <div className="flex items-start w-full gap-2 lg:justify-end">
                <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row">
                  <p className="p-3 text-xl font-semibold text-gray-600 lg:text-2xl">
                    <MdAccessTime />
                  </p>
                  <p className="text-xs font-semibold text-gray-600">
                    {paperDetail.time}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row ">
                  <p className="p-3 text-xl font-semibold text-gray-600 lg:text-2xl">
                    <MdOutlineLocationOn />
                  </p>
                  <p className="text-xs font-semibold text-black">
                    {paperDetail.hall}
                  </p>
                </div>
                <div className="flex flex-col items-center text-center lg:gap-2 lg:text-start lg:flex-row">
                  <p className="p-3 text-xl font-semibold text-gray-600 lg:text-2xl">
                    {paperDetail.teamSize !== "1" ? (
                      <AiOutlineTeam />
                    ) : (
                      <AiOutlineUser />
                    )}
                  </p>
                  <p className="text-xs font-semibold text-gray-700">
                    {paperDetail.teamSize} Member
                    {paperDetail.teamSize !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="pt-4 mt-1 text-gray-700 border-t text-md/6">
                {paperDetail.theme}
              </p>

              <div className="flex flex-col gap-12 mt-4">
                <div className="w-full lg:w-4/5">
                  {/* Abstract Submission and Topics */}
                  <div className="mb-6 bg-gradient-to-r">
                    <h4 className="text-2xl font-bold text-[#3c4043]">
                      Abstract Submission Deadline : {paperDetail.deadline}{" "}
                      {"March "}
                      2025
                    </h4>
                  </div>
                  <div>
                    <h4 className="text-2xl font-semibold text-[#3c4043]">
                      Topics
                    </h4>
                    <div className="text-md text-gray-700">
                      <p className="whitespace-pre-wrap ">
                        {paperDetail.topic}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section (Rules) */}
                {paperDetail.rules && (
                  <div className="w-full lg:w-2/5 xl:border-l sm:border-0 xl:pl-1 sm:pl-1 xl:mt-1 sm:mt-[-3.8rem]">
                    <p className="font-bold text-xl text-[#3c4043] mb-4 w-full">
                      Rules
                    </p>
                    <div className="text-md text-gray-700">
                      <p className="whitespace-pre-wrap text-gray-700  tracking-wide text-justify text-[#3c4043] ">
                        {paperDetail.rules}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {showVideo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="relative w-full max-w-2xl">
                    {paperDetail.youtubeUrl && (
                      <iframe
                        className="w-full h-[400px] rounded-lg z-30"
                        src={
                          paperDetail.youtubeUrl
                            ? paperDetail.youtubeUrl
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
