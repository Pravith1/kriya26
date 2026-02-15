"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@/components/FAQ/faq.css";

const faqData = {
  General: [
    {
      question: "What is KRIYA 2026?",
      answer:
        "KRIYA 2026 is a premier intercollegiate techno fest organized by PSG College of Technology. It features an exciting lineup of technical events, workshops, and competitions.",
    },
    {
      question: "Who can participate in KRIYA 2026?",
      answer:
        "Students from any engineering institution are welcome to participate.",
    },
    {
      question: "What are the dates for KRIYA 2026?",
      answer: "KRIYA 2026 will take place from 13th March to 15th March 2026.",
    },
    {
      question: "How can I stay updated about the event?",
      answer:
        "Stay informed through the official KRIYA 2026 website, social media channels, and email updates.",
    },
  ],
  Registration: [
    {
      question: "How can I register for KRIYA 2026?",
      answer:
        "You can register by visiting the official KRIYA 2026 website and following the registration process.",
    },
    {
      question: "Is registration mandatory to participate in the events?",
      answer:
        "Yes, registration is required to take part in any events or workshops.",
    },
    {
      question: "Can I register as a team for group events?",
      answer:
        "Absolutely! Team registrations are available for applicable events.",
    },
    {
      question: "What is the last date for registration?",
      answer:
        "Registrations are open until event slots are filled.",
    },
  ],
  Workshops: [
    {
      question: "What workshops are available during KRIYA 2026?",
      answer:
        "Workshops cover topics like artificial intelligence, robotics, and more. Detailed information can be found on the official website.",
    },
    {
      question: "Is there an additional fee for attending workshops?",
      answer: "Yes, workshops require a separate registration fee.",
    },
    {
      question: "Will participants receive certificates for workshops?",
      answer:
        "Yes, all workshop attendees will receive participation certificates.",
    },
    {
      question: "Do workshops require prior knowledge?",
      answer:
        "Some workshops may require basic knowledge, which will be specified in their descriptions.",
    },
    {
      question: "Are workshop slots limited?",
      answer:
        "Yes, workshop slots are limited and will be filled on a first-come, first-served basis.",
    },
  ],
  Events: [
    {
      question: "What types of events will be held at KRIYA 2026?",
      answer: "KRIYA 2026 will feature technical competitions and hackathons.",
    },
    {
      question: "Can I participate in multiple events?",
      answer:
        "Yes, you are welcome to participate in multiple events, provided there are no scheduling conflicts.",
    },
    {
      question: "Are there prizes for winners?",
      answer: "Yes, winners will receive cash prizes and certificates.",
    },
    {
      question: "How will I know the event schedule?",
      answer:
        "The event schedule will be shared on the official social media channels.",
    },
    {
      question: "Are there team-based events?",
      answer: "Yes, many events allow or require team participation.",
    },
  ],
  Logistics: [
    {
      question: "Where is KRIYA 2026 being held?",
      answer:
        "KRIYA 2026 will take place at PSG College of Technology, Coimbatore.",
    },
    {
      question: "Will food be available at the venue?",
      answer: "Yes, food stalls will be set up throughout the event.",
    },
    {
      question: "Is accommodation provided for outstation participants?",
      answer:
        "Yes, accommodations can be arranged upon request and separate payment has to be done for the accommodations.",
    },
    {
      question: "Is there parking available at the venue?",
      answer: "Yes, parking facilities are available for all participants.",
    },
  ],
  Refunds: [
    {
      question: "Can I get a refund if I cancel my registration?",
      answer: "No, KRIYA 2026 follows a strict no-refund policy.",
    },
    {
      question: "Are workshop fees refundable?",
      answer:
        "No, workshop fees are non-refundable unless the workshop is canceled by the organizers.",
    },
  ],
};

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-20vh bg-black text-[#EBECF3] flex flex-col items-center px-6 py-20"
      id="section8"
    >
      <div className="w-full lg:w-[60%] flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-zentry animated-word-static text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider mb-4 font-black text-center w-full"
        >
          FREQUENTLY ASKED QUESTIONS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 font-poppins text-sm mb-2 text-center w-full"
        >
          Get the answers you need to navigate our platform with confidence.
        </motion.p>

        {/* Category Buttons */}
        <div className="w-full overflow-x-auto no-scrollbar px-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-4 mb-6 text-xs sm:text-m justify-start md:justify-center mt-5 whitespace-nowrap w-max md:w-full mx-auto"
          >
            {Object.keys(faqData).map((category) => (
              <motion.button
                key={category}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded-full border border-[#3E4250] ${selectedCategory === category ? "bg-blue-500 text-black" : ""
                  }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* FAQ List */}
        <div className="w-full space-y-4 mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {faqData[selectedCategory].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left border border-[#3E4250] rounded-2xl w-full overflow-hidden"
                >
                  <button
                    className="w-full text-left px-6 py-4 flex justify-between items-center"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-lg text-left">{faq.question}</span>
                    <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 text-gray-300 font-poppins text-left"
                      >
                        <div className="pb-4">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
