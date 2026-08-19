"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, Paperclip, SendHorizontal } from "lucide-react";
import { BilahStatus } from "@/komponen/ui/bilah-status";
import { NavBawah } from "@/komponen/nav/nav-bawah";
import { AvatarLawan } from "@/komponen/chat/avatar-lawan";
import { rupaLawan, salinan } from "@/komponen/chat/rupa";
import { balasanCepat } from "@/lib/data/awal";
import { useToko } from "@/lib/toko";
import type { Peran } from "@/lib/tipe";

export function RuangChat({ id, peran = "pembeli" }: { id: string; peran?: Peran }) {
  const router = useRouter();
  const percakapan = useToko((s) =>
    (peran === "pedagang" ? s.percakapanPedagang : s.percakapan).find((c) => c.id === id),
  );
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

  const rupa = rupaLawan(percakapan.id, peran);
  const kata = salinan[peran];

  const kirim = (isi: string) => {
    const bersih = isi.trim();
    if (!bersih) return;
    kirimPesan(percakapan.id, bersih, peran);
    setTeks("");
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-garis">
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

        <AvatarLawan rupa={rupa} nama={percakapan.nama} size={36} titikDaring={false} />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[14px] font-bold leading-tight text-hijau">
            {percakapan.nama}
          </h1>
          <p
            className={`text-[11px] leading-tight ${rupa.daring ? "text-hijau" : "text-tinta-4"}`}
          >
            {rupa.daring ? kata.daring : kata.luring}
          </p>
        </div>

        {/* Tombol keterangan hanya ada di sisi pedagang pada rancangan. */}
        {peran === "pedagang" && (
          <button
            type="button"
            aria-label={`Keterangan tentang ${percakapan.nama}`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-tinta-3 transition-transform active:scale-90"
          >
            <Info size={19} strokeWidth={2} />
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-3">
          {percakapan.pesan.map((p) => (
            <li key={p.id} className={p.saya ? "flex justify-end" : "flex gap-2"}>
              {!p.saya && (
                <span className="mt-auto">
                  <AvatarLawan rupa={rupa} nama={percakapan.nama} size={24} titikDaring={false} />
                </span>
              )}
              <div className={`flex max-w-[76%] flex-col ${p.saya ? "items-end" : "items-start"}`}>
                <p
                  className={`rounded-[18px] px-3.5 py-2.5 text-[13px] leading-snug ${
                    p.saya
                      ? "rounded-br-[6px] bg-hijau text-white"
                      : "rounded-bl-[6px] bg-white text-tinta shadow-[0_1px_3px_rgb(0_0_0/0.06)]"
                  }`}
                >
                  {p.isi}
                </p>
                <span className="mt-1 px-1 text-[10px] text-tinta-4">{p.waktu}</span>
              </div>
            </li>
          ))}
        </ul>
        <div ref={bawah} />
      </div>

      {/* Balasan cepat, hanya untuk pedagang. Jawaban yang sama diketik
          berulang kali sepanjang hari, jadi disediakan sebagai ketukan. */}
      {peran === "pedagang" && (
        <div className="rel-gulir flex shrink-0 gap-2 border-t border-garis bg-krem px-3 pt-2.5">
          {balasanCepat.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => kirim(b)}
              className="shrink-0 rounded-pil border border-garis bg-white px-3.5 py-2 text-[12px] font-medium text-tinta-2 transition-transform active:scale-95"
            >
              {b}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim(teks);
        }}
        className={`flex shrink-0 items-center gap-2 bg-krem px-3 py-2.5 ${
          peran === "pedagang" ? "" : "border-t border-garis"
        }`}
      >
        <button
          type="button"
          aria-label="Lampirkan berkas"
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-white text-tinta-3 transition-transform active:scale-90"
        >
          <Paperclip size={17} strokeWidth={2} />
        </button>
        <input
          value={teks}
          onChange={(e) => setTeks(e.target.value)}
          placeholder={kata.ketik}
          aria-label={kata.ketik}
          className="min-w-0 flex-1 rounded-[13px] bg-white px-3.5 py-3 text-[13px] text-tinta placeholder:text-tinta-3 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Kirim pesan"
          disabled={!teks.trim()}
          className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-hijau text-white transition-[transform,opacity] active:scale-90 disabled:bg-tinta-5/30 disabled:text-tinta-3"
        >
          <SendHorizontal size={17} strokeWidth={2.2} />
        </button>
      </form>

      <NavBawah peran={peran} />
    </div>
  );
}
