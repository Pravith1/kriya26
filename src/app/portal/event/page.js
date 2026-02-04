"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { eventService } from "../../../services/eventservice";

const categoryColors = {
  "Core Engineering": "from-blue-500 to-cyan-500",
  "Bot": "from-purple-500 to-pink-500",
  "Coding": "from-green-500 to-emerald-500",
  "Fashion Technology": "from-pink-500 to-rose-500",
  "Science & Technology": "from-indigo-500 to-blue-500",
  "Quiz": "from-yellow-500 to-orange-500",
  "Other": "from-gray-500 to-slate-500",
};

const EventCard = ({ event }) => {
  const router = useRouter();
  const gradient = categoryColors[event.category] || categoryColors["Other"];

  return (
    <div
      onClick={() => router.push(`/portal/event/${event.id}`)}
      className="group relative overflow-hidden rounded-xl bg-black border border-white/10 p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-white/30"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="special-font text-xl md:text-2xl font-black uppercase text-white">
            {event.name}
          </h3>
          {event.date && (
            <span className="text-white/70 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
              {event.date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradient} text-white`}>
            {event.category}
          </span>
          {event.time && (
            <span className="text-gray-400 text-sm">
              🕐 {event.time}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
          <span className="text-sm font-semibold">VIEW DETAILS</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
    </div>
  );
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();

        let eventsData = [];
        if (Array.isArray(response)) {
          eventsData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          eventsData = response.data;
        } else if (response?.events && Array.isArray(response.events)) {
          eventsData = response.events;
        }

        const formattedEvents = (eventsData || [])
          .map((event) => ({
            name: event.eventName,
            id: event.eventId,
            date: event.date ? new Date(event.date).getDate().toString() : "",
            category: event.category || "Other",
            time: event.timing ? event.timing.split("-")[0] : "",
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category));
    return ["All", ...Array.from(cats)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.date.includes(searchTerm) ||
        event.time.includes(searchTerm);

      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="special-font text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-4 text-center">
            <b>E</b>vents
          </h1>
          <p className="text-gray-400 text-center text-lg mb-8">
            Explore all technical events across categories
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search events by name, category, date, or time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white/40 backdrop-blur-md transition-all"
            />
          </div>

          {/* Category Filters */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg font-semibold text-white animate-pulse">
              Loading events...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-white text-xl">
              {searchTerm || selectedCategory !== "All"
                ? "No events match your search"
                : "No events found"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;
