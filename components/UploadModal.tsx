"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadModal({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return alert("Pilih fotonya dulu!");
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage.from("gallery").upload(fileName, file);
      if (error) throw error;

      alert("Kenangan tersimpan! ✨");
      setFile(null);
      onUploadSuccess(); // Panggil fungsi ini untuk refresh gallery otomatis
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ padding: "15px", border: "2px dashed #ff4d4d", borderRadius: "15px", marginBottom: "20px", textAlign: "center", backgroundColor: "white" }}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
        style={{ marginBottom: "10px" }}
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: "pointer" }}
      >
        {uploading ? "Sabar ya..." : "🚀 Upload"}
      </button>
    </div>
  );
}