"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Peta } from "@/komponen/peta/peta";
import { IsiPedagang } from "@/komponen/pedagang/isi-pedagang";
import { daftarPedagang } from "@/lib/data/pedagang";
import type { Pedagang } from "@/lib/tipe";

/** Halaman pedagang untuk tautan langsung. */
export function DetailPedagang({ pedagang }: { pedagang: Pedagang }) {
  const router = useRouter();

  return (
    <Layar nav>
      <div className="relative flex-1">
        <Peta
          penuh
          utama
          skala={false}
          saya={{ x: 50.11, y: 42.72 }}
          tanda={daftarPedagang.map((p) => ({
            id: p.id,
            x: p.posisi.x,
            y: p.posisi.y,
          }))}
        />
        <div aria-hidden className="absolute inset-0 bg-black/25" />

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-white text-hijau shadow-[0_2px_10px_rgb(0_0_0/0.15)] transition-transform active:scale-90"
        >
          <ChevronLeft size={19} strokeWidth={2.4} />
        </button>

        <div className="bayang-lembar absolute inset-x-0 bottom-0 rounded-t-[24px] bg-krem px-4 pb-5 pt-2.5">
          <span
            aria-hidden
            className="mx-auto mb-4 block h-1 w-9 rounded-pil bg-tinta-5/60"
          />
          <IsiPedagang pedagang={pedagang} />
        </div>
      </div>
    </Layar>
  );
}
