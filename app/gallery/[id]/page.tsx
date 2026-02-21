"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meta, setMeta] = useState({ description: "", event_date: "" });
  const [loading, setLoading] = useState(true);
  
  // State untuk Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const publicUrl = supabase.storage.from("gallery").getPublicUrl(id as string).data.publicUrl;
  const isVideo = (id as string).match(/\.(mp4|webm|mov|ogg)$/i);

  useEffect(() => {
    fetchMeta();
  }, [id]);

  const fetchMeta = async () => {
    try {
      const { data } = await supabase
        .from("gallery_metadata")
        .select("*")
        .eq("file_id", id)
        .single();
      if (data) {
        setMeta(data);
        setEditDesc(data.description);
        setEditDate(data.event_date);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("gallery_metadata")
        .update({ description: editDesc, event_date: editDate })
        .eq("file_id", id);

      if (error) throw error;
      setMeta({ description: editDesc, event_date: editDate });
      setIsEditing(false);
    } catch (error: any) {
      alert("Gagal update: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin mau hapus kenangan ini? 🥺 Gak bisa balik lagi lho...")) return;
    
    try {
      // 1. Hapus Metadata
      await supabase.from("gallery_metadata").delete().eq("file_id", id);
      // 2. Hapus File di Storage
      await supabase.storage.from("gallery").remove([id as string]);
      
      router.push("/gallery");
      router.refresh();
    } catch (error: any) {
      alert("Gagal hapus: " + error.message);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden mt-[-80px] px-4">
      {/* Background & Overlay */}
      <div className="absolute inset-0 bg-center bg-cover scale-105 blur-xl opacity-30" style={{ backgroundImage: `url(${publicUrl})` }} />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        
        {/* Media Container */}
        <div className="rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40">
          {isVideo ? (
            <video src={publicUrl} controls autoPlay className="max-h-[50vh] md:max-h-[60vh] w-full object-contain" />
          ) : (
            <img src={publicUrl} alt="Memory" className="max-h-[50vh] md:max-h-[60vh] w-full object-contain shadow-2xl" />
          )}
        </div>

        {/* Caption & Edit Section */}
        <div className="mt-8 text-center px-6 w-full max-w-md">
          <AnimatePresence mode="wait">
            {isEditing ? (
              // FORM EDIT (Muncul pas tombol edit diklik)
              <motion.div 
                key="edit-mode"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md"
              >
                <input 
                  type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-pink-300/50"
                />
                <textarea 
                  value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm h-24 outline-none resize-none focus:border-pink-300/50"
                  placeholder="Tulis ceritanya..."
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleUpdate} disabled={isSaving}
                    className="flex-1 bg-pink-500/80 hover:bg-pink-500 text-white text-[10px] py-2 rounded-lg font-bold tracking-widest transition-all"
                  >
                    {isSaving ? "SAVING..." : "SAVE"}
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] py-2 rounded-lg tracking-widest transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </motion.div>
            ) : (
              // TAMPILAN NORMAL
              <motion.div 
                key="view-mode"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-pink-300 text-[10px] tracking-[0.5em] uppercase font-bold">
                  {meta.event_date ? new Date(meta.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Captured Moment"}
                </h2>
                <p className="text-white/80 text-sm mt-3 font-medium italic leading-relaxed drop-shadow-md">
                  "{meta.description || "Tanpa deskripsi"}"
                </p>

                {/* Tombol Aksi */}
                <div className="mt-8 flex gap-6">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-white/30 hover:text-pink-300 text-[9px] tracking-widest uppercase transition-all"
                  >
                    [ Edit Cerita ]
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="text-white/20 hover:text-red-400 text-[9px] tracking-widest uppercase transition-all"
                  >
                    [ Hapus ]
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}