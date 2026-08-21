"use client";

import * as React from "react";

/** Mendaftarkan service worker. */
export function PendaftarSW() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const daftar = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Pendaftaran gagal bukan alasan untuk merusak halaman: tanpa service worker aplikasinya tetap berjalan penuh, cuma tidak bisa dipasang dan tidak jalan saat luring. */
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
