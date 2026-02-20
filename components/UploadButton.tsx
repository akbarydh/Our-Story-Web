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

      const { error } = await supabase.storage.from("gallery").upload(fileName, file);
      if (error) throw error;

      onSuccess();
    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100 }}>
      <label style={{
        backgroundColor: "#ff4d6d",
        color: "white",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(255, 77, 109, 0.4)",
        fontSize: "24px",
        transition: "transform 0.2s"
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {uploading ? "⏳" : "＋"}
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
      </label>
    </div>
  );
}