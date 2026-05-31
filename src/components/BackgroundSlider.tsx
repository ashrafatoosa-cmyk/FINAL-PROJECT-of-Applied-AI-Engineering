"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=2400&q=90",
    headline: "Simplified Moving with AI Scanning.",
    subline: "Snap a photo. Get an instant quote. It's that easy.",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90",
    headline: "Precision. Care. Delivered.",
    subline: "White-Glove Service for Every Home",
  },
  {
    image: "/images/pack-1.png",
    headline: "Packing with care.",
    subline: "Our team protects every item for the move.",
  },
  {
    image: "/images/pack-2.png",
    headline: "Expert teams on the job.",
    subline: "Efficient loading and safe transport.",
  },
  {
    image: "/images/bg-1.png",
    headline: "We move, you relax.",
    subline: "Professional movers for stress-free relocations.",
  },
];

export default function BackgroundSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  }, [index]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[index].image})` }}
          />

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/50 to-brand-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-transparent to-brand-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.25)_100%)]" />

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 200px 60px rgba(2,6,23,0.3)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Typography Overlay */}
      <div className="absolute inset-0 z-10 flex items-start pointer-events-none">
        <div className="w-full px-5 sm:px-8 lg:px-24 pt-10 sm:pt-12 lg:pt-16">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="space-y-6"
              >
                <h2
                  className="text-white text-2xl sm:text-3xl lg:text-5xl font-display font-black tracking-tighter leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                  style={{ textShadow: "0 2px 40px rgba(0,0,0,0.2)" }}
                >
                  {slides[index].headline}
                </h2>
                <p className="text-white/70 text-xs sm:text-sm lg:text-base font-medium tracking-wide max-w-lg">
                  {slides[index].subline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile for cleaner UI */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full items-center justify-center text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/25 transition-all duration-500 group cursor-pointer"
      >
        <ChevronLeft
          size={24}
          strokeWidth={2}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full items-center justify-center text-white/50 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/25 transition-all duration-500 group cursor-pointer"
      >
        <ChevronRight
          size={24}
          strokeWidth={2}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>

      {/* Pagination Lines */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative cursor-pointer p-2"
          >
            <div
              className={`h-[4px] rounded-full transition-all duration-700 ease-out ${
                i === index
                  ? "w-12 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                  : "w-6 bg-white/30 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter (subtle) */}
      <div className="absolute bottom-10 right-6 lg:right-10 z-20 text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">
        <span className="text-white/60">{String(index + 1).padStart(2, "0")}</span>
        <span className="mx-1.5">/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
