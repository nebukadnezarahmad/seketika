import { test, expect, type Page } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";
import type { TitikKumpul } from "@/lib/tipe";

/** Bagian keadaan tersimpan yang disentuh berkas uji ini. */
type Simpanan = { titikKumpul: TitikKumpul[] };

/** Mengubah keadaan tersimpan lalu memuat ulang. */
async function ubahSimpanan(page: Page, ubah: (keadaan: Simpanan) => void) {
  await page.evaluate((sumber) => {
    const simpanan = JSON.parse(localStorage.getItem("seketika") ?? "{}");
    /* Fungsinya diseberangkan sebagai teks lalu dirakit ulang di dalam peramban. */
    new Function("keadaan", `(${sumber})(keadaan)`)(simpanan.state);
    localStorage.setItem("seketika", JSON.stringify(simpanan));
  }, ubah.toString());
  await page.reload();
}

test.describe("Menolak pesanan", () => {
  test("pesanan yang ditolak tidak terhitung sebagai pemasukan", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");

    await page.goto("/d/rekap");
    const nominal = page.locator("section").first().getByText(/^Rp /).first();
    const angka = (teks: string) => Number(teks.replace(/[^0-9]/g, ""));
    const sebelum = angka(await nominal.innerText());

    await page.goto("/d");
    const kartu = page.getByRole("listitem").filter({ hasText: "Pak Dedi" });
    await kartu.getByRole("button", { name: "Tolak" }).click();

    /* Inti perbaikannya: menolak tidak boleh menaikkan omzet sepeser pun. */
    await page.goto("/d/rekap");
    expect(angka(await nominal.innerText())).toBe(sebelum);
  });

  test("pesanan yang ditolak punya kelompoknya sendiri, bukan menumpang selesai", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page
      .getByRole("listitem")
      .filter({ hasText: "Pak Dedi" })
      .getByRole("button", { name: "Tolak" })
      .click();

    await page.goto("/d/pesanan");
    await page.getByRole("button", { name: /^Ditolak/ }).click();
    await expect(page.getByRole("listitem")).toHaveCount(1);
    await expect(page.getByText("Pak Dedi")).toBeVisible();

    await page.getByRole("button", { name: /^Selesai/ }).click();
    await expect(page.getByText("Pak Dedi")).toHaveCount(0);
  });
});

test.describe("Kelola menu pedagang", () => {
  test("mematikan menu menyembunyikannya dari warga", async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/menu");

    await expect(
      page.getByRole("heading", { name: "Kelola Menu" }),
    ).toBeVisible();
    await page
      .getByRole("checkbox", { name: "Tampilkan Bakso Mercon" })
      .uncheck({ force: true });
    await expect(page.getByText("Disembunyikan")).toBeVisible();

    /* Warga membuka gerobak yang sama dan tidak lagi menemukan menunya. */
    await page.goto("/pedagang/bakso-pak-anton/menu");
    await expect(
      page.getByRole("button", { name: /Bakso Mercon/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Bakso Komplit/ }),
    ).toBeVisible();
  });

  test("tautan kelola menu tidak lagi mendarat di layar pembeli", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/d/profil");
    await page.getByRole("link", { name: /Kelola Menu/ }).click();

    await page.waitForURL("**/d/menu");
    /* Dulu tautan ini mendarat di daftar menu warga, yang kini berisi tombol memanggil penjual: pedagang ditawari memanggil gerobaknya sendiri. */
    await expect(
      page.getByRole("button", { name: /Panggil Penjual/ }),
    ).toHaveCount(0);
  });
});

test.describe("Penilaian", () => {
  test("bintang hanya ditawarkan pada pesanan yang sudah selesai", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");

    /* ord-001 masih diproses, ord-002 sudah selesai. */
    await page.goto("/pesanan/ord-001");
    await expect(page.getByText("Beri Penilaian")).toHaveCount(0);

    await page.goto("/pesanan/ord-002");
    await expect(page.getByText("Beri Penilaian")).toBeVisible();
  });

  test("nilai yang sudah dikirim tidak bisa diubah lagi", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/pesanan/ord-002");

    await expect(
      page.getByRole("button", { name: "Kirim Penilaian" }),
    ).toBeDisabled();
    await page
      .getByRole("radio", { name: /^4 bintang/ })
      .check({ force: true });
    await page.getByRole("button", { name: "Kirim Penilaian" }).click();

    await expect(page.getByText("Penilaian Anda")).toBeVisible();
    await expect(page.getByText(/4 dari 5/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Kirim Penilaian" }),
    ).toHaveCount(0);

    /* Bertahan setelah dimuat ulang, bukan cuma keadaan di layar. */
    await page.reload();
    await expect(page.getByText(/4 dari 5/)).toBeVisible();
  });
});

