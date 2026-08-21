"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import { KepalaMerek } from "@/komponen/ui/kepala-merek";
import { useToko } from "@/lib/toko";

/** Layar sambutan, pintu masuk aplikasi. */
export function Sambutan() {
  const router = useRouter();
  const profil = useToko((s) => s.profil);

  /* "Masuk" mengantar pengguna lama langsung ke berandanya. */
  const masuk = () => {
    if (!profil) return router.push("/mulai");
    router.push(profil.peran === "pedagang" ? "/d" : "/beranda");
  };

  return (
    <main className="flex h-[100dvh] flex-col overflow-y-auto bg-white px-6 pb-[max(18px,env(safe-area-inset-bottom))] pt-5">
      <KepalaMerek ukuran={58} />

      {/* Ilustrasinya yang menyerap sisa ruang, bukan ruang kosong. */}
      <div className="flex min-h-[160px] flex-1 shrink-0 items-center justify-center py-4">
        <Image
          src="/img/ilustrasi-warung.svg"
          /* Sengaja kosong. */
          alt=""
          width={130}
          height={91}
          priority
          className="size-full object-contain"
        />
      </div>

      <div>
        <h1 className="tulisan-judul text-[28px] font-extrabold leading-[1.12] text-tinta">
          Panggil jajanan
          <br />
          {/* Barisnya memakai --color-hijau, bukan hijau lambang yang lebih terang. */}
          <span className="text-hijau">ke depan rumah</span>
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-tinta-4">
          Lihat gerobak yang sedang lewat di sekitarmu.
        </p>

        {/* Dua cara memesan, dipisah garis rambut, bukan kartu. */}
        <ul className="mt-4 divide-y divide-garis border-y border-garis">
          {[
            {
              Ikon: MapPin,
              judul: "Panggil ke lokasimu",
              isi: "Gerobak menghampiri alamatmu sendiri",
            },
            {
              Ikon: Users,
              judul: "Patungan tetangga",
              isi: "Satu titik kumpul untuk beberapa rumah",
            },
          ].map(({ Ikon, judul, isi }) => (
            <li key={judul} className="flex items-center gap-3 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-hijau-lembut text-hijau">
                <Ikon size={17} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-bold text-tinta">
                  {judul}
                </span>
                <span className="mt-px block text-[11.5px] text-tinta-4">
                  {isi}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={masuk}
          className="mt-5 h-[50px] w-full rounded-full bg-hijau text-[15.5px] font-bold text-white transition-transform active:scale-[0.98]"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={() => router.push("/daftar")}
          className="mt-2.5 h-[50px] w-full rounded-full border border-garis-tegas bg-white text-[15.5px] font-bold text-tinta transition-colors hover:bg-krem active:scale-[0.98]"
        >
          Buat Akun
        </button>

        <p className="mt-3.5 text-center text-[11px] text-tinta-4">
          Bayar tunai di tempat · tanpa komisi untuk pedagang
        </p>
      </div>
    </main>
  );
}
