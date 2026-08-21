/** Pembantu berbagi tautan titik kumpul. */

/** Tautan undangan. Memakai asal peramban supaya benar di mana pun ditaruh. */
export function tautTitik(id: string): string {
  const asal =
    typeof window === "undefined"
      ? "https://seketika.app"
      : window.location.origin;
  return `${asal}/kolab/${id}`;
}

/** Menyalin teks ke papan klip. */
export async function salinTeks(teks: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(teks);
      return true;
    }
    const kotak = document.createElement("textarea");
    kotak.value = teks;
    kotak.setAttribute("readonly", "");
    kotak.style.position = "fixed";
    kotak.style.opacity = "0";
    document.body.appendChild(kotak);
    kotak.select();
    const berhasil = document.execCommand("copy");
    document.body.removeChild(kotak);
    return berhasil;
  } catch {
    return false;
  }
}

/** Membuka WhatsApp dengan pesan ajakan yang sudah terisi. */
export function bagikanWhatsApp(namaTitik: string, taut: string): void {
  const pesan = `Yuk patungan pesan bareng di titik kumpul "${namaTitik}"! Gabung lewat SEKETIKA: ${taut}`;
  window.open(
    `https://wa.me/?text=${encodeURIComponent(pesan)}`,
    "_blank",
    "noopener,noreferrer",
  );
}
