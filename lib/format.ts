import type { BarisPesanan } from "@/lib/tipe";

/** Pemformat yang dipakai berulang di seluruh layar. */

/**
 * Total satu pesanan.
 *
 * Dikumpulkan di sini karena ini logika uang, bukan tampilan. Sebelumnya
 * rumus yang sama diketik ulang di tiga layar, dan begitu perhitungannya
 * berubah, satu layar yang terlewat akan menampilkan total berbeda dari
 * dua lainnya.
 */
export function totalBaris(baris: BarisPesanan[]): number {
  return baris.reduce((jumlah, b) => jumlah + b.harga * b.jumlah, 0);
}

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 25000 -> "Rp 25.000". Intl menempelkan "Rp" tanpa spasi, jadi dipisah. */
export function rp(nilai: number): string {
  return rupiah.format(nilai).replace(/^Rp\s?/, "Rp ");
}

/** 1500 -> "1,5 km", 520 -> "520m". */
export function jarakSingkat(meter: number): string {
  if (meter < 1000) return `${meter}m`;
  return `${(meter / 1000).toFixed(1).replace(".", ",")} km`;
}

/** Perkiraan waktu tempuh jalan kaki, 80 meter per menit. */
export function menitJalan(meter: number): number {
  return Math.max(1, Math.round(meter / 80));
}

/** "Hari ini · 09:41", "Kemarin · 18:30", "3 hari lalu · 14:00". */
export function kapan(iso: string): string {
  const t = new Date(iso);
  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(t);

  const nol = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const selisih = Math.round((nol(new Date()) - nol(t)) / 86_400_000);

  if (selisih <= 0) return `Hari ini · ${jam}`;
  if (selisih === 1) return `Kemarin · ${jam}`;
  return `${selisih} hari lalu · ${jam}`;
}

/** Sisa waktu menuju sebuah tenggat, misalnya "22 jam lagi". */
export function sisaWaktu(iso: string): string {
  const selisih = new Date(iso).getTime() - Date.now();
  if (selisih <= 0) return "Sudah lewat";
  const jam = Math.floor(selisih / 3_600_000);
  if (jam >= 1) return `${jam} jam lagi`;
  return `${Math.max(1, Math.round(selisih / 60_000))} menit lagi`;
}
