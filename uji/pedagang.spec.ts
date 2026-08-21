import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

test.describe("Sisi pedagang", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
  });

  test("menutup gerobak memunculkan ajakan yang beralasan", async ({
    page,
  }) => {
    await expect(page.getByText(/Sedang BUKA/)).toBeVisible();

    await page
      .getByRole("checkbox", { name: "Buka gerobak" })
      .uncheck({ force: true });

    await expect(page.getByText(/Sedang TUTUP/)).toBeVisible();
    /* Ajakannya menyebut jumlah permintaan yang sedang menunggu, bukan sekadar mengimbau membuka gerobak. */
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
    await expect(
      kartu.getByRole("button", { name: "Tandai Selesai" }),
    ).toBeVisible();
  });

  test("menandai selesai memindahkan pesanan keluar dari kelompok baru", async ({
    page,
  }) => {
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
    await page
      .getByRole("button", { name: /Beralih ke Mode Pedagang/ })
      .click();
    await page.waitForURL("**/d");
    await expect(page.getByText("Status Gerobak")).toBeVisible();

    await page.goto("/d/profil");
    await page.getByRole("button", { name: /Beralih ke Mode Pembeli/ }).click();
    await page.waitForURL("**/beranda");
    await expect(
      page.getByRole("heading", { name: "Rekomendasi Terdekat" }),
    ).toBeVisible();
  });

  test("setel ulang mengembalikan aplikasi ke keadaan contoh", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");
    await page.getByRole("button", { name: /Ikut Pesan Sekarang/ }).click();
    await expect(page.getByText("4/5 warga")).toBeVisible();

    await page.goto("/profil");
    await page.getByRole("button", { name: /Setel Ulang Data/ }).click();
    /* Setelah data dihapus aplikasi kembali ke pintu masuk, bukan langsung ke pemilihan peran. */
    await page.waitForURL("**/sambutan", { timeout: 10_000 });

    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");
    await expect(page.getByText("3/5 warga")).toBeVisible();
  });
});

test.describe("Kotak masuk pedagang", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/chat");
  });

  test("berisi warga, bukan sesama pedagang", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Pesan Masuk/ }),
    ).toBeVisible();
    await expect(page.getByText("Pesan dari calon pembeli Anda")).toBeVisible();

    for (const warga of [
      "Pak Dedi",
      "Bu Rahma",
      "Rizki Pratama",
      "Sinta Maharani",
    ]) {
      await expect(page.getByText(warga, { exact: true })).toBeVisible();
    }
    /* Nama pedagang lain tidak boleh muncul di kotak masuk pedagang. */
    for (const pedagang of [
      "Bakso Pak Anton",
      "Sayur Kang Ucup",
      "Donat Bu Jasmin",
    ]) {
      await expect(page.getByText(pedagang, { exact: true })).toHaveCount(0);
    }
  });

  test("kotak masuk kedua peran tidak tercampur", async ({ page }) => {
    await page.goto("/d/chat/cp-01");
    await page.getByLabel("Balas pesan...").fill("Baik pak, meluncur");
    await page.getByRole("button", { name: "Kirim pesan" }).click();
    await expect(page.getByText("Baik pak, meluncur")).toBeVisible();

    /* Pesan pedagang tidak boleh bocor ke kotak masuk warga. */
    await page.goto("/chat/ch-01");
    await expect(page.getByText("Baik pak, meluncur")).toHaveCount(0);
  });

  test("balasan cepat langsung terkirim sebagai pesan", async ({ page }) => {
    await page.goto("/d/chat/cp-03");
    await page.getByRole("button", { name: "Sudah habis hari ini" }).click();
    await expect(
      page.locator("li").filter({ hasText: "Sudah habis hari ini" }).last(),
    ).toBeVisible();
  });
});
