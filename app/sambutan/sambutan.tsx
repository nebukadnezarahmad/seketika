"use client";

import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import {
  KartuMengambang,
  KepalaMerek,
  PanggungSambutan,
} from "@/komponen/ui/panggung-sambutan";
import { useToko } from "@/lib/toko";

/**
 * Layar sambutan, pintu masuk aplikasi.
 *
 * Latarnya digambar di kode, bukan satu foto ilustrasi. Foto lamanya
 * adalah berkas terbesar pada layar pertama sekaligus hasil rakitan
 * mesin, dan pada purwarupa yang dinilai orang, unsur yang tidak bisa
 * dijelaskan asal-usulnya lebih baik tidak ada.
 *
 * Susunannya juga berubah dari versi sebelumnya, yang menaruh kartu
 * putih menutupi seperempat bawah lalu menyisakan dua tombol tanpa satu
 * kalimat pun yang menerangkan apa yang akan dimasuki orang. Sekarang
 * ada satu janji yang dinyatakan terang-terangan di atas tombolnya.
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
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#001c06]">
      <PanggungSambutan />

      <div className="relative flex flex-1 flex-col px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-[7%]">
        <KepalaMerek />

        {/* Jaraknya diambil dari sisa ruang, bukan dipatok tetap. Pada
            ponsel yang lebih pendek, jarak tetap mendorong baris terakhir
            keluar dari layar dan keterangan pembayarannya tergunting. */}
        <div className="mt-7 shrink-0">
          <KartuMengambang />
        </div>

        <div className="mt-auto">
          <h1 className="tulisan-judul text-[28px] font-extrabold leading-[1.12] text-white">
            Panggil jajanan
            <br />
            <span className="text-hijau-neon">ke depan rumah</span>
          </h1>
          <p className="mt-3 max-w-[19rem] text-[13px] leading-relaxed text-white/70">
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
                className="flex items-center gap-1.5 rounded-pil border border-white/20 bg-white/10 px-3 py-1.5 text-[11.5px] font-semibold text-white backdrop-blur-sm"
              >
                <Ikon size={13} strokeWidth={2.2} aria-hidden />
                {teks}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={masuk}
            className="mt-5 h-[52px] w-full rounded-full bg-hijau-neon text-[15.5px] font-extrabold text-hijau-gelap shadow-[0_10px_30px_rgb(74_222_128/0.25)] transition-transform active:scale-[0.98]"
          >
            Masuk
          </button>

          <button
            type="button"
            onClick={() => router.push("/daftar")}
            className="mt-2.5 h-[52px] w-full rounded-full border border-white/30 bg-white/10 text-[15.5px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
          >
            Buat Akun
          </button>

          <p className="mt-3 text-center text-[11px] text-white/45">
            Bayar tunai di tempat · tanpa komisi untuk pedagang
          </p>
        </div>
      </div>
    </main>
  );
}
