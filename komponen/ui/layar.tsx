import type { CSSProperties } from "react";
import { BilahStatus } from "./bilah-status";
import { NavBawah } from "@/komponen/nav/nav-bawah";

/** Tinggi navigasi bawah berikut area aman perangkat. */
const TINGGI_NAV = "calc(62px + env(safe-area-inset-bottom))";

/**
 * Kerangka satu layar aplikasi.
 *
 * Tinggi bingkainya dikunci setinggi layar dan isinya yang bergulir,
 * bukan halamannya. Itu yang membuat bilah status tetap di atas dan
 * navigasi tetap di bawah persis seperti aplikasi asli, alih-alih ikut
 * terdorong keluar layar saat daftar memanjang.
 */
export function Layar({
  children,
  nav,
  melayang,
  lembar,
  peran = "pembeli",
  latar = "bg-krem",
  statusGelap = false,
}: {
  children: React.ReactNode;
  /** Sembunyikan navigasi bawah untuk layar yang berdiri sendiri. */
  nav?: boolean;
  /** Lapisan yang mengambang di atas isi, misalnya kartu navigasi. */
  melayang?: React.ReactNode;
  /**
   * Lembar yang naik dari dasar layar.
   *
   * Punya slot sendiri, bukan ditaruh di dalam `children`, karena ia
   * harus dijangkarkan pada seluruh tinggi layar termasuk wilayah di
   * balik navigasi. Kalau ia ikut di dalam isi, jangkarnya berhenti di
   * tepi atas navigasi, sehingga lembarnya berangkat dari tengah layar
   * dan bukan dari balik navigasi.
   */
  lembar?: React.ReactNode;
  peran?: "pembeli" | "pedagang";
  latar?: string;
  statusGelap?: boolean;
}) {
  return (
    <div
      className={`relative flex h-[100dvh] flex-col overflow-hidden ${latar}`}
      /* Diturunkan sebagai variabel supaya lembar tahu berapa tinggi
         navigasi yang harus disisakan, tanpa perlu menebak sendiri atau
         menerima angka lewat prop di setiap pemakaian. Layar tanpa
         navigasi menyetelnya nol. */
      style={{ "--sisa-nav": nav ? TINGGI_NAV : "0px" } as CSSProperties}
    >
      <BilahStatus gelap={statusGelap} />
      {/* Lapisan melayang dijangkarkan pada wilayah di atas navigasi,
          bukan pada seluruh layar. Kalau dijangkarkan ke dasar layar, ia
          harus menebak tinggi navigasi berikut area aman perangkat, dan
          tebakan itu meleset di ponsel berponi. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="isi-layar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </div>
        {melayang}
      </div>
      {nav && <NavBawah peran={peran} />}
      {lembar}
    </div>
  );
}
