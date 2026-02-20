import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {/* Navbar Global */}
        <Navbar />
        
        {/* 1. Background Foto Global & Overlay */}
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s]"
            style={{ backgroundImage: "url('/images/bakcgrounddd.jpeg')" }} 
          />
          {/* Overlay gelap agar teks putih tetap terbaca jelas */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
        </div>

        {/* 2. Container Konten Utama */}
        <main className="relative pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}