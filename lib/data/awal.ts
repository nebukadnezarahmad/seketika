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
  {
    id: "tk-04",
    nama: "RT 02 Taman Bermain",
    patokan: "Taman Bermain RT 02",
    pedagangSlug: "bakso-pak-anton",
    target: 6,
    peserta: [
      { id: "w-10", nama: "Bu Tuti", inisial: "T" },
      { id: "w-11", nama: "Pak Har", inisial: "H" },
      { id: "w-12", nama: "Mbak Ayu", inisial: "A" },
      { id: "w-17", nama: "Pak Bambang", inisial: "B" },
      { id: "w-18", nama: "Bu Marni", inisial: "M" },
      { id: "w-19", nama: "Mas Fajar", inisial: "F" },
    ],
    status: "mengumpulkan",
    kedaluwarsa: jamDepan(15),
    jarak: 210,
  },
  /* Permintaan kedua untuk gerobak sendiri. Keduanya sudah memenuhi
     target, karena pedagang memang baru dipanggil setelah wargalah yang
     terkumpul cukup; titik kumpul yang masih mengumpulkan belum jadi
     urusannya. Dua permintaan, bukan satu, supaya hilangnya satu kotak
     setelah diselesaikan bisa dibedakan dari daftar yang memang kosong. */
  {
    id: "tk-05",
    nama: "RT 04 Gang Melati",
    patokan: "Warung Bu Yani, Gang Melati",
    pedagangSlug: "bakso-pak-anton",
    target: 4,
    peserta: [
      { id: "w-13", nama: "Bu Yani", inisial: "Y" },
      { id: "w-14", nama: "Pak Slamet", inisial: "S" },
      { id: "w-15", nama: "Mbak Rina", inisial: "R" },
      { id: "w-16", nama: "Bang Udin", inisial: "U" },
    ],
    status: "mengumpulkan",
    kedaluwarsa: jamDepan(6),
    jarak: 95,
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
    selesaiPada: hariLalu(0, 12, 5),
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
    selesaiPada: hariLalu(0, 11, 40),
  },
];

/**
 * Percakapan dari sisi pedagang: lawan bicaranya warga, bukan sesama
 * pedagang. Isinya mengikuti empat bingkai "Chat - Pedagang" di berkas
 * rancangan.
 *
 * Nama di bingkai ruang obrolan rancangan berbeda dengan nama di daftar
 * (Ahmad Fauzi dan Dewi Rahayu di ruang, Pak Dedi dan Bu Rahma di
 * daftar). Yang dipakai di sini nama dari daftar, karena nama itulah
 * yang cocok dengan cuplikan pesan terakhirnya, sekaligus sama dengan
 * nama pemesan di layar pesanan masuk.
 */
