"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadModal from "@/components/UploadModal"; // Import Modal Baru
import Link from "next/link";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State buat buka/tutup modal

  useEffect(() => { fetchImages(); }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      const { data } = await supabase.storage.from("gallery").list("", { 
        sortBy: { column: "created_at", order: "desc" } 
      });
      
      if (data) {
        const urls = data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => ({
          id: f.id,
          name: f.name,
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
        }));
        setImages(urls);
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER REVISI */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-200 drop-shadow-[0_0_10px_rgba(244,143,177,0.5)] mb-4 italic">
            Album Kita ❤️
          </h1>
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-light">
            Menyimpan setiap detik yang takkan terulang
          </p>
        </header>

        {/* TOMBOL (Tetap Desain Awal) */}
        <div className="flex justify-center mb-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full cursor-pointer transition-all shadow-lg shadow-pink-500/30 font-bold active:scale-95"
          >
            ✨ Tambah Kenangan Baru
          </button>
        </div>

        {/* Modal Kenangan */}
        <UploadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onUploadSuccess={fetchImages} 
        />

        {loading ? (
          <div className="text-center text-pink-300 animate-pulse font-light tracking-widest">
            Membuka album kenangan...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => {
              const isVideo = img.name.match(/\.(mp4|webm|mov|ogg)$/i);
              return (
                <Link href={`/gallery/${img.name}`} key={img.id}>
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:scale-[1.03] hover:border-pink-300/30">
                    {isVideo ? (
                      <div className="relative h-64 md:h-80 w-full">
                        <video src={img.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                          <span className="text-white text-3xl">▶</span>
                        </div>
                      </div>
                    ) : (
                      <img src={img.url} className="w-full h-64 md:h-80 object-cover" alt="Kenangan" />
                    )}
                    <div className="p-4 text-center bg-black/40 border-t border-white/5">
                      <span className="text-white/70 text-[10px] tracking-widest uppercase font-medium group-hover:text-pink-200">
                        📍 Lihat Detail
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}