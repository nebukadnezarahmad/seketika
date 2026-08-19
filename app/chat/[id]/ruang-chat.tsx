"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Paperclip, SendHorizontal } from "lucide-react";
import { BilahStatus } from "@/komponen/ui/bilah-status";
import { NavBawah } from "@/komponen/nav/nav-bawah";
import { rupaPercakapan } from "@/lib/data/awal";
import { useToko } from "@/lib/toko";

export function RuangChat({ id, peran = "pembeli" }: { id: string; peran?: "pembeli" | "pedagang" }) {
  const router = useRouter();
  const percakapan = useToko((s) => s.percakapan.find((c) => c.id === id));
  const kirimPesan = useToko((s) => s.kirimPesan);
  const [teks, setTeks] = React.useState("");
  const bawah = React.useRef<HTMLDivElement>(null);

  const jumlah = percakapan?.pesan.length ?? 0;
  React.useEffect(() => {
    /* Percakapan selalu dibuka pada pesan terbaru, seperti aplikasi
       perpesanan pada umumnya. */
    bawah.current?.scrollIntoView({ block: "end" });
  }, [jumlah]);

  if (!percakapan) {
    return (
      <div className="flex h-[100dvh] flex-col bg-krem">
        <BilahStatus />
        <p className="flex-1 px-6 py-16 text-center text-[13px] text-tinta-4">
          Percakapan tidak ditemukan.
        </p>
        <NavBawah peran={peran} />
      </div>
    );
  }

  const rupa = rupaPercakapan[percakapan.id];

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    const isi = teks.trim();
    if (!isi) return;
    kirimPesan(percakapan.id, isi);
    setTeks("");
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#efece6]">
      <div className="bg-krem">
        <BilahStatus />
      </div>

      <header className="flex shrink-0 items-center gap-3 border-b border-garis bg-krem px-4 pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-hijau transition-transform active:scale-90"
        >
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>
        <Image
          src={rupa?.foto ?? "/img/foto-bakso.jpg"}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-[11px] object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold leading-tight text-hijau">
            {percakapan.nama}
          </p>
          <p
            className={`text-[11px] leading-tight ${rupa?.daring ? "text-[#22c55e]" : "text-tinta-4"}`}
          >
            {rupa?.daring ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-3">
          {percakapan.pesan.map((p) => (
            <li key={p.id} className={p.saya ? "flex justify-end" : "flex gap-2"}>
              {!p.saya && (
                <Image
                  src={rupa?.foto ?? "/img/foto-bakso.jpg"}
                  alt=""
                  width={24}
                  height={24}
                  className="mt-auto size-6 shrink-0 rounded-[7px] object-cover"
                />
              )}
              <div className={`max-w-[76%] ${p.saya ? "items-end" : "items-start"} flex flex-col`}>
                <p
                  className={`rounded-[18px] px-3.5 py-2.5 text-[13px] leading-snug ${
                    p.saya
                      ? "rounded-br-[6px] bg-hijau text-white"
                      : "rounded-bl-[6px] bg-white text-tinta shadow-[0_1px_3px_rgb(0_0_0/0.06)]"
                  }`}
                >
                  {p.isi}
                </p>
                <span className="mt-1 px-1 text-[10px] text-tinta-5">{p.waktu}</span>
              </div>
            </li>
          ))}
        </ul>
        <div ref={bawah} />
      </div>

      <form
        onSubmit={kirim}
        className="flex shrink-0 items-center gap-2 border-t border-garis bg-krem px-3 py-2.5"
      >
        <button
          type="button"
          aria-label="Lampirkan berkas"
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-white text-tinta-4 transition-transform active:scale-90"
        >
          <Paperclip size={17} strokeWidth={2} />
        </button>
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder="Ketik pesan..."
          aria-label="Ketik pesan"
          className="min-w-0 flex-1 rounded-[13px] bg-white px-3.5 py-3 text-[13px] text-tinta placeholder:text-tinta-3 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Kirim pesan"
          disabled={!teks.trim()}
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-hijau text-white transition-[transform,opacity] active:scale-90 disabled:bg-tinta-5/30 disabled:text-tinta-4"
        >
          <SendHorizontal size={17} strokeWidth={2.2} />
        </button>
      </form>

      <NavBawah peran={peran} />
    </div>
  );
}