test.describe("Obrolan titik kumpul", () => {
  test("pesan terkirim, tersimpan, dan membawa nama pengirimnya", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");

    await page.getByRole("button", { name: /Obrolan Warga/ }).click();
    const lembar = page.getByRole("dialog");
    await expect(lembar.getByText("Belum ada obrolan.")).toBeVisible();

    await lembar
      .getByLabel("Tulis pesan untuk warga lain")
      .fill("Kumpul jam 5 ya");
    await lembar.getByRole("button", { name: "Kirim pesan" }).click();

    await expect(lembar.getByText("Dewi: Kumpul jam 5 ya")).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: /Obrolan Warga/ }).click();
    await expect(page.getByText("Dewi: Kumpul jam 5 ya")).toBeVisible();
  });
});

test.describe("Kedaluwarsa titik kumpul", () => {
  test("titik kumpul yang lewat tenggat berhenti menerima warga", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await page.goto("/kolab/tk-01");
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toBeVisible();

    await ubahSimpanan(page, (keadaan) => {
      const t = keadaan.titikKumpul.find((x) => x.id === "tk-01");
      if (t) t.kedaluwarsa = new Date(Date.now() - 3_600_000).toISOString();
    });

    await expect(page.getByText("Sudah lewat batas waktu")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toHaveCount(0);
    await expect(page.getByText("Waktu habis")).toBeVisible();

    /* Pada daftar pun ia tidak lagi menawarkan bergabung, tapi juga tidak lenyap begitu saja; menghilang diam-diam membuat orang mengira datanya rusak. */
    await page.goto("/kolab");
    const kartu = page
      .getByRole("listitem")
      .filter({ hasText: "RT 05 Blok C" });
    await expect(kartu.getByText("Hangus")).toBeVisible();
    await expect(kartu.getByText("Tidak menerima warga baru")).toBeVisible();
  });
});

test.describe("Pusat notifikasi", () => {
  test("lonceng warga ada di beranda dan memadamkan lencananya", async ({
    page,
  }) => {
    /* Loncengnya di beranda, bukan di dalam profil: kabar pesanan perlu terlihat begitu aplikasi dibuka, bukan setelah orang punya alasan lain untuk membuka profilnya. */
    await lewatiPengenalan(page, "pembeli", "Dewi");

    const lonceng = page.getByRole("link", {
      name: /^Notifikasi, \d+ belum dibaca/,
    });
    await expect(lonceng).toBeVisible();
    await lonceng.click();

    await page.waitForURL("**/notifikasi");
    await expect(
      page.getByRole("heading", { name: "Notifikasi" }),
    ).toBeVisible();
    await expect(page.getByText("Pesanan selesai").first()).toBeVisible();

    /* Membuka layarnya berarti membacanya; loncengnya kembali polos. */
    await page.goto("/beranda");
    await expect(
      page.getByRole("link", { name: "Notifikasi", exact: true }),
    ).toBeVisible();

    /* Kepala profil tidak lagi memuat lonceng; jalur cadangannya berupa satu baris di daftar menu. */
    await page.goto("/profil");
    await expect(
      page.getByRole("link", { name: /^Notifikasi, \d+ belum dibaca/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Kabar pesanan dan titik kumpul/ }),
    ).toBeVisible();
  });

  test("pedagang melihat kabar yang berbeda dari warga", async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.goto("/notifikasi");

    await expect(page.getByText("Pesanan baru masuk").first()).toBeVisible();
    await expect(
      page.getByText("Permintaan titik kumpul").first(),
    ).toBeVisible();
    /* Kabar milik warga tidak boleh bocor ke sisi pedagang. */
    await expect(page.getByText("Pesanan sedang disiapkan")).toHaveCount(0);
  });
});
