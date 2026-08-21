import Image from "next/image";
import Link from "next/link";
import { ChevronRight, User, Users } from "lucide-react";
import { jarakSingkat } from "@/lib/format";
import type { Pedagang } from "@/lib/tipe";

/** Isi lembar pedagang: nama, tautan ke menu, dan dua cara memesan. */
export function IsiPedagang({ pedagang }: { pedagang: Pedagang }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Image
          src={pedagang.foto}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-[14px] object-cover"
        />
        <div className="min-w-0">
          <p className="tulisan-judul truncate text-[17px] font-extrabold text-hijau">
            {pedagang.nama}
          </p>
          <p className="text-[12px] text-tinta-4">
            {pedagang.jenis} · {jarakSingkat(pedagang.jarak)}
          </p>
        </div>
      </div>

      <Link
        href={`/pedagang/${pedagang.slug}/menu`}
        className="mt-4 inline-flex items-center rounded-full border-[1.5px] border-tinta px-3.5 py-2 text-[15px] font-extrabold text-tinta transition-transform active:scale-[0.98]"
      >
        Lihat Daftar Menu?
      </Link>

      <p className="mt-4 text-[13px] text-tinta-4">
        Bagaimana kamu ingin memesan?
      </p>

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
              <span className="text-[14px] font-bold text-white">
                Pesan dengan Kolaborasi
              </span>
              <span className="rounded-pil bg-hijau-neon px-1.5 py-0.5 text-[9px] font-extrabold tracking-[0.06em] text-hijau-gelap">
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
    </>
  );
}
