"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/**
 * Kepala halaman dengan tombol kembali di kiri dan judul di tengah.
 *
 * Judulnya benar-benar berada di tengah layar, bukan sekadar di tengah
 * ruang sisa. Itu sebabnya ada elemen kosong selebar tombol di sisi
 * kanan: tanpanya judul akan meleset ke kanan sejauh lebar tombol.
 */
export function Kepala({
  judul,
  subjudul,
  kanan,
}: {
  judul: string;
  subjudul?: string;
  kanan?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-garis bg-krem/95 px-4 py-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Kembali"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-hijau transition-transform active:scale-90"
      >
        <ChevronLeft size={18} strokeWidth={2.4} />
      </button>

      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-[15px] font-bold leading-tight text-hijau">{judul}</p>
        {subjudul && (
          <p className="truncate text-[11px] leading-tight text-tinta-4">{subjudul}</p>
        )}
      </div>

      <div className="grid size-9 shrink-0 place-items-center">{kanan}</div>
    </header>
  );
}
