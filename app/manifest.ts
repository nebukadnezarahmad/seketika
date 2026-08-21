import type { MetadataRoute } from "next";

/**
 * Manifest aplikasi web.
 *
 * Tanpa berkas ini SEKETIKA cuma bisa "ditambahkan ke layar utama"
 * sebagai pintasan peramban: ikonnya cuplikan halaman, namanya judul
 * tab, dan membukanya tetap memunculkan bilah alamat. Dengan manifest
 * dan service worker, Chrome memasangnya sebagai aplikasi sungguhan, dan
 * berkas yang sama dipakai PWABuilder atau Bubblewrap untuk membungkusnya
 * jadi APK.
 *
 * `display: "standalone"` yang menghilangkan bilah alamat. Untuk APK,
 * bilah itu baru benar-benar hilang setelah assetlinks.json di domain
 * ini dicocokkan dengan sidik jari kunci penanda tangan APK-nya; sampai
 * itu ada, Android menampilkannya sebagai bilah tipis.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SEKETIKA - Panggil jajanan keliling ke depan rumah",
    /* Muat di bawah ikon peluncur tanpa terpotong. Nama panjangnya
       dipakai di dialog pemasangan dan daftar aplikasi. */
    short_name: "SEKETIKA",
    description:
      "Lihat gerobak yang sedang lewat di sekitarmu, panggil ke lokasimu, atau patungan satu titik kumpul bersama tetangga.",
    lang: "id",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    /* Latar putih, sama dengan layar pembuka. Android memakai warna ini
       untuk layar peluncuran sebelum halaman pertama selesai dilukis;
       warna yang berbeda dari layar pertama membuat pembukaan berkedip. */
    background_color: "#ffffff",
    theme_color: "#00860f",
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      { src: "/icon/ikon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/ikon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      /* Ikon maskable digambar lebih kecil di dalam bidangnya. Peluncur
         Android memotong ikon jadi lingkaran atau kotak membulat sesuai
         tema ponsel, dan lambang yang memenuhi bidang akan kehilangan
         sinar oranyenya di sudut. */
      {
        src: "/icon/ikon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
