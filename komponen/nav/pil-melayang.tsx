"use client";

import Link from "next/link";
import { ChevronUp, Navigation } from "lucide-react";

/**
 * Kartu navigasi yang melayang di atas navigasi bawah.
 *
 * Di berkas rancangan lapisan ini bernama "FloatingNavPill", dan memang
 * melayang: ia menumpang di atas isi halaman, bukan ikut mengalir di
 * dalamnya. Bayangannya jatuh ke kartu di belakangnya, dan halaman tetap
 * bisa digulung penuh di baliknya.
 *
 * Geometrinya mengikuti rancangan: lebar 366 dari bingkai 390, jadi ada
 * sisa 12px di kiri dan kanan, dan dasarnya berhenti 35px di atas
 * navigasi.
 */
export function PilMelayang({
  judul,
  keterangan,
  menit,
  href,
  aksi,
  labelAksi = "Tandai Selesai",
}: {
  judul: string;
  keterangan: string;
  menit: number;
  /** Tujuan saat baris utamanya diketuk. */
  href: string;
  aksi?: () => void;
  labelAksi?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30">
      <div
        className="pointer-events-auto animate-[pil-naik_400ms_ease-out_both] overflow-hidden rounded-[20px] shadow-[0_8px_32px_rgb(26_77_46/0.45),0_2px_8px_rgb(0_0_0/0.2)]"
        style={{
          backgroundImage:
            "linear-gradient(163.78deg, #12392a 0%, #1a4d2e 60%, #2d6b45 100%)",
        }}
      >
        {/* Enam titik samar di tepi atas, tekstur dari rancangan. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2.5 h-0.5">
          {[10, 65, 120, 175, 230, 285].map((x) => (
            <span
              key={x}
              className="absolute size-0.5 rounded-pil bg-white/8"
              style={{ left: x }}
            />
          ))}
        </div>

        <Link
          href={href}
          className="relative flex items-center gap-2.5 px-3.5 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
        >
          <span className="grid size-[38px] shrink-0 place-items-center rounded-[13px] bg-white/12 text-white">
            <Navigation size={18} strokeWidth={2.2} className="fill-white" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-extrabold leading-[18px] tracking-[-0.12px] text-white">
              {judul}
            </span>
            <span className="flex items-center gap-1.5 pt-0.5">
              <span aria-hidden className="flex items-center gap-[7px]">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    /* Titiknya memanjang lewat skala, bukan lebar. Animasi
                       ini berputar terus, jadi menganimasikan lebar berarti
                       memaksa peramban menghitung ulang tata letak pada
                       setiap bingkai selama kartunya terlihat. */
                    className="h-1 w-1 origin-left animate-[titik-jalan_1.6s_ease-in-out_infinite] rounded-pil bg-white/35"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </span>
              <span className="truncate text-[11px] font-medium leading-[16.5px] text-white/85">
                {keterangan}
              </span>
            </span>
          </span>

          <span className="flex shrink-0 flex-col items-center rounded-[12px] bg-white/15 px-2.5 py-1.5">
            <span className="text-[16px] font-extrabold leading-4 text-[#4ade80]">{menit}</span>
            <span className="pt-px text-[9px] font-semibold leading-[13.5px] text-white/85">
              menit
            </span>
          </span>

          <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-white/12 text-white">
            <ChevronUp size={14} strokeWidth={2.4} />
          </span>
        </Link>

        <div className="flex items-center justify-between border-t border-white/10 px-3.5 py-2">
          <p className="text-[10px] font-medium leading-[15px] text-white/85">
            Ketuk untuk buka navigasi
          </p>
          {aksi && (
            <button
              type="button"
              onClick={aksi}
              className="rounded-[8px] bg-white/12 px-2.5 py-1.5 text-[10px] font-bold leading-[15px] text-white/90 transition-transform active:scale-95"
            >
              {labelAksi}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
