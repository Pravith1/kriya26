"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AiOutlineUser } from "react-icons/ai";
import { GrTransaction, GrWorkshop } from "react-icons/gr";
import {
  MdEventAvailable,
  MdOutlineCancel,
  MdOutlineEmojiEvents,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { HiOutlinePresentationChartBar } from "react-icons/hi";
import { BsCheck2Circle } from "react-icons/bs";
import {
  fetchRegisteredEvents,
  fetchRegisteredWorkshops,
  fetchRegisteredPapers,
  fetchEvents,
  fetchWorkshops,
  fetchPapers,
  fetchPaymentDetailsByEmail,
  fetchAccomodationDetailsByEmail,
} from "../../../API/call";
import { IoIosArrowForward, IoMdLogOut } from "react-icons/io";
import Link from "next/link";
import { Inter, Playfair_Display, Poppins, DM_Sans } from "next/font/google";
import PdfUploader from "@/components/PdfUploader";
import { QRCodeSVG } from "qrcode.react";

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);
  const [accomodationDetails, setAccomodationDetails] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(null);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const handleDownloadCertificate = async (eventId, uniqueId) => {
    try {
      setCertificateLoading(eventId);

      const response = await fetch(
        `https://kriyabackend.psgtech.ac.in/api/certificate/generate/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kriya_id: uniqueId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download certificate");
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Empty PDF file received.");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${eventId}.pdf`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log("Certificate downloaded successfully");
    } catch (error) {
      alert("Failed to download certificate: " + error.message);
      console.error("Error downloading certificate:", error);
    } finally {
      setCertificateLoading(null);
    }
  };

  // Fetch user-related data when user is available
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch registered events using new authenticated API
        const eventRes = await fetchRegisteredEvents();
        console.log(eventRes.data?.events);
        setEventDetails(eventRes.data?.events || []);

        // Fetch registered workshops using new authenticated API
        const workshopRes = await fetchRegisteredWorkshops();
        // Set workshop details - map to format expected by UI
        const workshopData = workshopRes.data?.workshops || [];
        setPaymentDetails(workshopData.map(w => ({
          type: "WORKSHOP",
          status: "SUCCESS",
          eventId: w.workshopId,
          fee: 0 // Fee not returned from this endpoint
        })));

        // Fetch registered papers using new authenticated API
        const paperRes = await fetchRegisteredPapers();
        setPaperDetails(paperRes.data?.papers || []);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Fetch events, workshops, and papers
  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        // API returns { events: [...] } structure
        const eventsArray = eventData.data?.events || eventData.data || [];
        const formattedEvents = eventsArray.map((event) => ({
          name: event.eventName,
          id: event.eventId,
          date: event.date,
          desc: event.one_line_desc ? event.one_line_desc : event.description,
          category: event.category,
          time: event.timing?.split("to")[0] || "",
        }));
        console.log(formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const getWorkshops = async () => {
      try {
        const workshopData = await fetchWorkshops();
        // API returns { workshops: [...] } structure
        setWorkshops(workshopData.data?.workshops || workshopData.data || []);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      }
    };

    const getPapers = async () => {
      try {
        const paperData = await fetchPapers();
        // API returns { papers: [...] } structure
        setPapers(paperData.data?.papers || paperData.data || []);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    setLoading(true);
    Promise.all([getEvents(), getWorkshops(), getPapers()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // If no user, will redirect (handled in useEffect)
  if (!user) {
    return null;
  }

  return loading ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg font-semibold text-gray-600 animate-pulse">
        Loading profile...
      </p>
    </div>
  ) : (
    <section className="h-screen pt-24 pb-8 overflow-x-hidden overflow-y-scroll lg:pt-0 lg:pb-24 bg-gray-100">
      <div className="hidden lg:block w-full h-36 bg-black"></div>
      <div
        className={`bg-gradient-to-r from-[#5451B6]/5 to-grey-300 bg-grey-300 flex flex-col items-center py-12 text-black lg:px-16 lg:items-start ${poppins.variable}`}
      >
        <div
          className="relative w-48 h-48 bg-black rounded-full lg:-mt-36"
          style={{
            backgroundImage: `url(${user?.profilePhoto || '/assets/default-avatar.png'})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
        </div>
        <div className="bg-grey-300 flex flex-col items-center justify-between w-full lg:flex-row">
          <div>
            <h1
              className={`${playfair.variable} font-playfair px-4 mt-8 text-4xl font-bold text-center text-black lg:text-left lg:px-0 tracking-tight`}
            >
              {user?.name || "User"}
            </h1>
            <h3
              className={`${dmSans.variable} font-dm-sans mt-2 text-sm tracking-widest text-center text-black lg:text-left uppercase`}
            >
              Profile
            </h3>
          </div>
          <PdfUploader
            kriyaId={user?.uniqueId}
            email={user?.email}
            existingIdCardUrl={user?.idCardUrl}
          />
        </div>
      </div>
      {user && (
        <div
          className={`${poppins.variable} font-poppins grid grid-cols-1 gap-16 px-8 text-black bg-gradient-to-r from-[#5451B6]/5 to-grey-300 bg-grey-300 lg:grid-cols-2 lg:px-16 relative`}
        >
          <div className="w-full pr-8">
            <div
              className={`text-black flex items-center w-full space-x-4 ${inter.variable}`}
            >
              <AiOutlineUser className="text-2xl" />
              <h1 className={"text-2xl"}>About</h1>
            </div>
            <div
              className={`grid w-full grid-cols-1 mt-8 space-y-2 gap-y-1 ${inter.variable}`}
            >
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Name"
                content={user.name}
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Unique ID"
                content={user.uniqueId}
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Email"
                content={user.email}
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Phone"
                content={user.phone}
              />
              <TextOutput
                className="w-full grid grid-cols-[100px_1fr] lg:grid-cols-[100px_minmax(0,1fr)]"
                heading="College"
                content={
                  <div className="break-words">{user.college}</div>
                }
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Department"
                content={user.department}
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Year"
                content={`${user.year} Year`}
              />
              <TextOutput
                className="w-full lg:grid-cols-[100px_minmax(400px,1fr)] grid"
                heading="Status"
                content={
                  <span className={`px-2 py-1 rounded text-sm ${user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.verified ? '✓ Verified' : 'Pending Verification'}
                  </span>
                }
              />
            </div>

            {/* QR Code Section */}
            <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
              <p className={`${dmSans.variable} font-dm-sans font-semibold text-black mb-3`}>Your QR Code</p>
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setIsQRExpanded(true)}
              >
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 transition-transform group-hover:scale-105">
                  <QRCodeSVG
                    value={JSON.stringify({ type: "PARTICIPANT", uniqueId: user.uniqueId })}
                    size={120}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 group-hover:text-gray-700">Tap to expand</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 hidden w-px bg-gray-400 lg:block left-1/2 bottom-20"></div>
          <div className="w-full pr-8">
            <div className="flex w-full space-x-4 flex-start">
              <GrTransaction className="text-2xl text-black " />
              <h1 className={"text-2xl"}>Transactions</h1>
            </div>
            <div className="mt-8 space-y-4 max-h-[40vh] overflow-y-auto pr-4">
              {paymentDetails?.length === 0 && (
                <div className="space-y-4">
                  <p className="text-lg">
                    Uh oh! You have&apos;nt made any transactions yet !
                  </p>
                  <Link
                    className="flex items-center px-4 py-2 mt-2 text-sm text-black bg-blue-500 w-fit rounded-xl group"
                    href="/auth/payment?type=GENERAL"
                  >
                    <div className="pr-4">
                      <p className="font-[500]">Unlock the full experience!</p>
                      <p className="font-[500] pb-1">
                        Pay the general registration fee and,
                      </p>
                      <li className="pl-4 text-sm">
                        gain chance to participate in all the exciting events.
                      </li>
                    </div>
                    <IoIosArrowForward
                      className="ml-1 transition-all group-hover:ml-2"
                      size={32}
                    />
                  </Link>
                </div>
              )}
              {paymentDetails?.map((payment, i) => (
                <div className="flex flex-row items-center space-x-4" key={i}>
                  {payment.status === "SUCCESS" ? (
                    <BsCheck2Circle className="text-3xl text-green-700" />
                  ) : (
                    <MdOutlineCancel className="text-3xl text-red-500" />
                  )}
                  <div className="w-full">
                    <div className="flex items-center justify-between text-xs">
                      <p className="">
                        Transaction ID: {payment.transactionId}
                      </p>
                      <div className="flex flex-col items-end">
                        <p className="text-right">
                          {new Date(payment.datetime).toDateString()}
                        </p>
                        <p className="text-right">
                          {
                            new Date(payment.datetime)
                              .toTimeString()
                              .split("GMT")[0]
                          }
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${payment.status === "SUCCESS"
                        ? "text-green-700"
                        : "text-red-500"
                        } flex items-center justify-between`}
                    >
                      <p className="w-3/4 lg:text-lg">
                        {payment.eventId === "-1"
                          ? "General"
                          : "Workshop " + payment.eventId}{" "}
                        registration{" "}
                        {payment.status === "SUCCESS"
                          ? "paid successfully"
                          : "payment unsuccessful"}
                      </p>
                      <p className="lg:text-lg">Rs. {payment.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {paymentDetails?.length !== 0 && !user.generalFeePaid && (
              <Link
                className="flex items-center px-4 py-2 mt-2 text-sm text-black bg-blue-500 w-fit rounded-xl group"
                href="/auth/payment?type=GENERAL"
              >
                <div className="pr-4">
                  <p className="font-[500]">Unlock the full experience!</p>
                  <p className="font-[500] pb-1">
                    Pay the general registration fee and,
                  </p>
                  <li className="pl-4 text-sm">Gain access to the pro show</li>
                  <li className="pl-4 text-sm">
                    Plus the chance to participate in all the exciting events.
                  </li>
                </div>
                <IoIosArrowForward
                  className="ml-1 transition-all group-hover:ml-2"
                  size={32}
                />
              </Link>
            )}

            <div className="flex flex-col w-full mt-10 space-y-5 lg:pr-8">
              <p className="text-lg">
                If you have any problems with the Transactions, Please fill out
                this forms !{" "}
              </p>
              <button
                className="flex items-center justify-center w-24 h-10 text-white bg-black "
                onClick={() =>
                  window.open("https://forms.gle/t7LWz5WXHMqfAwqP9")
                }
              >
                Forms
              </button>
            </div>
          </div>

          <div className="w-full lg:pr-8">
            <div className="flex items-center w-full space-x-4">
              <MdOutlineEmojiEvents className="text-2xl text-black" />
              <h1 className="text-2xl">Registered Events</h1>
            </div>
            <div className="mt-8 space-y-4 max-h-[40vh] overflow-y-auto pr-4">
              {eventDetails?.length === 0 && (
                <div className="space-y-4">
                  <p className="text-lg">
                    Uh oh! You have&apos;nt registered for any events yet !
                  </p>
                  <Link
                    className="flex items-center px-4 py-2 text-sm text-black bg-blue-500 w-fit rounded-xl group"
                    href="/portal/event"
                  >
                    <p className="">Register for events here !</p>
                    <IoIosArrowForward
                      className="ml-1 transition-all group-hover:ml-2"
                      size={16}
                    />
                  </Link>
                </div>
              )}
              {eventDetails?.map((event, index) => (
                <div key={index} className="">
                  {event.eventId !== "EVNT0069" && (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <p className="">
                          Mar{" "}
                          {events.find((i) => i.id === event.eventId)?.date ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between space-x-4">
                        <Link
                          href={`/portal/event/${event.eventId}`}
                          className="lg:text-lg hover:text-blue-400 hover:underline"
                        >
                          {events.find((i) => i.id === event.eventId)?.name ||
                            "Unknown Event"}
                        </Link>
                        <p className="text-sm lg:text-base max-w-[50%]">
                          {events.find((i) => i.id === event.eventId)?.timing ||
                            "Unknown Time"}
                        </p>
                      </div>
                      {(event.attended ||
                        (event?.roundLevel && event.roundLevel > 1)) && (
                          <button
                            onClick={() =>
                              handleDownloadCertificate(
                                event.eventId,
                                user?.uniqueId
                              )
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={certificateLoading === event.eventId}
                          >
                            {certificateLoading === event.eventId
                              ? "Downloading..."
                              : "Download Certificate"}
                          </button>
                        )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center w-full space-x-4">
              <GrWorkshop className="text-2xl text-black " />
              <h1 className="text-2xl">Registered Workshops</h1>
            </div>
            <div className="mt-8 space-y-4 max-h-[40vh] overflow-y-auto pr-4">
              {paymentDetails?.filter(
                (w) => w.type === "WORKSHOP" && w.status === "SUCCESS"
              ).length === 0 && (
                  <div className="space-y-4">
                    <p className="text-lg">
                      Uh oh! You have&apos;nt registered for any workshops yet !
                    </p>
                    <Link
                      className="flex items-center px-4 py-2 text-sm text-black bg-blue-500 rounded-lg shadow-md hover:scale-105 transition-transform w-fit"
                      href="/../#section5"
                    >
                      <p className="">Register for workshops here !</p>
                      <IoIosArrowForward
                        className="ml-1 transition-all group-hover:ml-2"
                        size={16}
                      />
                    </Link>
                  </div>
                )}
              {paymentDetails
                ?.filter((w) => w.type === "WORKSHOP" && w.status === "SUCCESS")
                .map(
                  (workshop, i) =>
                    workshop &&
                    workshops && (
                      <div className="" key={i}>
                        <div className="flex items-center justify-between text-xs">
                          <p className="">Workshop ID: {workshop.eventId}</p>
                          <p className="">
                            Mar{" "}
                            {
                              workshops.find((i) => i.wid === workshop.eventId)
                                ?.date
                            }
                          </p>
                        </div>
                        <div className="flex items-center justify-between space-x-4">
                          <Link
                            href={`/portal/workshop/${workshop.eventId}`}
                            className="w-3/4 lg:text-lg hover:text-blue-400 hover:underline"
                          >
                            {
                              workshops.find((i) => i.wid === workshop.eventId)
                                ?.workName
                            }
                          </Link>
                          <p className="lg:text-lg">Rs. {workshop.fee}</p>
                        </div>
                      </div>
                    )
                )}
            </div>
          </div>
          <div className="flex flex-col w-full mt-10 space-y-5 lg:pr-8">
            <p className="text-lg">
              Join our College Ambassador Program for Kriya 2025, invite friends
              using your unique referral code, and earn exciting rewards!
            </p>
            <button
              className="flex items-center justify-center w-24 h-10 text-white bg-black "
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/e/1FAIpQLScXUP6KEY5Lwk88U6OsFf5SMOYdz6OIQJluQXlj0sbMfvAB3Q/viewform?usp=sharing"
                )
              }
            >
              Forms
            </button>
          </div>

          <div className="w-full mb-8 lg:pr-8">
            <div className="flex items-center w-full space-x-4">
              <HiOutlinePresentationChartBar className="text-2xl text-black" />
              <h1 className="text-2xl">Registered Paper Presentations</h1>
            </div>
            <div className="mt-8 space-y-4 max-h-[40vh] overflow-y-auto pr-4">
              {paperDetails?.length === 0 && (
                <div className="space-y-4">
                  <p className="text-lg">
                    Uh oh! You have&apos;nt registered for any paper
                    presentations yet !
                  </p>
                  <Link
                    className="flex items-center px-4 py-2 text-sm text-black bg-blue-500 w-fit rounded-xl group"
                    href="/../#section4"
                  >
                    <p className="">Register for paper presentations here !</p>
                    <IoIosArrowForward
                      className="ml-1 transition-all group-hover:ml-2"
                      size={16}
                    />
                  </Link>
                </div>
              )}
              {paperDetails?.map((paper, i) => {
                const matchedPaper = papers.find(
                  (p) => p.ppid === paper.paperId
                );

                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs">
                      <p>Paper Presentation ID: {paper.paperId}</p>
                      <p>Mar {matchedPaper?.date}</p>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <Link
                        href={`/portal/paper/${paper.paperId}`}
                        className="lg:text-lg hover:text-blue-400 hover:underline"
                      >
                        {matchedPaper?.eventName}
                      </Link>
                      <p className="text-sm lg:text-base max-w-[50%]">
                        {matchedPaper?.time}
                      </p>
                    </div>

                    {paper?.attendance?.attended && (
                      <button
                        onClick={() =>
                          handleDownloadCertificate(
                            paper.paperId,
                            user?.uniqueId
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
                        disabled={certificateLoading === paper.paperId}
                      >
                        {certificateLoading === paper.paperId
                          ? "Downloading..."
                          : "Download Certificate"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="flex flex-row w-full py-4 lg:hidden"
            onClick={handleLogout}
          >
            <IoMdLogOut size={24} className="mr-4" />
            Logout
          </button>
        </div>
      )}

      {/* QR EXPANSION OVERLAY */}
      {isQRExpanded && (
        <div
          className="fixed inset-0 bg-black/90 z-[2000] flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsQRExpanded(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl flex flex-col items-center gap-5 max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <QRCodeSVG
              value={JSON.stringify({ type: "PARTICIPANT", uniqueId: user?.uniqueId })}
              size={280}
            />
            <div className="text-center">
              <p className="text-black font-semibold text-lg">{user?.name}</p>
              <p className="text-gray-600 text-sm">{user?.uniqueId}</p>
            </div>
            <p className="text-gray-500 text-sm">Tap outside to close</p>
          </div>
        </div>
      )}
    </section>
  );
};

const TextOutput = ({ heading, content, className = "" }) => {
  return (
    <div className={`${className}`}>
      <p className={`${dmSans.variable} font-dm-sans font-semibold text-black`}>
        {heading}
      </p>
      <p className={`${inter.variable} font-inter text-black`}>{content}</p>
    </div>
  );
};

export default Profile;
