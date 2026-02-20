"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadButton from "@/components/UploadButton";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchImages(); }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      // Mengambil data dari bucket 'gallery' di Supabase
      const { data } = await supabase.storage.from("gallery").list("", { 
        sortBy: { column: "created_at", order: "desc" } 
      });
      
      if (data) {
        const urls = data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => ({
          id: f.id,
          // Mendapatkan URL publik untuk menampilkan gambar
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
          name: f.name
        }));
        setImages(urls);
      }
    } finally { setLoading(false); }
  }

  return (
    // Background utama dihilangkan agar foto dari layout.tsx terlihat
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          {/* Judul menggunakan glow pink agar senada dengan homepage */}
          <h1 className="text-4xl md:text-6xl font-bold text-pink-200 drop-shadow-[0_0_10px_rgba(244,143,177,0.5)] mb-4">
            Album Kita ❤️
          </h1>
          <p className="text-white/80 italic text-lg font-light">
            "Setiap foto punya cerita, setiap cerita punya makna."
          </p>
        </header>

        {/* Komponen upload yang sudah kita pisah */}
        <UploadButton onSuccess={fetchImages} />

        {loading ? (
          <div className="text-center text-pink-300 animate-pulse font-medium">
            Membuka album kenangan...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img) => (
              <div 
                key={img.id} 
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-pink-500/20"
              >
                {/* Gambar kenangan */}
                <img 
                  src={img.url} 
                  alt="Kenangan" 
                  className="w-full h-64 md:h-80 object-cover" 
                />
                
                {/* Keterangan foto semi-transparan */}
                <div className="p-4 text-center bg-black/40 backdrop-blur-sm">
                  <span className="text-white/90 text-xs md:text-sm font-light tracking-wide">
                    📍 {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jika gallery masih kosong */}
        {!loading && images.length === 0 && (
          <div className="text-center mt-20 text-white/50">
            <p className="text-xl">Belum ada foto nih. Yuk upload foto pertama kalian!</p>
          </div>
        )}
      </div>
    </div>
  );
}