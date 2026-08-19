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
  peran = "pembeli",
  latar = "bg-krem",
  statusGelap = false,
}: {
  children: React.ReactNode;
  /** Sembunyikan navigasi bawah untuk layar yang berdiri sendiri. */
  nav?: boolean;
  peran?: "pembeli" | "pedagang";
  latar?: string;
  statusGelap?: boolean;
}) {
  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden ${latar}`}>
      <BilahStatus gelap={statusGelap} />
      <div className="isi-layar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </div>
      {nav && <NavBawah peran={peran} />}
    </div>
  );
}
