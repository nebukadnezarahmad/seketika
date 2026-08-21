/**
 * Mengembalikan aplikasi ke keadaan contoh, termasuk di aplikasi
 * terpasang.
 *
 * Di peramban, "Setel Ulang Data" cukup menulis ulang keadaan lalu
 * berpindah halaman. Di aplikasi terpasang tidak: tidak ada bilah alamat
 * dan tidak ada tombol muat ulang, jadi kalau service worker masih
 * memegang salinan berkas versi lama, tombol itu akan mengembalikan data
 * contoh dari KODE LAMA, bukan dari kode yang sedang tayang. Tombolnya
 * terlihat bekerja padahal tidak membawa apa pun yang baru.
 *
 * Karena itu urutannya: keadaan ditulis ulang, salinan dibuang, service
 * worker disuruh memeriksa versi baru, lalu halaman dimuat ulang penuh
 * lewat `location` dan bukan lewat router. Router hanya berpindah layar
 * dengan berkas JavaScript yang sudah terlanjur berjalan; muat ulang
 * penuh menarik dokumen dan berkasnya dari awal.
 */
export async function bersihkanSalinan(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    if ("caches" in window) {
      const kunci = await caches.keys();
      await Promise.all(kunci.map((k) => caches.delete(k)));
    }
  } catch {
    /* Membuang salinan boleh gagal; yang penting keadaan sudah ditulis
       ulang dan halaman tetap dimuat ulang di bawah. */
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

/**
 * Muat ulang penuh ke halaman pembuka.
 *
 * Dipisah dari `bersihkanSalinan` supaya bisa diuji tanpa benar-benar
 * memuat ulang jendela.
 */
export function muatUlangKeAwal(): void {
  /* Aturan lint di sini menyarankan `useRouter().push()`, dan itu justru
     yang harus dihindari: `push` berpindah layar dengan berkas
     JavaScript yang sudah terlanjur berjalan, sehingga kode versi lama
     tetap hidup. Yang dibutuhkan tombol ini justru muat ulang dokumen
     dari awal. */
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}
