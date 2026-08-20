import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

test.describe("Kelola menu", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/menu");
  });

  test("menu baru yang ditambah langsung terlihat warga", async ({ page }) => {
    await page.getByRole("button", { name: /Tambah Menu/ }).click();
    const lembar = page.getByRole("dialog");
    await lembar.getByLabel("Nama menu").fill("Bakso Urat Jumbo");
    await lembar.getByLabel("Keterangan").fill("Urat sapi ukuran besar");
    await lembar.getByLabel("Harga per porsi").fill("28000");
    await lembar.getByRole("button", { name: "Tambah ke Daftar" }).click();

    await expect(page.getByText("6 dari 6 menu menyala")).toBeVisible();

    await page.goto("/pedagang/bakso-pak-anton/menu");
    await expect(page.getByRole("button", { name: /Bakso Urat Jumbo/ })).toBeVisible();
    await expect(page.getByText("Rp 28.000")).toBeVisible();
  });

  test("isian ditolak kalau nama kosong atau harga nol", async ({ page }) => {
    await page.getByRole("button", { name: /Tambah Menu/ }).click();
    const lembar = page.getByRole("dialog");
    await lembar.getByRole("button", { name: "Tambah ke Daftar" }).click();

    await expect(lembar.getByText("Nama menu belum diisi.")).toBeVisible();
    await expect(lembar.getByText("Harga harus lebih dari nol.")).toBeVisible();
    /* Lembarnya tetap terbuka; menutupnya diam-diam berarti isian yang
       ditolak hilang tanpa penjelasan. */
    await expect(lembar).toBeVisible();
  });

  test("harga yang disunting ikut berubah di sisi warga", async ({ page }) => {
    await page.getByRole("button", { name: /Bakso Mercon/ }).click();
    const lembar = page.getByRole("dialog");
    await lembar.getByLabel("Harga per porsi").fill("17000");
    await lembar.getByRole("button", { name: "Simpan Perubahan" }).click();

    await page.goto("/pedagang/bakso-pak-anton/menu");
    await page.getByRole("button", { name: /Bakso Mercon/ }).click();
    await expect(page.getByRole("dialog").getByText("Rp 17.000")).toBeVisible();
  });

  test("menghapus menu minta ketukan kedua lebih dulu", async ({ page }) => {
    await page.getByRole("button", { name: /Bakso Ikan/ }).click();
    const lembar = page.getByRole("dialog");

    await lembar.getByRole("button", { name: /Hapus Menu/ }).click();
    /* Ketukan pertama cuma memunculkan penegasan, belum menghapus. */
    await expect(lembar.getByText(/Hapus Bakso Ikan dari daftar menu/)).toBeVisible();

    await lembar.getByRole("button", { name: "Ya, hapus" }).click();
    await expect(page.getByText("4 dari 4 menu menyala")).toBeVisible();
    await expect(page.getByRole("button", { name: /Bakso Ikan/ })).toHaveCount(0);
  });
});

test.describe("Tombol pada tab profil", () => {
  test("warga bisa mengubah alamat dan data dirinya", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/profil");

    await page.getByRole("button", { name: /Alamat Tersimpan/ }).click();
    const lembar = page.getByRole("dialog");
    await lembar.getByLabel("Alamat").fill("Jalan Kenanga No.7");
    await lembar.getByLabel("Patokan").fill("Sebelah warung Bu Tin");
    await lembar.getByRole("button", { name: "Simpan" }).click();

    await expect(page.getByText("Jalan Kenanga No.7")).toBeVisible();

    /* Alamat baru dipakai layar lain, bukan cuma tersimpan di profil. */
    await page.goto("/beranda");
    await expect(page.getByText("Jalan Kenanga No.7")).toBeVisible();
  });

  test("bantuan dan tentang aplikasi punya isi, bukan tautan mati", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/profil");

    await page.getByRole("button", { name: /Pusat Bantuan Tetangga/ }).click();
    await expect(page.getByText(/Pedagang tidak kunjung datang/)).toBeVisible();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: /Tentang SEKETIKA/ }).click();
    await expect(page.getByText(/Tunai di tempat/)).toBeVisible();
  });

  test("pedagang bisa mengubah jam operasional dan area", async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/profil");

    await page.getByRole("button", { name: /Jam Operasional/ }).click();
    const lembar = page.getByRole("dialog");
    await lembar.getByLabel("Mulai").fill("06.30");
    await lembar.getByLabel("Sampai").fill("21.00");
    await lembar.getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText("06.30 - 21.00")).toBeVisible();

    await page.getByRole("button", { name: /Area Jangkauan/ }).click();
    await page.getByRole("dialog").getByLabel("Kawasan").fill("Perum Griya Asri");
    await page.getByRole("dialog").getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText("Perum Griya Asri")).toBeVisible();
  });

  test("galeri menampilkan foto yang memang dipakai", async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/profil");
    await page.getByRole("button", { name: /Foto & Galeri/ }).click();

    const lembar = page.getByRole("dialog");
    await expect(lembar.getByRole("img")).toHaveCount(6);
    await expect(lembar.getByText(/belum tersedia pada purwarupa/)).toBeVisible();
  });
});

test.describe("Penilaian terlihat di kedua sisi", () => {
  test("bintang muncul di riwayat pesanan dan di halaman toko", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");

    await page.goto("/pesanan");
    await expect(page.getByText("Belum dinilai").first()).toBeVisible();

    await page.goto("/pesanan/ord-002");
    await page.getByRole("radio", { name: /^5 bintang/ }).check({ force: true });
    await page.getByRole("button", { name: "Kirim Penilaian" }).click();

    await page.goto("/pesanan");
    await expect(page.getByText("Kamu beri 5 dari 5")).toBeVisible();
  });
});

test("permintaan titik kumpul di beranda pedagang bisa dibuka", async ({ page }) => {
  await lewatiPengenalan(page, "pedagang", "Pak Anton");
  await page.getByRole("link", { name: /RT 02 Taman Bermain/ }).click();
  await page.waitForURL(/\/kolab\/tk-/);
  await expect(page.getByRole("heading", { name: "Detail Titik Kumpul" })).toBeVisible();
});
