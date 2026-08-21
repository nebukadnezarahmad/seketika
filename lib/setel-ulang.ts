/** Mengembalikan aplikasi ke keadaan contoh, termasuk di aplikasi terpasang. */
export async function bersihkanSalinan(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if ("caches" in window) {
      const kunci = await caches.keys();
      await Promise.all(kunci.map((k) => caches.delete(k)));
    }
  } catch {
    /* Membuang salinan boleh gagal; yang penting keadaan sudah ditulis ulang dan halaman tetap dimuat ulang di bawah. */
  }

  try {
    if ("serviceWorker" in navigator) {
      const pendaftaran = await navigator.serviceWorker.getRegistration();
      await pendaftaran?.update();
    }
  } catch {
    /* Sama: kegagalan di sini tidak boleh menahan muat ulang. */
  }
}

/** Muat ulang penuh ke halaman pembuka. */
export function muatUlangKeAwal(): void {
  /* Aturan lint di sini menyarankan `useRouter().push()`, dan itu justru yang harus dihindari: `push` berpindah layar dengan berkas JavaScript yang sudah terlanjur berjalan, sehingga kode versi lama tetap hidup. */
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}
