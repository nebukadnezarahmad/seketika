import type { StatusTitik, TitikKumpul } from "@/lib/tipe";

/** Keadaan titik kumpul yang sebenarnya pada suatu saat. */
export function statusTitik(
  titik: TitikKumpul,
  sekarang: number | null,
): StatusTitik {
  /* Yang sudah dijemput atau selesai tidak bisa hangus. */
  if (titik.status === "dijemput" || titik.status === "selesai")
    return titik.status;

  const cukup = titik.peserta.length >= titik.target;
  if (cukup) return "tercapai";

  if (sekarang === null) return titik.status;
  return new Date(titik.kedaluwarsa).getTime() <= sekarang
    ? "hangus"
    : "mengumpulkan";
}

/** Menunggu keputusan pedagang. */
export function menungguPedagang(
  titik: TitikKumpul,
  sekarang: number | null,
): boolean {
  return statusTitik(titik, sekarang) === "tercapai";
}

/** Jarak dibagi kecepatan jalan kaki, dibulatkan ke menit terdekat. */
const KELOK = 1.35;
const METER_PER_MENIT = 85;

/** Perkiraan lama tempuh ke satu titik kumpul, dalam menit. */
export function menitTempuh(jarak: number): number {
  return Math.max(
    1,
    Math.round((Math.round((jarak * KELOK) / 10) * 10) / METER_PER_MENIT),
  );
}

/** Masih menerima peserta baru. */
export function masihMengumpulkan(
  titik: TitikKumpul,
  sekarang: number | null,
): boolean {
  return statusTitik(titik, sekarang) === "mengumpulkan";
}

export const labelStatusTitik: Record<StatusTitik, string> = {
  mengumpulkan: "Aktif",
  tercapai: "Tercapai",
  dijemput: "Dijemput",
  selesai: "Selesai",
  hangus: "Hangus",
};
