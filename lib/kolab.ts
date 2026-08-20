import type { StatusTitik, TitikKumpul } from "@/lib/tipe";

/**
 * Keadaan titik kumpul yang sebenarnya pada suatu saat.
 *
 * Status yang tersimpan tidak selalu status yang berlaku. Titik kumpul
 * punya tenggat, dan tenggat itu lewat dengan sendirinya walau tidak ada
 * seorang pun yang membuka aplikasi. Kalau kehangusan ditulis ke
 * penyimpanan, ia butuh sesuatu yang berjalan untuk menuliskannya, dan
 * ponsel yang tidak dibuka berarti tidak ada yang menulis: titik kumpul
 * dari minggu lalu akan tetap mengaku "Aktif" dan mengajak orang
 * bergabung ke sesuatu yang sudah lewat.
 *
 * Karena itu kehangusan disimpulkan di sini, dari jam, setiap kali
 * ditanya. `sekarang` masuk sebagai parameter dan bukan dibaca dari
 * `Date.now()`, mengikuti aturan yang sama dengan `lib/format.ts`:
 * fungsi yang membaca jam diam-diam berhenti murni, dan hasil di server
 * tidak akan cocok dengan hasil di peramban.
 *
 * Ketika `sekarang` masih null, yaitu sebelum peramban menghidupkan
 * komponennya, status tersimpan yang dipakai. Menebak hangus pada saat
 * itu membuat kartu berkedip: sekejap hangus, lalu kembali aktif.
 */
export function statusTitik(titik: TitikKumpul, sekarang: number | null): StatusTitik {
  /* Yang sudah dijemput atau selesai tidak bisa hangus. Tenggatnya cuma
     mengatur sampai kapan warga boleh bergabung, bukan menghapus apa yang
     sudah terjadi. */
  if (titik.status === "dijemput" || titik.status === "selesai") return titik.status;

  const cukup = titik.peserta.length >= titik.target;
  if (cukup) return "tercapai";

  if (sekarang === null) return titik.status;
  return new Date(titik.kedaluwarsa).getTime() <= sekarang ? "hangus" : "mengumpulkan";
}

/** Masih menerima peserta baru. */
export function masihMengumpulkan(titik: TitikKumpul, sekarang: number | null): boolean {
  return statusTitik(titik, sekarang) === "mengumpulkan";
}

export const labelStatusTitik: Record<StatusTitik, string> = {
  mengumpulkan: "Aktif",
  tercapai: "Tercapai",
  dijemput: "Dijemput",
  selesai: "Selesai",
  hangus: "Hangus",
};
