"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link untuk navigasi

export default function Home() {
  const startDate = new Date("2025-12-24T00:00:00");

  const formattedDate = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [duration, setDuration] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now.getTime() - startDate.getTime();

      if (difference < 0) {
        setIsStarted(false);
        return;
      }

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
    <main className="relative h-screen w-full overflow-hidden font-sans">
      
      {/* 1. Background Foto & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
        style={{ backgroundImage: "url('/images/bakcgrounddd.jpeg')" }} // Pastikan file ada di public/images/
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* 2. Navigasi (Sesuai Struktur Halaman Dokumen) */}
      <nav className="relative z-20 flex justify-center gap-6 p-6">
        {[
          { name: "Timeline", href: "/timeline" },
          { name: "Gallery", href: "/gallery" },
          { name: "Letters", href: "/letters" },
          { name: "Bucket List", href: "/bucket-list" }
        ].map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="text-white/80 hover:text-pink-300 text-sm font-medium tracking-widest transition-colors"
          >
            {item.name.toUpperCase()}
          </Link>
        ))}
      </nav>

      {/* 3. Konten Utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-4">
        
        {/* Title dengan Aksen Pink & Glow */}
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
          className="mb-8 text-lg md:text-xl text-white/90 italic font-light"
        >
          Since {formattedDate}
        </motion.p>

        {/* Counter Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-lg px-10 py-6 rounded-2xl border border-white/20 shadow-2xl"
        >
          {isStarted ? (
            <>
              <p className="mb-4 text-pink-100 text-sm uppercase tracking-[0.3em]">Together for</p>
              <div className="flex gap-4 md:gap-8 text-white">
                <div className="flex flex-col">
                  <span className="text-3xl md:text-5xl font-bold">{duration.days}</span>
                  <span className="text-[10px] text-pink-200">DAYS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-5xl font-bold">{duration.hours}</span>
                  <span className="text-[10px] text-pink-200">HOURS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl md:text-5xl font-bold">{duration.minutes}</span>
                  <span className="text-[10px] text-pink-200">MINS</span>
                </div>
                <div className="flex flex-col text-pink-300">
                  <span className="text-3xl md:text-5xl font-bold">{duration.seconds}</span>
                  <span className="text-[10px]">SECS</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-lg text-white">Counting down to our magic moment...</p>
          )}
        </motion.div>
      </div>

      {/* 4. Floating Music Player (Cicilan Komponen) */}
      <motion.div 
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        className="fixed bottom-8 right-8 z-30 flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 pr-6 rounded-full border border-pink-200/30 shadow-lg"
      >
        <button className="w-10 h-10 flex items-center justify-center bg-pink-400 hover:bg-pink-500 text-white rounded-full transition-all shadow-pink-500/50 shadow-md">
          <span className="text-xs">▶</span>
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] text-pink-200 font-bold uppercase tracking-tighter">Now Playing</span>
          <span className="text-xs text-white truncate w-24">Our Song.mp3</span>
        </div>
      </motion.div>

    </main>
  );
}