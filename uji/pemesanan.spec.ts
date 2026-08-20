import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/**
 * Layar menu tidak lagi memakai keranjang bertahap. Yang dijual di sini
 * pedagang keliling: warga memanggil gerobaknya, lalu memilih setelah
 * gerobak sampai. Uji di berkas ini mengikuti alur itu, bukan alur
 * tambah-kurang yang dipakai sebelumnya.
 */
test.describe("Pemesanan", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pembeli");
  });

  test("daftar menu tidak lagi punya tombol tambah", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    /* `exact` wajib di sini. Tanpa itu pencocokan nama jatuh ke substring
       dan keterangan "Bakso daging sapi dengan tambahan telur" ikut
       terjaring, sehingga tesnya gagal karena kalimat menu, bukan karena
       tombolnya masih ada. */
    await expect(page.getByRole("button", { name: "Tambah", exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Panggil Penjual/ }).first()).toBeVisible();
  });

  test("mengetuk menu menaikkan lembar berisi keterangan lengkapnya", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");

    const sebelum = page.url();
    await page.getByRole("button", { name: /Bakso Mercon/ }).click();

    const lembar = page.getByRole("dialog");
    await expect(lembar).toBeVisible();
    /* Lembar naik di layar yang sama, bukan berpindah halaman. */
    expect(page.url()).toBe(sebelum);

    await expect(lembar.getByRole("heading", { name: "Bakso Mercon" })).toBeVisible();
    await expect(lembar.getByText("Bakso isian cabe rawit ekstra pedas")).toBeVisible();
    await expect(lembar.getByText("Rp 15.000")).toBeVisible();
    await expect(lembar.getByRole("button", { name: /Panggil Penjual/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(lembar).toBeHidden();
  });

  test("panggil penjual dari lembar membawa menunya sebagai ancar-ancar", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: /Bakso Komplit/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Panggil Penjual/ }).click();

    await page.waitForURL(/\/pesanan\/ord-\d+/);
    await expect(page.getByRole("heading", { name: "Detail Pesanan" })).toBeVisible();
    await expect(page.getByText("Menunggu konfirmasi penjual")).toBeVisible();
    await expect(page.getByText("1× Bakso Komplit")).toBeVisible();
    await expect(page.getByText("Rp 25.000").first()).toBeVisible();
  });

  test("panggil penjual dari atas daftar memesan tanpa rincian", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: /Panggil Penjual/ }).first().click();

    await page.waitForURL(/\/pesanan\/ord-\d+/);
    /* Pesanan tanpa rincian tidak boleh terbaca seperti pesanan gagal;
       layarnya harus menerangkan kenapa daftarnya kosong. */
    await expect(page.getByText(/menunya dipilih/)).toBeVisible();
    await expect(page.getByText("Dihitung di tempat")).toBeVisible();
  });

  test("penyaring pada daftar pesanan memilah menurut status", async ({ page }) => {
    await page.goto("/pesanan");
    await expect(page.getByRole("link", { name: /Lihat Detail/ })).toHaveCount(4);

    await page.getByRole("button", { name: "Dibatalkan" }).click();
    await expect(page.getByRole("link", { name: /Lihat Detail/ })).toHaveCount(1);
    await expect(page.getByText("Es Teh Kang Asep")).toBeVisible();
  });
});
