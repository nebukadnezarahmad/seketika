import { test, expect } from "@playwright/test";
import { lewatiPengenalan } from "./bantu";

/** Syarat supaya SEKETIKA bisa dipasang sebagai aplikasi, dan supaya tombol setel ulang tetap berguna setelah terpasang. */
test.describe("Bisa dipasang sebagai aplikasi", () => {
  test("manifest memuat yang dibutuhkan peluncur ponsel", async ({
    request,
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/manifest.webmanifest",
    );

    const jawaban = await request.get("/manifest.webmanifest");
    expect(jawaban.status()).toBe(200);
    const m = await jawaban.json();

    expect(m.name).toContain("SEKETIKA");
    expect(m.short_name).toBe("SEKETIKA");
    /* `standalone` yang menghilangkan bilah alamat; tanpa itu yang terpasang cuma pintasan peramban. */
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");

    /* Chrome menuntut ikon 192 dan 512. */
    const ukuran = m.icons.map((i: { sizes: string }) => i.sizes);
    expect(ukuran).toContain("192x192");
    expect(ukuran).toContain("512x512");
    expect(
      m.icons.some((i: { purpose?: string }) => i.purpose === "maskable"),
    ).toBe(true);
  });

  test("semua ikon yang disebut manifest benar-benar ada", async ({
    request,
  }) => {
    const m = await (await request.get("/manifest.webmanifest")).json();
    for (const ikon of m.icons as { src: string }[]) {
      const jawaban = await request.get(ikon.src);
      expect(jawaban.status(), `${ikon.src} tidak ditemukan`).toBe(200);
      expect(jawaban.headers()["content-type"]).toContain("image/png");
    }
  });

  test("berkas service worker tersedia di akar", async ({ request }) => {
    /* Lingkupnya ditentukan letak berkasnya. */
    const jawaban = await request.get("/sw.js");
    expect(jawaban.status()).toBe(200);
    expect(await jawaban.text()).toContain('addEventListener("fetch"');
  });

  test("lambang aplikasi memakai logo SEKETIKA, bukan bawaan Next", async ({
    page,
    request,
  }) => {
    await page.goto("/");
    const ikon = await page
      .locator('link[rel="icon"]')
      .first()
      .getAttribute("href");
    expect(ikon).toContain("/icon.png");
    expect((await request.get("/apple-icon.png")).status()).toBe(200);
  });
});

test.describe("Bilah status di aplikasi terpasang", () => {
  /* Playwright tidak bisa memalsukan `display-mode`, dan CDP pun tidak menyediakannya. */
  test("aturan penyembunyian ikut terkirim dengan isi yang benar", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");

    const aturan = await page.evaluate(() => {
      for (const lembar of document.styleSheets) {
        let daftar: CSSRuleList;
        try {
          daftar = lembar.cssRules;
        } catch {
          continue;
        }
        for (const r of daftar) {
          const syarat = (r as CSSMediaRule).conditionText;
          if (syarat?.includes("display-mode")) {
            return {
              syarat,
              isi: [...(r as CSSMediaRule).cssRules].map((x) => x.cssText),
            };
          }
        }
      }
      return null;
    });

    expect(aturan, "blok @media display-mode hilang dari CSS").not.toBeNull();
    expect(aturan!.syarat).toContain("standalone");
    expect(aturan!.isi.join(" ")).toContain(".bilah-tiruan");
    expect(aturan!.isi.join(" ")).toContain("display: none");
  });

  test("di peramban biasa bilah tiruannya tetap tampil", async ({ page }) => {
    await lewatiPengenalan(page, "pembeli", "Dewi");
    await expect(page.locator(".bilah-tiruan").first()).toBeVisible();
  });

  test("dokumen luar dikunci, tiap layar menggulung di dalamnya", async ({
    page,
  }) => {
    /* Di aplikasi terpasang, dokumen yang bisa diseret akan ikut naik dan menyingkap latar kosong di baliknya — yang terlihat seperti "layar bisa keangkat". */
    await lewatiPengenalan(page, "pembeli", "Dewi");
    const of = await page.evaluate(() => ({
      html: getComputedStyle(document.documentElement).overflow,
      body: getComputedStyle(document.body).overflow,
    }));
    expect(of.html).toBe("hidden");
    expect(of.body).toBe("hidden");
  });
});

test.describe("Setel ulang di aplikasi terpasang", () => {
  test("memuat ulang halaman penuh, bukan sekadar pindah layar", async ({
    page,
  }) => {
    await lewatiPengenalan(page, "pedagang", "Pak Anton");

    /* Data dibuat basi seperti pada ponsel yang sudah lama memakai aplikasi ini: tanpa tk-05 dan tk-04 belum tercapai. */
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("seketika") ?? "{}");
      s.state.titikKumpul = s.state.titikKumpul
        .filter((t: { id: string }) => t.id !== "tk-05")
        .map((t: { id: string; peserta: unknown[] }) =>
          t.id === "tk-04" ? { ...t, peserta: t.peserta.slice(0, 3) } : t,
        );
      localStorage.setItem("seketika", JSON.stringify(s));
    });
    await page.reload();
    await expect(page.getByRole("link", { name: /warga ·/ })).toHaveCount(0);

    await page.goto("/d/profil");
    /* Penanda ini cuma hidup selama dokumen yang sama. */
    await page.evaluate(() => {
      (window as unknown as { __penanda?: string }).__penanda = "ada";
    });

    await page.getByText("Setel Ulang Data").click();
    await page.waitForURL("**/", { timeout: 15_000 });

    const masihAda = await page.evaluate(
      () =>
        typeof (window as unknown as { __penanda?: string }).__penanda !==
        "undefined",
    );
    expect(masihAda, "halaman tidak dimuat ulang penuh").toBe(false);

    await lewatiPengenalan(page, "pedagang", "Pak Anton");
    await expect(page.getByRole("link", { name: /warga ·/ })).toHaveCount(2);
  });
});
