import type { Page } from "@playwright/test";

/**
 * Pembantu yang dipakai beberapa berkas uji.
 *
 * Radio dan sakelar di aplikasi ini adalah input sungguhan yang
 * disembunyikan dari mata dan dibungkus label. Pengguna mengetuk
 * labelnya, bukan inputnya, jadi ujinya pun begitu; setelah itu keadaan
 * input diperiksa untuk memastikan kaitan labelnya benar.
 */
export async function pilihPeran(page: Page, peran: "pembeli" | "pedagang") {
  const teks = peran === "pembeli" ? "Saya Ingin Membeli" : "Saya Ingin Berdagang";
  await page.getByText(teks, { exact: true }).click();
}

/** Menjalani tiga langkah pengenalan sampai tuntas. */
export async function lewatiPengenalan(
  page: Page,
  peran: "pembeli" | "pedagang",
  nama = "Rahmat",
) {
  await page.goto("/mulai");
  await pilihPeran(page, peran);
  await page.getByRole("button", { name: /Lanjut/ }).click();
  await page.getByRole("button", { name: /Izinkan/ }).click();
  await page.getByLabel("Nama Lengkap").fill(nama);
  await page.getByRole("button", { name: /Mulai/ }).click();
  await page.waitForURL(peran === "pedagang" ? "**/d" : "**/beranda");
}
