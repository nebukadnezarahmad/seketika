"use client";

import * as React from "react";
import { X } from "lucide-react";

/**
 * Lembar yang naik dari bawah layar.
 *
 * Dipakai untuk detail pedagang, konfirmasi, dan daftar pesanan harian.
 * Ia terkunci di dalam bingkai ponsel, bukan di seluruh jendela, supaya
 * di layar lebar lembarnya naik dari dasar kartu ponsel dan bukan dari
 * dasar layar laptop.
 *
 * Diserahkan ke `Layar` lewat prop `lembar`, bukan ditaruh di dalam isi
 * halaman. Jangkarnya harus setinggi layar penuh termasuk wilayah di
 * balik navigasi, karena dari sanalah ia berangkat: pada keadaan tertutup
 * seluruh badannya bersembunyi di balik navigasi, lalu merangkak naik
 * dari belakangnya. Navigasi diberi lapisan yang lebih tinggi supaya
 * lembarnya lewat di belakang, bukan menyeberang di depan.
 */
export function Lembar({
  buka,
  tutup,
  children,
  judul,
}: {
  buka: boolean;
  tutup: () => void;
  children: React.ReactNode;
  judul?: string;
}) {
  /* Pelepasan dari pohon ditunda sampai animasi turun benar-benar
     selesai, kalau tidak lembarnya hilang seketika tanpa gerak keluar.

     Penandanya disetel saat render, bukan di dalam efek. Ini pola resmi
     React untuk state yang diturunkan dari prop, dan hasilnya satu
     render lebih sedikit dibanding menyetelnya dari efek. Penutupannya
     sendiri dipicu `transitionend`, jadi durasinya selalu mengikuti
     animasi yang sebenarnya, bukan angka tebakan. */
  const [tampil, setTampil] = React.useState(buka);
  if (buka && !tampil) setTampil(true);

  /* Keadaan "sudah naik", terpisah dari "sudah dipasang".

     Tanpa pemisahan ini lembarnya tidak pernah beranimasi masuk. Saat
     `buka` berubah jadi benar, render yang sama sekaligus memasang panel
     ke DOM dan memberinya kelas posisi akhir, jadi peramban tidak pernah
     melihat posisi awalnya dan tidak punya apa pun untuk ditransisikan;
     yang terlihat cuma lembar yang tiba-tiba ada. Animasi menutup tetap
     berjalan karena di sana panelnya memang sudah terpasang sejak awal,
     dan itu yang membuat cacatnya menipu: geraknya terasa ada, cuma
     satu arah. */
  const [naik, setNaik] = React.useState(false);
  /* Diturunkan saat render, mengikuti pola yang sama dengan `tampil` di
     atas. Menyetelnya dari dalam efek akan menunda satu bingkai, dan
     pada bingkai itu panel masih tergambar di posisi atas padahal
     perintah menutup sudah diberikan. */
  if (!buka && naik) setNaik(false);

  React.useEffect(() => {
    if (!buka) return;
    /* Dua bingkai, bukan satu. Bingkai pertama memastikan panel sudah
       benar-benar terlukis di posisi bawah; baru pada bingkai kedua
       kelasnya ditukar sehingga peramban punya dua keadaan untuk
       dijembatani. Dengan satu bingkai saja, sebagian peramban masih
       menggabungkan keduanya jadi satu perubahan gaya. */
    let kedua = 0;
    const pertama = requestAnimationFrame(() => {
      kedua = requestAnimationFrame(() => setNaik(true));
    });
    return () => {
      cancelAnimationFrame(pertama);
      cancelAnimationFrame(kedua);
    };
  }, [buka]);

  /* Jaring pengaman pelepasan.

     Pelepasan biasanya dipicu `transitionend`. Tapi kalau lembar ditutup
     sebelum dua bingkai pembuka sempat berjalan, panel tidak pernah
     berpindah posisi, jadi tidak ada transisi yang berakhir dan tidak ada
     yang memicu pelepasan. Yang tertinggal adalah lapisan setinggi layar
     yang tak terlihat tapi tetap menadah ketukan. Pewaktu ini menutup
     celah itu; pada jalur normal `transitionend` selalu mendahuluinya. */
  React.useEffect(() => {
    if (buka || !tampil) return;
    const pewaktu = setTimeout(() => setTampil(false), 500);
    return () => clearTimeout(pewaktu);
  }, [buka, tampil]);

  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!buka) return;

    /* Lembar ini mengaku `aria-modal`, dan janji itu harus ditepati:
       teknologi bantu menganggap isi di luarnya tidak terjangkau. Tanpa
       pengurungan fokus, tombol di balik lapisan gelap tetap bisa
       dicapai lewat Tab, sehingga pengguna papan ketik bisa tersesat
       menekan sesuatu yang bahkan tidak terlihat. */
    const dibukaOleh = document.activeElement as HTMLElement | null;
    const bisaDifokus = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute("disabled"));

    bisaDifokus()[0]?.focus();

    const saatTekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") return tutup();
      if (e.key !== "Tab") return;
      const daftar = bisaDifokus();
      if (daftar.length === 0) return;
      const pertama = daftar[0];
      const terakhir = daftar[daftar.length - 1];
      if (e.shiftKey && document.activeElement === pertama) {
        e.preventDefault();
        terakhir.focus();
      } else if (!e.shiftKey && document.activeElement === terakhir) {
        e.preventDefault();
        pertama.focus();
      }
    };

    window.addEventListener("keydown", saatTekan);
    return () => {
      window.removeEventListener("keydown", saatTekan);
      /* Fokus dikembalikan ke tombol yang membuka lembar ini, supaya
         pengguna papan ketik tidak terlempar ke awal halaman. */
      dibukaOleh?.focus();
    };
  }, [buka, tutup]);

  if (!tampil) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={judul}
    >
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={tutup}
        className={`absolute inset-0 bg-black/35 transition-opacity duration-[var(--gerak-sedang)] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          naik ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        onTransitionEnd={(e) => {
          /* Peristiwa transisi menggelembung dari isi lembar, jadi hanya
             transisi milik panel ini yang boleh melepasnya. */
          if (e.target === e.currentTarget && !buka) setTampil(false);
        }}
        /* Jarak bawahnya sebesar tinggi navigasi, jadi pada keadaan
           terbuka isi lembar berhenti tepat di atas navigasi, sementara
           pada keadaan tertutup `translate-y-full` menggesernya sejauh
           tingginya sendiri sehingga ia benar-benar lenyap di balik
           navigasi.

           Lengkung geraknya meluncur cepat lalu mendarat pelan, sama
           dengan token yang dipakai seluruh gerak masuk di aplikasi ini;
           `ease-out` bawaan terasa berhenti mendadak pada jarak sejauh
           ini. Yang dianimasikan hanya `transform` dan `opacity`, dua
           sifat yang bisa ditangani penyusun gambar tanpa menghitung
           ulang tata letak di tiap bingkai. */
        style={{ marginBottom: "var(--sisa-nav, 0px)" }}
        className={`bayang-lembar relative max-h-[80%] overflow-y-auto rounded-t-[24px] bg-krem transition-transform duration-[var(--gerak-sedang)] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
          naik ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Pegangan di tengah dan tombol tutup di kanan. Tanpa tombol ini
            satu-satunya cara menutup adalah mengetuk pita gelap tipis di
            atas lembar, dan itu terlalu sempit untuk ditemukan. */}
        <div className="sticky top-0 z-10 flex items-center bg-krem pb-1 pt-2.5">
          <span aria-hidden className="mx-auto h-1 w-9 rounded-pil bg-tinta-5/60" />
          <button
            type="button"
            onClick={tutup}
            aria-label="Tutup"
            className="absolute right-3 top-2 grid size-8 place-items-center rounded-full bg-tinta-5/15 text-tinta-3 transition-transform active:scale-90"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
