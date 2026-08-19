import type { Pedagang } from "@/lib/tipe";

/**
 * Lima pedagang keliling contoh, isinya sama persis dengan berkas desain:
 * nama, jenis dagangan, rating, jarak, status buka, sampai daftar menu
 * beserta harga dan keterangannya.
 *
 * `posisi` adalah letak pin di atas kotak peta, dinyatakan dalam persen
 * supaya petanya ikut menyesuaikan lebar layar tanpa pin bergeser.
 */
export const daftarPedagang: Pedagang[] = [
  {
    id: "pd-01",
    slug: "bakso-pak-anton",
    nama: "Bakso Pak Anton",
    namaPeta: "Bakso Pak Anton",
    jenis: "Bakso & Mie",
    kategori: "Makanan",
    rating: 4.9,
    jarak: 150,
    menit: 3,
    buka: true,
    foto: "/img/foto-bakso.jpg",
    posisi: { x: 17.06, y: 35.28 },
    menu: [
      { id: "m-01", nama: "Bakso Komplit", deskripsi: "Bakso sapi pilihan dengan rasa nikmat", harga: 25000 },
      { id: "m-02", nama: "Bakso Mercon", deskripsi: "Bakso isian cabe rawit ekstra pedas", harga: 15000 },
      { id: "m-03", nama: "Bakso Polos", deskripsi: "Bakso sapi full daging dengan tekstur lembut", harga: 13000 },
      { id: "m-04", nama: "Bakso Telur", deskripsi: "Bakso daging sapi dengan tambahan telur", harga: 15000 },
      { id: "m-05", nama: "Bakso Ikan", deskripsi: "Bakso yang terbuat dari ikan tenggiri berkualitas", harga: 13000 },
    ],
  },
  {
    id: "pd-02",
    slug: "nasi-goreng-bu-siti",
    nama: "Nasi Goreng Bu Siti",
    namaPeta: "Nasi Goreng Siti",
    jenis: "Nasi & Lauk",
    kategori: "Makanan",
    rating: 4.8,
    jarak: 280,
    menit: 4,
    buka: true,
    foto: "/img/foto-nasgor.jpg",
    posisi: { x: 78.51, y: 20.95 },
    menu: [
      { id: "m-06", nama: "Nasi Goreng Spesial", deskripsi: "Nasi goreng dengan telur mata sapi dan ayam", harga: 17000 },
      { id: "m-07", nama: "Nasi Goreng Biasa", deskripsi: "Nasi goreng bumbu rempah tradisional", harga: 13000 },
      { id: "m-08", nama: "Es Teh Manis", deskripsi: "Teh segar dengan es batu", harga: 5000 },
    ],
  },
  {
    id: "pd-03",
    slug: "mie-ayam-mas-budi",
    nama: "Mie Ayam Mas Budi",
    namaPeta: "Mie Ayam Budi",
    jenis: "Mie Ayam",
    kategori: "Makanan",
    rating: 4.7,
    jarak: 320,
    menit: 6,
    buka: true,
    foto: "/img/foto-mie.jpg",
    posisi: { x: 30.47, y: 64.61 },
    menu: [
      { id: "m-09", nama: "Mie Ayam Biasa", deskripsi: "Mie dengan topping ayam cincang", harga: 8000 },
      { id: "m-10", nama: "Mie Ayam Bakso", deskripsi: "Mie ayam lengkap dengan bakso sapi", harga: 12000 },
    ],
  },
  {
    id: "pd-04",
    slug: "es-teh-kang-asep",
    nama: "Es Teh Kang Asep",
    namaPeta: "Teh Kang Asep",
    jenis: "Minuman",
    kategori: "Minuman",
    rating: 4.6,
    jarak: 450,
    menit: 8,
    buka: false,
    foto: "/img/foto-esteh.jpg",
    posisi: { x: 17.34, y: 86.61 },
    menu: [
      { id: "m-11", nama: "Es Teh Spesial", deskripsi: "Es teh pilihan dengan gula merah", harga: 6000 },
    ],
  },
  {
    id: "pd-05",
    slug: "siomay-pak-agus",
    nama: "Siomay Pak Agus",
    namaPeta: "Siomay Pak Agus",
    jenis: "Siomay & Batagor",
    kategori: "Jajanan",
    rating: 4.5,
    jarak: 520,
    menit: 10,
    buka: true,
    foto: "/img/foto-siomay.jpg",
    posisi: { x: 55.89, y: 84.94 },
    menu: [
      { id: "m-12", nama: "Siomay Ikan", deskripsi: "Siomay ikan tenggiri kukus dengan bumbu kacang", harga: 15000 },
      { id: "m-13", nama: "Batagor", deskripsi: "Batagor renyah dengan kuah kacang", harga: 12000 },
    ],
  },
];

/** Foto tiap butir menu, dipetakan dari id menu. */
export const fotoMenu: Record<string, string> = {
  "m-01": "/img/menu/bakso-komplit.jpg",
  "m-02": "/img/menu/bakso-mercon.jpg",
  "m-03": "/img/menu/bakso-polos.jpg",
  "m-04": "/img/menu/bakso-telur.jpg",
  "m-05": "/img/menu/bakso-ikan.jpg",
  "m-06": "/img/menu/nasgor-spesial.jpg",
  "m-07": "/img/menu/nasgor-biasa.jpg",
  "m-08": "/img/menu/esteh-manis.jpg",
  "m-09": "/img/menu/mie-biasa.jpg",
  "m-10": "/img/menu/mie-bakso.jpg",
  "m-11": "/img/menu/esteh-spesial.jpg",
  "m-12": "/img/menu/siomay-ikan.jpg",
  "m-13": "/img/menu/batagor.jpg",
};

export function cariPedagang(slug: string): Pedagang | undefined {
  return daftarPedagang.find((p) => p.slug === slug);
}

/**
 * Gerobak yang dipegang peran pedagang pada purwarupa ini.
 *
 * Aplikasi belum punya autentikasi, jadi peran pedagang selalu masuk
 * sebagai gerobak yang sama. Slugnya disimpan di sini, satu tempat,
 * karena sebelumnya ditulis ulang di dua layar dan keduanya memaksa
 * hasil pencariannya bukan-null. Kalau slug itu diganti saat menyunting
 * data contoh, keduanya akan gagal saat render tanpa peringatan apa pun.
 */
export const SLUG_GEROBAK_SAYA = "bakso-pak-anton";

/** Gerobak peran pedagang. Jatuh ke pedagang pertama kalau slugnya hilang. */
export function gerobakSaya(): Pedagang {
  return cariPedagang(SLUG_GEROBAK_SAYA) ?? daftarPedagang[0];
}

/** Kategori penyaring di beranda. "Dekat Anda" berarti tanpa penyaringan. */
export const kategoriPenyaring = ["Dekat Anda", "Makanan", "Minuman", "Jajanan", "Cemilan"] as const;