export const percakapanPedagangAwal: Percakapan[] = [
  {
    id: "cp-01",
    nama: "Pak Dedi",
    pesan: [
      { id: "p1", saya: false, isi: "Pak, baksonya masih ada ga? Mau pesan 3 porsi nih", waktu: "09:35" },
      { id: "p2", saya: true, isi: "Masih ada Mas! Lagi di sekitar Jl. Melati. 10 menit lagi sampai ya", waktu: "09:37" },
      { id: "p3", saya: false, isi: "Siap pak, saya tunggu di depan pos satpam", waktu: "09:40" },
      { id: "p4", saya: true, isi: "Oke, saya menuju ke sana sekarang!", waktu: "09:41" },
      { id: "p5", saya: false, isi: "Oke, saya tunggu di depan gerbang ya pak", waktu: "09:43" },
    ],
  },
  {
    id: "cp-02",
    nama: "Bu Rahma",
    pesan: [
      { id: "p1", saya: false, isi: "Pak, minta tolong berhenti sebentar di gang Mangga ya", waktu: "14:05" },
      { id: "p2", saya: true, isi: "Bisa bu, sekitar 5 menit lagi sampai", waktu: "14:06" },
      { id: "p3", saya: false, isi: "Mau beli 2 bakso urat sama 2 bakso tahu", waktu: "14:08" },
      { id: "p4", saya: true, isi: "Siap bu! Sudah sampai di gang Mangga", waktu: "14:11" },
      { id: "p5", saya: false, isi: "Makasih banyak pak, bungkusannya rapi!", waktu: "14:20" },
    ],
  },
  {
    id: "cp-03",
    nama: "Rizki Pratama",
    pesan: [
      { id: "p1", saya: false, isi: "Pak, hari ini lewat kompleks Permai ga?", waktu: "11:00" },
      { id: "p2", saya: true, isi: "Iya mas, biasanya jam 11 saya lewat sana", waktu: "11:01" },
      { id: "p3", saya: false, isi: "Wah sudah lewat belum? Saya mau beli nih", waktu: "11:30" },
      { id: "p4", saya: true, isi: "Aduh, tadi sudah lewat mas. Besok saya lewat lagi", waktu: "11:32" },
      { id: "p5", saya: false, isi: "Besok jualan lagi jam berapa pak?", waktu: "11:33" },
    ],
  },
  {
    id: "cp-04",
    nama: "Sinta Maharani",
    pesan: [
      { id: "p1", saya: false, isi: "Pak, mau tanya, bakso isi ayam ada ga?", waktu: "10:10" },
      { id: "p2", saya: true, isi: "Ada mbak! Bakso ayam, sapi, dan campuran. Mau yang mana?", waktu: "10:12" },
      { id: "p3", saya: false, isi: "Campur aja pak, 2 porsi. Saya di blok B12", waktu: "10:14" },
      { id: "p4", saya: true, isi: "Siap, hari ini sudah habis mbak. Besok ya saya lewat blok B", waktu: "10:20" },
      { id: "p5", saya: false, isi: "Oke pak, ditunggu besok ya!", waktu: "10:21" },
    ],
  },
];

/**
 * Rupa lawan bicara di sisi pedagang. Warga tidak punya foto profil di
 * aplikasi ini, jadi avatarnya lingkaran berinisial, sama seperti di
 * layar pesanan masuk dan titik kumpul.
 */
export const rupaPercakapanPedagang: Record<
  string,
  { inisial: string; daring: boolean; kapan: string; belumDibaca?: number }
> = {
  "cp-01": { inisial: "D", daring: true, kapan: "09:43", belumDibaca: 2 },
  "cp-02": { inisial: "R", daring: true, kapan: "Kemarin" },
  "cp-03": { inisial: "R", daring: false, kapan: "Sen" },
  "cp-04": { inisial: "S", daring: false, kapan: "Ming" },
};

/** Balasan cepat yang tersedia di ruang obrolan pedagang. */
export const balasanCepat = ["Oke, segera!", "Sudah habis hari ini", "Sekitar 10 menit lagi"];

/**
 * Riwayat pesanan yang sudah selesai pada hari-hari sebelumnya.
 *
 * Bahan mentah Buku Kas. Dipisahkan dari `pesananMasukAwal` dengan
 * sengaja: array itu adalah kotak masuk hari ini yang dipakai layar
 * Pesanan Masuk, dan menumpuk dua puluhan riwayat ke dalamnya akan
 * mengubur pesanan yang benar-benar perlu dijawab pedagang hari ini.
 *
 * Sebarannya dibuat menyerupai hari kerja gerobak bakso keliling: ada
 * kelompok pagi, siang, dan sore, dengan sore paling padat. Pola itu
 * tidak ditulis di mana pun sebagai angka; fitur "jam paling ramai"
 * menemukannya sendiri dari data ini. Jumlah pesanan per hari juga
 * sengaja naik-turun, bukan rata, supaya grafik tujuh harinya bergerak.
 *
 * `menitLalu` diisi nol karena tidak dipakai untuk data riwayat; yang
 * menentukan penempatan pada grafik adalah `selesaiPada`.
 */
