"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadFoto() {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload file ke Bucket 'gallery'
      let { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      alert("Foto berhasil diupload ke Supabase!");
    } catch (error) {
      alert("Error upload: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ padding: "20px", border: "2px dashed #ff4d4d", borderRadius: "10px" }}>
      <h3>📸 Tambah Foto Kenangan</h3>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading} 
      />
      {uploading && <p>Sabar ya, lagi proses upload...</p>}
    </div>
  );
}