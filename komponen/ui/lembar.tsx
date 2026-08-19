"use client";

import * as React from "react";

/**
 * Lembar yang naik dari bawah layar.
 *
 * Dipakai untuk detail pedagang, konfirmasi, dan daftar pesanan harian.
 * Ia terkunci di dalam bingkai ponsel, bukan di seluruh jendela, supaya
 * di layar lebar lembarnya naik dari dasar kartu ponsel dan bukan dari
 * dasar layar laptop.
 */
export function Lembar({
  buka,
  tutup,
  children,
  judul,
}: {
  buka: boolean;
  tutup: () => void;
  children: React.ReactNode;
  judul?: string;
}) {
  /* Tunda pelepasan dari pohon sampai animasi turun selesai, kalau tidak
     lembarnya hilang begitu saja tanpa gerak keluar. */
  const [tampil, setTampil] = React.useState(buka);
  React.useEffect(() => {
    if (buka) return setTampil(true);
    const t = setTimeout(() => setTampil(false), 220);
    return () => clearTimeout(t);
  }, [buka]);

  React.useEffect(() => {
    if (!buka) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && tutup();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [buka, tutup]);

  if (!tampil) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={judul}>
      <button
        type="button"
        aria-label="Tutup"
        onClick={tutup}
        className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
          buka ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`bayang-lembar relative max-h-[86%] overflow-y-auto rounded-t-[24px] bg-krem transition-transform duration-200 ease-out ${
          buka ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 flex justify-center bg-krem pb-1 pt-2.5">
          <span aria-hidden className="h-1 w-9 rounded-pil bg-tinta-5/60" />
        </div>
        {children}
      </div>
    </div>
  );
}
