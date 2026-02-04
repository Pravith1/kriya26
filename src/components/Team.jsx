"use client";

import React, { useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const TeamMember = ({ img, name, role }) => {
    return (
        <div className="group relative flex w-full flex-col items-center justify-center p-4 sm:w-1/2 md:w-1/3 lg:w-1/5">
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border-2 border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:border-yellow-300">
                <img
                    src={img}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="mt-4 text-center">
                <h3 className="font-zentry text-2xl uppercase text-blue-50 transition-colors duration-300 group-hover:text-yellow-300">
                    {name}
                </h3>
                <p className="font-general text-sm uppercase tracking-wide text-blue-50/70">
                    {role}
                </p>
            </div>
        </div>
    );
};

// Small team member card for department grids
const SmallTeamCard = ({ img, name, role }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
        >
            {/* Image First */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 mb-2">
                <img
                    src={img}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
            </div>

            {/* Name and Role Below - Fixed Height Container */}
            <div className="text-center w-full min-h-[44px] flex flex-col items-center justify-start">
                {role && (
                    <span className="inline-block mb-1 px-2 py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-wide bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                        {role}
                    </span>
                )}
                <p className="font-circular-web text-xs md:text-sm text-white font-medium line-clamp-2 px-1">
                    {name}
                </p>
            </div>
        </motion.div>
    );
};

// Department carousel with vertical grid
const DepartmentCarousel = ({ departments }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % departments.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + departments.length) % departments.length);
    };

    const currentDept = departments[currentIndex];

    return (
        <div className="relative">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div>
                    <h2 className="font-zentry text-4xl md:text-5xl lg:text-6xl uppercase text-blue-50">
                        {currentDept.title}
                    </h2>
                    <p className="font-general text-sm text-blue-50/60 mt-2">
                        {currentDept.members.length} Members
                    </p>
                </div>

                {/* Navigation Buttons - Top Right */}
                <div className="flex gap-3">
                    <button
                        onClick={goToPrev}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:scale-110 transition-all"
                    >
                        <HiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/30 hover:scale-110 transition-all"
                    >
                        <HiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Department Indicator Dots */}
            <div className="flex justify-center gap-2 mb-8">
                {departments.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`rounded-full transition-all ${currentIndex === index
                            ? 'w-8 h-2 bg-blue-400'
                            : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Vertical Grid of Members */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-4 px-4"
                >
                    {currentDept.members.map((member, index) => (
                        <SmallTeamCard key={index} {...member} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const Team = () => {
    // First 5 core team members (keep as-is)
    const coreMembers = [
        { img: "/img/gallery-1.webp", name: "Arjun Reddy", role: "Lead Organizer" },
        { img: "/img/gallery-2.webp", name: "Priya Sharma", role: "Tech Head" },
        { img: "/img/gallery-3.webp", name: "Vikram Singh", role: "Design Lead" },
        { img: "/img/gallery-4.webp", name: "Ananya Patel", role: "Event Coordinator" },
        { img: "/img/gallery-5.webp", name: "Rohan Kumar", role: "Marketing Head" },
    ];

    // Generate placeholder members for each department
    const generateMembers = (count, baseName) => {
        return Array.from({ length: count }, (_, i) => ({
            img: `/img/gallery-${(i % 5) + 1}.webp`,
            name: `${baseName} ${i + 1}`,
            role: i < 3 ? (i === 0 ? "Team Lead" : "Co-Lead") : undefined // First 3 members have roles
        }));
    };

    const departments = [
        { title: "Tech Team", members: generateMembers(30, "Tech Member") },
        { title: "PR Team", members: generateMembers(25, "PR Member") },
        { title: "ERM Team", members: generateMembers(35, "ERM Member") },
        { title: "Design Team", members: generateMembers(28, "Design Member") },
        { title: "Content Team", members: generateMembers(32, "Content Member") },
        { title: "Operations Team", members: generateMembers(40, "Operations Member") },
        { title: "Finance Team", members: generateMembers(20, "Finance Member") },
    ];

    return (
        <section className="relative min-h-screen w-full bg-black py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-16 flex w-full flex-col items-center justify-center text-center">
                    <p className="font-general text-sm uppercase text-blue-50">
                        The Minds Behind
                    </p>
                    <AnimatedTitle
                        title="m<b>e</b>et our <br /> amazing <b>t</b>eam"
                        containerClass="mt-5 !text-white text-center"
                    />
                </div>

                {/* Core Team - First 5 members */}
                <div className="flex flex-wrap justify-center gap-8 lg:gap-0 mb-20">
                    {coreMembers.map((member, index) => (
                        <TeamMember key={index} {...member} />
                    ))}
                </div>

                {/* Divider */}
                <div className="my-20 border-t border-white/10" />

                {/* Department Section Title */}
                <div className="mb-12 text-center">
                    <h2 className="font-zentry text-4xl md:text-5xl uppercase text-blue-50">
                        Our <span className="text-yellow-300">Departments</span>
                    </h2>
                    <p className="font-general text-sm text-blue-50/60 mt-4">
                        Use the arrows to explore different teams
                    </p>
                </div>

                {/* Department Carousel */}
                <DepartmentCarousel departments={departments} />
            </div>
        </section>
    );
};

export default Team;
