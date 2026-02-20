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
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
      <label style={{
        backgroundColor: "#ff4d4d",
        color: "white",
        padding: "14px 28px",
        borderRadius: "50px",
        cursor: "pointer",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.3s ease",
        boxShadow: "0 10px 20px rgba(255, 77, 77, 0.2)",
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        <span>{uploading ? "⌛ Menyimpan..." : "✨ Tambah Kenangan Baru"}</span>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
      </label>
    </div>
  );
}