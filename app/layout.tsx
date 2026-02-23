import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingMusic from "@/components/FloatingMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Our Story | Kenangan Kita",
  description: "Album kenangan digital perjalanan cinta kita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[#0a0a0a]`}>
        {/* 1. Navbar Global */}
        <Navbar />
        
        {/* 2. Background Foto Global & Overlay */}
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{ backgroundImage: "url('/images/bakcgrounddd.jpeg')" }} 
          />
          {/* Overlay gelap agar teks tetap terbaca */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        {/* 3. Container Konten Utama */}
        <main className="relative pt-20 min-h-screen">
          {children}
        </main>

        {/* 4. Musik Melayang (Akan muncul di semua halaman) */}
        <FloatingMusic />
      </body>
    </html>
  );
}