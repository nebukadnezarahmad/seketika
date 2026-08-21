/**
 * Service worker SEKETIKA.
 *
 * Ada dua alasan ia dibutuhkan. Pertama, Chrome baru menawarkan
 * pemasangan sebagai aplikasi sungguhan kalau ada service worker dengan
 * penangan fetch. Kedua, aplikasi yang dipasang tidak punya bilah alamat
 * dan tidak punya tombol muat ulang, jadi kalau salinannya salah simpan,
 * pengguna terkurung di versi lama tanpa jalan keluar.
 *
 * Karena itu aturannya sengaja dibalik dari kebiasaan: JARINGAN DULU
 * untuk hampir semuanya, salinan cuma dipakai saat jaringan gagal. Yang
 * dilayani dari salinan lebih dulu hanya berkas di /_next/static/, yang
 * namanya memuat sidik jari isinya; berkas dengan nama sama tidak pernah
 * berubah isinya, jadi tidak ada versi lama yang bisa tersangkut.
 *
 * Permintaan data React (RSC) sengaja tidak disalin sama sekali. Kuncinya
 * cuma URL, sedangkan satu URL yang sama bisa meminta dokumen HTML atau
 * muatan RSC tergantung kepalanya, dan menyalinnya berarti suatu saat
 * halaman menerima jenis jawaban yang salah.
 */
const VERSI = "seketika-1";

self.addEventListener("install", () => {
  /* Langsung ambil alih, jangan menunggu tab lama ditutup. Di aplikasi
     terpasang, "tab lama" bisa berarti berhari-hari. */
  self.skipWaiting();
});

self.addEventListener("activate", (peristiwa) => {
  peristiwa.waitUntil(
    (async () => {
      const kunci = await caches.keys();
      await Promise.all(kunci.filter((k) => k !== VERSI).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

/** Berkas ber-sidik-jari: dilayani dari salinan, ditarik sekali saja. */
function tetap(jalur) {
  return jalur.startsWith("/_next/static/");
}

/** Gambar dan ikon: boleh dari salinan saat jaringan mati. */
function bolehDisalin(jalur) {
  return jalur.startsWith("/img/") || jalur.startsWith("/icon/");
}

self.addEventListener("fetch", (peristiwa) => {
  const permintaan = peristiwa.request;
  if (permintaan.method !== "GET") return;

  const url = new URL(permintaan.url);
  if (url.origin !== self.location.origin) return;

  /* Permintaan data React dilewatkan apa adanya, tidak disalin. */
  if (permintaan.headers.has("RSC")) return;

  if (tetap(url.pathname)) {
    peristiwa.respondWith(
      (async () => {
        const wadah = await caches.open(VERSI);
        const salinan = await wadah.match(permintaan);
        if (salinan) return salinan;
        const jawaban = await fetch(permintaan);
        if (jawaban.ok) wadah.put(permintaan, jawaban.clone());
        return jawaban;
      })(),
    );
    return;
  }

  const layakDisalin = permintaan.mode === "navigate" || bolehDisalin(url.pathname);
  if (!layakDisalin) return;

  peristiwa.respondWith(
    (async () => {
      try {
        const jawaban = await fetch(permintaan);
        if (jawaban.ok) {
          const wadah = await caches.open(VERSI);
          wadah.put(permintaan, jawaban.clone());
        }
        return jawaban;
      } catch (kesalahan) {
        const wadah = await caches.open(VERSI);
        const salinan = await wadah.match(permintaan);
        if (salinan) return salinan;
        if (permintaan.mode === "navigate") {
          const beranda = await wadah.match("/");
          if (beranda) return beranda;
        }
        throw kesalahan;
      }
    })(),
  );
});