/**
 * Riwayat yang lebih tua, hari ke-7 sampai ke-29.
 *
 * Dibangkitkan, bukan diketik satu per satu: dua puluh sembilan hari
 * pesanan yang ditulis tangan akan memakan ribuan baris dan tidak lebih
 * benar daripada pola yang sama yang dijalankan berulang. Yang dipakai
 * Buku Kas hanya tujuh hari terakhir, jadi bagian ini semata bahan untuk
 * laporan bulanan pada langganan berbayar.
 *
 * Tidak ada satu pun angka acak di sini. `Math.random()` akan
 * menghasilkan riwayat yang berbeda setiap kali halaman dimuat, sehingga
 * laporan bulanan berubah sendiri tanpa ada yang memesan apa pun, dan
 * penyajian di server tidak akan pernah cocok dengan peramban. Semuanya
 * diturunkan dari nomor harinya.
 */
function riwayatLama(): PesananMasuk[] {
  const menu = [
    { menuId: "m-01", nama: "Bakso Komplit", harga: 25000 },
    { menuId: "m-02", nama: "Bakso Mercon", harga: 15000 },
    { menuId: "m-03", nama: "Bakso Polos", harga: 13000 },
    { menuId: "m-04", nama: "Bakso Telur", harga: 15000 },
    { menuId: "m-08", nama: "Es Teh Manis", harga: 5000 },
  ];
  const warga = [
    ["Bu Rahma", "R"], ["Pak Dedi", "D"], ["Bu Sri", "S"], ["Mas Yudi", "Y"],
    ["Bu Lina", "L"], ["Pak Soni", "S"], ["Bu Ratna", "R"], ["Kak Nia", "N"],
    ["Pak Ito", "I"], ["Mas Fajar", "F"], ["Bu Endah", "E"], ["Bu Wati", "W"],
  ];
  const titik = [
    "RT 05 Blok C · Pos Ronda",
    "RT 05 Blok C · Pos 2",
    "RT 07 Taman Asri · Pos Satpam",
    "RT 02 Taman Bermain",
  ];
  /* Jamnya tetap berkelompok pagi, siang, dan sore dengan sore paling
     padat, sama seperti minggu terakhir yang ditulis tangan. Pola itulah
     yang nanti ditemukan sendiri oleh prediksi jam ramai. */
  const jam = [8, 12, 16, 17, 17, 18];

  const hasil: PesananMasuk[] = [];
  for (let hari = 7; hari <= 29; hari += 1) {
    const banyak = 3 + ((hari * 7) % 4);
    for (let i = 0; i < banyak; i += 1) {
      const n = hari * 5 + i;
      const [nama, inisial] = warga[n % warga.length];
      const utama = menu[n % menu.length];
      const ikut = menu[4];
      hasil.push({
        id: `rl-${hari}-${i}`,
        warga: nama,
        inisial,
        titik: titik[n % titik.length],
        baris: [
          { ...utama, jumlah: 1 + (n % 3) },
          ...(n % 3 === 0 ? [{ ...ikut, jumlah: 1 + (n % 2) }] : []),
        ],
        status: "selesai",
        menitLalu: 0,
        selesaiPada: hariLalu(hari, jam[n % jam.length], (n * 7) % 60),
      });
    }
  }
  return hasil;
}

