import type { MetadataRoute } from "next";

/** Manifest aplikasi web. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SEKETIKA - Panggil jajanan keliling ke depan rumah",
    /* Muat di bawah ikon peluncur tanpa terpotong. */
    short_name: "SEKETIKA",
    description:
      "Lihat gerobak yang sedang lewat di sekitarmu, panggil ke lokasimu, atau patungan satu titik kumpul bersama tetangga.",
    lang: "id",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    /* Latar putih, sama dengan layar pembuka. */
    background_color: "#ffffff",
    theme_color: "#00860f",
    categories: ["food", "shopping", "lifestyle"],
    icons: [
      {
        src: "/icon/ikon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/ikon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      /* Ikon maskable digambar lebih kecil di dalam bidangnya. */
      {
        src: "/icon/ikon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
