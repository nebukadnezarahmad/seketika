import Link from "next/link";
import type { ComponentProps } from "react";

type Rupa = "utama" | "garis" | "amber" | "halus" | "bahaya";

/* Bentuk pil (rounded-full), bukan sudut 14px seperti versi lama —
   tombol utama ala Gojek nyaris selalu berbentuk kapsul penuh. */
const dasar =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-[transform,background-color,border-color,opacity] duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-45";

const rupa: Record<Rupa, string> = {
  utama: "bg-hijau text-white hover:bg-hijau-gelap",
  garis: "border border-garis bg-white text-hijau hover:border-hijau/40",
  amber: "gradasi-amber text-white",
  halus: "bg-hijau-lembut text-hijau hover:bg-[#d9f2db]",
  bahaya: "border border-merah/30 bg-white text-merah hover:bg-merah-lembut",
};

const ukuran = {
  sm: "h-9 px-3.5 text-[12px]",
  md: "h-11 px-4 text-[13px]",
  lg: "h-[50px] px-5 text-[14px]",
} as const;

type Bersama = { rupa?: Rupa; ukur?: keyof typeof ukuran; penuh?: boolean };

export function Tombol({
  rupa: r = "utama",
  ukur = "lg",
  penuh,
  className = "",
  ...p
}: ComponentProps<"button"> & Bersama) {
  return (
    <button
      {...p}
      className={`${dasar} ${rupa[r]} ${ukuran[ukur]} ${penuh ? "w-full" : ""} ${className}`}
    />
  );
}

export function TombolTaut({
  rupa: r = "utama",
  ukur = "lg",
  penuh,
  className = "",
  ...p
}: ComponentProps<typeof Link> & Bersama) {
  return (
    <Link
      {...p}
      className={`${dasar} ${rupa[r]} ${ukuran[ukur]} ${penuh ? "w-full" : ""} ${className}`}
    />
  );
}
