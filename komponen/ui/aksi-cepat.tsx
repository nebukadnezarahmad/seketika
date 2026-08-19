import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/**
 * Deret pintasan layanan di beranda.
 *
 * Ini pola yang dipakai hampir semua super-app: satu kartu putih berisi
 * grid ikon persegi-membulat berwarna lembut, tiap ikon satu layanan.
 * Gunanya bukan sekadar hiasan — jalur ke fitur andalan tidak boleh
 * bersembunyi di balik gulir. "Titik Kumpul" ditaruh paling kiri karena
 * itu pembeda utama aplikasi ini, dan sebelumnya hanya bisa dicapai
 * lewat tautan di dalam halaman lain.
 *
 * Empat kolom, bukan lima: pada lebar 390px lima kolom menyisakan
 * label sempit yang terpaksa dipotong, sedangkan sebagian besar nama
 * layanan di sini dua kata.
 */
export type Pintasan = {
  label: string;
  href: string;
  Ikon: LucideIcon;
  /** Kelas latar dan warna ikon, dipasangkan dari token tema. */
  warna: string;
};

export function AksiCepat({ pintasan }: { pintasan: readonly Pintasan[] }) {
  return (
    <nav aria-label="Pintasan layanan" className="px-4 pt-3">
      <ul className="bayang-kartu grid grid-cols-4 items-start gap-1 rounded-[20px] border border-garis bg-white px-2 py-3.5">
        {pintasan.map(({ label, href, Ikon, warna }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-[14px] py-1 transition-transform active:scale-95"
            >
              <span
                aria-hidden
                className={`grid size-11 place-items-center rounded-[16px] ${warna}`}
              >
                <Ikon size={21} strokeWidth={2.1} />
              </span>
              {/* Tinggi minimum satu baris, bukan tinggi tetap dua baris.
                  Dengan tinggi tetap, label yang semuanya muat satu baris
                  menyisakan satu baris kosong di bawah kartu. Label yang
                  memang membungkus tetap boleh memanjang; `items-start`
                  pada butirnya yang menjaga baris ikon tetap sejajar. */}
              <span className="flex min-h-[13px] items-start text-center text-[10.5px] font-semibold leading-[13px] text-tinta-2">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
