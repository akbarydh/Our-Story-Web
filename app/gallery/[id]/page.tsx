"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function DetailPage() {
  const { id } = useParams();
  const [meta, setMeta] = useState({ description: "Loading memory...", event_date: "" });

  const publicUrl = supabase.storage.from("gallery").getPublicUrl(id as string).data.publicUrl;
  const isVideo = (id as string).match(/\.(mp4|webm|mov|ogg)$/i);

  // Ambil data deskripsi dari tabel database
  useEffect(() => {
    const fetchMeta = async () => {
      const { data } = await supabase
        .from("gallery_metadata")
        .select("*")
        .eq("file_id", id)
        .single();
      if (data) setMeta(data);
    };
    fetchMeta();
  }, [id]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden mt-[-80px] px-4">
      <div className="absolute inset-0 bg-center bg-cover scale-110 blur-3xl opacity-40" style={{ backgroundImage: `url(${publicUrl})` }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40">
          {isVideo ? (
            <video src={publicUrl} controls autoPlay className="max-h-[60vh] w-full object-contain" />
          ) : (
            <img src={publicUrl} alt="Memory" className="max-h-[60vh] w-full object-contain shadow-2xl" />
          )}
        </div>

        {/* REVISI CAPTION: Deskripsi & Tanggal */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-center px-6">
          <h2 className="text-pink-300 text-[10px] tracking-[0.5em] uppercase font-bold">
             {meta.event_date ? new Date(meta.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Captured Moment"}
          </h2>
          <p className="text-white/80 text-sm mt-3 font-medium italic max-w-md leading-relaxed drop-shadow-md">
            "{meta.description || "Tanpa deskripsi"}"
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}