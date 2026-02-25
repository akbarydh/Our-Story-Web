"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // Pastikan path ini benar

export default function BucketListPage() {
  const [list, setList] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data dari Supabase
  const fetchBucketList = async () => {
    const { data, error } = await supabase
      .from("bucket_list")
      .select("*")
      .order("id", { ascending: true });
    
    if (!error) setList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBucketList(); }, []);

  // 2. Tambah Data Baru
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const { data, error } = await supabase
      .from("bucket_list")
      .insert([{ task: newItem, completed: false }])
      .select();

    if (!error && data) {
      setList([...list, data[0]]);
      setNewItem("");
    }
  };

  // 3. Update Status (Checkbox)
  const toggleComplete = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("bucket_list")
      .update({ completed: !currentStatus })
      .eq("id", id);

    if (!error) {
      setList(list.map(item => item.id === id ? { ...item, completed: !currentStatus } : item));
    }
  };

  // 4. Hapus Data
  const deleteItem = async (id: number) => {
    const { error } = await supabase.from("bucket_list").delete().eq("id", id);
    if (!error) setList(list.filter(item => item.id !== id));
  };

  // LOGIKA PROGRESS BAR
  const totalItems = list.length;
  const completedCount = list.filter((item) => item.completed).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <main className="min-h-screen text-white selection:bg-pink-500/30 overflow-x-hidden pb-20 bg-transparent">
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        
        {/* Tombol Back */}
        <Link href="/">
          <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-pink-200/60 hover:text-pink-200 mb-12 cursor-pointer w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Back to Home</span>
          </motion.div>
        </Link>

        <header className="mb-10">
          <h1 className="text-5xl font-bold mb-4 text-pink-100 drop-shadow-[0_0_15px_rgba(244,143,177,0.3)]">
            Our <span className="italic font-light">Missions</span>.
          </h1>
          
          {/* Progress Card Otomatis */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-lg shadow-xl"
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-pink-200 font-bold mb-1">Adventure Progress</p>
                <h3 className="text-3xl font-bold text-white">{progressPercentage}%</h3>
              </div>
              <p className="text-xs text-white/50">{completedCount} of {totalItems} Missions</p>
            </div>
            
            {/* Bar Background */}
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
              {/* Bar Fill */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-pink-500 to-pink-300 shadow-[0_0_15px_rgba(244,143,177,0.5)]"
              />
            </div>
          </motion.div>

          {/* Form Input */}
          <form onSubmit={addItem} className="flex gap-2 mt-10">
            <input 
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Tulis mimpi baru di sini..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-pink-500/50 transition-all placeholder:text-white/20"
            />
            <button type="submit" className="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-pink-500/20">
              Add
            </button>
          </form>
        </header>

        {/* List Section */}
        <div className="space-y-4">
          <AnimatePresence>
            {!loading && list.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-md transition-all ${
                  item.completed ? "bg-pink-500/10 border-pink-500/30" : "bg-white/5 border-white/10 shadow-lg"
                }`}
              >
                <div 
                  onClick={() => toggleComplete(item.id, item.completed)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                    item.completed ? "bg-pink-500 border-pink-500 scale-110" : "border-white/30 hover:border-pink-400"
                  }`}
                >
                  {item.completed && <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                </div>
                
                <span className={`flex-1 text-base transition-all duration-300 ${
                  item.completed ? "text-white/30 line-through italic font-light" : "text-white/90"
                }`}>
                  {item.task}
                </span>

                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-white/30 hover:text-red-400 active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 3A2.75 2.75 0 006 5.75v.5h8v-.5A2.75 2.75 0 0011.25 3h-2.5zM5 7.25a.75.75 0 01.75-.75h8.5a.75.75 0 01.75.75v10.5a2.25 2.25 0 01-2.25 2.25h-5.5A2.25 2.25 0 015 17.75V7.25z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {list.length === 0 && !loading && (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-3xl text-white/20 italic">
              Belum ada misi terdaftar...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}