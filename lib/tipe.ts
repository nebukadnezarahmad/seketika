/** Bentuk data yang dipakai seluruh aplikasi. */

export type Kategori = "Makanan" | "Minuman" | "Jajanan" | "Cemilan";

export type Menu = {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
};

export type Pedagang = {
  id: string;
  slug: string;
  nama: string;
  /** Nama ringkas untuk label pada peta, yang ruangnya sempit. */
  namaPeta: string;
  /** Kalimat pendek di bawah nama, misalnya "Bakso & Mie". */
  jenis: string;
  kategori: Kategori;
  rating: number;
  /** Jarak dari pengguna dalam meter. */
  jarak: number;
  /** Perkiraan waktu tempuh dalam menit, sesuai label di desain. */
  menit: number;
  buka: boolean;
  foto: string;
  /** Posisi pada peta, dalam persen terhadap kotak peta. */
  posisi: { x: number; y: number };
  menu: Menu[];
};

export type StatusPesanan = "menunggu" | "diproses" | "selesai" | "dibatalkan";

export type BarisPesanan = { menuId: string; nama: string; harga: number; jumlah: number };

export type Pesanan = {
  id: string;
  pedagangSlug: string;
  baris: BarisPesanan[];
  status: StatusPesanan;
  /** Waktu pemesanan sebagai ISO string. */
  dibuatPada: string;
  /** Diisi kalau pesanan lahir dari sebuah titik kumpul. */
  titikKumpulId?: string;
  alamat: string;
};

/**
 * `hangus` tidak pernah disimpan, hanya disimpulkan.
 *
 * Titik kumpul yang lewat tenggatnya tanpa memenuhi target berubah jadi
 * hangus dengan sendirinya. Kalau keadaan itu ditulis ke penyimpanan, ia
 * butuh sesuatu yang berjalan untuk menuliskannya, dan aplikasi yang
 * tidak dibuka berarti tidak ada yang menulis; titik kumpul dari minggu
 * lalu akan tetap mengaku aktif. Karena itu `statusTitik()` di
 * `lib/kolab.ts` yang menyimpulkannya dari jam, bukan penyimpanan.
 */
export type StatusTitik =
  | "mengumpulkan"
  | "tercapai"
  | "dijemput"
  | "selesai"
  | "hangus";

export type Peserta = {
  id: string;
  nama: string;
  /** Inisial dipakai sebagai avatar; desainnya memakai lingkaran huruf. */
  inisial: string;
};

export type TitikKumpul = {
  id: string;
  nama: string;
  /** Patokan lokasi, misalnya "Pos Ronda, Bumi Marina Emas". */
  patokan: string;
  pedagangSlug: string;
  target: number;
  peserta: Peserta[];
  status: StatusTitik;
  /** Batas waktu titik kumpul, ISO string. Lewat ini ia hangus. */
  kedaluwarsa: string;
  jarak: number;
  catatan?: string;
};

export type Pesan = {
  id: string;
  /** true kalau pesan dikirim oleh pengguna yang sedang masuk. */
  saya: boolean;
  isi: string;
  waktu: string;
};

export type Percakapan = {
  id: string;
  nama: string;
  /** Slug pedagang kalau lawan bicaranya pedagang. */
  pedagangSlug?: string;
  pesan: Pesan[];
};

export type Peran = "pembeli" | "pedagang";

export type Profil = {
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  patokan: string;
  peran: Peran;
  /** Khusus pedagang. */
  namaUsaha?: string;
  jenisUsaha?: string;
  deskripsiUsaha?: string;
  /** Kawasan yang dilayani gerobak, misalnya "Bumi Marina Emas". */
  areaJangkauan?: string;
  /** Jam buka dan tutup, disimpan sebagai "07.00" dan "20.00". */
  jamBuka?: string;
  jamTutup?: string;
};

/** Pesanan dilihat dari sisi pedagang. */
export type PesananMasuk = {
  id: string;
  warga: string;
  inisial: string;
  /** Titik antar, misalnya "RT 05 Blok C · Pos Ronda". */
  titik: string;
  baris: BarisPesanan[];
  /**
   * `baru`     belum disentuh pedagang
   * `diproses` sudah diterima, sedang disiapkan
   * `diantar`  pedagang sudah berangkat menuju pembeli
   * `selesai`  sudah sampai
   * `ditolak`  pedagang tidak sanggup melayaninya
   *
   * `ditolak` wajib terpisah dari `selesai`. Sebelumnya tombol tolak
   * menyetel `selesai`, dan sejak Buku Kas ada, pesanan yang ditolak ikut
   * terhitung sebagai pemasukan hari itu. Menolak pesanan justru menaikkan
   * omzet.
   *
   * `diantar` sengaja dipisah dari `diproses`. Hanya satu pesanan yang
   * bisa berstatus `diantar`, karena satu gerobak hanya bisa menuju satu
   * tempat, dan hanya status itu yang memunculkan kartu navigasi
   * melayang.
   */
  status: "baru" | "diproses" | "diantar" | "selesai" | "ditolak";
  /** Menit sejak pesanan masuk, dipakai untuk teks "5 mnt lalu". */
  menitLalu: number;
  /**
   * Waktu pesanan diselesaikan sebagai ISO string. Hanya terisi untuk
   * status `selesai`.
   *
   * Sengaja opsional. Data yang sudah tersimpan di localStorage pengguna
   * dari versi sebelum Buku Kas ada tidak punya medan ini, dan kalau
   * dibuat wajib, aplikasi akan pecah begitu diperbarui. Rekap
   * memperlakukan pesanan tanpa stempel ini sebagai tidak bertanggal,
   * jadi ia dilewati alih-alih dihitung pada hari yang salah.
   */
  selesaiPada?: string;
};
