"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import { GarisTanya } from "@/komponen/ui/logo";
import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { useToko } from "@/lib/toko";

/**
 * Layar sambutan, pintu masuk aplikasi.
 *
 * Ilustrasinya memenuhi layar dan tulisannya berdiri di atasnya, bukan di
 * dalam kartu putih yang menutupi seperempat bawah seperti versi
 * sebelumnya. Kartu itu memotong ilustrasi tepat pada bagian yang paling
 * menjelaskan aplikasinya — gerobak dan warga yang saling menyapa — dan
 * menyisakan dua tombol mengambang tanpa satu kalimat pun yang
 * menerangkan apa yang akan dimasuki orang.
 *
 * Supaya teks putih tetap terbaca di atas gambar yang terang, ada sapuan
 * gradasi hijau pekat yang naik dari dasar. Gradasi dipilih alih-alih
 * warna rata karena batas yang tegas antara gambar dan blok warna justru
 * memutus ilustrasinya jadi dua potongan.
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
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-krem">
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

      {/* Dua sapuan gradasi: satu memudarkan puncak gambar ke warna latar
          supaya lambang di atasnya punya alas yang tenang, satu lagi
          menggelapkan dasar supaya teks putih di bawahnya terbaca. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-krem via-krem/80 to-transparent"
      />
      <div
        aria-hidden
        /* Pekat di dasar lalu memudar cepat. Gradasi yang rata sepanjang
           tingginya menenggelamkan pedagang dan warga di tengah gambar,
           padahal merekalah yang paling menjelaskan aplikasi ini. */
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-hijau-gelap from-22% via-hijau-gelap/70 via-58% to-transparent"
      />

      {/* Lambang */}
      <div className="relative flex flex-col items-center pt-[7%]">
        <LogoGerak size={92} bergerak={false} />

        <h1 className="tulisan-gradasi tulisan-judul mt-3 text-[38px] font-extrabold leading-none tracking-[0.01em]">
          SEKETIKA
        </h1>

        {/* Kalimat sapaan dengan coretan oranye di bawahnya. Coretannya
            menempel pada teks, bukan diletakkan pada koordinat tetap,
            supaya tetap sejajar kalau lebar hurufnya bergeser sedikit. */}
        <p className="relative mt-3.5 font-[family-name:var(--font-tangan)] text-[21px] font-bold leading-none text-tinta">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[9px] right-[6px] h-[15px] w-[50px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      </div>

      {/* Ajakan dan tombol, berdiri di atas gambar */}
      <div className="relative mt-auto px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        <h2 className="tulisan-judul text-[27px] font-extrabold leading-[1.15] text-white">
          Panggil jajanan
          <br />
          ke depan rumah
        </h2>
        <p className="mt-2.5 max-w-[19rem] text-[13px] leading-relaxed text-white/75">
          Lihat gerobak yang sedang lewat di sekitarmu, panggil ke lokasimu,
          atau patungan satu titik kumpul bareng tetangga.
        </p>

        {/* Dua keping yang menyebut kedua cara memesan. Ini janji yang
            ditepati aplikasinya, bukan hiasan: keduanya benar-benar jadi
            dua pilihan pada layar pedagang. */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            { Ikon: MapPin, teks: "Panggil ke lokasimu" },
            { Ikon: Users, teks: "Patungan tetangga" },
          ].map(({ Ikon, teks }) => (
            <li
              key={teks}
              className="flex items-center gap-1.5 rounded-pil border border-white/25 bg-white/12 px-3 py-1.5 text-[11.5px] font-semibold text-white backdrop-blur-sm"
            >
              <Ikon size={13} strokeWidth={2.2} aria-hidden />
              {teks}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={masuk}
          className="mt-5 h-[50px] w-full rounded-full bg-white text-[15.5px] font-extrabold text-hijau-gelap transition-transform active:scale-[0.98]"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={() => router.push("/daftar")}
          className="mt-2.5 h-[50px] w-full rounded-full border border-white/45 bg-white/10 text-[15.5px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
        >
          Buat Akun
        </button>
      </div>
    </main>
  );
}
