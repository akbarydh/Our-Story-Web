"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function LettersPage() {
  const [letters, setLetters] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sender, setSender] = useState(""); // Default kosong agar user harus memilih
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Daftar Nama Opsi (Ganti dengan nama kalian)
  const SENDER_OPTIONS = ["Akbar", "Naila"];

  useEffect(() => { fetchLetters(); }, []);

  const fetchLetters = async () => {
    setLoading(true);
    const { data } = await supabase.from("letters").select("*").order("created_at", { ascending: false });
    if (data) setLetters(data);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!title || !content || !sender) return alert("Lengkapi semua field dulu ya!");
    setIsSending(true);
    try {
      const { error } = await supabase.from("letters").insert([
        { title, content, sender, reply_to_title: replyingTo }
      ]);
      if (error) throw error;

      const botToken = "8215830664:AAG3sK4pbb168Rm4lkcdpM4UM_UIuO8fe-o";
      const chatIds = ["1304535878", "5648114343"]; 
      
      const escapeHTML = (str: string) => 
        str.replace(/[&<>]/g, (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[tag] || tag));

      const cleanTitle = escapeHTML(title);
      const cleanSender = escapeHTML(sender);
      const replyStatus = replyingTo 
        ? `\n(Membalas: "<i>${escapeHTML(replyingTo)}</i>")` 
        : "";

      const message = `<b>💌 Ada Surat Baru Masuk! 💌</b>${replyStatus}\n\n` +
                      `Judul: "<i>${cleanTitle}</i>"\n` +
                      `Dari: <b>${cleanSender}</b>\n\n` +
                      `✨ <a href="https://our-story-web-phi.vercel.app/letters">Klik di sini untuk baca!</a>`;

      await Promise.all(chatIds.map(async (id) => {
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              chat_id: id, 
              text: message, 
              parse_mode: "HTML",
              disable_web_page_preview: false 
            }),
          });
        } catch (err) { console.error(err); }
      }));

      setTitle(""); setContent(""); setSender("");
      setIsWriteModalOpen(false);
      fetchLetters();
      
      alert(replyingTo ? "Surat balasan berhasil dikirim! 🚀💌" : "Surat berhasil dikirim! 🚀💌");
      setReplyingTo(null);
    } catch (error: any) {
      alert("Gagal mengirim: " + error.message);
    } finally { setIsSending(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus surat ini? 🥺")) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("letters").delete().eq("id", id);
      if (error) throw error;
      setSelectedLetter(null);
      fetchLetters();
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    } finally { setIsDeleting(false); }
  };

  return (
    <div className="min-h-screen -mt-20 pt-32 px-6 pb-20 relative overflow-hidden text-white font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-pink-200 tracking-tighter italic"
          >
            Letters for You 💌
          </motion.h1>
          <p className="text-white/60 text-[10px] md:text-xs mt-4 tracking-[0.3em] uppercase font-light">
            Setiap kata adalah detak jantung yang tertulis
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setReplyingTo(null); setTitle(""); setSender(""); setIsWriteModalOpen(true); }}
            className="mt-10 px-10 py-4 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-100 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold backdrop-blur-md"
          >
            + Tulis Surat Baru
          </motion.button>
        </header>

        {loading ? (
          <div className="flex justify-center pt-20">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {letters.map((letter) => (
              <motion.div
                key={letter.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedLetter(letter)}
                className="cursor-pointer group p-8 bg-black/40 border border-white/10 rounded-[2.5rem] backdrop-blur-md transition-all flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-pink-300/40 text-[9px] font-mono uppercase tracking-[0.2em]">
                      {new Date(letter.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    {letter.reply_to_title && (
                      <div className="text-[8px] text-pink-300/60 uppercase tracking-widest italic font-bold">↩ Membalas</div>
                    )}
                  </div>
                  <h3 className="text-white text-xl font-medium group-hover:text-pink-200 leading-snug italic">
                    "{letter.title}"
                  </h3>
                  <p className="text-white/50 text-sm mt-4 line-clamp-3 font-light">
                    {letter.content}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-3 text-[9px] text-pink-300/50 tracking-[0.3em] uppercase font-bold italic">
                  <span>From: {letter.sender}</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-pink-300/20 to-transparent"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLetter(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#fdfaf6] p-10 md:p-14 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[85vh] text-zinc-800"
            >
              <button onClick={() => handleDelete(selectedLetter.id)} className="absolute top-8 right-8 text-zinc-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>

              <div className="font-serif">
                <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-10 border-b pb-5">
                  {selectedLetter.reply_to_title ? `Reply to: ${selectedLetter.reply_to_title}` : "Archived Message"}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-10 text-zinc-900 italic tracking-tighter">{selectedLetter.title}</h2>
                <div className="text-base md:text-lg leading-[1.8] text-zinc-700 whitespace-pre-wrap font-medium">{selectedLetter.content}</div>
                <div className="mt-12 flex flex-col items-end border-t pt-10">
                  <p className="text-zinc-400 text-[10px] italic uppercase">With all my heart,</p>
                  <p className="text-zinc-900 font-bold mt-2 text-2xl italic">{selectedLetter.sender}</p>
                  
                  <button 
                    onClick={() => {
                      setReplyingTo(selectedLetter.title);
                      setTitle(`Re: ${selectedLetter.title}`);
                      setSender(""); // Reset pengirim biar milih ulang
                      setIsWriteModalOpen(true);
                      setSelectedLetter(null);
                    }}
                    className="mt-8 px-6 py-2 bg-zinc-900 text-white rounded-full text-[10px] tracking-widest uppercase hover:bg-pink-600 transition-colors font-bold"
                  >
                    ↩ Balas Surat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 text-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsWriteModalOpen(false); setReplyingTo(null); }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-900 border border-white/10 p-8 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl"
            >
              <h2 className="text-pink-300 font-bold tracking-[0.3em] text-center mb-10 uppercase text-[10px]">
                {replyingTo ? `Balas: ${replyingTo}` : "Create New Letter"}
              </h2>
              <div className="space-y-4">
                {/* DROP-DOWN NAMA PENGIRIM */}
                <div className="relative">
                  <select 
                    value={sender} 
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-300/50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-zinc-900">Pilih Nama Pengirim...</option>
                    {SENDER_OPTIONS.map((name) => (
                      <option key={name} value={name} className="bg-zinc-900">{name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-[10px]">▼</div>
                </div>

                {/* INPUT JUDUL - OTOMATIS READONLY KALAU BALES */}
                <input 
                  placeholder="Judul Surat..." 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  readOnly={!!replyingTo} 
                  className={`w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-300/50 font-bold ${replyingTo ? 'opacity-60 cursor-not-allowed' : ''}`} 
                />

                <textarea 
                  placeholder="Tuliskan perasaanmu..." 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-5 text-white text-sm h-48 outline-none resize-none focus:border-pink-300/50 leading-relaxed" 
                />

                <button 
                  onClick={handleSend} 
                  disabled={isSending} 
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-lg shadow-pink-500/20 text-xs tracking-widest mt-4 uppercase"
                >
                  {isSending ? "MENGIRIM..." : replyingTo ? "KIRIM BALASAN ❤️" : "KIRIM SURAT ❤️"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}