import type { Menu } from "@/lib/tipe";

/**
 * Menu gerobak sendiri yang berlaku saat ini.
 *
 * Selama pedagang belum pernah menyunting apa pun, yang berlaku adalah
 * menu bawaan dari data contoh. Begitu ia menyentuhnya, daftar tersimpan
 * yang jadi sumbernya. Pemilihan itu dikerjakan di satu tempat ini supaya
 * layar pedagang dan layar warga tidak bisa membaca daftar yang berbeda.
 */
export function menuBerlaku(menuSaya: Menu[] | null, bawaan: Menu[]): Menu[] {
  return menuSaya ?? bawaan;
}

/** Menu yang benar-benar dilihat warga: yang berlaku, dikurangi yang dimatikan. */
export function menuTampil(
  menuSaya: Menu[] | null,
  bawaan: Menu[],
  nonaktif: string[],
): Menu[] {
  return menuBerlaku(menuSaya, bawaan).filter((m) => !nonaktif.includes(m.id));
}

/**
 * Id untuk menu yang baru dibuat.
 *
 * Berawalan berbeda dari menu bawaan yang memakai `m-`, supaya menu
 * buatan pedagang tidak pernah bertabrakan dengan id di data contoh
 * walaupun daftarnya pernah dihapus habis lalu diisi ulang. Waktu dipakai
 * sebagai pembeda karena dua menu tidak mungkin dibuat pada milidetik
 * yang sama lewat satu jempol.
 */
export function idMenuBaru(): string {
  return `mx-${Date.now().toString(36)}`;
}

/** Batas harga yang masuk akal untuk dagangan keliling, dalam rupiah. */
export const HARGA_MAKS = 500_000;

export type SalahIsi = { nama?: string; harga?: string };

/**
 * Memeriksa isian menu sebelum disimpan.
 *
 * Dikembalikan sebagai kumpulan pesan per kolom, bukan satu pesan
 * gabungan, supaya tiap kesalahan bisa muncul tepat di bawah kolom yang
 * bersangkutan. Pesan tunggal di atas formulir memaksa orang menebak
 * kolom mana yang dimaksud.
 */
export function periksaMenu(nama: string, harga: string): SalahIsi {
  const salah: SalahIsi = {};
  if (!nama.trim()) salah.nama = "Nama menu belum diisi.";

  const angka = Number(harga.replace(/\D/g, ""));
  if (!harga.trim() || Number.isNaN(angka) || angka <= 0) {
    salah.harga = "Harga harus lebih dari nol.";
  } else if (angka > HARGA_MAKS) {
    salah.harga = "Harga terlalu besar untuk satu porsi.";
  }
  return salah;
}

/** "25000" dari "Rp 25.000" atau "25.000". */
export function angkaHarga(teks: string): number {
  return Number(teks.replace(/\D/g, "")) || 0;
}

/** 25000 -> "25.000", untuk isian harga yang diketik pengguna. */
export function harganRapi(nilai: number): string {
  return nilai ? new Intl.NumberFormat("id-ID").format(nilai) : "";
}
