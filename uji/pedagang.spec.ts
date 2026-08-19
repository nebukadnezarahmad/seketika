import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

test.describe("Sisi pedagang", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
  });

  test("menutup gerobak memunculkan ajakan yang beralasan", async ({ page }) => {
    await expect(page.getByText(/Sedang BUKA/)).toBeVisible();

    await page.getByRole("checkbox", { name: "Buka gerobak" }).uncheck({ force: true });

    await expect(page.getByText(/Sedang TUTUP/)).toBeVisible();
    /* Ajakannya menyebut jumlah permintaan yang sedang menunggu, bukan
       sekadar mengimbau membuka gerobak. */
    await expect(page.getByText(/permintaan titik kumpul/)).toBeVisible();
  });

  test("menerima pesanan memindahkannya ke pengantaran", async ({ page }) => {
    const kartu = page.getByRole("listitem").filter({ hasText: "Bu Rahma" });
    await kartu.getByRole("button", { name: /Terima & Berangkat/ }).click();

    await page.waitForURL(/\/d\/antar\/in-\d+/);
    await expect(page.getByText("Tujuan Pengiriman")).toBeVisible();
    await expect(page.getByText("Bu Rahma")).toBeVisible();
    await expect(page.getByText("RT 05 Blok C · Pos Ronda")).toBeVisible();
  });

  test("penyaring pesanan masuk memilah menurut status", async ({ page }) => {
    await page.goto("/d/pesanan");
    await expect(page.getByRole("listitem")).toHaveCount(5);

    await page.getByRole("button", { name: /^Baru/ }).click();
    await expect(page.getByRole("listitem")).toHaveCount(2);

    await page.getByRole("button", { name: /^Selesai/ }).click();
    await expect(page.getByRole("listitem")).toHaveCount(2);
    await expect(page.getByText("Bu Lina")).toBeVisible();
  });

  test("rincian pesanan terbuka dan menampilkan total", async ({ page }) => {
    await page.goto("/d/pesanan");
    const kartu = page.getByRole("listitem").filter({ hasText: "Pak Dedi" });
    await kartu.getByRole("button").first().click();

    /* Bakso Komplit 25.000 x3 ditambah Bakso Mercon 15.000 x2. */
    await expect(kartu.getByText("Rp 105.000")).toBeVisible();
    await expect(kartu.getByRole("button", { name: "Tandai Selesai" })).toBeVisible();
  });

  test("menandai selesai memindahkan pesanan keluar dari kelompok baru", async ({ page }) => {
    await page.goto("/d/pesanan");
    await page.getByRole("button", { name: /^Baru/ }).click();
    await expect(page.getByRole("listitem")).toHaveCount(2);

    const kartu = page.getByRole("listitem").filter({ hasText: "Pak Dedi" });
    await kartu.getByRole("button").first().click();
    await kartu.getByRole("button", { name: "Tandai Selesai" }).click();

    await expect(page.getByRole("listitem")).toHaveCount(1);
  });
});

test.describe("Berpindah peran", () => {
  test("warga bisa menengok sisi pedagang lalu kembali", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");

    await page.goto("/profil");
    await page.getByRole("button", { name: /Beralih ke Mode Pedagang/ }).click();
    await page.waitForURL("**/d");
    await expect(page.getByText("Status Gerobak")).toBeVisible();

    await page.goto("/d/profil");
    await page.getByRole("button", { name: /Beralih ke Mode Pembeli/ }).click();
    await page.waitForURL("**/beranda");
    await expect(page.getByRole("heading", { name: "Rekomendasi Terdekat" })).toBeVisible();
  });

  test("setel ulang mengembalikan aplikasi ke keadaan contoh", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");
    await page.getByRole("button", { name: /Ikut Pesan Sekarang/ }).click();
    await expect(page.getByText("4/5 warga")).toBeVisible();

    await page.goto("/profil");
    await page.getByRole("button", { name: /Setel Ulang Data/ }).click();
    /* Setelah data dihapus aplikasi kembali ke pintu masuk, bukan langsung
       ke pemilihan peran. */
    await page.waitForURL("**/sambutan", { timeout: 10_000 });

    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");
    await expect(page.getByText("3/5 warga")).toBeVisible();
  });
});
