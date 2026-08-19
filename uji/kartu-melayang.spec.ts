import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/**
 * Kartu navigasi melayang punya satu aturan sederhana: ia hidup persis
 * selama satu pengantaran berlangsung. Ketiga uji di bawah mengunci
 * ketiga ujung aturan itu.
 */
test.describe("Kartu navigasi melayang", () => {
  const kartu = "text=Ketuk untuk buka navigasi";

  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
  });

  test("belum muncul sebelum ada pesanan yang diberangkatkan", async ({ page }) => {
    /* Data contoh memuat pesanan berstatus diproses, tapi diproses berarti
       sedang disiapkan, bukan sedang diantar. Tidak ada yang perlu
       dinavigasikan sampai pedagang benar-benar berangkat. */
    await expect(page.locator(kartu)).toHaveCount(0);
  });

  test("muncul setelah Terima & Berangkat, membawa nama pemesannya", async ({ page }) => {
    await page
      .getByRole("listitem")
      .filter({ hasText: "Bu Rahma" })
      .getByRole("button", { name: /Terima & Berangkat/ })
      .click();
    await page.waitForURL(/\/d\/antar\//);

    await page.goto("/d");
    await expect(page.locator(kartu)).toBeVisible();
    await expect(page.getByText("Menuju Lokasi Bu Rahma")).toBeVisible();
  });

  test("diketuk kembali ke layar navigasi", async ({ page }) => {
    await page
      .getByRole("listitem")
      .filter({ hasText: "Bu Rahma" })
      .getByRole("button", { name: /Terima & Berangkat/ })
      .click();
    await page.waitForURL(/\/d\/antar\//);
    await page.goto("/d");

    await page.getByRole("link", { name: /Menuju Lokasi/ }).click();
    await page.waitForURL(/\/d\/antar\//);
    await expect(page.getByText("Tujuan Pengiriman")).toBeVisible();
  });

  test("hilang setelah ditandai selesai", async ({ page }) => {
    await page
      .getByRole("listitem")
      .filter({ hasText: "Bu Rahma" })
      .getByRole("button", { name: /Terima & Berangkat/ })
      .click();
    await page.waitForURL(/\/d\/antar\//);
    await page.goto("/d");
    await expect(page.locator(kartu)).toBeVisible();

    await page.getByRole("button", { name: "Tandai Selesai" }).click();
    await expect(page.locator(kartu)).toHaveCount(0);
  });

  test("hanya satu pengantaran berjalan pada satu waktu", async ({ page }) => {
    for (const nama of ["Bu Rahma", "Pak Dedi"]) {
      await page
        .getByRole("listitem")
        .filter({ hasText: nama })
        .getByRole("button", { name: /Terima & Berangkat/ })
        .click();
      await page.waitForURL(/\/d\/antar\//);
      await page.goto("/d");
    }
    /* Dua-duanya diberangkatkan, tapi hanya boleh ada satu kartu. */
    await expect(page.locator(kartu)).toHaveCount(1);
  });
});
