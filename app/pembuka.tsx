"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/komponen/ui/logo";
import { useToko } from "@/lib/toko";

/** Total waktu pembukaan sebelum berpindah, dalam milidetik. */
const DURASI = 2600;

/**
 * Layar pembuka bertahap.
 *
 * Rancangannya berupa tiga bingkai berurutan: ilustrasi dulu, lalu
 * lambang dan nama, lalu tagline. Di sini urutan itu dibangun dari
 * penundaan animasi CSS, bukan dari penghitung tahap di React, supaya
 * tidak ada render tambahan sepanjang pembukaan.
 */
export function Pembuka() {
  const router = useRouter();

  React.useEffect(() => {
    /* Pemulihan data sudah dilakukan di akar aplikasi, jadi keadaannya
       pasti siap dibaca di sini. Pengguna yang sudah punya profil tidak
       diseret mengulang pendaftaran. */
    const profil = useToko.getState().profil;
    const tujuan = !profil ? "/sambutan" : profil.peran === "pedagang" ? "/d" : "/beranda";
    const pewaktu = setTimeout(() => router.replace(tujuan), DURASI);
    return () => clearTimeout(pewaktu);
  }, [router]);

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#fcf9f0]">
      <div
        className="absolute inset-0 animate-[ilustrasi-masuk_900ms_ease-out_both] bg-cover bg-bottom"
        style={{ backgroundImage: "url(/img/ilustrasi-sambutan.jpg)" }}
      />

      <div className="relative flex flex-col items-center pt-[6.2%]">
        <div className="animate-[muncul_600ms_500ms_ease-out_both]">
          <Logo size={112} />
        </div>

        <h1 className="tulisan-gradasi mt-[8px] animate-[muncul_600ms_700ms_ease-out_both] font-[family-name:var(--font-lambang)] text-[44px] font-bold leading-none tracking-[0.01em]">
          SEKETIKA
        </h1>

        <p className="tulisan-gradasi mt-[9px] animate-[muncul_600ms_1100ms_ease-out_both] font-[family-name:var(--font-lambang)] text-[12px] font-bold">
          Pedagang Dekat, Hidup Lebih Praktis
        </p>
      </div>

      <span className="khusus-pembaca-layar">Memuat SEKETIKA</span>
    </main>
  );
}
