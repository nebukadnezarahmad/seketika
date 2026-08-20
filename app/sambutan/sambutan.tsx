"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Users } from "lucide-react";
import { KepalaMerek } from "@/komponen/ui/kepala-merek";
import { useToko } from "@/lib/toko";

/**
 * Layar sambutan, pintu masuk aplikasi.
 *
 * Ilustrasinya bukan gambar baru: itu karya tim sendiri dari berkas
 * Figma SEKETIKA, yang selama ini cuma tampil sebagai potongan setinggi
 * 92px di layar pilih peran. Yang dilakukan di sini hanya membingkainya
 * ulang ke bidang penuh yang memang digambar perancangnya, lalu menyetel
 * warnanya ke palet sekarang. Menggambar ilustrasi baru berarti menaruh
 * satu unsur yang tidak bisa dijelaskan asal-usulnya di layar pertama,
 * padahal karya yang benar-benar dibuat orang sudah ada di repositori.
 *
 * Selebihnya tetap datar: tanpa bayangan, tanpa gradasi, tanpa hiasan
 * latar. Ilustrasi yang menanggung seluruh nada layar, bukan efek.
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
    <main className="flex h-[100dvh] flex-col overflow-y-auto bg-white px-6 pb-[max(18px,env(safe-area-inset-bottom))] pt-5">
      <KepalaMerek ukuran={58} />

      {/* Ilustrasinya yang menyerap sisa ruang, bukan ruang kosong.
          Batas bawah 160px menahannya berhenti mengecil: di bawah itu
          tenda, mangkuk, dan orangnya berubah jadi noda hijau yang tidak
          menggambarkan apa pun. Pada layar yang terlalu pendek untuk
          memuat semuanya, layarnya bergulir sedikit, dan itu lebih baik
          daripada ilustrasi seukuran perangko.

          Wadahnya yang menentukan bidang, lalu `object-contain` yang
          memuatkan gambarnya di dalam bidang itu. Versi sebelumnya
          memakai `h-full w-auto`, dan itu menyesatkan: `max-width: 100%`
          bawaan Tailwind tetap mengunci lebarnya di 342px, jadi kotak
          gambarnya berakhir 342x266 sementara gambarnya sendiri
          tergambar 342x240 — rasionya tidak pernah benar-benar dijaga
          oleh `w-auto` seperti yang terbaca. */}
      <div className="flex min-h-[160px] flex-1 shrink-0 items-center justify-center py-4">
        <Image
          src="/img/ilustrasi-warung.svg"
          /* Sengaja kosong. Judul di bawahnya dan dua baris cara memesan
             sudah menyampaikan seluruh isi gambar ini; menaruh narasi
             panjang di sini membuat pembaca layar mengeja pemandangan
             selama beberapa detik sebelum sampai ke judul dan tombol,
             tanpa satu pun keterangan baru. */
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
          {/* Barisnya memakai --color-hijau, bukan hijau lambang yang
              lebih terang. Di atas putih, #00AA13 cuma mencapai 3,1:1
              dan judul sebesar ini masih terhitung teks. */}
          <span className="text-hijau">ke depan rumah</span>
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-tinta-4">
          Lihat gerobak yang sedang lewat di sekitarmu.
        </p>

        {/* Dua cara memesan, dipisah garis rambut, bukan kartu. Kartu
            bertumpuk bayangan membuat dua baris keterangan terlihat
            seperti tombol yang bisa ditekan padahal tidak. */}
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
                <span className="block text-[13.5px] font-bold text-tinta">{judul}</span>
                <span className="mt-px block text-[11.5px] text-tinta-4">{isi}</span>
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
