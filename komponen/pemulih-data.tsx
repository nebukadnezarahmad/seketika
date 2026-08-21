"use client";

import * as React from "react";
import { useToko } from "@/lib/toko";

/** Memulihkan data tersimpan sebelum aplikasi digambar. */
export function PemulihData({ children }: { children: React.ReactNode }) {
  const sudah = React.useSyncExternalStore(
    (ubah) => useToko.persist.onFinishHydration(ubah),
    () => useToko.persist.hasHydrated(),
    () => false,
  );

  React.useEffect(() => {
    void useToko.persist.rehydrate();
  }, []);

  if (!sudah) {
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
