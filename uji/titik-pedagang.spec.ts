import { test, expect, type Page } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/**
 * Sisi pedagang dari titik kumpul.
 *
 * Sebelum berkas ini ada, pedagang yang membuka permintaan titik
 * kumpulnya sendiri mendapat layar warga: navigasi warga di bawah, dan
 * satu-satunya tombol "Ikut Pesan Sekarang". Menekannya menaikkan
 * hitungan peserta dari 3/6 jadi 4/6, yaitu angka yang justru dipakai
 * pedagang untuk memutuskan berangkat.
 */
test.describe("Titik kumpul di sisi pedagang", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.getByRole("link", { name: /RT 02 Taman Bermain/ }).click();
    await page.waitForURL(/\/kolab\/tk-/);
  });

  test("pedagang tidak bisa ikut jadi peserta titik kumpulnya sendiri", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Ikut Pesan Sekarang/ })).toHaveCount(0);
    await expect(page.getByText("3/6 warga")).toBeVisible();
  });

  test("navigasi bawah tetap navigasi pedagang, bukan navigasi warga", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await expect(nav).toHaveAttribute("aria-label", "Navigasi pedagang");
    await expect(nav.getByText("Pesanan")).toBeVisible();
  });

  test("menerima permintaan mengubah statusnya dan membuka rute", async ({ page }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();

    await page.waitForURL(/\/kolab\/tk-\d+\/rute/);
    await expect(page.getByRole("heading", { name: "Rute ke Titik Kumpul" })).toBeVisible();
    /* Rutenya berangkat dari gerobak, bukan dari rumah warga. */
    await expect(page.getByText(/Gerobak Bakso Pak Anton/)).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveAttribute("aria-label", "Navigasi pedagang");

    await page.goBack();
    await expect(page.getByText("Dijemput").first()).toBeVisible();
  });

  test("yang diselesaikan hilang dari daftar, yang lain tetap tinggal", async ({ page }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);
    await page.goBack();
    await page.getByRole("button", { name: /Selesaikan Titik Kumpul/ }).click();
    await expect(page.getByText("Titik kumpul ini sudah selesai")).toBeVisible();

    await page.goto("/d");
    /* Yang diselesaikan hilang, yang belum tetap ada. Menguji keduanya
       sekaligus penting: daftar yang menghilangkan semuanya juga akan
       lolos kalau yang diperiksa cuma hilangnya satu kotak. */
    await expect(page.getByRole("link", { name: /RT 02 Taman Bermain/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /RT 04 Gang Melati/ })).toBeVisible();
  });

  test("gerobak sendiri punya dua permintaan dengan keadaan berbeda", async ({ page }) => {
    await page.goto("/d");

    const kumpul = page.getByRole("link", { name: /RT 02 Taman Bermain/ });
    const capai = page.getByRole("link", { name: /RT 04 Gang Melati/ });
    await expect(kumpul).toBeVisible();
    await expect(capai).toBeVisible();
    await expect(kumpul).toContainText("Aktif");
    await expect(capai).toContainText("Tercapai");

    /* Ajakan saat gerobak tutup menyebut angka yang sama dengan jumlah
       kotak yang menunggu. */
    await page.getByRole("checkbox", { name: "Buka gerobak" }).uncheck({ force: true });
    await expect(page.getByText(/2 permintaan titik kumpul/)).toBeVisible();
  });

  test("menyelesaikan satu permintaan menurunkan hitungan, bukan menghapusnya", async ({ page }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);
    await page.goBack();
    await page.getByRole("button", { name: /Selesaikan Titik Kumpul/ }).click();

    await page.goto("/d");
    await page.getByRole("checkbox", { name: "Buka gerobak" }).uncheck({ force: true });
    await expect(page.getByText(/1 permintaan titik kumpul/)).toBeVisible();
  });
});

/**
 * Sisi warga harus ikut berubah ketika pedagang berangkat, kalau tidak
 * tombol pedagang cuma menulis angka ke penyimpanan tanpa akibat yang
 * terlihat siapa pun.
 *
 * Statusnya disuntikkan lewat penyimpanan, bukan lewat layar pedagang,
 * karena satu peramban cuma memegang satu profil dan warga tidak punya
 * cara mengubah status titik kumpul.
 */
test.describe("Sisi warga mengikuti keputusan pedagang", () => {
  const setStatusTitik = async (page: Page, id: string, status: string) => {
    await page.evaluate(
      ([id, status]) => {
        const simpanan = JSON.parse(localStorage.getItem("seketika") ?? "{}");
        simpanan.state.titikKumpul = simpanan.state.titikKumpul.map(
          (t: { id: string }) => (t.id === id ? { ...t, status } : t),
        );
        localStorage.setItem("seketika", JSON.stringify(simpanan));
      },
      [id, status],
    );
  };

  test("titik kumpul yang sudah dijemput tidak lagi menawarkan gabung", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Rahmat");
    await page.goto("/kolab/tk-04");
    await setStatusTitik(page, "tk-04", "dijemput");
    await page.reload();

    await expect(page.getByText("Bakso Pak Anton sedang menuju lokasi")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ikut Pesan Sekarang/ })).toHaveCount(0);
    await expect(page.getByText("Dijemput").first()).toBeVisible();
  });

  test("titik kumpul yang sudah selesai ditutup untuk warga", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Rahmat");
    await page.goto("/kolab/tk-04");
    await setStatusTitik(page, "tk-04", "selesai");
    await page.reload();

    await expect(page.getByText("Titik kumpul ini sudah selesai")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ikut Pesan Sekarang/ })).toHaveCount(0);
  });
});
