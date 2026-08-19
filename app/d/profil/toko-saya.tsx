"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, BookOpen, Camera, Clock, MapPin, RotateCcw, Settings, ShoppingBag,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { BarisMenu } from "@/komponen/ui/baris-menu";
import { SLUG_GEROBAK_SAYA, gerobakSaya } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";


export function TokoSaya() {
  const router = useRouter();
  const gerobak = gerobakSaya();
  const profil = useToko((s) => s.profil);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const gantiPeran = useToko((s) => s.gantiPeran);
  const setelUlang = useToko((s) => s.setelUlang);

  return (
    <Layar nav peran="pedagang">
      <header className="gradasi-kumpul relative overflow-hidden px-4 pb-4 pt-3">
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]" />

        <div className="relative flex items-center justify-between">
          <h1 className="text-[19px] font-extrabold text-white">Toko Saya</h1>
          <button
            type="button"
            aria-label="Pengaturan"
            className="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
          >
            <Settings size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="relative mt-4 flex items-start gap-3.5">
          <span className="relative shrink-0">
            <Image
              src={gerobak.foto}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-[18px] object-cover ring-2 ring-white/25"
            />
            <BadgeCheck
              size={20}
              className="absolute -bottom-1 -right-1 fill-[#22c55e] text-white"
            />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[21px] font-extrabold leading-tight text-white">
              {profil?.namaUsaha || gerobak.nama}
            </p>
            <p className="mt-0.5 truncate text-[12.5px] text-white/65">
              {gerobak.jenis} · {profil?.nama ?? "Pak Anton"}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-pil bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white">
              <BadgeCheck size={13} strokeWidth={2.2} />
              Terverifikasi
            </span>
          </div>
        </div>

        <dl className="relative mt-4 grid grid-cols-2 rounded-[16px] bg-white/10 py-3">
          <div className="border-r border-white/15 text-center">
            <dd className="text-[20px] font-extrabold text-white">248</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Total Pesanan</dt>
          </div>
          <div className="text-center">
            <dd className="text-[20px] font-extrabold text-white">1.2K</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Warga Terlayani</dt>
          </div>
        </dl>
      </header>

      <div className="px-4 pb-5 pt-3">
        <div className="bayang-kartu flex items-center gap-3 rounded-[16px] border border-garis bg-white p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau">
            <ShoppingBag size={18} strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-tinta">Edit Profil Toko</p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-tinta-4">
              Nama, deskripsi, dan informasi kontak
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-[11px] bg-hijau px-4 py-2 text-[12px] font-bold text-white transition-transform active:scale-95"
          >
            Edit
          </button>
        </div>

        <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Kelola Toko
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={BookOpen}
            nada="hijau"
            judul="Kelola Menu"
            isi={`${gerobak.menu.length} item aktif`}
            href={`/pedagang/${SLUG_GEROBAK_SAYA}/menu`}
          />
          <BarisMenu
            Ikon={MapPin}
            nada="biru"
            judul="Area Jangkauan"
            isi="Bumi Marina Emas"
            href="/d/profil"
          />
          <BarisMenu
            Ikon={Clock}
            nada="amber"
            judul="Jam Operasional"
            isi="07.00 - 20.00"
            href="/d/profil"
          />
          <BarisMenu
            Ikon={Camera}
            nada="ungu"
            judul="Foto & Galeri"
            isi="3 foto diunggah"
            href="/d/profil"
            akhir
          />
        </div>

        <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Akun &amp; Analitik
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={ShoppingBag}
            nada="hijau"
            judul="Riwayat Pesanan"
            isi={`${pesananMasuk.length} pesanan tercatat`}
            href="/d/pesanan"
          />
          <BarisMenu
            Ikon={ShoppingBag}
            nada="biru"
            judul="Beralih ke Mode Pembeli"
            isi="Lihat aplikasi dari sisi warga"
            onClick={() => {
              gantiPeran("pembeli");
              router.push("/beranda");
            }}
          />
          <BarisMenu
            Ikon={RotateCcw}
            nada="merah"
            judul="Setel Ulang Data"
            isi="Kembalikan ke keadaan contoh"
            onClick={() => {
              setelUlang();
              router.push("/");
            }}
            akhir
          />
        </div>
      </div>
    </Layar>
  );
}
