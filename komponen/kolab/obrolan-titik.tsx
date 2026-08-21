"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { useToko } from "@/lib/toko";

/** Obrolan di dalam satu titik kumpul. */
export function ObrolanTitik({
  titikId,
  nama,
}: {
  titikId: string;
  nama: string;
}) {
  const pesan = useToko((s) => s.obrolanTitik[titikId]) ?? [];
  const kirim = useToko((s) => s.kirimPesanTitik);
  const [isi, setIsi] = React.useState("");
  const dasarRef = React.useRef<HTMLDivElement>(null);

  /* Gulir ke pesan terbaru setiap kali daftarnya bertambah. */
  React.useEffect(() => {
    dasarRef.current?.scrollIntoView({ block: "end" });
  }, [pesan.length]);

  const antar = (e: React.FormEvent) => {
    e.preventDefault();
    const bersih = isi.trim();
    if (!bersih) return;
    kirim(titikId, bersih, nama);
    setIsi("");
  };

  return (
    <div className="px-4 pb-5">
      <h2 className="text-[15px] font-extrabold text-tinta">Obrolan Warga</h2>
      <p className="mt-0.5 text-[11.5px] text-tinta-4">
        Buat janjian jam berapa berkumpul di titiknya
      </p>

      <ul className="mt-3 flex max-h-[38vh] flex-col gap-2 overflow-y-auto">
        {pesan.map((p) => (
          <li
            key={p.id}
            className="rounded-[14px] border border-garis bg-white px-3 py-2.5"
          >
            <p className="text-[12.5px] leading-snug text-tinta-2">{p.isi}</p>
            <p className="mt-1 text-[10px] text-tinta-4">{p.waktu}</p>
          </li>
        ))}

        {pesan.length === 0 && (
          <li className="rounded-[16px] border border-dashed border-garis bg-white px-4 py-7 text-center text-[12px] leading-relaxed text-tinta-4">
            Belum ada obrolan.
            <br />
            Mulai duluan, tetangga yang lain bisa ikut menyahut.
          </li>
        )}
        <div ref={dasarRef} />
      </ul>

      <form onSubmit={antar} className="mt-3 flex items-center gap-2">
        <input
          value={isi}
          onChange={(e) => setIsi(e.target.value)}
          aria-label="Tulis pesan untuk warga lain"
          placeholder="Tulis pesan..."
          className="h-11 min-w-0 flex-1 rounded-full border border-garis bg-white px-4 text-[13px] text-tinta placeholder:text-tinta-4 focus:outline-none focus:ring-2 focus:ring-hijau/35"
        />
        <button
          type="submit"
          disabled={!isi.trim()}
          aria-label="Kirim pesan"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-hijau text-white transition-[transform,opacity] active:scale-90 disabled:bg-tinta-5/30 disabled:text-tinta-3"
        >
          <Send size={17} strokeWidth={2.2} />
        </button>
      </form>
    </div>
  );
}
