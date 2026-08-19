"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { GarisTanya, Logo } from "@/komponen/ui/logo";
import { useToko } from "@/lib/toko";

/**
 * Layar sambutan, pintu masuk aplikasi.
 *
 * Ilustrasinya memenuhi layar dan kartu putih naik dari dasar menutupi
 * seperempat bawahnya. Semua posisi di sini memakai persen terhadap
 * bingkai 393x852 di rancangan, bukan piksel tetap, supaya proporsinya
 * bertahan pada ponsel yang lebih pendek atau lebih jangkung.
 */
export function Sambutan() {
  const router = useRouter();
  const profil = useToko((s) => s.profil);

  /* "Masuk" mengantar pengguna lama langsung ke berandanya. Yang belum
     punya profil tetap harus melewati pengenalan dulu, karena aplikasi
     belum tahu ia warga atau pedagang. */
  const masuk = () => {
    if (!profil) return router.push("/mulai");
    router.push(profil.peran === "pedagang" ? "/d" : "/beranda");
  };

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#fcf9f0]">
      {/* Lewat next/image, bukan latar CSS. Sebagai latar CSS berkasnya
          dikirim mentah 79 KB; lewat pengoptimal Next ia jadi WebP 16 KB
          pada lebar yang benar-benar dipakai. Ini gambar terbesar di layar
          pertama, jadi selisihnya terasa pada pemuatan dingin. */}
      <Image
        src="/img/ilustrasi-sambutan.jpg"
        alt=""
        aria-hidden
        fill
        sizes="390px"
        priority
        className="object-cover object-bottom"
      />

      <div className="relative flex flex-col items-center pt-[6.2%]">
        <Logo size={112} />

        <h1 className="tulisan-gradasi mt-[8px] font-[family-name:var(--font-lambang)] text-[44px] font-bold leading-none tracking-[0.01em]">
          SEKETIKA
        </h1>

        <p className="tulisan-gradasi mt-[9px] font-[family-name:var(--font-lambang)] text-[12px] font-bold">
          Pedagang Dekat, Hidup Lebih Praktis
        </p>

        {/* Kalimat sapaan dengan coretan oranye di bawahnya. Coretannya
            menempel pada teks, bukan diletakkan pada koordinat tetap,
            supaya tetap sejajar kalau lebar hurufnya bergeser sedikit. */}
        <p className="relative mt-[19px] font-[family-name:var(--font-tangan)] text-[22px] font-bold leading-none text-black">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[9px] right-[6px] h-[15px] w-[50px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      </div>

      {/* Kartu tindakan */}
      <div className="relative mt-auto rounded-t-[39px] bg-white px-6 pb-[env(safe-area-inset-bottom)] pt-[23px] shadow-[0_-3px_7px_rgb(0_0_0/0.15)]">
        <button
          type="button"
          onClick={masuk}
          className="h-[45px] w-full rounded-[18px] bg-gradient-to-r from-[#2d6b45] to-[#1a4d2e] text-[16px] font-semibold text-white transition-transform active:scale-[0.98]"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={() => router.push("/daftar")}
          className="mt-[9px] h-[45px] w-full rounded-[18px] border-2 border-[#2d6b45] bg-white text-[16px] font-semibold text-[#1f8f3f] transition-transform active:scale-[0.98]"
        >
          Buat Akun
        </button>

        <div className="h-[26px]" />
      </div>
    </main>
  );
}
