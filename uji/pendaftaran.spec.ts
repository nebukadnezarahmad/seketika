import { test, expect } from "@playwright/test";

test.describe("Pintu masuk", () => {
  test("sambutan menawarkan masuk atau membuat akun", async ({ page }) => {
    await page.goto("/sambutan");
    await expect(page.getByText("Pedagang Dekat, Hidup Lebih Praktis")).toBeVisible();
    await expect(page.getByText("Mau ngapain hari ini?")).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk" })).toBeVisible();
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
