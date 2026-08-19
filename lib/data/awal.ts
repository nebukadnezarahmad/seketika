import type { Percakapan, Pesanan, PesananMasuk, TitikKumpul } from "@/lib/tipe";

/**
 * Keadaan contoh saat aplikasi pertama dibuka.
 *
 * Isinya diambil dari layar-layar di berkas desain supaya aplikasi yang
 * baru dipasang tidak menyambut penggunanya dengan daftar kosong. Semua
 * data ini bisa diubah dan ditimpa lewat pemakaian biasa.
 */

const hariLalu = (n: number, jam: number, menit: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(jam, menit, 0, 0);
  return d.toISOString();
};

export const pesananAwal: Pesanan[] = [
  {
    id: "ord-001",
    pedagangSlug: "bakso-pak-anton",
    baris: [
      { menuId: "m-05", nama: "Bakso Ikan", harga: 13000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "diproses",
    dibuatPada: hariLalu(0, 9, 41),
    alamat: "Bumi Marina Emas Selatan No.12",
  },
  {
    id: "ord-002",
    pedagangSlug: "nasi-goreng-bu-siti",
    baris: [{ menuId: "m-06", nama: "Nasi Goreng Spesial", harga: 17000, jumlah: 1 }],
    status: "selesai",
    dibuatPada: hariLalu(1, 18, 30),
    alamat: "Bumi Marina Emas Selatan No.12",
  },
  {
    id: "ord-003",
    pedagangSlug: "mie-ayam-mas-budi",
    baris: [{ menuId: "m-10", nama: "Mie Ayam Bakso", harga: 12000, jumlah: 2 }],
    status: "selesai",
    dibuatPada: hariLalu(2, 12, 15),
    alamat: "Bumi Marina Emas Selatan No.12",
  },
  {
    id: "ord-004",
    pedagangSlug: "es-teh-kang-asep",
    baris: [{ menuId: "m-11", nama: "Es Teh Spesial", harga: 6000, jumlah: 3 }],
    status: "dibatalkan",
    dibuatPada: hariLalu(3, 14, 0),
    alamat: "Bumi Marina Emas Selatan No.12",
  },
];

const jamDepan = (n: number) => new Date(Date.now() + n * 3_600_000).toISOString();

export const titikKumpulAwal: TitikKumpul[] = [
  {
    id: "tk-01",
    nama: "RT 05 Blok C",
    patokan: "Pos Ronda, Bumi Marina Emas",
    pedagangSlug: "siomay-pak-agus",
    target: 5,
    peserta: [
      { id: "w-01", nama: "Bu Rahma", inisial: "R" },
      { id: "w-02", nama: "Pak Dedi", inisial: "D" },
      { id: "w-03", nama: "Neng Siska", inisial: "S" },
    ],
    status: "mengumpulkan",
    kedaluwarsa: jamDepan(22),
    jarak: 120,
  },
  {
    id: "tk-02",
    nama: "RT 03 Perumahan Indah",
    patokan: "Taman Bermain RT 03",
    pedagangSlug: "siomay-pak-agus",
    target: 4,
    peserta: [
      { id: "w-04", nama: "Bang Roni", inisial: "R" },
      { id: "w-05", nama: "Bu Wati", inisial: "W" },
    ],
    status: "mengumpulkan",
    kedaluwarsa: jamDepan(9),
    jarak: 340,
  },
  {
    id: "tk-03",
    nama: "RT 07 Taman Asri",
    patokan: "Pos Satpam RT 07",
    pedagangSlug: "siomay-pak-agus",
    target: 5,
    peserta: [
      { id: "w-06", nama: "Bu Lina", inisial: "L" },
      { id: "w-07", nama: "Pak Soni", inisial: "S" },
      { id: "w-08", nama: "Bu Ningsih", inisial: "N" },
      { id: "w-09", nama: "Mas Yudi", inisial: "Y" },
    ],
    status: "mengumpulkan",
    kedaluwarsa: jamDepan(4),
    jarak: 610,
  },
];

export const percakapanAwal: Percakapan[] = [
  {
    id: "ch-01",
    nama: "Bakso Pak Anton",
    pedagangSlug: "bakso-pak-anton",
    pesan: [
      { id: "p1", saya: true, isi: "Kak, saya pesan 2 bakso urat sama 1 es teh ya", waktu: "09:38" },
      { id: "p2", saya: false, isi: "Siap kak! Ditunggu ya, kurang lebih 10 menit.", waktu: "09:39" },
      { id: "p3", saya: true, isi: "Oke, saya tunggu di depan gerbang", waktu: "09:41" },
      { id: "p4", saya: false, isi: "Pesanan Anda sedang kami siapkan ya!", waktu: "09:43" },
    ],
  },
  {
    id: "ch-02",
    nama: "Sayur Kang Ucup",
    pesan: [
      { id: "p1", saya: true, isi: "Kang, bayam sama kangkungnya ada ga?", waktu: "16:10" },
      { id: "p2", saya: false, isi: "Ada kak, bayam 1 ikat 3000, kangkung 2500 per ikat.", waktu: "16:12" },
      { id: "p3", saya: true, isi: "Ambil 2 bayam sama 2 kangkung ya kang", waktu: "16:13" },
      { id: "p4", saya: false, isi: "Siap kak, total 11.000.", waktu: "16:15" },
      { id: "p5", saya: true, isi: "Oke dibayar cash ya kang", waktu: "16:16" },
      { id: "p6", saya: false, isi: "Makasih banyak kak! \u{1F64F}", waktu: "16:20" },
    ],
  },
  {
    id: "ch-03",
    nama: "Donat Bu Jasmin",
    pesan: [
      { id: "p1", saya: true, isi: "Bu, donatnya masih ada ga?", waktu: "10:00" },
      { id: "p2", saya: false, isi: "Masih kak! Mau berapa? Ada coklat, gula, sama keju.", waktu: "10:02" },
      { id: "p3", saya: true, isi: "3 coklat, 2 keju ya bu", waktu: "10:03" },
      { id: "p4", saya: false, isi: "Oke kak, total 12.500 ya.", waktu: "10:05" },
      { id: "p5", saya: true, isi: "Donat cokelatnya enak banget bu!", waktu: "10:40" },
    ],
  },
  {
    id: "ch-04",
    nama: "Nasi Goreng Bu Siti",
    pedagangSlug: "nasi-goreng-bu-siti",
    pesan: [
      { id: "p1", saya: true, isi: "Bu Siti, pesan nasi goreng spesial 1 porsi", waktu: "18:20" },
      { id: "p2", saya: false, isi: "Siap kak! 15 menit ya.", waktu: "18:21" },
      { id: "p3", saya: false, isi: "Nasi goreng spesialnya sudah siap kak", waktu: "18:36" },
    ],
  },
];

/** Foto dan status daring lawan bicara, dipetakan dari id percakapan. */
export const rupaPercakapan: Record<string, { foto: string; daring: boolean; kapan: string }> = {
  "ch-01": { foto: "/img/foto-bakso.jpg", daring: true, kapan: "09:43" },
  "ch-02": { foto: "/img/foto-sayur.jpg", daring: true, kapan: "Kemarin" },
  "ch-03": { foto: "/img/foto-donat.jpg", daring: false, kapan: "Sen" },
  "ch-04": { foto: "/img/foto-nasgor.jpg", daring: false, kapan: "Ming" },
};

/**
 * Pesanan yang masuk ke gerobak, isinya mengikuti layar pedagang di
 * berkas desain: Bu Rahma dan Pak Dedi masih baru, Kak Budi sedang
 * diproses, sisanya sudah selesai hari ini.
 */
export const pesananMasukAwal: PesananMasuk[] = [
  {
    id: "in-01",
    warga: "Bu Rahma",
    inisial: "R",
    titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "baru",
    menitLalu: 5,
  },
  {
    id: "in-02",
    warga: "Pak Dedi",
    inisial: "D",
    titik: "RT 05 Blok C · Pos 2",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 3 },
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 2 },
    ],
    status: "baru",
    menitLalu: 8,
  },
  {
    id: "in-03",
    warga: "Kak Budi",
    inisial: "B",
    titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 4 },
    ],
    status: "diproses",
    menitLalu: 20,
  },
  {
    id: "in-04",
    warga: "Bu Lina",
    inisial: "L",
    titik: "RT 05 Blok C · Pos Ronda",
    baris: [{ menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 }],
    status: "selesai",
    menitLalu: 45,
  },
  {
    id: "in-05",
    warga: "Pak Soni",
    inisial: "S",
    titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 2 },
      { menuId: "m-10", nama: "Mie Ayam Bakso", harga: 12000, jumlah: 1 },
    ],
    status: "selesai",
    menitLalu: 62,
  },
];
