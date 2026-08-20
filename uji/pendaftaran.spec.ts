import { test, expect } from "@playwright/test";

test.describe("Pintu masuk", () => {
  test("sambutan menerangkan aplikasinya, bukan cuma dua tombol", async ({ page }) => {
    await page.goto("/sambutan");

    await expect(page.getByRole("heading", { name: /Panggil jajanan/ })).toBeVisible();
    await expect(page.getByText("Mau ngapain hari ini?")).toBeVisible();

    /* Dua keping cara memesan. Keduanya janji yang benar-benar ditepati
       aplikasinya, bukan hiasan, jadi keberadaannya ikut dikunci. */
    const keping = page.getByRole("listitem");
    await expect(keping.filter({ hasText: "Panggil ke lokasimu" })).toBeVisible();
    await expect(keping.filter({ hasText: "Patungan tetangga" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buat Akun" })).toBeVisible();

    /* Ilustrasinya karya tim di berkas Figma, bukan hiasan yang bisa
       hilang tanpa akibat: tanpa itu layar pertama cuma teks dan dua
       tombol. Tingginya ikut dikunci supaya tidak menyusut jadi
       perangko kalau tata letaknya berubah lagi. */
    /* Dicari lewat sumbernya, bukan peran gambar: alt-nya sengaja
       dikosongkan karena isinya sudah diucapkan teks di sekitarnya. */
    const gambar = page.locator('img[src*="ilustrasi-warung"]');
    await expect(gambar).toBeVisible();
    const kotak = await gambar.boundingBox();
    expect(kotak!.height).toBeGreaterThan(120);
  });

  /* Pada ekspor Figma aslinya pasangan roda berpusat 8,5 unit di kanan
     batang gerobaknya, dan seluruh lambang terbaca miring. Selisihnya
     kecil di ikon 24px tapi kentara pada lambang besar di layar pembuka
     dan sambutan, jadi kelurusannya dikunci di sini. */
  test("gerobak pada lambang lurus, bukan miring ke satu sisi", async ({ page }) => {
    await page.goto("/sambutan");

    const lambang = page.locator("svg[aria-label='Logo SEKETIKA']");
    await expect(lambang).toBeVisible();

    /* Dua persegi panjang di lambang: batang gerobak lalu gandarnya.
       Roda kiri dan kanan adalah elips pertama dan ketiga. */
    const batang = await lambang.locator("rect").first().boundingBox();
    const rodaKiri = await lambang.locator("ellipse").nth(0).boundingBox();
    const rodaKanan = await lambang.locator("ellipse").nth(2).boundingBox();
    if (!batang || !rodaKiri || !rodaKanan) throw new Error("bagian lambang tidak terukur");

    const pusat = (k: { x: number; width: number }) => k.x + k.width / 2;
    expect(Math.abs(pusat(rodaKiri) + pusat(rodaKanan) - 2 * pusat(batang))).toBeLessThan(1.5);
  });

  test("Buat Akun membuka formulir pendaftaran", async ({ page }) => {
    await page.goto("/sambutan");
    await page.getByRole("button", { name: "Buat Akun" }).click();
    await page.waitForURL("**/daftar");
    await expect(
      page.getByRole("heading", { name: "Perjalanan Anda dimulai di sini." }),
    ).toBeVisible();
  });

  test("tombol daftar terkunci sampai ketiga isian sah", async ({ page }) => {
    await page.goto("/daftar");
    const buat = page.getByRole("button", { name: "Buat Akun" });
    await expect(buat).toBeDisabled();

    await page.getByLabel("Nama Lengkap").fill("Dewi");
    await expect(buat).toBeDisabled();
    await page.getByLabel("Email").fill("dewi@contoh.com");
    await expect(buat).toBeDisabled();

    /* Kata sandi pendek belum cukup; batasnya enam karakter. */
    await page.getByLabel("Password").fill("123");
    await expect(buat).toBeDisabled();
    await page.getByLabel("Password").fill("rahasia123");
    await expect(buat).toBeEnabled();
  });

  test("kata sandi bisa ditampilkan dan disembunyikan lagi", async ({ page }) => {
    await page.goto("/daftar");
    const sandi = page.getByLabel("Password");
    await sandi.fill("rahasia123");
    await expect(sandi).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Tampilkan kata sandi" }).click();
    await expect(sandi).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Sembunyikan kata sandi" }).click();
    await expect(sandi).toHaveAttribute("type", "password");
  });

  test("nama dan surel terbawa ke langkah isi data", async ({ page }) => {
    await page.goto("/daftar");
    await page.getByLabel("Nama Lengkap").fill("Dewi Lestari");
    await page.getByLabel("Email").fill("dewi@contoh.com");
    await page.getByLabel("Password").fill("rahasia123");
    await page.getByRole("button", { name: "Buat Akun" }).click();

    await page.waitForURL("**/mulai");
    await page.getByText("Saya Ingin Membeli", { exact: true }).click();
    await page.getByRole("button", { name: /Lanjut/ }).click();
    await page.getByRole("button", { name: /Izinkan/ }).click();

    /* Yang sudah diisi saat mendaftar tidak ditanyakan ulang. */
    await expect(page.getByLabel("Nama Lengkap")).toHaveValue("Dewi Lestari");
    await expect(page.getByLabel("Email")).toHaveValue("dewi@contoh.com");
  });

  test("Masuk mengantar pengguna lama langsung ke berandanya", async ({ page }) => {
    await page.goto("/mulai");
    await page.getByText("Saya Ingin Membeli", { exact: true }).click();
    await page.getByRole("button", { name: /Lanjut/ }).click();
    await page.getByRole("button", { name: /Izinkan/ }).click();
    await page.getByLabel("Nama Lengkap").fill("Rahmat");
    await page.getByRole("button", { name: /Mulai/ }).click();
    await page.waitForURL("**/beranda");

    await page.goto("/sambutan");
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.waitForURL("**/beranda");
  });
});
