"use client";

import { useSyncExternalStore } from "react";

/** Waktu sekarang yang aman dibaca saat render. */
export function useSekarang(selang = 60_000): number | null {
  return useSyncExternalStore(
    (ubah) => {
      const pewaktu = setInterval(ubah, selang);
      return () => clearInterval(pewaktu);
    },
    () => Math.floor(Date.now() / selang) * selang,
    () => null,
  );
}
