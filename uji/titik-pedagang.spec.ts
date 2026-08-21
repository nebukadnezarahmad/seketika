import { test, expect, type Page } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/** Sisi pedagang dari titik kumpul. */
test.describe("Titik kumpul di sisi pedagang", () => {
  test.beforeEach(async ({ page }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await page.getByRole("link", { name: /RT 02 Taman Bermain/ }).click();
    await page.waitForURL(/\/kolab\/tk-/);
  });

  test("pedagang tidak bisa ikut jadi peserta titik kumpulnya sendiri", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toHaveCount(0);
    await expect(page.getByText("6/6 warga")).toBeVisible();
  });

  test("navigasi bawah tetap navigasi pedagang, bukan navigasi warga", async ({
    page,
  }) => {
    const nav = page.getByRole("navigation");
    await expect(nav).toHaveAttribute("aria-label", "Navigasi pedagang");
    await expect(nav.getByText("Pesanan")).toBeVisible();
  });

  test("menerima permintaan mengubah statusnya dan membuka rute", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();

    await page.waitForURL(/\/kolab\/tk-\d+\/rute/);
    await expect(
      page.getByRole("heading", { name: "Rute ke Titik Kumpul" }),
    ).toBeVisible();
    /* Rutenya berangkat dari gerobak, bukan dari rumah warga. */
    await expect(page.getByText(/Gerobak Bakso Pak Anton/)).toBeVisible();
    await expect(page.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Navigasi pedagang",
    );

    await page.goBack();
    await expect(page.getByText("Dijemput").first()).toBeVisible();
  });

  test("yang diterima keluar dari daftar dan pindah ke kartu melayang", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);

    await page.goto("/d");
    /* Dicocokkan lewat pola kartu daftarnya ("N/M warga · patokan"), bukan lewat nama titiknya saja: kartu melayang juga sebuah tautan dan namanya memuat nama titik yang sama, jadi memeriksa namanya saja akan menghitung kartu melayang itu juga. */
    const kartu = page.getByRole("link", { name: /warga ·/ });
    await expect(kartu).toHaveCount(1);
    await expect(kartu).toContainText("RT 04 Gang Melati");

    /* Jejaknya tidak hilang: yang sedang dijemput pindah ke kartu melayang, tempat yang sama dengan pesanan yang sedang diantar. */
    await expect(page.getByText("Menuju RT 02 Taman Bermain")).toBeVisible();
    await expect(page.getByText(/6 warga menunggu/)).toBeVisible();
  });

  test("kartu permintaan sisa tidak tertutup kartu melayang", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);
    await page.goto("/d");

    /* Digulung sampai dasar lewat wadahnya sendiri. */
    await page.locator(".isi-layar").evaluate((e) => {
      e.scrollTop = e.scrollHeight;
    });
    await page.waitForTimeout(300);

    const kartu = await page
      .getByRole("link", { name: /warga ·/ })
      .boundingBox();
    const pil = await page
      .getByText("Menuju RT 02 Taman Bermain")
      .boundingBox();
    expect(kartu!.y + kartu!.height).toBeLessThan(pil!.y);

    await page.getByRole("link", { name: /warga ·/ }).click();
    await page.waitForURL(/\/kolab\/tk-05/);
  });

  test("kartu melayang menutup titik kumpul yang sudah dijemput", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);
    await page.goto("/d");

    await page.getByRole("button", { name: /Tandai Selesai/ }).click();

    await expect(page.getByText("Menuju RT 02 Taman Bermain")).toHaveCount(0);
    const sisa = page.getByRole("link", { name: /warga ·/ });
    await expect(sisa).toHaveCount(1);
    await expect(sisa).toContainText("RT 04 Gang Melati");
  });

  test("dua permintaan yang tampil keduanya sudah tercapai", async ({
    page,
  }) => {
    await page.goto("/d");

    const kartu = page.getByRole("link", { name: /warga ·/ });
    await expect(kartu).toHaveCount(2);
    await expect(kartu.nth(0)).toContainText("Tercapai");
    await expect(kartu.nth(1)).toContainText("Tercapai");

    /* Ajakan saat gerobak tutup menyebut angka yang sama dengan jumlah kotak yang menunggu. */
    await page
      .getByRole("checkbox", { name: "Buka gerobak" })
      .uncheck({ force: true });
    await expect(page.getByText(/2 permintaan titik kumpul/)).toBeVisible();
  });

  test("membuka yang belum tercapai lewat tautan tidak menawarkan berangkat", async ({
    page,
  }) => {
    /* Berandanya sudah menyaring, tapi tautan lama di kabar atau riwayat peramban masih bisa mengantar ke sini. */
    await page.evaluate(() => {
      const simpanan = JSON.parse(localStorage.getItem("seketika") ?? "{}");
      simpanan.state.titikKumpul = simpanan.state.titikKumpul.map(
        (t: { id: string; peserta: unknown[] }) =>
          t.id === "tk-05" ? { ...t, peserta: t.peserta.slice(0, 2) } : t,
      );
      localStorage.setItem("seketika", JSON.stringify(simpanan));
    });
    await page.goto("/kolab/tk-05");

    await expect(
      page.getByRole("button", { name: /Terima & Berangkat/ }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Menunggu warga terkumpul (2/4)"),
    ).toBeVisible();
    await expect(
      page.getByText(/Permintaan ini masuk ke berandamu/),
    ).toBeVisible();
  });

  test("yang belum tercapai tidak sampai ke pedagang", async ({ page }) => {
    /* Satu peserta dicabut dari RT 04 supaya targetnya kembali kurang. */
    await page.goto("/d");
    await page.evaluate(() => {
      const simpanan = JSON.parse(localStorage.getItem("seketika") ?? "{}");
      simpanan.state.titikKumpul = simpanan.state.titikKumpul.map(
        (t: { id: string; peserta: unknown[] }) =>
          t.id === "tk-05" ? { ...t, peserta: t.peserta.slice(0, 3) } : t,
      );
      localStorage.setItem("seketika", JSON.stringify(simpanan));
    });
    await page.reload();

    await expect(
      page.getByRole("link", { name: /RT 04 Gang Melati/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /RT 02 Taman Bermain/ }),
    ).toBeVisible();

    await page
      .getByRole("checkbox", { name: "Buka gerobak" })
      .uncheck({ force: true });
    await expect(page.getByText(/1 permintaan titik kumpul/)).toBeVisible();
  });

  test("menerima satu permintaan menurunkan hitungan, bukan menghapusnya", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /Terima & Berangkat/ }).click();
    await page.waitForURL(/\/rute/);

    await page.goto("/d");
    await page
      .getByRole("checkbox", { name: "Buka gerobak" })
      .uncheck({ force: true });
    await expect(page.getByText(/1 permintaan titik kumpul/)).toBeVisible();
  });
});

/** Sisi warga harus ikut berubah ketika pedagang berangkat, kalau tidak tombol pedagang cuma menulis angka ke penyimpanan tanpa akibat yang terlihat siapa pun. */
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

  test("titik kumpul yang sudah dijemput tidak lagi menawarkan gabung", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Rahmat");
    await page.goto("/kolab/tk-04");
    await setStatusTitik(page, "tk-04", "dijemput");
    await page.reload();

    await expect(
      page.getByText("Bakso Pak Anton sedang menuju lokasi"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toHaveCount(0);
    await expect(page.getByText("Dijemput").first()).toBeVisible();
  });

  test("titik kumpul yang sudah selesai ditutup untuk warga", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Rahmat");
    await page.goto("/kolab/tk-04");
    await setStatusTitik(page, "tk-04", "selesai");
    await page.reload();

    await expect(
      page.getByText("Titik kumpul ini sudah selesai"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Ikut Pesan Sekarang/ }),
    ).toHaveCount(0);
  });
});
