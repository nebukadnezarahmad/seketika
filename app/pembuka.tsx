"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { useToko } from "@/lib/toko";

/** Lama pembukaan sebelum berpindah sendiri, dalam milidetik. */
const DURASI = 2900;

/** Huruf lambang, dimunculkan satu per satu. */
const HURUF = [..."SEKETIKA"];

/**
 * Layar pembuka.
 *
 * Lambangnya tidak sekadar memudar masuk, melainkan dirakit di depan
 * mata: gerobaknya datang lebih dulu, pin lokasi jatuh mendarat di
 * atasnya, lingkaran dan intinya membesar dari tengah, lalu sinarnya
 * memancar dan gelombang sinyal menyebar. Urutan itu menceritakan
 * lambangnya sendiri — gerobak yang bisa ditemukan — dan itu yang
 * membedakan gerak bermakna dari unsur yang cuma berkedip masuk.
 *
 * Seluruh tahapan diatur lewat penundaan animasi CSS, bukan penghitung
 * di React, jadi tidak ada satu pun render tambahan sepanjang pembukaan
 * dan urutannya tidak bisa meleset karena pewaktu yang telat berjalan.
 *
 * Latarnya terang, bukan hijau pekat. Lambangnya sendiri berwarna hijau
 * tua, dan menaruhnya di atas hijau lain akan meredam bentuk yang justru
 * sedang dirakit. Yang bergerak di latar cuma dua bulatan hijau sangat
 * muda yang mengambang pelan; latar yang ikut sibuk merebut perhatian
 * dari lambangnya.
 */
export function Pembuka() {
  const router = useRouter();
  const sudahPindah = React.useRef(false);

  /* Satu jalan keluar yang dipakai bersama oleh pewaktu, ketukan, dan
     papan ketik. Penjaga `sudahPindah` mencegah perpindahan ganda ketika
     pengguna mengetuk tepat saat pewaktunya berbunyi. */
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
    <main
      className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-krem"
      style={{ ["--durasi-buka" as string]: `${DURASI}ms` }}
    >
      {/* Latar: dua bulatan hijau muda yang mengambang, dan sapuan
          gradasi tipis di bawahnya supaya layarnya tidak terasa datar. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="lg-apung absolute -left-16 top-[12%] size-56 rounded-full bg-hijau-lembut/70 blur-[2px]" />
        <span
          className="lg-apung absolute -right-20 bottom-[18%] size-72 rounded-full bg-hijau-lembut/60 blur-[2px]"
          style={{ animationDelay: "-4.5s" }}
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-hijau-lembut/45 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center px-8">
        {/* Gelombang sinyal yang menyebar dari pin. Tiga lingkaran dengan
            penundaan berbeda supaya terbaca sebagai denyut berkelanjutan,
            bukan satu kali kedip. */}
        {/* Riaknya dipusatkan lewat left-1/2 dan geseran setengah lebar,
            bukan lewat flex. Anak yang berposisi mutlak keluar dari aliran
            lentur induknya, jadi `justify-center` tidak berpengaruh apa
            pun padanya dan lingkarannya melenceng dari pusat pin. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[10px] h-0">
          {[0, 750, 1500].map((tunda) => (
            <span
              key={tunda}
              className="lg-riak absolute left-1/2 size-[120px] -translate-x-1/2 rounded-full border border-hijau-terang/35"
              style={{ animationDelay: `${1500 + tunda}ms` }}
            />
          ))}
        </div>

        <LogoGerak size={132} />

        {/* Lambang kata, huruf demi huruf. Satu heading utuh untuk pembaca
            layar; potongan hurufnya disembunyikan darinya supaya tidak
            dieja satu per satu. */}
        <h1 className="mt-6 flex tulisan-judul text-[42px] font-extrabold leading-none tracking-[0.02em]">
          <span className="khusus-pembaca-layar">SEKETIKA</span>
          {HURUF.map((h, i) => (
            <span
              key={`${h}-${i}`}
              aria-hidden
              className="lg-huruf tulisan-gradasi"
              style={{ animationDelay: `${1560 + i * 55}ms` }}
            >
              {h}
            </span>
          ))}
        </h1>

        <p
          className="lg-huruf mt-3 text-center text-[12.5px] font-semibold tracking-[0.08em] text-tinta-3"
          style={{ animationDelay: "2130ms" }}
        >
          PEDAGANG DEKAT, HIDUP LEBIH PRAKTIS
        </p>
      </div>

      {/* Batang pemuatan yang habis tepat saat layarnya berpindah, jadi
          lamanya menunggu terlihat alih-alih ditebak. */}
      <div
        aria-hidden
        className="absolute bottom-[13%] h-[3px] w-28 overflow-hidden rounded-pil bg-hijau-lembut"
      >
        <span className="lg-garis-muat block h-full w-full rounded-pil bg-hijau" />
      </div>

      {/* Tombol selebar layar. Ia benar-benar melakukan perpindahan, bukan
          sekadar penampung ketukan, supaya pengguna papan ketik dan
          pembaca layar punya jalan keluar yang diumumkan, bukan tersirat. */}
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
