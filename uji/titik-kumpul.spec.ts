import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/** Titik Kumpul adalah fitur yang membedakan SEKETIKA dari aplikasi pesan-antar biasa, jadi alurnya diuji paling rinci. */
test.describe("Titik Kumpul", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
  });

  test("ikut bergabung menaikkan hitungan warga", async ({ page }) => {
    await page.goto("/kolab/tk-01");
    await expect(page.getByText("3/5 warga")).toBeVisible();
    await expect(page.getByText("Masih butuh")).toContainText("2 warga lagi");

    await page.getByRole("button", { name: /Ikut Pesan Sekarang/ }).click();

    await expect(page.getByText("4/5 warga")).toBeVisible();
    await expect(page.getByText("Kamu sudah ikut pesan")).toBeVisible();
  });

  test("sekali bergabung tidak terhitung dua kali", async ({ page }) => {
    await page.goto("/kolab/tk-01");
    await page.getByRole("button", { name: /Ikut Pesan Sekarang/ }).click();
    await expect(page.getByText("4/5 warga")).toBeVisible();

    /* Tombolnya berganti jadi keterangan menunggu, jadi tidak ada jalan untuk menambah diri sendiri lagi. */
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toHaveCount(0);
    await page.reload();
    await expect(page.getByText("4/5 warga")).toBeVisible();
  });

  test("target terpenuhi mengubah ajakan jadi arahan ke lokasi", async ({
    page,
  }) => {
    /* RT 07 sudah terisi 4 dari 5; satu orang lagi menggenapkannya. */
    await page.goto("/kolab/tk-03");
    await expect(page.getByText("4/5 warga")).toBeVisible();

    await page.getByRole("button", { name: /Ikut Pesan Sekarang/ }).click();

    await expect(page.getByText("5/5 warga")).toBeVisible();
    await expect(page.getByText("Tercapai")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Arahkan Saya ke Lokasi Titik Kumpul/ }),
    ).toBeVisible();
  });

  test("membuat titik kumpul baru dan mendapat tautan undangan", async ({
    page,
  }) => {
    await page.goto("/kolab/buat?pedagang=siomay-pak-agus");

    const publikasikan = page.getByRole("button", {
      name: /Publish Titik Kumpul/,
    });
    await expect(publikasikan).toBeDisabled();

    await page
      .getByPlaceholder("Misal: RT 03 Perumahan Indah")
      .fill("RT 09 Bukit Indah");
    /* Target minimal dua warga; satu ketukan saja belum cukup. */
    await page.getByRole("button", { name: "Tambah target" }).click();
    await expect(publikasikan).toBeDisabled();
    await page.getByRole("button", { name: "Tambah target" }).click();
    await expect(publikasikan).toBeEnabled();

    await publikasikan.click();
    await page.waitForURL(/\/kolab\/tk-.+\/berhasil/);
    await expect(
      page.getByRole("heading", { name: /Berhasil Dibuat/ }),
    ).toBeVisible();
    await expect(page.getByText(/\/kolab\/tk-/)).toBeVisible();
  });

  test("titik kumpul buatan sendiri muncul di daftar sebagai milik Anda", async ({
    page,
  }) => {
    await page.goto("/kolab/buat?pedagang=siomay-pak-agus");
    await page
      .getByPlaceholder("Misal: RT 03 Perumahan Indah")
      .fill("RT 09 Bukit Indah");
    await page.getByRole("button", { name: "Tambah target" }).click();
    await page.getByRole("button", { name: "Tambah target" }).click();
    await page.getByRole("button", { name: /Publish Titik Kumpul/ }).click();
    await page.waitForURL(/berhasil/);

    await page.goto("/kolab");
    const kartu = page
      .getByRole("listitem")
      .filter({ hasText: "RT 09 Bukit Indah" });
    await expect(kartu).toBeVisible();
    await expect(kartu).toContainText("Dibuat oleh Anda");
    await expect(kartu).toContainText("1/2 warga bergabung");
  });
});
