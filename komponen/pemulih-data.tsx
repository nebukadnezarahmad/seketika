"use client";

import * as React from "react";
import { useToko } from "@/lib/toko";

/**
 * Memulihkan data tersimpan sebelum aplikasi digambar.
 *
 * Penyimpanan sengaja dibuat `skipHydration` supaya hasil penyajian di
 * server sama persis dengan lukisan pertama di peramban. Konsekuensinya
 * pemulihan harus dipicu sendiri, dan pemicunya harus berada di akar:
 * kalau hanya dipasang di layar pembuka, membuka tautan langsung ke
 * halaman mana pun atau sekadar memuat ulang akan mengosongkan seluruh
 * keadaan yang sudah tersimpan.
 *
 * Status pemulihan dibaca lewat `useSyncExternalStore`, bukan disalin ke
 * state lewat efek. Dengan begitu tidak ada render berantai dan nilainya
 * selalu berasal dari satu sumber yang sama.
 */
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
