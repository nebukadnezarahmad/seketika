"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { LencanaStatus, TahapPesanan } from "@/komponen/pesanan/lencana";
import { cariPedagang } from "@/lib/data/pedagang";
import { kapan } from "@/lib/format";
import { useToko } from "@/lib/toko";
import type { StatusPesanan } from "@/lib/tipe";

const tab = [
  { kunci: "semua", label: "Semua" },
  { kunci: "diproses", label: "Diproses" },
  { kunci: "selesai", label: "Selesai" },
  { kunci: "dibatalkan", label: "Dibatalkan" },
] as const;

export function DaftarPesanan() {
  const [aktif, setAktif] = React.useState<(typeof tab)[number]["kunci"]>("semua");
  const pesanan = useToko((s) => s.pesanan);

  const terlihat = pesanan.filter((p) => {
    if (aktif === "semua") return true;
    /* Pesanan yang masih menunggu konfirmasi tetap masuk kelompok
       "Diproses" karena bagi warga keduanya sama-sama belum kelar. */
    if (aktif === "diproses") return p.status === "diproses" || p.status === "menunggu";
    return p.status === (aktif as StatusPesanan);
  });

  return (
    <Layar nav>
      <h1 className="px-4 pb-3 pt-3 text-center text-[19px] font-extrabold text-hijau">Pesanan</h1>

      <div className="rel-gulir flex gap-2 px-4 pb-3">
        {tab.map((t) => {
          const on = aktif === t.kunci;
          return (
            <button
              key={t.kunci}
              type="button"
              onClick={() => setAktif(t.kunci)}
              aria-pressed={on}
              className={`shrink-0 rounded-pil border px-3.5 py-2 text-[12px] transition-colors ${
                on
                  ? "border-hijau bg-hijau font-bold text-white"
                  : "border-garis-pil bg-white font-medium text-tinta-3"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <ul className="flex flex-col gap-3 px-4 pb-4">
        {terlihat.map((p) => {
          const pedagang = cariPedagang(p.pedagangSlug);
          return (
            <li
              key={p.id}
              className="bayang-kartu rounded-[16px] border border-garis bg-white p-3.5"
            >
              <div className="flex items-center gap-2.5">
                {pedagang && (
                  <Image
                    src={pedagang.foto}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 shrink-0 rounded-[10px] object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-tinta">{pedagang?.nama}</p>
                  <p className="text-[11px] text-tinta-4">{kapan(p.dibuatPada)}</p>
                </div>
                <LencanaStatus status={p.status} />
              </div>

              <div className="mt-3.5">
                <TahapPesanan status={p.status} />
              </div>

              <div className="mt-3 flex justify-end">
                <Link
                  href={`/pesanan/${p.id}`}
                  className={`flex items-center gap-1.5 rounded-[11px] px-3 py-2 text-[12px] font-bold transition-transform active:scale-95 ${
                    p.status === "diproses" || p.status === "menunggu"
                      ? "bg-hijau text-white"
                      : "bg-hijau-lembut text-hijau"
                  }`}
                >
                  Lihat Detail
                  <ArrowRight size={13} strokeWidth={2.6} />
                </Link>
              </div>
            </li>
          );
        })}

        {terlihat.length === 0 && (
          <li className="rounded-[16px] border border-dashed border-garis bg-white px-4 py-10 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada pesanan di kelompok ini.
          </li>
        )}
      </ul>
    </Layar>
  );
}
