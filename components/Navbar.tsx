"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Timeline", href: "/timeline" },
    { name: "Gallery", href: "/gallery" },
    { name: "Letters", href: "/letters" },
    { name: "Bucket List", href: "/bucket-list" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-black/40 backdrop-blur-lg border-b border-white/10">
      {/* Container utama dengan overflow-x-auto supaya bisa di-swipe kalau kepanjangan di HP */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-4 md:gap-8 px-6 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`whitespace-nowrap text-[10px] md:text-sm font-semibold tracking-widest transition-all flex-shrink-0 ${
                isActive ? "text-pink-300 scale-105" : "text-white/60 hover:text-pink-200"
              }`}
            >
              {item.name.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}