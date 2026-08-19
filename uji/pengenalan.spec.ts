import { test, expect } from "@playwright/test";
import { lewatiPengenalan, pilihPeran } from "./bantu";

test.describe("Pengenalan", () => {
  test("layar pembuka mengarahkan pengguna baru ke pemilihan peran", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("SEKETIKA", { exact: true })).toBeVisible();
    await page.waitForURL("**/mulai", { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "Selamat Datang!" })).toBeVisible();
  });

  test("tombol Lanjut terkunci sampai peran dipilih", async ({ page }) => {
    await page.goto("/mulai");
    const lanjut = page.getByRole("button", { name: /Lanjut/ });
    await expect(lanjut).toBeDisabled();

    await pilihPeran(page, "pembeli");
    /* Mengetuk kartunya harus benar-benar mencentang radio di dalamnya;
       kalau kaitan labelnya putus, papan ketik dan pembaca layar ikut
       kehilangan kendali atas pilihan ini. */
    await expect(page.getByRole("radio", { name: /Saya Ingin Membeli/ })).toBeChecked();
    await expect(lanjut).toBeEnabled();
  });

  test("pembeli menyelesaikan tiga langkah lalu mendarat di beranda", async ({ page }) => {
    await page.goto("/mulai");
    await pilihPeran(page, "pembeli");
    await page.getByRole("button", { name: /Lanjut/ }).click();

    await expect(page.getByRole("heading", { name: /Beri Akses/ })).toBeVisible();
    await page.getByRole("button", { name: /Izinkan/ }).click();

    await expect(page.getByRole("heading", { name: "Isi Data Pembeli" })).toBeVisible();
    /* Nama satu-satunya isian wajib; sisanya boleh menyusul dari profil. */
    await expect(page.getByRole("button", { name: /Mulai/ })).toBeDisabled();
    await page.getByLabel("Nama Lengkap").fill("Rahmat");
    await page.getByRole("button", { name: /Mulai/ }).click();

    await page.waitForURL("**/beranda");
    await expect(page.getByRole("heading", { name: "Rekomendasi Terdekat" })).toBeVisible();
  });

  test("pedagang diarahkan ke berandanya sendiri, bukan beranda warga", async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await expect(page.getByText("Status Gerobak")).toBeVisible();
    await expect(page.getByText(/Sedang BUKA/)).toBeVisible();
  });

  test("pengguna yang sudah terdaftar tidak diseret mengulang pengenalan", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli");
    await page.goto("/");
    await page.waitForURL("**/beranda", { timeout: 10_000 });
  });
});
