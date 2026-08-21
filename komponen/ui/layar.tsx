import type { CSSProperties } from "react";
import { BilahStatus } from "./bilah-status";
import { NavBawah } from "@/komponen/nav/nav-bawah";

/** Tinggi navigasi bawah berikut area aman perangkat. */
const TINGGI_NAV = "calc(62px + env(safe-area-inset-bottom))";

/** Kerangka satu layar aplikasi. */
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
  /** Lembar yang naik dari dasar layar. */
  lembar?: React.ReactNode;
  peran?: "pembeli" | "pedagang";
  latar?: string;
  statusGelap?: boolean;
}) {
  return (
    <div
      className={`relative flex h-[100dvh] flex-col overflow-hidden ${latar}`}
      /* Diturunkan sebagai variabel supaya lembar tahu berapa tinggi navigasi yang harus disisakan, tanpa perlu menebak sendiri atau menerima angka lewat prop di setiap pemakaian. */
      style={{ "--sisa-nav": nav ? TINGGI_NAV : "0px" } as CSSProperties}
    >
      <BilahStatus gelap={statusGelap} />
      {/* Lapisan melayang dijangkarkan pada wilayah di atas navigasi, bukan pada seluruh layar. */}
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
