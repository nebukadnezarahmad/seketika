import { totalBaris } from "@/lib/format";
import type { PesananMasuk } from "@/lib/tipe";

/** Perhitungan Buku Kas. */

/** Tengah malam pada hari yang berjarak `offset` hari ke belakang. */
function awalHari(sekarang: number, offset = 0): number {
  const d = new Date(sekarang);
  d.setHours(0, 0, 0, 0);
  /* Lewat `setDate`, bukan pengurangan 86.400.000 milidetik. */
  d.setDate(d.getDate() - offset);
  return d.getTime();
}

/** Menyaring pesanan yang benar-benar bisa dihitung. */
function terhitung(
  daftar: PesananMasuk[],
): { waktu: number; pesanan: PesananMasuk }[] {
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

/** Tujuh hari terakhir untuk grafik batang, urut dari paling lama ke hari ini. */
export function deretTujuhHari(
  daftar: PesananMasuk[],
  sekarang: number,
): TitikDeret[] {
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

/** Menu yang paling banyak terjual dalam `sejakHari` hari terakhir. */
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

  return [...kumpulan.values()].sort(
    (a, b) => b.porsi - a.porsi || b.total - a.total,
  );
}

export type RentangJam = { mulai: number; selesai: number; jumlah: number };

/** Lebar satu keranjang jam, dalam jam. */
const LEBAR_JAM = 2;

/** Rentang jam dengan pesanan terbanyak dalam tujuh hari terakhir. */
export function jamRamai(
  daftar: PesananMasuk[],
  sekarang: number,
): RentangJam[] {
  const batas = awalHari(sekarang, 6);
  const keranjang = new Map<number, number>();

  for (const { waktu } of terhitung(daftar)) {
    if (awalHari(waktu) < batas) continue;
    const mulai =
      Math.floor(new Date(waktu).getHours() / LEBAR_JAM) * LEBAR_JAM;
    keranjang.set(mulai, (keranjang.get(mulai) ?? 0) + 1);
  }

  return [...keranjang.entries()]
    .map(([mulai, jumlah]) => ({ mulai, selesai: mulai + LEBAR_JAM, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.mulai - b.mulai);
}

export type Banding = { persen: number; naik: boolean };

/** Selisih hari ini terhadap kemarin dalam persen. */
export function bandingHari(iniTotal: number, kemarinTotal: number): Banding {
  if (kemarinTotal <= 0) return { persen: 0, naik: iniTotal > 0 };
  const selisih = ((iniTotal - kemarinTotal) / kemarinTotal) * 100;
  return { persen: Math.round(Math.abs(selisih)), naik: selisih >= 0 };
}

/** "07.00", dari angka jam. Dipakai label rentang jam ramai. */
export function jamRapi(jam: number): string {
  return `${String(jam).padStart(2, "0")}.00`;
}

/* ------------------------------------------------------------------ Perhitungan langganan berbayar. */

/** Panjang satu daur laporan bulanan, dalam hari. */
export const HARI_BULANAN = 30;

export type LaporanBulanan = {
  total: number;
  jumlahPesanan: number;
  hariBerjualan: number;
  rataRataHarian: number;
  terbaik: { label: string; total: number } | null;
  /** Empat kelompok tujuh harian, dari yang paling lama ke yang terbaru. */
  mingguan: { label: string; total: number }[];
};

const TANGGAL_PENDEK = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

/** Rekap tiga puluh hari terakhir. */
export function laporanBulanan(
  daftar: PesananMasuk[],
  sekarang: number,
): LaporanBulanan {
  const perHari = new Map<number, number>();
  let jumlahPesanan = 0;
  const batas = awalHari(sekarang, HARI_BULANAN - 1);

  for (const { waktu, pesanan } of terhitung(daftar)) {
    const hari = awalHari(waktu);
    if (hari < batas) continue;
    perHari.set(hari, (perHari.get(hari) ?? 0) + totalBaris(pesanan.baris));
    jumlahPesanan += 1;
  }

  const total = [...perHari.values()].reduce((j, n) => j + n, 0);
  const hariBerjualan = perHari.size;

  let terbaik: LaporanBulanan["terbaik"] = null;
  for (const [hari, nilai] of perHari) {
    if (!terbaik || nilai > terbaik.total) {
      terbaik = { label: TANGGAL_PENDEK.format(new Date(hari)), total: nilai };
    }
  }

  const mingguan = [3, 2, 1, 0].map((ke) => {
    const mulai = awalHari(sekarang, ke * 7 + 6);
    const selesai = awalHari(sekarang, ke * 7);
    let jumlah = 0;
    for (const [hari, nilai] of perHari) {
      if (hari >= mulai && hari <= selesai) jumlah += nilai;
    }
    return {
      label: ke === 0 ? "Minggu ini" : `${ke + 1} minggu lalu`,
      total: jumlah,
    };
  });

  return {
    total,
    jumlahPesanan,
    hariBerjualan,
    rataRataHarian: hariBerjualan > 0 ? Math.round(total / hariBerjualan) : 0,
    terbaik,
    mingguan,
  };
}

export type Prakiraan = {
  titik: string;
  mulai: number;
  selesai: number;
  jumlah: number;
  total: number;
};

/** Kawasan dan jam yang paling sering menghasilkan pesanan. */
export function prakiraanRamai(
  daftar: PesananMasuk[],
  sekarang: number,
): Prakiraan[] {
  const batas = awalHari(sekarang, HARI_BULANAN - 1);
  const kotak = new Map<string, Prakiraan>();

  for (const { waktu, pesanan } of terhitung(daftar)) {
    if (awalHari(waktu) < batas) continue;
    const mulai =
      Math.floor(new Date(waktu).getHours() / LEBAR_JAM) * LEBAR_JAM;
    /* Kawasan diambil dari bagian pertama nama titik, sebelum tanda pemisah. */
    const titik = pesanan.titik.split("·")[0].trim();
    const kunci = `${titik}|${mulai}`;
    const ada = kotak.get(kunci);
    kotak.set(kunci, {
      titik,
      mulai,
      selesai: mulai + LEBAR_JAM,
      jumlah: (ada?.jumlah ?? 0) + 1,
      total: (ada?.total ?? 0) + totalBaris(pesanan.baris),
    });
  }

  return [...kotak.values()].sort(
    (a, b) => b.jumlah - a.jumlah || b.total - a.total,
  );
}

export type Nilai = { rata: number; jumlah: number };

/** Rata-rata bintang yang diterima satu gerobak. */
export function nilaiRataRata(
  pesanan: { id: string; pedagangSlug: string }[],
  penilaian: Record<string, number>,
  slug: string,
): Nilai | null {
  const angka = pesanan
    .filter((p) => p.pedagangSlug === slug)
    .map((p) => penilaian[p.id])
    .filter((n): n is number => typeof n === "number");

  if (angka.length === 0) return null;
  return {
    rata:
      Math.round((angka.reduce((j, n) => j + n, 0) / angka.length) * 10) / 10,
    jumlah: angka.length,
  };
}

export type RincianHari = {
  total: number;
  jumlahPesanan: number;
  menu: BarisMenuTerlaris[];
  jam: RentangJam[];
};

/** Rincian satu hari saja, dipakai saat batang grafik diketuk. */
export function rincianHari(
  daftar: PesananMasuk[],
  sekarang: number,
  offsetHari: number,
): RincianHari {
  const hari = awalHari(sekarang, offsetHari);
  const pada = terhitung(daftar).filter((x) => awalHari(x.waktu) === hari);

  const kumpulan = new Map<string, BarisMenuTerlaris>();
  const keranjang = new Map<number, number>();
  let total = 0;

  for (const { waktu, pesanan } of pada) {
    total += totalBaris(pesanan.baris);
    const mulai =
      Math.floor(new Date(waktu).getHours() / LEBAR_JAM) * LEBAR_JAM;
    keranjang.set(mulai, (keranjang.get(mulai) ?? 0) + 1);

    for (const b of pesanan.baris) {
      const ada = kumpulan.get(b.nama);
      kumpulan.set(b.nama, {
        nama: b.nama,
        porsi: (ada?.porsi ?? 0) + b.jumlah,
        total: (ada?.total ?? 0) + b.harga * b.jumlah,
      });
    }
  }

  return {
    total,
    jumlahPesanan: pada.length,
    menu: [...kumpulan.values()].sort(
      (a, b) => b.porsi - a.porsi || b.total - a.total,
    ),
    jam: [...keranjang.entries()]
      .map(([mulai, jumlah]) => ({ mulai, selesai: mulai + LEBAR_JAM, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah || a.mulai - b.mulai),
  };
}

const HARI_PANJANG = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

/** "Kamis, 20 Agu" dari offset hari. Dipakai judul rincian harian. */
export function labelHari(sekarang: number, offsetHari: number): string {
  const d = new Date(awalHari(sekarang, offsetHari));
  return `${HARI_PANJANG[d.getDay()]}, ${TANGGAL_PENDEK.format(d)}`;
}
