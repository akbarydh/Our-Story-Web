"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadButton({ onSuccess }: { onSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      // Upload file (bisa gambar/video) ke Bucket 'gallery'
      const { error } = await supabase.storage.from("gallery").upload(fileName, file);
      if (error) throw error;

      onSuccess(); // Refresh gallery otomatis setelah berhasil
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex justify-center mb-10">
      <label className="flex items-center gap-3 px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full cursor-pointer transition-all shadow-lg shadow-pink-500/30 font-bold active:scale-95 group">
        <span className="text-xl group-hover:rotate-12 transition-transform">
          {uploading ? "⌛" : "✨"}
        </span>
        <span>{uploading ? "Menyimpan Kenangan..." : "Tambah Foto / Video"}</span>
        
        {/* Di sini kuncinya: accept diubah agar bisa video */}
        <input 
          type="file" 
          accept="image/*,video/*" 
          onChange={handleUpload} 
          disabled={uploading} 
          className="hidden" 
        />
      </label>
    </div>
  );
}