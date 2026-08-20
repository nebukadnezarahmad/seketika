import { totalBaris } from "@/lib/format";
import type { PesananMasuk } from "@/lib/tipe";

/**
 * Perhitungan Buku Kas.
 *
 * Dipisahkan dari komponennya, sama alasannya dengan `lib/format.ts`:
 * ini logika uang, bukan tampilan, dan logika uang harus bisa diuji
 * tanpa merender apa pun.
 *
 * Dua aturan yang berlaku di seluruh berkas ini:
 *
 * 1. Nominal selalu lewat `totalBaris()`, tidak pernah menulis ulang
 *    `harga × jumlah`. Rumus itu pernah tersebar di tiga layar dan mulai
 *    menyimpang satu sama lain.
 * 2. Tidak ada satu pun pemanggilan `Date.now()` di sini. Waktu masuk
 *    sebagai parameter `sekarang`, persis seperti `sisaWaktu()`. Kalau
 *    dibaca diam-diam di dalam, fungsinya berhenti murni: hasil di
 *    server tidak akan cocok dengan hasil di peramban, dan angkanya
 *    berubah tanpa ada yang menyuruh.
 */

/** Tengah malam pada hari yang berjarak `offset` hari ke belakang. */
function awalHari(sekarang: number, offset = 0): number {
  const d = new Date(sekarang);
  d.setHours(0, 0, 0, 0);
  /* Lewat `setDate`, bukan pengurangan 86.400.000 milidetik. Keduanya
     sama hasilnya di Indonesia yang tidak mengenal waktu musim panas,
     tapi pengurangan mentah meleset satu jam di zona yang mengenalnya,
     dan meleset satu jam artinya pesanan pukul 00.30 jatuh ke hari yang
     salah. */
  d.setDate(d.getDate() - offset);
  return d.getTime();
}

/**
 * Menyaring pesanan yang benar-benar bisa dihitung.
 *
 * Yang lolos hanya pesanan berstatus selesai dan bertanggal. Pesanan
 * selesai tanpa `selesaiPada` datang dari penyimpanan versi lama;
 * memasukkannya berarti menebak tanggalnya, dan tebakan pada angka uang
 * lebih buruk daripada tidak menampilkannya sama sekali.
 */
function terhitung(daftar: PesananMasuk[]): { waktu: number; pesanan: PesananMasuk }[] {
  return daftar
    .filter((p) => p.status === "selesai" && p.selesaiPada)
    .map((p) => ({ waktu: new Date(p.selesaiPada!).getTime(), pesanan: p }))
    .filter((x) => Number.isFinite(x.waktu));
}

/** Total rupiah pada satu hari, `offsetHari` hari ke belakang dari hari ini. */
export function pendapatanHari(
  daftar: PesananMasuk[],
  sekarang: number,
  offsetHari = 0,
): number {
  const hari = awalHari(sekarang, offsetHari);
  return terhitung(daftar)
    .filter((x) => awalHari(x.waktu) === hari)
    .reduce((jumlah, x) => jumlah + totalBaris(x.pesanan.baris), 0);
}

const NAMA_HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export type TitikDeret = { label: string; iso: string; total: number };

/**
 * Tujuh hari terakhir untuk grafik batang, urut dari paling lama ke hari
 * ini. Hari ini selalu jadi butir terakhir supaya batangnya berada di
 * ujung kanan, arah yang sama dengan cara orang membaca garis waktu.
 */
export function deretTujuhHari(daftar: PesananMasuk[], sekarang: number): TitikDeret[] {
  return Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const hari = new Date(awalHari(sekarang, offset));
    return {
      label: NAMA_HARI[hari.getDay()],
      iso: hari.toISOString(),
      total: pendapatanHari(daftar, sekarang, offset),
    };
  });
}

export type BarisMenuTerlaris = { nama: string; porsi: number; total: number };

/**
 * Menu yang paling banyak terjual dalam `sejakHari` hari terakhir.
 *
 * Urutannya menurut jumlah porsi, bukan menurut rupiah. "Terlaris"
 * berarti paling banyak berpindah tangan; menu murah yang selalu ikut
 * dipesan memang pantas berada di atas menu mahal yang sesekali laku,
 * dan justru itu keterangan yang berguna buat memutuskan berapa banyak
 * yang harus disiapkan besok. Nominalnya tetap ikut ditampilkan supaya
 * sisi uangnya tidak hilang.
 */
export function menuTerlaris(
  daftar: PesananMasuk[],
  sekarang: number,
  sejakHari = 7,
): BarisMenuTerlaris[] {
  const batas = awalHari(sekarang, sejakHari - 1);
  const kumpulan = new Map<string, BarisMenuTerlaris>();

  for (const { waktu, pesanan } of terhitung(daftar)) {
    if (awalHari(waktu) < batas) continue;
    for (const b of pesanan.baris) {
      const ada = kumpulan.get(b.nama);
      const porsi = (ada?.porsi ?? 0) + b.jumlah;
      const total = (ada?.total ?? 0) + b.harga * b.jumlah;
      kumpulan.set(b.nama, { nama: b.nama, porsi, total });
    }
  }

  return [...kumpulan.values()].sort((a, b) => b.porsi - a.porsi || b.total - a.total);
}

export type RentangJam = { mulai: number; selesai: number; jumlah: number };

/** Lebar satu keranjang jam, dalam jam. */
const LEBAR_JAM = 2;

/**
 * Rentang jam dengan pesanan terbanyak dalam tujuh hari terakhir.
 *
 * Dikelompokkan per dua jam, bukan per jam. Per jam, pesanan yang
 * sebenarnya satu gelombang sore terpecah jadi beberapa batang kecil
 * yang tidak menonjol; dua jam cukup lebar untuk memunculkan polanya
 * tapi masih cukup sempit untuk ditindaklanjuti pedagang.
 */
export function jamRamai(daftar: PesananMasuk[], sekarang: number): RentangJam[] {
  const batas = awalHari(sekarang, 6);
  const keranjang = new Map<number, number>();

  for (const { waktu } of terhitung(daftar)) {
    if (awalHari(waktu) < batas) continue;
    const mulai = Math.floor(new Date(waktu).getHours() / LEBAR_JAM) * LEBAR_JAM;
    keranjang.set(mulai, (keranjang.get(mulai) ?? 0) + 1);
  }

  return [...keranjang.entries()]
    .map(([mulai, jumlah]) => ({ mulai, selesai: mulai + LEBAR_JAM, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.mulai - b.mulai);
}

export type Banding = { persen: number; naik: boolean };

/**
 * Selisih hari ini terhadap kemarin dalam persen.
 *
 * Ketika kemarin nol, persentase tidak punya arti matematis: tidak ada
 * yang bisa dibagi. Yang dikembalikan nol, dan pemanggilnya wajib
 * memeriksa sendiri apakah kemarin memang nol sebelum menampilkan
 * perbandingan. Menampilkan "+0% dari kemarin" pada hari pertama
 * berjualan akan terbaca sebagai tidak ada kemajuan, padahal yang benar
 * adalah belum ada pembandingnya.
 */
export function bandingHari(iniTotal: number, kemarinTotal: number): Banding {
  if (kemarinTotal <= 0) return { persen: 0, naik: iniTotal > 0 };
  const selisih = ((iniTotal - kemarinTotal) / kemarinTotal) * 100;
  return { persen: Math.round(Math.abs(selisih)), naik: selisih >= 0 };
}

/** "07.00", dari angka jam. Dipakai label rentang jam ramai. */
export function jamRapi(jam: number): string {
  return `${String(jam).padStart(2, "0")}.00`;
}
