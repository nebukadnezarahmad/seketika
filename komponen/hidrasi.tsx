"use client";

import * as React from "react";
import { useToko } from "@/lib/toko";

/**
 * Menyalakan penyimpanan lokal setelah komponen menempel.
 *
 * Penyimpanan sengaja dibuat `skipHydration`, jadi lukisan pertama di
 * peramban sama persis dengan hasil penyajian di server. Tanpa gerbang
 * ini React akan mengeluh karena server tidak tahu isi localStorage.
 */
export function Hidrasi({ children }: { children: React.ReactNode }) {
  const [siap, setSiap] = React.useState(false);

  React.useEffect(() => {
    useToko.persist.rehydrate();
    setSiap(true);
  }, []);

  if (!siap) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-krem">
        <span className="khusus-pembaca-layar">Memuat</span>
        <span
          aria-hidden
          className="size-7 animate-spin rounded-full border-2 border-hijau/25 border-t-hijau"
        />
      </div>
    );
  }

  return <>{children}</>;
}
