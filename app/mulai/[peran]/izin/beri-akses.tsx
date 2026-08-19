"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, MapPin, Volume2 } from "lucide-react";
import { BilahStatus } from "@/komponen/ui/bilah-status";
import { Tombol } from "@/komponen/ui/tombol";
import { JudulLangkah, KakiVersi, Kicker, TitikLangkah } from "@/komponen/ui/langkah";
import { useToko } from "@/lib/toko";
import type { Peran } from "@/lib/tipe";

const izin = [
  {
    kunci: "lokasi" as const,
    judul: "Akses Lokasi",
    isi: "Temukan pedagang atau titik kumpul di sekitarmu.",
    Ikon: MapPin,
  },
  {
    kunci: "notifikasi" as const,
    judul: "Notifikasi",
    isi: "Dapatkan update saat pedagang favoritmu mendekat.",
    Ikon: Bell,
  },
  {
    kunci: "suara" as const,
    judul: "Panduan Suara",
    isi: "Arahan navigasi otomatis tanpa perlu terus melihat layar.",
    Ikon: Volume2,
  },
];

export function BeriAkses({ peran }: { peran: Peran }) {
  const router = useRouter();
  const [nyala, setNyala] = React.useState({ lokasi: false, notifikasi: false, suara: false });
  const setIzin = useToko((s) => s.setIzin);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-krem">
      <BilahStatus />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2">
        <div className="overflow-hidden rounded-[20px]">
          <Image
            src="/img/ilustrasi-izin.svg"
            alt="Ilustrasi izin lokasi, notifikasi, dan suara"
            width={350}
            height={209}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="mt-4">
          <TitikLangkah ke={2} />
        </div>

        <div className="mt-3">
          <Kicker anak="LANGKAH 2 DARI 3" />
          <JudulLangkah anak={<>Beri Akses, Nikmati Kemudahan!</>} />
          <p className="mt-2 text-[13px] leading-relaxed text-tinta-3">
            SEKETIKA butuh beberapa izin agar pengalaman jajan atau jualanmu maksimal.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {izin.map(({ kunci, judul, isi, Ikon }) => (
            <div
              key={kunci}
              className="bayang-kartu flex items-center gap-3 rounded-[16px] border border-garis bg-white p-3.5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau">
                <Ikon size={19} strokeWidth={1.9} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold text-tinta">{judul}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-tinta-3">{isi}</p>
              </div>

              {/* Sakelar dibangun dari checkbox sungguhan supaya tetap bisa
                  dijangkau papan ketik dan dibaca pembaca layar. */}
              <label className="relative shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nyala[kunci]}
                  onChange={(e) => setNyala((n) => ({ ...n, [kunci]: e.target.checked }))}
                  className="peer khusus-pembaca-layar"
                />
                <span className="sr-only">{judul}</span>
                <span
                  aria-hidden
                  className="block h-[26px] w-[46px] rounded-pil bg-tinta-5/45 transition-colors peer-checked:bg-hijau peer-focus-visible:ring-2 peer-focus-visible:ring-hijau/40 peer-focus-visible:ring-offset-2"
                />
                <span
                  aria-hidden
                  className="absolute left-[3px] top-[3px] size-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Tombol
            penuh
            onClick={() => {
              setIzin(nyala);
              router.push(`/mulai/${peran}/data`);
            }}
          >
            Izinkan &amp; Lanjut
            <ArrowRight size={16} strokeWidth={2.4} />
          </Tombol>
          <KakiVersi />
        </div>
      </div>
    </div>
  );
}
