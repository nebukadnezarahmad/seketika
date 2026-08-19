import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ElementType } from "react";

export type Warna = "hijau" | "biru" | "ungu" | "amber" | "merah";

const warna: Record<Warna, string> = {
  hijau: "bg-hijau-lembut text-hijau",
  biru: "bg-[#e8f0fe] text-[#2563eb]",
  ungu: "bg-[#f3e8ff] text-[#9333ea]",
  amber: "bg-amber/12 text-amber-tua",
  merah: "bg-merah/10 text-merah",
};

/**
 * Satu baris dalam daftar pengaturan: kotak ikon berwarna, judul,
 * keterangan, lalu tanda panah. Dipakai di profil pembeli dan pedagang.
 */
export function BarisMenu({
  Ikon,
  nada = "hijau",
  judul,
  isi,
  href,
  onClick,
  akhir,
}: {
  Ikon: ElementType;
  nada?: Warna;
  judul: string;
  isi?: string;
  href?: string;
  onClick?: () => void;
  /** Baris terakhir tidak memerlukan garis pemisah. */
  akhir?: boolean;
}) {
  const dalam = (
    <>
      <span className={`grid size-10 shrink-0 place-items-center rounded-[12px] ${warna[nada]}`}>
        <Ikon size={18} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[14px] font-bold text-tinta">{judul}</span>
        {isi && <span className="mt-0.5 block text-[11.5px] leading-snug text-tinta-4">{isi}</span>}
      </span>
      <ChevronRight size={17} className="shrink-0 text-tinta-5" />
    </>
  );

  const kelas = `flex w-full items-center gap-3 px-3.5 py-3 ${
    akhir ? "" : "border-b border-garis"
  }`;

  if (href) {
    return (
      <Link href={href} className={kelas}>
        {dalam}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={kelas}>
      {dalam}
    </button>
  );
}
