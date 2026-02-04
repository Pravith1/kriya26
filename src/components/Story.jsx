"use client"
import gsap from "gsap";
import { useRef, useState, useCallback, useEffect } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";

// Slides data - image and title only
const STORY_SLIDES = [
  {
    id: 1,
    image: "/img/entrance.webp",
    alt: "Event 1",
    title: "Git Wars",
  },
  {
    id: 2,
    image: "/img/entrance.webp",
    alt: "Event 2",
    title: "Nexus",
  },
  {
    id: 3,
    image: "/img/entrance.webp",
    alt: "Event 3",
    title: "Forge Your Destiny",
  },
];

const FloatingImage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsRef = useRef([]);
  const containerRef = useRef(null);

  // Touch handling for mobile swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Get stack position for each card
  const getStackPosition = useCallback((cardIndex) => {
    const diff = cardIndex - currentIndex;
    const total = STORY_SLIDES.length;

    // Normalize for circular navigation
    let pos = diff;
    if (diff > total / 2) pos = diff - total;
    if (diff < -total / 2) pos = diff + total;

    return pos;
  }, [currentIndex]);

  // Update card positions
  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const pos = getStackPosition(index);

      // Only show cards at position 0, 1, 2 (current and 2 behind)
      if (pos < 0 || pos > 2) {
        gsap.set(card, {
          opacity: 0,
          scale: 0.8,
          y: 60,
          zIndex: 0,
          pointerEvents: 'none',
        });
        return;
      }

      // Stack effect: behind cards scale down and move up
      const scale = 1 - (pos * 0.06);
      const yOffset = pos * -25;
      const zIndex = 30 - pos * 10;
      const opacity = 1 - (pos * 0.25);

      gsap.to(card, {
        scale,
        y: yOffset,
        zIndex,
        opacity,
        duration: 0.5,
        ease: "power2.out",
        pointerEvents: pos === 0 ? 'auto' : 'none',
      });
    });
  }, [currentIndex, getStackPosition]);

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const currentCard = cardsRef.current[currentIndex];

    // Animate current card out to the left
    gsap.to(currentCard, {
      x: -300,
      opacity: 0,
      rotateY: -15,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        // Reset position for when it comes back
        gsap.set(currentCard, { x: 0, rotateY: 0 });
        setCurrentIndex((prev) => (prev + 1) % STORY_SLIDES.length);
        setIsAnimating(false);
      }
    });
  }, [currentIndex, isAnimating]);

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    const prevIndex = (currentIndex - 1 + STORY_SLIDES.length) % STORY_SLIDES.length;
    const prevCard = cardsRef.current[prevIndex];

    // Position previous card off-screen left
    gsap.set(prevCard, { x: -300, opacity: 0, rotateY: -15, zIndex: 40 });

    // Animate it in
    gsap.to(prevCard, {
      x: 0,
      opacity: 1,
      rotateY: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        setCurrentIndex(prevIndex);
        setIsAnimating(false);
      }
    });
  }, [currentIndex, isAnimating]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const currentSlide = STORY_SLIDES[currentIndex];

  return (
    <div
      id="story"
      className="min-h-dvh w-full bg-black text-blue-75 overflow-x-hidden overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider mb-4 font-bold text-white">
          Flagship Events
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title={currentSlide.title}
            containerClass="mt-5 pointer-events-none relative z-50 text-center mb-6"
          />

          {/* Card Stack Container */}
          <div
            ref={containerRef}
            className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            {/* Card Stack */}
            <div className="relative w-[85vw] md:w-[60vw] lg:w-[50vw] h-full">
              {STORY_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="absolute inset-0 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Desktop only */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hidden md:flex items-center justify-center text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md hidden md:flex items-center justify-center text-white border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Slide Indicators - Mobile only */}
          <div className="flex md:hidden justify-center gap-3 mt-4">
            {STORY_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => !isAnimating && setCurrentIndex(index)}
                disabled={isAnimating}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex ? 'bg-white w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex w-full justify-center">
          <Button
            id="realm-btn"
            title="View Details"
            containerClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;