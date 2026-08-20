/** Sisi terpanjang foto menu setelah dikecilkan, dalam piksel. */
const SISI_MAKS = 480;

/** Mutu JPEG hasil pengecilan. */
const MUTU = 0.72;

/** Batas ukuran berkas yang mau diterima sebelum dibaca, 8 MB. */
export const UKURAN_MAKS = 8 * 1024 * 1024;

/**
 * Mengubah berkas foto jadi teks data URL yang sudah dikecilkan.
 *
 * Foto tidak disimpan mentah. Satu foto dari kamera ponsel bisa tiga
 * sampai lima megabita, dan sebagai data URL ia membengkak sepertiga
 * lagi. Penyimpanan peramban cuma menyediakan sekitar lima megabita
 * untuk seluruh aplikasi, jadi dua foto mentah saja sudah cukup untuk
 * membuat seluruh keadaan aplikasi gagal disimpan, termasuk pesanan dan
 * profil yang tidak ada hubungannya dengan foto.
 *
 * Karena itu fotonya digambar ulang ke kanvas dengan sisi terpanjang
 * 480 piksel lalu dikeluarkan sebagai JPEG. Hasilnya puluhan kilobita,
 * dan pada petak foto seukuran layar ponsel selisih ketajamannya tidak
 * terlihat.
 *
 * Sengaja mengembalikan pesan kesalahan alih-alih melempar. Yang
 * memanggilnya adalah penangan peristiwa pada formulir, dan di sana
 * pesan yang bisa ditempel di bawah kolom lebih berguna daripada
 * pengecualian yang harus ditangkap.
 */
export async function fotoJadiTeks(
  berkas: File,
): Promise<{ teks: string } | { salah: string }> {
  if (!berkas.type.startsWith("image/")) {
    return { salah: "Berkasnya harus berupa gambar." };
  }
  if (berkas.size > UKURAN_MAKS) {
    return { salah: "Ukuran gambar terlalu besar, maksimal 8 MB." };
  }

  try {
    const gambar = await muatGambar(URL.createObjectURL(berkas));
    const skala = Math.min(1, SISI_MAKS / Math.max(gambar.width, gambar.height));
    const lebar = Math.round(gambar.width * skala);
    const tinggi = Math.round(gambar.height * skala);

    const kanvas = document.createElement("canvas");
    kanvas.width = lebar;
    kanvas.height = tinggi;
    const kuas = kanvas.getContext("2d");
    if (!kuas) return { salah: "Peramban ini tidak bisa memproses gambar." };

    kuas.drawImage(gambar, 0, 0, lebar, tinggi);
    URL.revokeObjectURL(gambar.src);
    return { teks: kanvas.toDataURL("image/jpeg", MUTU) };
  } catch {
    return { salah: "Gambarnya gagal dibaca. Coba foto lain." };
  }
}

function muatGambar(src: string): Promise<HTMLImageElement> {
  return new Promise((selesai, gagal) => {
    const gambar = new Image();
    gambar.onload = () => selesai(gambar);
    gambar.onerror = () => gagal(new Error("gagal memuat"));
    gambar.src = src;
  });
}
