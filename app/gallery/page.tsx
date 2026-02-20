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
      const { data } = await supabase.storage.from("gallery").list("", { sortBy: { column: "created_at", order: "desc" } });
      if (data) {
        const urls = data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => ({
          id: f.id, url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl, name: f.name
        }));
        setImages(urls);
      }
    } finally { setLoading(false); }
  }

  return (
    <div style={{ 
      padding: "60px 20px", 
      background: "linear-gradient(135deg, #fff5f7 0%, #f0f4ff 100%)", 
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif"
    }}>
      <header style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ color: "#4a4a4a", fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-1px" }}>
          Album Cinta Kita <span style={{ color: "#ff4d6d" }}>❤️</span>
        </h1>
        <p style={{ color: "#888" }}>Tiap foto punya cerita, tiap momen punya rasa.</p>
      </header>
      
      <UploadButton onSuccess={fetchImages} />

      {loading ? (
        <div style={{ textAlign: "center", color: "#ff4d6d", fontWeight: "bold" }}>Membuka album kenangan...</div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "25px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {images.map((img) => (
            <div key={img.id} style={{ 
              backgroundColor: "white",
              padding: "12px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img src={img.url} alt="Kenangan" style={{ 
                width: "100%", height: "300px", objectFit: "cover", borderRadius: "12px" 
              }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}