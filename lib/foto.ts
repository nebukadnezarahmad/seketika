/** Sisi terpanjang foto menu setelah dikecilkan, dalam piksel. */
const SISI_MAKS = 480;

/** Mutu JPEG hasil pengecilan. */
const MUTU = 0.72;

/** Batas ukuran berkas yang mau diterima sebelum dibaca, 8 MB. */
export const UKURAN_MAKS = 8 * 1024 * 1024;

/** Mengubah berkas foto jadi teks data URL yang sudah dikecilkan. */
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
    const skala = Math.min(
      1,
      SISI_MAKS / Math.max(gambar.width, gambar.height),
    );
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
