"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { SLUG_GEROBAK_SAYA } from "@/lib/data/pedagang";
import { pemberitahuan } from "@/lib/notifikasi";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/** Lonceng pemberitahuan berikut lencana jumlah yang belum dibaca. */
export function Lonceng({
  nada = "hijau",
  ukuran = 36,
}: {
  /** `hijau` lingkaran hijau muda, dipakai di atas latar terang. */
  nada?: "hijau" | "putih" | "polos";
  /** Sisi kotaknya dalam piksel, supaya bisa disejajarkan dengan tetangganya di bilah atas beranda. */
  ukuran?: number;
}) {
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
      aria-label={
        belum > 0 ? `Notifikasi, ${belum} belum dibaca` : "Notifikasi"
      }
      style={{ width: ukuran, height: ukuran }}
      className={`relative grid shrink-0 place-items-center rounded-full transition-transform active:scale-90 ${
        nada === "putih"
          ? "bg-white/15 text-white"
          : nada === "polos"
            ? "border border-garis bg-white text-tinta-2"
            : "bg-hijau-lembut text-hijau"
      }`}
    >
      <Bell size={ukuran >= 44 ? 19 : 17} strokeWidth={2} />
      {belum > 0 && (
        /* Angkanya ikut ditulis, bukan cuma titik merah. */
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
