"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, Link2, MessageCircle } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Tombol } from "@/komponen/ui/tombol";
import { bagikanWhatsApp, salinTeks, tautTitik } from "@/lib/berbagi";
import { useToko } from "@/lib/toko";

export function BerhasilDibuat({ id }: { id: string }) {
  const titik = useToko((s) => s.titikKumpul.find((t) => t.id === id));
  const [tersalin, setTersalin] = React.useState(false);
  const taut = tautTitik(id);

  const salin = async () => {
    if (await salinTeks(taut)) {
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    }
  };

  return (
    <Layar nav>
      <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-8 text-center">
        <span className="grid size-[88px] place-items-center rounded-full bg-hijau text-white shadow-[0_10px_30px_rgb(26_77_46/0.3)]">
          <Check size={44} strokeWidth={3} />
        </span>

        <h1 className="mt-6 text-[23px] font-extrabold leading-tight text-hijau">
          Titik Kumpul
          <br />
          Berhasil Dibuat!
        </h1>
        <p className="mt-3 max-w-[17rem] text-[13px] leading-relaxed text-tinta-3">
          Bagikan ke tetangga agar cepat terpenuhi dan pedagang segera datang.
        </p>

        <div className="bayang-kartu mt-7 flex w-full items-center gap-3 rounded-[16px] border border-garis bg-white p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau">
            <Link2 size={17} strokeWidth={2.1} />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[12.5px] font-semibold text-tinta">
              {taut}
            </span>
            <span className="block text-[11px] text-tinta-4">
              Link undangan Anda
            </span>
          </span>
          <button
            type="button"
            onClick={salin}
            className="shrink-0 rounded-[10px] bg-hijau-lembut px-3 py-2 text-[11.5px] font-bold text-hijau transition-transform active:scale-95"
          >
            {tersalin ? "Tersalin" : "Salin"}
          </button>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3">
          <Tombol
            penuh
            onClick={() => bagikanWhatsApp(titik?.nama ?? "titik kumpul", taut)}
          >
            <MessageCircle size={17} strokeWidth={2.2} />
            Bagikan via WhatsApp
          </Tombol>
          <Tombol rupa="garis" penuh onClick={salin}>
            <Copy size={16} strokeWidth={2.2} />
            {tersalin ? "Link tersalin" : "Salin Link"}
          </Tombol>
        </div>

        <Link
          href={`/kolab/${id}`}
          className="mt-6 text-[13px] font-semibold text-hijau underline underline-offset-4"
        >
          Lihat Detail Titik Kumpul →
        </Link>
      </div>
    </Layar>
  );
}
