"use client";

import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function DetailPage() {
  const { id } = useParams();

  const publicUrl = supabase.storage.from("gallery").getPublicUrl(id as string).data.publicUrl;
  const isVideo = (id as string).match(/\.(mp4|webm|mov|ogg)$/i);

  return (
    // mt-[-80px] untuk narik konten ke tengah layar melewati padding layout global
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden mt-[-80px] px-4">

      {/* Background blur estetik */}
      <div
        className="absolute inset-0 bg-center bg-cover scale-110 blur-3xl opacity-40"
        style={{ backgroundImage: `url(${publicUrl})` }}
      />

      {/* Overlay gelap agar foto utama lebih menonjol */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      {/* Main content: Foto / Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center w-full max-w-4xl"
      >
        {/* Media container dengan shadow kuat agar terlihat mengambang */}
        <div className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40">
          {isVideo ? (
            <video
              src={publicUrl}
              controls
              autoPlay
              className="max-h-[60vh] w-full object-contain"
            />
          ) : (
            <img
              src={publicUrl}
              alt="Memory"
              className="max-h-[60vh] w-full object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Caption minimalis di bawah foto */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <h2 className="text-pink-300 text-[10px] tracking-[0.5em] uppercase font-bold drop-shadow-lg">
            Captured Moment
          </h2>
          <p className="text-white/20 text-[9px] mt-3 font-mono truncate max-w-[200px] mx-auto">
            {id}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}