"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !description || !date) return alert("Isi semua dulu ya sayang!");

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      // 1. Upload ke Storage
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (storageError) throw storageError;

      // 2. Simpan Deskripsi & Tanggal ke Database
      const { error: dbError } = await supabase
        .from("gallery_metadata")
        .insert([{ file_id: fileName, description, event_date: date }]);

      if (dbError) throw dbError;

      alert("Kenangan berhasil disimpan! ❤️");
      onUploadSuccess();
      onClose();
      setFile(null); setDescription(""); setDate("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-pink-300 font-bold tracking-widest text-center mb-6 uppercase text-sm">Tambah Kenangan Baru</h2>
            
            <div className="space-y-4">
              {/* Input File */}
              <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-300/10 file:text-pink-300 hover:file:bg-pink-300/20"
              />

              {/* Input Deskripsi */}
              <textarea placeholder="Tulis ceritanya di sini..." value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-pink-300/50 h-24 resize-none"
              />

              {/* Input Tanggal */}
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-pink-300/50"
              />

              <button onClick={handleUpload} disabled={uploading}
                className="w-full bg-pink-300 hover:bg-pink-400 text-black font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {uploading ? "Lagi Nyimpen..." : "SIMPAN KENANGAN ❤️"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}