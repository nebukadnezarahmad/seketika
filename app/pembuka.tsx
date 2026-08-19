"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToko } from "@/lib/toko";

export function Pembuka() {
  const router = useRouter();

  React.useEffect(() => {
    /* Pemulihan data sudah dilakukan di akar aplikasi, jadi di sini
       keadaannya pasti sudah siap dibaca.

       Jeda pendek memberi waktu lambangnya terbaca. Pengguna yang sudah
       pernah masuk tidak diseret mengulang pengenalan. */
    const profil = useToko.getState().profil;
    const tujuan = !profil ? "/mulai" : profil.peran === "pedagang" ? "/d" : "/beranda";
    const pewaktu = setTimeout(() => router.replace(tujuan), 1400);
    return () => clearTimeout(pewaktu);
  }, [router]);

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center gap-5 bg-hijau px-8 text-center">
      <div className="grid size-[104px] place-items-center rounded-[30px] bg-white/95 p-4 shadow-[0_10px_40px_rgb(0_0_0/0.25)]">
        <Image src="/img/logo.svg" alt="" width={142} height={137} priority className="h-auto w-full" />
      </div>
      <div>
        <p className="text-[30px] font-extrabold tracking-[0.14em] text-white">SEKETIKA</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
          Jajanan keliling, sekali ketuk sampai depan rumah
        </p>
      </div>
      <span
        aria-hidden
        className="mt-3 size-6 animate-spin rounded-full border-2 border-white/25 border-t-white"
      />
      <span className="khusus-pembaca-layar">Memuat aplikasi</span>
    </main>
  );
}