export const riwayatPedagangAwal: PesananMasuk[] = [
  /* Kemarin */
  {
    id: "rw-01", warga: "Bu Rahma", inisial: "R", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 2 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(1, 8, 15),
  },
  {
    id: "rw-02", warga: "Pak Dedi", inisial: "D", titik: "RT 05 Blok C · Pos 2",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 1 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(1, 12, 30),
  },
  {
    id: "rw-03", warga: "Bu Sri", inisial: "S", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 2 },
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(1, 16, 45),
  },
  {
    id: "rw-04", warga: "Mas Yudi", inisial: "Y", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 3 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(1, 17, 20),
  },
  {
    id: "rw-05", warga: "Bu Lina", inisial: "L", titik: "RT 02 Taman Bermain",
    baris: [{ menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 3 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(1, 18, 10),
  },

  /* Dua hari lalu */
  {
    id: "rw-06", warga: "Pak Soni", inisial: "S", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(2, 7, 40),
  },
  {
    id: "rw-07", warga: "Bu Ratna", inisial: "R", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 1 },
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(2, 17, 5),
  },
  {
    id: "rw-08", warga: "Kak Nia", inisial: "N", titik: "RT 02 Taman Bermain",
    baris: [
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 1 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 2 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(2, 18, 40),
  },

  /* Tiga hari lalu */
  {
    id: "rw-09", warga: "Pak Ito", inisial: "I", titik: "RT 05 Blok C · Pos 2",
    baris: [{ menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 8, 0),
  },
  {
    id: "rw-10", warga: "Bu Rahma", inisial: "R", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 1 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 11, 50),
  },
  {
    id: "rw-11", warga: "Mas Fajar", inisial: "F", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [{ menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 3 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 12, 40),
  },
  {
    id: "rw-12", warga: "Bu Endah", inisial: "E", titik: "RT 02 Taman Bermain",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 2 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 16, 20),
  },
  {
    id: "rw-13", warga: "Pak Dedi", inisial: "D", titik: "RT 05 Blok C · Pos 2",
    baris: [{ menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 3 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 17, 35),
  },
  {
    id: "rw-14", warga: "Kak Budi", inisial: "B", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(3, 18, 55),
  },

  /* Empat hari lalu */
  {
    id: "rw-15", warga: "Bu Wati", inisial: "W", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 4 },
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(4, 9, 0),
  },
  {
    id: "rw-16", warga: "Pak Har", inisial: "H", titik: "RT 02 Taman Bermain",
    baris: [{ menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 1 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(4, 12, 10),
  },
  {
    id: "rw-17", warga: "Bu Sri", inisial: "S", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 2 },
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(4, 17, 15),
  },
  {
    id: "rw-18", warga: "Mas Yudi", inisial: "Y", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 2 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(4, 17, 50),
  },

  /* Lima hari lalu, hari paling sepi */
  {
    id: "rw-19", warga: "Bu Lina", inisial: "L", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(5, 16, 50),
  },
  {
    id: "rw-20", warga: "Pak Soni", inisial: "S", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 1 },
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(5, 18, 20),
  },

  /* Enam hari lalu */
  {
    id: "rw-21", warga: "Bu Ratna", inisial: "R", titik: "RT 05 Blok C · Pos Ronda",
    baris: [
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 1 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(6, 7, 15),
  },
  {
    id: "rw-22", warga: "Kak Nia", inisial: "N", titik: "RT 02 Taman Bermain",
    baris: [{ menuId: "m-03", nama: "Bakso Polos", harga: 13000, jumlah: 2 }],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(6, 11, 30),
  },
  {
    id: "rw-23", warga: "Pak Ito", inisial: "I", titik: "RT 05 Blok C · Pos 2",
    baris: [
      { menuId: "m-01", nama: "Bakso Komplit", harga: 25000, jumlah: 2 },
      { menuId: "m-08", nama: "Es Teh Manis", harga: 5000, jumlah: 1 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(6, 16, 35),
  },
  {
    id: "rw-24", warga: "Bu Endah", inisial: "E", titik: "RT 07 Taman Asri · Pos Satpam",
    baris: [
      { menuId: "m-02", nama: "Bakso Mercon", harga: 15000, jumlah: 2 },
      { menuId: "m-04", nama: "Bakso Telur", harga: 15000, jumlah: 2 },
    ],
    status: "selesai", menitLalu: 0, selesaiPada: hariLalu(6, 17, 45),
  },

  ...riwayatLama(),
];
