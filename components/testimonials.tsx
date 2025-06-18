"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { Locale } from "@/lib/i18n-config";
import GlassCard from "./ui/glass-card";
import ScrollReveal from "./ui/scroll-reveal";

interface TestimonialsProps {
  lang: Locale;
}

interface Testimonial {
  quote: string;
  author: string;
  etoile: number;
  image?: string;
}

interface Dictionary {
  title: string| "Témoignages" | "Testimonials";
  subtitle: string| "Ce que nos clients disent" | "What our clients say";
  items: Testimonial[]| Array<{ quote: string; author: string; etoile: number; image?: string; }>;
}

export default function Testimonials({ lang }: TestimonialsProps) {
  const isRtl = lang === "ar";
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch(`/api/testimonials?lang=${lang}`);
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        setDictionary(data);
      } catch (err) {
        setError("Error loading testimonials");
        console.error(err);
      }
    }

    fetchTestimonials();
  }, [lang]);

  // Auto-rotation
  useEffect(() => {
    if (!dictionary || dictionary.items.length === 0) return;

    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent(current === dictionary.items.length - 1 ? 0 : current + 1);
    }, 8000);
    return () => clearTimeout(timer);
  }, [current, dictionary]);

  // Render loading state
  if (!dictionary && !error) {
    return (
      <div className="container mx-auto px-4">
        <Skeleton height={40} width={300} className="mb-4 mx-auto" />
        <Skeleton height={20} width={500} className="mb-16 mx-auto" />
        <div className="relative mx-auto max-w-4xl">
          <Skeleton height={300} className="rounded-2xl" />
          <div className="mt-8 flex justify-center space-x-4">
            <Skeleton circle height={48} width={48} />
            <Skeleton height={12} width={100} />
            <Skeleton circle height={48} width={48} />
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const length = dictionary?.items?.length ?? 0;

  const renderStars = (count: number) => {
    const totalStars = 5;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalStars }, (_, i) => (
          <motion.svg
            key={i}
            className={`h-5 w-5 ${i < count ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.07 10.101c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  // Animation variants for transition
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
      },
    }),
  };

  // Function to get initials from a name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Function to generate a color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-24 text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className={`mb-4 text-3xl font-bold text-white md:text-4xl ${isRtl ? "font-arabic" : ""}`}>
            <span className="relative">
              {dictionary?.title}
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-gold to-amber-300"></span>
            </span>
          </h2>
          <p className={`text-lg text-gray-300 ${isRtl ? "font-arabic" : ""}`}>{dictionary?.subtitle}</p>
        </ScrollReveal>

        <div className="relative mx-auto max-w-4xl">
          <GlassCard className="overflow-hidden rounded-2xl p-0" intensity="light">
            <div className="relative h-[300px] overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col"
                >
                  <div className={`flex flex-col items-center justify-center p-8 text-center h-full ${isRtl ? "font-arabic" : ""}`}>
                    <div className="mb-6">
                      <div
                        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white ${dictionary ? getColorFromName(
                          dictionary.items[current].author
                        ) : ""}`}
                      >
                        {dictionary ? getInitials(dictionary.items[current].author) : ""}
                      </div>
                      <h4 className="text-xl font-bold text-white">{dictionary?.items?.[current]?.author ?? ""}</h4>
                      <div className="flex justify-center mt-2">
                        {dictionary ? renderStars(dictionary.items[current].etoile) : null}
                      </div>
                    </div>

                    <Quote className="mb-4 h-10 w-10 text-gold/40 mx-auto" />
                    <p className="mb-6 text-lg italic text-white">{dictionary ? dictionary.items[current].quote : ""}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </GlassCard>

          {/* Navigation */}
          <div className="mt-8 flex justify-center space-x-4">
            <motion.button
              onClick={prevSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-white"
              aria-label={lang === "fr" ? "Témoignage précédent" : lang === "ar" ? "الشهادة السابقة" : "Previous testimonial"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>

            <div className="flex items-center space-x-2">
              {dictionary && dictionary.items.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`h-3 rounded-full transition-all ${
                    index === current ? "w-10 bg-gold" : "w-3 bg-white/30 hover:bg-gold/50"
                  }`}
                  aria-label={lang === "fr" ? `Aller au témoignage ${index + 1}` : lang === "ar" ? `الذهاب إلى الشهادة ${index + 1}` : `Go to testimonial ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                ></motion.button>
              ))}
            </div>

            <motion.button
              onClick={nextSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-gold hover:text-white"
              aria-label={lang === "fr" ? "Témoignage suivant" : lang === "ar" ? "الشهادة التالية" : "Next testimonial"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}