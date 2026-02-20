"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const startDate = new Date("2025-12-24T00:00:00");
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(false);

  const formattedDate = startDate.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();
      if (difference < 0) return setIsStarted(false);

      setIsStarted(true);
      setDuration({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    // Hapus class background di sini karena sudah ada di layout
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-bold mb-3 text-pink-200 drop-shadow-[0_0_15px_rgba(244,143,177,0.6)]"
      >
        Our Story
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-10 text-lg md:text-xl text-white/90 italic font-light"
      >
        Since {formattedDate}
      </motion.p>

      {/* Counter Card dengan efek Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-lg px-8 py-6 rounded-3xl border border-white/20 shadow-2xl"
      >
        {isStarted ? (
          <>
            <p className="mb-4 text-pink-100 text-xs uppercase tracking-[0.4em]">Together for</p>
            <div className="flex gap-6 md:gap-10 text-white">
              {Object.entries(duration).map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-4xl md:text-6xl font-bold">{value}</span>
                  <span className="text-[10px] text-pink-200 mt-1 uppercase">{label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-lg text-white">Counting down...</p>
        )}
      </motion.div>

      {/* Floating Music Player ditaruh di sini atau bisa dipindah ke layout juga */}
    </div>
  );
}