"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Peta } from "@/komponen/peta/peta";
import { daftarPedagang } from "@/lib/data/pedagang";
import { jarakSingkat } from "@/lib/format";
import type { Pedagang } from "@/lib/tipe";

/**
 * Kartu pedagang yang naik dari bawah, di atas peta.
 *
 * Layar ini menawarkan dua cara memesan yang berbeda watak: memanggil
 * pedagang sendirian, atau menumpang pada titik kumpul tetangga. Yang
 * kedua diberi kartu hijau pekat karena itulah yang membedakan SEKETIKA
 * dari aplikasi pesan-antar biasa.
 */
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
          tanda={daftarPedagang.map((p) => ({ id: p.id, x: p.posisi.x, y: p.posisi.y }))}
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
          <span aria-hidden className="mx-auto mb-4 block h-1 w-9 rounded-pil bg-tinta-5/60" />

          <div className="flex items-center gap-3">
            <Image
              src={pedagang.foto}
              alt=""
              width={48}
              height={48}
              className="size-12 rounded-[14px] object-cover"
            />
            <div className="min-w-0">
              <p className="tulisan-judul truncate text-[17px] font-extrabold text-hijau">{pedagang.nama}</p>
              <p className="text-[12px] text-tinta-4">{jarakSingkat(pedagang.jarak)}</p>
            </div>
          </div>

          <Link
            href={`/pedagang/${pedagang.slug}/menu`}
            className="mt-4 inline-flex items-center rounded-full border-[1.5px] border-tinta px-3.5 py-2 text-[15px] font-extrabold text-tinta transition-transform active:scale-[0.98]"
          >
            Lihat Daftar Menu?
          </Link>

          <p className="mt-4 text-[13px] text-tinta-4">Bagaimana kamu ingin memesan?</p>

          <div className="mt-3 flex flex-col gap-3">
            <Link
              href={`/pedagang/${pedagang.slug}/menu`}
              className="bayang-kartu flex items-center gap-3 rounded-[20px] border border-garis bg-white p-3.5 transition-transform active:scale-[0.99]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-hijau-lembut text-hijau">
                <User size={19} strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-hijau">
                  Panggil Pedagang ke Lokasi Anda
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-tinta-3">
                  Panggil pedagang menuju lokasi Anda sekarang!
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-tinta-5" />
            </Link>

            <Link
              href={`/kolab?pedagang=${pedagang.slug}`}
              className="flex items-center gap-3 rounded-[20px] bg-hijau p-3.5 shadow-[0_4px_14px_rgb(0_134_15/0.28)] transition-transform active:scale-[0.99]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                <Users size={19} strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-white">Pesan dengan Kolaborasi</span>
                  <span className="rounded-pil bg-hijau-neon px-1.5 py-0.5 text-[9px] font-extrabold tracking-[0.06em] text-hijau">
                    BARU
                  </span>
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-white/75">
                  Gabung atau buat titik kumpul bareng tetangga
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-white/70" />
            </Link>
          </div>
        </div>
      </div>
    </Layar>
  );
}
