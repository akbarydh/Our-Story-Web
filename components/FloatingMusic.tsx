"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLAYLIST = [
  {
    title: "Penjaga Hati",
    artist: "Nadhif Basalamah",
    cover: "/images/cover-album.jpeg",
    src: "/musik-web.mp3"
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    cover: "/images/gambar2.jpeg", 
    src: "/musik2.mp3" 
  },
  {
    title: "Kasih Putih",
    artist: "Yovie Widianto, Glenn Fredly",
    cover: "/images/gambar3.jpeg",
    src: "/kasih3.mp3"
  },
  {
    title: "Untuk Perempuan Yang Sedang Dalam Pelukan",
    artist: "Payung Teduh",
    cover: "/images/gambar4.jpeg",
    src:"/untuk4.mp3"
  }
];

export default function FloatingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentIndex];

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">
      
      {/* INFO LAGU (Clickable to Next) */}
      <AnimatePresence mode="wait">
        {isPlaying && (
          <motion.div
            key={currentTrack.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-end bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-lg"
          >
            <p className="text-[7px] text-pink-400 font-black uppercase tracking-[0.2em]">Now Playing</p>
            <p className="text-[10px] text-white font-bold whitespace-nowrap max-w-[150px] overflow-hidden text-ellipsis text-right">
              {currentTrack.title}
            </p>
            <p className="text-[8px] text-white/40 italic">{currentTrack.artist}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        {/* Tombol Previous - Selalu Muncul */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={prevTrack}
          className="w-8 h-8 bg-zinc-900/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180">
            <path d="M3 5v10l7-5-7-5zm7 0v10l7-5-7-5z" />
          </svg>
        </motion.button>

        {/* BAGIAN VINYL (Tombol Play/Pause) */}
        <div className="relative">
          <audio ref={audioRef} src={currentTrack.src} onEnded={nextTrack} />

          {/* Jarum Vinyl */}
          <motion.div
            initial={{ rotate: -45 }}
            animate={{ rotate: isPlaying ? 0 : -45 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-2 -right-1 z-20 origin-top-right pointer-events-none scale-75 md:scale-100"
          >
            <svg width="25" height="35" viewBox="0 0 30 40" fill="none">
              <path d="M25 5L10 35" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="25" cy="5" r="4" fill="#9ca3af"/>
            </svg>
          </motion.div>

          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
            className="relative w-14 h-14 md:w-20 md:h-20 bg-[#121212] rounded-full p-1 shadow-2xl border-4 border-[#1a1a1a] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 rounded-full opacity-30" 
              style={{ background: `repeating-radial-gradient(circle, #000, #000 2px, #1a1a1a 3px, #1a1a1a 4px)` }} 
            />
            <motion.div
              key={currentIndex}
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="relative w-full h-full rounded-full overflow-hidden z-10"
            >
              <img 
                src={currentTrack.cover} 
                alt="Cover" 
                className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-110' : 'grayscale brightness-50'}`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Tombol Next - Selalu Muncul */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={nextTrack}
          className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M3 5v10l7-5-7-5zm7 0v10l7-5-7-5z" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}