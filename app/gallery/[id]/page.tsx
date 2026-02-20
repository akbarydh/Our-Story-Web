"use client";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Ambil URL Publik dari Supabase
  const publicUrl = supabase.storage.from("gallery").getPublicUrl(id as string).data.publicUrl;
  const isVideo = (id as string).match(/\.(mp4|webm|mov|ogg)$/i);

  return (
    // mt-[-80px] untuk narik konten ke atas supaya tidak ada celah di bawah Navbar
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 mt-[-20px]">
      
      {/* Tombol Kembali yang lebih cantik */}
      <button 
        onClick={() => router.back()}
        className="absolute top-24 left-6 z-10 flex items-center gap-2 text-white/80 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full backdrop-blur-xl border border-white/20 transition-all active:scale-95"
      >
        <span>←</span> <span>Kembali</span>
      </button>

      {/* Container Foto/Video: Maksimal tinggi 70% layar supaya gak kegedean */}
      <div className="relative max-w-5xl w-full max-h-[70vh] flex justify-center items-center rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 bg-black/20">
        {isVideo ? (
          <video 
            src={publicUrl} 
            controls 
            autoPlay 
            className="max-w-full max-h-[70vh] object-contain" 
          />
        ) : (
          <img 
            src={publicUrl} 
            className="max-w-full max-h-[70vh] object-contain" 
            alt="Full Memory" 
          />
        )}
      </div>
      
      {/* Keterangan di bawah foto */}
      <div className="mt-8 text-center animate-fade-in">
        <h2 className="text-pink-200 text-sm font-bold tracking-[0.3em] uppercase drop-shadow-md">
          Captured Moment
        </h2>
        <p className="text-white/40 text-xs mt-2 font-mono italic">
          {id}
        </p>
      </div>
    </div>
  );
}