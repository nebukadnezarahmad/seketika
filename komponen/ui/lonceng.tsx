"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { SLUG_GEROBAK_SAYA } from "@/lib/data/pedagang";
import { pemberitahuan } from "@/lib/notifikasi";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/**
 * Lonceng pemberitahuan berikut lencana jumlah yang belum dibaca.
 *
 * Sebelum ini, lonceng di dua layar berupa tombol tanpa penangan apa pun:
 * terlihat bisa ditekan, tapi tidak melakukan apa-apa. Sekarang ia tautan
 * sungguhan ke pusat pemberitahuan.
 *
 * Jumlahnya dihitung dari keadaan yang sama dengan yang dipakai layar
 * tujuannya, jadi angka pada lencana tidak bisa berbeda dengan isi yang
 * ditemukan pengguna setelah mengetuknya.
 */
export function Lonceng({ nada = "hijau" }: { nada?: "hijau" | "putih" }) {
  const profil = useToko((s) => s.profil);
  const pesanan = useToko((s) => s.pesanan);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const dibaca = useToko((s) => s.notifikasiDibaca);
  const sekarang = useSekarang();

  const daftar = pemberitahuan(
    profil?.peran ?? "pembeli",
    { pesanan, pesananMasuk, titikKumpul, slugGerobak: SLUG_GEROBAK_SAYA },
    sekarang,
  );
  const belum = daftar.filter((n) => !dibaca.includes(n.id)).length;

  return (
    <Link
      href="/notifikasi"
      aria-label={belum > 0 ? `Notifikasi, ${belum} belum dibaca` : "Notifikasi"}
      className={`relative grid size-9 shrink-0 place-items-center rounded-full transition-transform active:scale-90 ${
        nada === "putih" ? "bg-white/15 text-white" : "bg-hijau-lembut text-hijau"
      }`}
    >
      <Bell size={17} strokeWidth={2} />
      {belum > 0 && (
        /* Angkanya ikut ditulis, bukan cuma titik merah. Titik saja
           memaksa orang membuka layarnya untuk tahu ada berapa, dan bagi
           pembaca layar ia tidak berarti apa-apa. */
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid min-w-[17px] place-items-center rounded-full bg-merah px-1 text-[9.5px] font-bold leading-[17px] text-white ring-2 ring-krem"
        >
          {belum > 9 ? "9+" : belum}
        </span>
      )}
    </Link>
  );
}
