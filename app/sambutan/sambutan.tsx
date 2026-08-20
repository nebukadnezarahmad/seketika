"use client";

import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import { KepalaMerek } from "@/komponen/ui/kepala-merek";
import { useToko } from "@/lib/toko";

/**
 * Layar sambutan, pintu masuk aplikasi.
 *
 * Datar sepenuhnya: putih, tanpa bayangan, tanpa gradasi, tanpa hiasan
 * latar. Versi sebelumnya menumpuk bidang gradasi kabur, jala peta,
 * jalur bertitik, dan dua kartu miring bertumpuk bayangan. Semua unsur
 * itu memberi kesan yang sama, dan kesan itu adalah gambar rakitan
 * mesin, bukan produk yang dirancang orang.
 *
 * Yang menggantikannya bukan hiasan lain melainkan isi: dua baris yang
 * menyebut dua cara memesan, sekaligus satu-satunya janji layar ini.
 * Keduanya benar-benar jadi dua pilihan pada layar pedagang.
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
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-white px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-6">
      {/* Lambangnya memusat di sisa ruang, bukan ditempel di puncak
          layar lalu meninggalkan lubang kosong sebelum judulnya. Sisa
          ruang inilah yang menyusut lebih dulu pada ponsel pendek, jadi
          tidak ada satu pun isi yang tergeser keluar layar. */}
      <div className="flex flex-1 items-center justify-center">
        <KepalaMerek />
      </div>

      <div>
        <h1 className="tulisan-judul text-[29px] font-extrabold leading-[1.12] text-tinta">
          Panggil jajanan
          <br />
          {/* Barisnya memakai --color-hijau, bukan hijau lambang yang
              lebih terang. Di atas putih, #00AA13 cuma mencapai 3,1:1
              dan judul sebesar ini masih terhitung teks. */}
          <span className="text-hijau">ke depan rumah</span>
        </h1>
        <p className="mt-2.5 max-w-[19rem] text-[13.5px] leading-relaxed text-tinta-4">
          Lihat gerobak yang sedang lewat di sekitarmu, lalu pilih cara
          memanggilnya.
        </p>

        {/* Dua cara memesan, dipisah garis rambut, bukan kartu. Kartu
            bertumpuk bayangan di layar sebesar ini membuat dua baris
            keterangan terlihat seperti tombol yang bisa ditekan padahal
            tidak. */}
        <ul className="mt-6 divide-y divide-garis border-y border-garis">
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
            <li key={judul} className="flex items-center gap-3.5 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-hijau-lembut text-hijau">
                <Ikon size={18} strokeWidth={2.2} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold text-tinta">{judul}</span>
                <span className="mt-0.5 block text-[12px] text-tinta-4">{isi}</span>
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={masuk}
          className="mt-7 h-[50px] w-full rounded-full bg-hijau text-[15.5px] font-bold text-white transition-transform active:scale-[0.98]"
        >
          Masuk
        </button>

        <button
          type="button"
          onClick={() => router.push("/daftar")}
          className="mt-2.5 h-[50px] w-full rounded-full border border-garis-pil bg-white text-[15.5px] font-bold text-tinta transition-colors hover:bg-krem active:scale-[0.98]"
        >
          Buat Akun
        </button>

        <p className="mt-4 text-center text-[11px] text-tinta-4">
          Bayar tunai di tempat · tanpa komisi untuk pedagang
        </p>
      </div>
    </main>
  );
}
