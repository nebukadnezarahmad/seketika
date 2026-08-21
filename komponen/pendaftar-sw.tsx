"use client";

import * as React from "react";

/**
 * Mendaftarkan service worker.
 *
 * Hanya di build produksi. Di `next dev`, service worker menyalin berkas
 * yang sedang berubah setiap detik dan hasilnya perubahan kode tidak
 * kelihatan sampai salinannya dibersihkan manual.
 *
 * Didaftarkan setelah halaman selesai dimuat, bukan saat komponen ini
 * dipasang. Pendaftaran service worker bersaing dengan pengunduhan berkas
 * halaman pertama, dan mendahulukannya membuat lukisan pertama tertunda.
 */
export function PendaftarSW() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const daftar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Pendaftaran gagal bukan alasan untuk merusak halaman: tanpa
           service worker aplikasinya tetap berjalan penuh, cuma tidak
           bisa dipasang dan tidak jalan saat luring. */
      });
    };

    if (document.readyState === "complete") {
      daftar();
      return;
    }
    window.addEventListener("load", daftar, { once: true });
    return () => window.removeEventListener("load", daftar);
  }, []);

  return null;
}
