import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

test.describe("Pemesanan", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pembeli");
  });

  test("bilah pesan baru muncul setelah ada menu yang dipilih", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await expect(page.getByRole("button", { name: /^Pesan / })).toHaveCount(0);

    await page.getByRole("button", { name: "Tambah" }).first().click();
    await expect(page.getByRole("button", { name: /Pesan 1 item/ })).toBeVisible();
  });

  test("jumlah dan total ikut berubah saat menu ditambah", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: "Tambah" }).first().click();
    /* Bakso Komplit Rp 25.000, dua porsi. */
    await page.getByRole("button", { name: "Tambah Bakso Komplit" }).click();
    await expect(page.getByRole("button", { name: /Pesan 2 item · Rp 50\.000/ })).toBeVisible();
  });

  test("mengurangi sampai nol mengembalikan tombol Tambah", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: "Tambah" }).first().click();
    await page.getByRole("button", { name: "Kurangi Bakso Komplit" }).click();
    await expect(page.getByRole("button", { name: "Tambah" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /^Pesan / })).toHaveCount(0);
  });

  test("keranjang tidak mencampur dua pedagang", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: "Tambah" }).first().click();

    /* Satu gerobak tidak bisa mengantar dagangan gerobak lain, jadi
       memilih menu pedagang lain harus mengganti isi keranjang. */
    await page.goto("/pedagang/mie-ayam-mas-budi/menu");
    await page.getByRole("button", { name: "Tambah" }).first().click();
    await expect(page.getByRole("button", { name: /Pesan 1 item · Rp 8\.000/ })).toBeVisible();
  });

  test("memesan membuat pesanan baru yang bisa dilacak", async ({ page }) => {
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: "Tambah" }).first().click();
    await page.getByRole("button", { name: /Pesan 1 item/ }).click();

    await page.waitForURL(/\/pesanan\/ord-\d+/);
    await expect(page.getByRole("heading", { name: "Detail Pesanan" })).toBeVisible();
    await expect(page.getByText("Tracking Pesanan")).toBeVisible();
    await expect(page.getByText("Menunggu konfirmasi penjual")).toBeVisible();
    await expect(page.getByText("Rp 25.000").first()).toBeVisible();
  });

  test("penyaring pada daftar pesanan memilah menurut status", async ({ page }) => {
    await page.goto("/pesanan");
    await expect(page.getByRole("link", { name: /Lihat Detail/ })).toHaveCount(4);

    await page.getByRole("button", { name: "Dibatalkan" }).click();
    await expect(page.getByRole("link", { name: /Lihat Detail/ })).toHaveCount(1);
    await expect(page.getByText("Es Teh Kang Asep")).toBeVisible();
  });
});
