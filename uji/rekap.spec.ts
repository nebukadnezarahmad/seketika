import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/**
 * Buku Kas membuka angka yang selama ini sudah tersimpan tapi tidak
 * pernah dijumlahkan. Yang diuji di sini bukan tata letaknya, melainkan
 * tiga hal yang bisa diam-diam salah: angkanya muncul, angkanya ikut
 * berubah ketika pesanan diselesaikan, dan tawaran berbayarnya benar
 * dalam keadaan terkunci alih-alih menjanjikan halaman yang belum ada.
 */
test.describe("Buku Kas", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/rekap");
  });

  test("menampilkan pendapatan hari ini dan grafik tujuh hari", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Buku Kas" })).toBeVisible();
    await expect(page.getByText("Pendapatan Hari Ini")).toBeVisible();

    /* Data contoh menyelesaikan dua pesanan hari ini, jadi angkanya tidak
       boleh nol rupiah. */
    const kartu = page.locator("section").first();
    await expect(kartu.getByText(/^Rp /)).toBeVisible();
    await expect(kartu.getByText("Rp 0")).toHaveCount(0);

    await expect(page.getByRole("heading", { name: /Tujuh Hari Terakhir/ })).toBeVisible();
    /* Tujuh batang, tiap batang membawa nominalnya sendiri untuk pembaca
       layar; tanpa itu grafiknya tidak berarti apa-apa bagi yang tidak
       melihatnya. */
    const batang = page.locator("section", { hasText: "Tujuh Hari Terakhir" }).getByRole("listitem");
    await expect(batang).toHaveCount(7);
    await expect(batang.last()).toContainText("(hari ini)");

    await expect(page.getByRole("heading", { name: /Menu Terlaris/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Jam Paling Ramai/ })).toBeVisible();
    await expect(page.getByText(/Paling ramai jam/)).toBeVisible();
  });

  test("menyelesaikan satu pesanan menaikkan angka pendapatan", async ({ page }) => {
    const nominal = page.locator("section").first().getByText(/^Rp /).first();
    const sebelum = await nominal.innerText();

    /* Pak Dedi memesan Bakso Komplit 25.000 kali tiga dan Bakso Mercon
       15.000 kali dua, jadi menyelesaikannya menambah 105.000. */
    await page.goto("/d/pesanan");
    const kartu = page.getByRole("listitem").filter({ hasText: "Pak Dedi" });
    await kartu.getByRole("button").first().click();
    await kartu.getByRole("button", { name: "Tandai Selesai" }).click();

    await page.goto("/d/rekap");
    await expect(nominal).not.toHaveText(sebelum);

    const angka = (teks: string) => Number(teks.replace(/[^0-9]/g, ""));
    expect(angka(await nominal.innerText())).toBe(angka(sebelum) + 105_000);
  });

  test("kartu SEKETIKA Pro tampil dengan fitur dalam keadaan terkunci", async ({ page }) => {
    const pro = page.locator("section", { hasText: "SEKETIKA Pro" }).last();
    await expect(pro.getByText("SEKETIKA Pro")).toBeVisible();

    for (const fitur of [
      "Laporan bulanan lengkap",
      "Prediksi kawasan & jam ramai",
      "Catatan stok dagangan",
    ]) {
      await expect(pro.getByText(fitur)).toBeVisible();
    }

    await expect(pro.getByRole("button", { name: "Pelajari" })).toBeDisabled();
  });

  test("dijangkau dari lembar pesanan hari ini dan dari halaman toko", async ({ page }) => {
    await page.goto("/d");
    await page.getByRole("button", { expanded: false }).first().click();
    await page.getByRole("link", { name: "Lihat Buku Kas" }).click();
    await page.waitForURL("**/d/rekap");

    await page.goto("/d/profil");
    await page.getByRole("link", { name: /Buku Kas/ }).click();
    await page.waitForURL("**/d/rekap");
    await expect(page.getByRole("heading", { name: "Buku Kas" })).toBeVisible();
  });
});
