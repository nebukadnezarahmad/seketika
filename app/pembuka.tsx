"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "@/komponen/ui/logo";
import { useToko } from "@/lib/toko";

/** Lama pembukaan sebelum berpindah sendiri, dalam milidetik. */
const DURASI = 2600;

/**
 * Layar pembuka bertahap.
 *
 * Rancangannya berupa tiga bingkai berurutan: ilustrasi dulu, lalu
 * lambang dan nama, lalu tagline. Urutan itu dibangun dari penundaan
 * animasi CSS, bukan penghitung tahap di React, supaya tidak ada render
 * tambahan sepanjang pembukaan.
 */
export function Pembuka() {
  const router = useRouter();
  const sudahPindah = React.useRef(false);

  /* Satu jalan keluar yang dipakai bersama oleh pewaktu, ketukan, dan
     tombol lewati. Penjaga `sudahPindah` mencegah perpindahan ganda
     ketika pengguna mengetuk tepat saat pewaktunya berbunyi. */
  const lanjut = React.useCallback(() => {
    if (sudahPindah.current) return;
    sudahPindah.current = true;
    const profil = useToko.getState().profil;
    router.replace(!profil ? "/sambutan" : profil.peran === "pedagang" ? "/d" : "/beranda");
  }, [router]);

  React.useEffect(() => {
    /* Perpindahan berwaktu tidak boleh jadi satu-satunya jalan keluar.
       Orang yang butuh waktu lebih lama membaca, atau yang justru ingin
       cepat, harus bisa menentukan sendiri kapan berpindah. */
    const pewaktu = setTimeout(lanjut, DURASI);
    window.addEventListener("pointerdown", lanjut);
    window.addEventListener("keydown", lanjut);
    return () => {
      clearTimeout(pewaktu);
      window.removeEventListener("pointerdown", lanjut);
      window.removeEventListener("keydown", lanjut);
    };
  }, [lanjut]);

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-krem">
      <div className="absolute inset-0 animate-[ilustrasi-masuk_900ms_ease-out_both]">
        {/* Lewat next/image, bukan latar CSS. Sebagai latar CSS berkasnya
            dikirim mentah 79 KB; lewat pengoptimal Next ia jadi WebP 16 KB
            pada lebar yang benar-benar dipakai. Ini gambar terbesar di
            layar pertama, jadi selisihnya terasa pada pemuatan dingin. */}
        <Image
          src="/img/ilustrasi-sambutan.jpg"
          alt=""
          aria-hidden
          fill
          sizes="390px"
          priority
          className="object-cover object-bottom"
        />
      </div>

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

      {/* Tombol selebar layar. Ia benar-benar melakukan perpindahan, bukan
          sekadar penampung ketukan, supaya pengguna papan ketik dan pembaca
          layar punya jalan keluar yang diumumkan, bukan hanya tersirat. */}
      <button
        type="button"
        onClick={lanjut}
        className="absolute inset-0 size-full cursor-default"
      >
        <span className="khusus-pembaca-layar">Lewati pembukaan dan masuk aplikasi</span>
      </button>
    </main>
  );
}
