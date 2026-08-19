import { BilahStatus } from "./bilah-status";
import { NavBawah } from "@/komponen/nav/nav-bawah";

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
  peran = "pembeli",
  latar = "bg-krem",
  statusGelap = false,
}: {
  children: React.ReactNode;
  /** Sembunyikan navigasi bawah untuk layar yang berdiri sendiri. */
  nav?: boolean;
  /** Lapisan yang mengambang di atas isi, misalnya kartu navigasi. */
  melayang?: React.ReactNode;
  peran?: "pembeli" | "pedagang";
  latar?: string;
  statusGelap?: boolean;
}) {
  return (
    <div className={`relative flex h-[100dvh] flex-col overflow-hidden ${latar}`}>
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
    </div>
  );
}
