"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IoMdCall, IoLogoWhatsapp } from "react-icons/io";
import { MdAccessTime, MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineTeam, AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import {
	fetchPaperById,
	fetchPaperDetailsByEmail,
	fetchPaperRegister,
	fetchUserByEmail,
} from "../../../../API/call";
import { SiGmail } from "react-icons/si";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import particleOptions from "../../../../../ParticleOptions";

const Paper = ({ params }) => {
	const router = useRouter();
	const { id } = params;
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [generalPayment, setGeneralPayment] = useState(false);
	const [userPaperDetails, setUserPaperDetails] = useState([]);

	const particlesInit = useCallback(async (engine) => {

		await loadSlim(engine);
	}, []);

	const particlesLoaded = (container) => {
	};

	const toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const [paperDetail, setPaperDetail] = useState(null);

	// useEffect(() => {
	// 	fetchPaperDetailsByEmail(localStorage.getItem("email")).then((res) => {
	// 		console.log(res.data);
	// 		setUserPaperDetails(res.data);
	// 	});
	// }, []);

	// const handleRegister = () => {
	// 	if (!isLoggedIn) {
	// 		router.push("/auth?type=signup");
	// 	} else if (!generalPayment) {
	// 		router.push("/auth/payment?type=GENERAL");
	// 	} else {
	// 		fetchPaperRegister({
	// 			email: localStorage.getItem("email"),
	// 			paperId: id,
	// 		}).then((res) => {
	// 			console.log(res);
	// 			window.location.reload();
	// 		});
	// 	}
	// };

	useEffect(() => {
		setPaperDetail(fetchPaperById(id));
	}, [id]);

	// useEffect(() => {
	// 	fetchUserByEmail(localStorage.getItem("email")).then((res) => {
	// 		console.log(res.data.user);
	// 		setIsLoggedIn(true);
	// 		setGeneralPayment(res?.data?.user?.isPaid);
	// 	});
	// }, []);

	return !paperDetail ? (
		<section className="w-full h-screen py-12 overflow-y-scroll lg:px-16 font-poppins pt-36 lg:pt-12">
			<p className="px-8 text-xl text-white">Loading...</p>
		</section>
	) : (
		<section className="w-full h-screen py-12 overflow-y-scroll bg-black lg:px-16 font-poppins pt-28 lg:pt-12">
			<Particles
				id="tsparticles"
				init={particlesInit}
				loaded={particlesLoaded}
				className="absolute top-0 left-0"
				height="100vh"
				width="100vh"
				options={particleOptions}
			/>
			<div className="w-fit">
				<h1 className="px-8 text-4xl font-semibold text-white lg:px-0">
					{toTitleCase(paperDetail.eventName)}
				</h1>
				<div className="w-[60%] lg:w-[80%] ml-8 lg:ml-0 mt-2 h-[4px] bg-gradient-to-r rounded-[2px] from-[#3b82f6] to-[#8b5cf6]"></div>
			</div>

			<div className="flex flex-col w-full gap-4 my-8 text-black lg:flex-row lg:px-0 ">
				<div className="flex flex-col justify-between w-full space-y-5 lg:w-3/5 ">
					<div className="bg-white text-[#3c4043] lg:rounded-3xl lg:px-0 space-y-8 relative py-8 px-8 h-full">
						<p className="text-2xl text-left pl-10 font-semibold tracking-wider text-[#3c4043] lg:text-[#3c4043]">
							Theme
						</p>
						<p className=" list-disc text-left pl-10 lg:text-lg text-[#3c4043] lg:text-[#3c4043] text-lg space-y-2 lg:pr-16">
							{paperDetail.theme}
						</p>
					</div>

					<div className="bg-white text-[#3c4043] lg:rounded-3xl lg:px-0 space-y-8 relative py-8 px-8 h-full">
						<p className="text-2xl text-left pl-10 font-semibold tracking-wider text-[#3c4043] lg:text-[#3c4043]">
							Topics
						</p>
						<ul className=" list-disc text-left pl-10 lg:text-lg text-[#3c4043] lg:text-[#3c4043]  space-y-2 lg:pr-16">
							{paperDetail.topic.split("\n").map((item, index) => (
								<li
									key={index}
									className={`${item.slice(-1) === ":"
										? "text-xl font-semibold -ml-2 py-2"
										: "text-lg"
										}`}
								>
									{item}
								</li>
							))}
						</ul>
					</div>

					<div className="relative px-8 py-8 space-y-8 bg-white lg:rounded-3xl lg:px-0 ">
						<p className="text-2xl font-semibold tracking-wider text-[#3c4043] pl-10">
							Rules
						</p>

						{paperDetail.ppid !== "PRPN0004" ? (
							<ul className="list-disc text-base lg:text-base text-[#3c4043] pl-10 space-y-2 lg:pr-16">
								<li>
									All Abstracts to be submitted ELECTRONICALLY ONLY via the tab
									provided below
								</li>
								<li>
									Preferable structure for paper:
									<ul className="pl-8 my-2 list-disc">
										<li>Title</li>
										<li>Presenting Author (to be underlined)</li>
										<li>Co-Author(s)</li>
										<li>Institute</li>
										<li>Designation</li>
										<li>Results</li>
										<li>Discussion</li>
										<li>Conclusion</li>
									</ul>
								</li>
								<li>
									All abstracts to be submitted in two pages in portrait
									orientation in PDF format only.
								</li>
								<li>
									Participants shall select a topic and present the paper only
									from the given topics.
								</li>
								<li>
									Hyperlinks, animation images or videos are not permitted.
								</li>
								<li>
									Authors who want to present a paper need to pay general
									registration fees.{" "}
									{paperDetail.ppid !== "PRPN0002" &&
										"Maximum of 3 authors are allowed to present"}
									. If any other author is willing to attend the presentation,
									they must have paid the general registration fee.
								</li>
								<li
									className={paperDetail.ppid === "PRPN0002" ? "hidden" : " "}
								>
									Participants of a team must be from the same college.
								</li>
								<li>
									Abstracts of papers will be scrutinized for their presentation
									merit by the committee. The committee will have the right to
									change the pattern of presentation (Papers) and acceptance or
									rejection on merits of the abstract.
								</li>
								<li>
									Last date of receipt of Abstracts is 15th February 2024.
								</li>
								<li>
									All presenters are mandated to register for the conference and
									to be physically present during the designated paper
									presentation viewing period
								</li>
							</ul>
						) : (
							<ul className="list-disc text-base lg:text-base text-[#3c4043] pl-10 space-y-2 lg:pr-16">
								<li>
									கீழே கொடுக்கப்பட்டுள்ள டேப் மூலம் அனைத்து சுருக்கங்களும்
									மின்னணு முறையில் மட்டுமே சமர்ப்பிக்கப்பட வேண்டும்.
								</li>
								<li>
									ஆய்வு கட்டுரைக்ககான விருப்பமான அமைப்பு:
									<ul className="pl-8 my-2 list-disc">
										<li>தலைப்பு:</li>
										<li>சமர்ப்பிக்கும் பங்கேற்பாளர்(அடிக்கோடிட வேண்டும்)</li>
										<li>இணை பங்கேற்பாளர் (கள்)</li>
										<li>கல்வி நிறுவனம்</li>
										<li>பங்கேற்பாளர்களின் துறை</li>
										<li>அறிமுகம்</li>
										<li>முடிவுகள்</li>
										<li>கலந்துரையாடல்</li>
										<li>முடிவுரை</li>
									</ul>
								</li>
								<li>
									அனைத்து சுருக்கங்களும் இரண்டு பக்கங்களில் போர்ட்ரெய்ட்
									நோக்குநிலையில் PDF வடிவத்தில் மட்டுமே சமர்ப்பிக்கப்பட
									வேண்டும்.(அதிகபட்சம் இரண்டு பக்கங்கள்).
								</li>
								<li>
									ஹைப்பர்லிங்க்கள், அனிமேஷன் படங்கள் அல்லது வீடியோக்கள்
									அனுமதிக்கப்படமாட்டாது.
								</li>
								<li>
									கட்டுரையை சமர்ப்பிக்க விரும்பும் பங்கேற்பாளர்கள் பொது பதிவுக்
									கட்டணத்தைச் செலுத்த வேண்டும். 1 பங்கேற்பாளர் மட்டுமே முன்வைக்க
									அனுமதிக்கப்படுகிறது. இணை பங்கேற்பாளர்கள் விளக்கக்காட்சியில்
									கலந்து கொள்ளத் தயாராக இருந்தால், அவர்கள் பொது பதிவு கட்டணம்
									செலுத்தியிருக்க வேண்டும்.
								</li>
								<li>
									பங்கேற்பாளர், கொடுக்கப்பட்ட தலைப்பில் இருந்து மட்டுமே
									தலைப்பைத் தேர்ந்தெடுத்து கட்டுரையை சமர்ப்பிக்க வேண்டும்.
								</li>
								<li>
									தாள்களின் சுருக்கங்கள் ஆசிரியர் குழுவால் ஆராயப்படும். ஆசிரியர்
									குழுவின் உடைய பரிந்துரையே இறுதியானது.
								</li>
								<li>
									கட்டுரையை சமர்ப்பிப்பதற்கான கடைசி நாள்: 15 பிப்ரவரி 2024
								</li>
								<li>
									பங்கேற்பாளர்கள் அனைவரும் கட்டாயம் முன்பதிவு செய்திருக்க
									வேண்டும் மற்றும் விளக்கக் காட்சியை சமர்ப்பிக்கும் போது நேரில்
									வர வேண்டும்.
								</li>
							</ul>
						)}
					</div>
				</div>

				<div className="flex flex-col w-full space-y-4 lg:w-2/5">
					{!userPaperDetails.find((i) => i.paperId === id) ? (
						<button
							className="flex justify-center p-8 space-y-4 text-center bg-white lg:rounded-3xl lg:p-12 lg:text-left lg:justify-start"
							onClick={() => {
								alert("Registrations Closed!");
							}}
						>
							<span className="text-3xl lg:text-3xl font-semibold tracking-wide bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
								{/* {"Register Here!"} */}
								{"Registrations Closed!"}
							</span>
						</button>
					) : (
						<div className="flex flex-row w-full gap-4 lg:px-0">
							<div className="bg-[#ffffff] w-full lg:rounded-3xl p-8 lg:p-12 space-y-4">
								<p className="text-xl font-semibold tracking-wider text-[#3c4043]">
									Submit the abstract to the mail ID
								</p>
								<p className="text-base text-[#3c4043] space-y-4">
									{paperDetail.eventMail.map((item, index) => (
										<div className="flex flex-row items-center w-full space-x-4 group" key={index}>
											<SiGmail className="text-2xl group-hover:text-black" />
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
								</p>
							</div>
						</div>
					)}

					<div className="lg:bg-[#ffffff] lg:rounded-3xl p-8 lg:p-12 space-y-6 h-full">
						<p className="text-2xl font-semibold tracking-wide text-white lg:text-[#3c4043]">
							Abstract Submission Deadline
						</p>

						<div className="flex flex-row items-center gap-4 lg:gap-4">
							<p className="text-6xl lg:text-6xl font-semibold tracking-wide text-white lg:text-[#3c4043]">
								{paperDetail.deadline}
							</p>
							<div className="flex flex-col">
								<p className="text-lg font-semibold tracking-wide text-white lg:text-[#3c4043]">
									February
								</p>
								<p className="text-lg font-semibold tracking-wide text-white lg:text-[#3c4043]">
									2024
								</p>
							</div>
						</div>

						{/* <div>
              <p className="text-2xl font-semibold tracking-wide py-4 text-white lg:text-[#3c4043]">
                Note
              </p>
              <ul className="list-disc text-base text-white lg:text-[#3c4043] pl-4 space-y-2">
                <li>For teams, only <b className="font-semibold">one</b> team member needs to pay the general registration fee. (This is applicable only for paper presentations.)</li>
              </ul>
            </div> */}
					</div>
				</div>
			</div>

			<div className="flex flex-col space-x-5 lg:flex-row">
				<div className="bg-[#ffffff] w-full lg:rounded-3xl p-8 lg:p-12 space-y-4 ">
					<p className="text-2xl font-semibold tracking-wide text-[#3c4043] pb-4">
						Presentation Details
					</p>

					<div className="flex flex-row items-center gap-4 lg:gap-4">
						<p className="text-6xl lg:text-6xl font-semibold tracking-wide text-[#3c4043]">
							{paperDetail.date}
						</p>
						<div className="flex flex-col">
							<p className="text-lg font-semibold tracking-wide text-[#3c4043]">
								February
							</p>
							<p className="text-lg font-semibold tracking-wide text-[#3c4043]">
								2024
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center gap-4 lg:gap-6">
						<p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
							<MdAccessTime />
						</p>
						<div className="flex flex-col pl-2">
							<p className="text-base lg:text-lg font-semibold tracking-wider text-[#3c4043]">
								{paperDetail.time}
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center gap-4 lg:gap-6">
						<p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
							<MdOutlineLocationOn />
						</p>
						<div className="flex flex-col pl-2">
							<p
								className={`text-base lg:text-lg font-semibold tracking-wider text-[#3c4043]`}
							>
								{paperDetail.hall}
							</p>
						</div>
					</div>
					{/* <div className="flex flex-row items-center gap-4 lg:gap-6">
                <p className="text-4xl font-semibold tracking-wide text-[#3c4043] p-3">
                  {paperDetail.teamSize !== "1" ? <AiOutlineTeam /> : <AiOutlineUser />}
                </p>
                <div className="flex flex-col pl-2">
                  <p className="text-base lg:text-lg font-semibold tracking-wide text-[#3c4043]">
                    {paperDetail.teamSize} Member{paperDetail.teamSize !== "1" ? "s" : ""}
                  </p>
                </div>
              </div> */}
				</div>

				<div className="lg:bg-[#ffffff] w-full h-auto lg:rounded-3xl p-8 space-y-5">
					<p className="text-3xl lg:text-3xl font-semibold tracking-wide text-white lg:text-[#3c4043]">
						Contact
					</p>

					<div className="flex flex-row items-center justify-between">
						<div className="w-1/2 lg:w-1/2">
							<p className="text-base lg:text-base font-semibold tracking-wide text-white lg:text-[#3c4043]">
								{toTitleCase(paperDetail.contact1[0])}
							</p>
							<p className="text-base lg:text-base tracking-wider text-white lg:text-[#3c4043]">
								{paperDetail.contact1[1]}
							</p>
						</div>
						<div className="space-x-8">
							<button
								onClick={() => {
									window.open(`tel:${paperDetail.contact1[1]}`);
								}}
							>
								<IoMdCall className="hover:text-gray-200 text-white lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
							</button>
							<button
								onClick={() => {
									window.open(`https://wa.me/${paperDetail.contact1[1]}`);
								}}
							>
								<IoLogoWhatsapp className="hover:text-gray-200 text-white lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
							</button>
						</div>
					</div>

					<div className="flex flex-row items-center justify-between">
						<div className="w-1/2 lg:w-1/2">
							<p className="text-base lg:text-base font-semibold tracking-wide text-white lg:text-[#3c4043]">
								{toTitleCase(paperDetail.contact2[0])}
							</p>
							<p className="text-base lg:text-base tracking-wider text-white lg:text-[#3c4043]">
								{paperDetail.contact2[1]}
							</p>
						</div>
						<div className="space-x-8">
							<button
								onClick={() => {
									window.open(`tel:${paperDetail.contact2[1]}`);
								}}
							>
								<IoMdCall className="hover:text-gray-200 text-white lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
							</button>
							<button
								onClick={() => {
									window.open(`https://wa.me/${paperDetail.contact2[1]}`);
								}}
							>
								<IoLogoWhatsapp className="hover:text-gray-200 text-white lg:text-[#3c4043] lg:hover:text-[#5f6164] text-3xl" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Paper;
