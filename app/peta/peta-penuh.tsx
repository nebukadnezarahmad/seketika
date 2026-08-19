"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { IkonKompas } from "@/komponen/ui/ikon";
import { Peta } from "@/komponen/peta/peta";
import { daftarPedagang } from "@/lib/data/pedagang";
import { jarakSingkat } from "@/lib/format";

/**
 * Peta satu layar penuh.
 *
 * Bedanya dengan peta kecil di beranda: di sini tiap pin membawa label
 * nama, jarak, dan perkiraan waktu, dan di bagian bawah ada rel kartu
 * ringkas yang bisa digeser untuk melompat ke pedagangnya.
 */
export function PetaPenuh() {
  const router = useRouter();

  return (
    <Layar nav>
      <div className="relative flex-1">
        <Peta
          penuh
          skala={false}
          saya={{ x: 50.11, y: 42.72 }}
          tanda={daftarPedagang.map((p) => ({
            id: p.id,
            x: p.posisi.x,
            y: p.posisi.y,
            label: { judul: p.namaPeta, isi: `${jarakSingkat(p.jarak)} • ${p.menit} menit` },
          }))}
        />

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-white text-hijau shadow-[0_2px_10px_rgb(0_0_0/0.15)] transition-transform active:scale-90"
        >
          <ChevronLeft size={19} strokeWidth={2.4} />
        </button>

        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-pil bg-hijau px-3.5 py-2 shadow-[0_4px_10px_rgb(26_77_46/0.3)]">
          <span aria-hidden className="size-1.5 rounded-pil bg-hijau-neon" />
          <span className="whitespace-nowrap text-[11px] font-bold text-white">
            {daftarPedagang.length} pedagang aktif
          </span>
        </div>

        <button
          type="button"
          aria-label="Pusatkan ke lokasi saya"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white text-tinta-6 shadow-[0_2px_10px_rgb(0_0_0/0.15)] transition-transform active:scale-90"
        >
          <IkonKompas size={19} />
        </button>

        {/* Rel kartu ringkas di atas peta */}
        <div className="rel-gulir absolute inset-x-0 bottom-3 flex gap-2.5 px-4">
          {daftarPedagang.map((p) => (
            <Link
              key={p.id}
              href={`/pedagang/${p.slug}`}
              className="flex shrink-0 items-center gap-2.5 rounded-[14px] bg-white/95 py-2 pl-2 pr-3.5 shadow-[0_3px_12px_rgb(0_0_0/0.16)] backdrop-blur-sm transition-transform active:scale-[0.98]"
            >
              <Image
                src={p.foto}
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-[10px] object-cover"
              />
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-[12px] font-bold text-tinta">
                  {p.namaPeta}
                </span>
                <span className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10px] text-tinta-4">
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-pil ${p.buka ? "bg-hijau" : "bg-tinta-5"}`}
                  />
                  {p.buka ? "Buka" : "Tutup"} · {jarakSingkat(p.jarak)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layar>
  );
}
