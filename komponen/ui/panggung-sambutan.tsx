import { MapPin, Star, Users } from "lucide-react";
import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { GarisTanya } from "@/komponen/ui/logo";

/**
 * Latar layar sambutan dan pendaftaran, digambar seluruhnya di kode.
 *
 * Menggantikan satu foto ilustrasi berukuran 79 KB. Selain jadi berkas
 * terbesar pada layar pertama, gambar itu juga hasil rakitan mesin, dan
 * pada purwarupa yang dinilai orang, unsur yang tidak bisa dijelaskan
 * asal-usulnya lebih baik tidak ada. Yang digambar di kode tajam di
 * kerapatan piksel berapa pun, ikut berubah kalau warnanya disetel
 * ulang, dan tidak menambah satu pun permintaan jaringan.
 *
 * Versi pertamanya hijau pekat menutup seluruh layar. Sekarang putih
 * yang mendominasi dan hijaunya cuma dipinjam dari lambang: hijau merek
 * untuk garis dan tanda, hijau lembut untuk bidang, oranye lambang untuk
 * satu titik tujuan. Selain itu memang yang diminta, layar gelap juga
 * memutus layar pertama dari seluruh sisa aplikasi yang berlatar putih —
 * orang masuk dari ruangan gelap lalu tiba-tiba lampu menyala.
 *
 * Isinya bukan hiasan acak. Dua kartu yang mengambang itu memperlihatkan
 * dua hal yang benar-benar ada di dalam aplikasi: satu gerobak yang
 * sedang buka lengkap dengan jaraknya, dan satu titik kumpul yang sedang
 * mengumpulkan warga. Kesan pertama yang menjanjikan sesuatu yang tidak
 * ditemukan di dalam adalah kesan pertama yang berbohong.
 */
export function PanggungSambutan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      {/* Tiga bidang hijau sangat muda yang kabur. Fungsinya menahan
          pandangan di puncak layar tempat lambang berada dan memberi
          dasar hangat pada tombol di bawah, tanpa satu pun bidang gelap
          yang mengubah watak layarnya. */}
      <div className="absolute -left-24 -top-24 size-[24rem] rounded-full bg-hijau-lembut blur-[64px]" />
      <div className="absolute -right-28 top-[24%] size-[18rem] rounded-full bg-amber-lembut blur-[72px]" />
      <div className="absolute -bottom-28 left-1/4 size-[22rem] rounded-full bg-hijau-lembut blur-[72px]" />

      {/* Jala peta yang sangat samar, mengingatkan bahwa yang dijual
          aplikasi ini adalah menemukan sesuatu di sekitar. */}
      <svg className="absolute inset-0 size-full opacity-[0.5]" aria-hidden>
        <defs>
          <pattern id="jala" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0H0V34" fill="none" stroke="var(--color-hijau-terang)" strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jala)" />
      </svg>

      {/* Jalur bertitik dari satu pin ke pin lain, seperti rute gerobak. */}
      <svg
        className="absolute inset-x-0 top-[26%] h-40 w-full"
        viewBox="0 0 390 160"
        fill="none"
        aria-hidden
      >
        <path
          d="M34 120C86 120 96 34 158 34C220 34 232 116 296 116C336 116 352 96 366 78"
          stroke="var(--color-hijau-terang)"
          strokeOpacity="0.4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
        <circle cx="34" cy="120" r="5.5" fill="var(--color-hijau-terang)" stroke="#fff" strokeWidth="2" />
        <circle cx="366" cy="78" r="5.5" fill="var(--color-amber)" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

/**
 * Dua kartu yang mengambang, isinya cuplikan nyata dari aplikasi.
 *
 * Dipisah dari latarnya karena keduanya harus berada di atas isi layar,
 * sedangkan latar berada di bawahnya.
 *
 * Kartunya putih dengan bayangan lembut, bentuk yang sama dengan kartu
 * gerobak di beranda. Versi kaca buram sebelumnya hanya masuk akal di
 * atas latar gelap; di atas putih ia berubah jadi kotak abu tanpa
 * bentuk, dan cuplikan yang mestinya menjanjikan isi aplikasi justru
 * memperlihatkan sesuatu yang tidak ada di dalamnya.
 */
export function KartuMengambang() {
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto h-[176px] w-full max-w-[330px]">
      {/* Kartu gerobak. Lebarnya cukup untuk memuat namanya utuh; pada
          lebar yang lebih sempit nama pedagangnya terpotong dan baris
          ratingnya membungkus jadi dua, sehingga kartu cuplikan justru
          memperlihatkan tata letak yang berantakan. */}
      <div className="absolute left-0 top-0 w-[248px] -rotate-[5deg] rounded-[18px] border border-garis bg-white p-3 shadow-[0_14px_34px_rgb(0_90_10/0.13)]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-hijau-lembut text-hijau">
            <MapPin size={16} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold text-tinta">Bakso Pak Anton</p>
            <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10.5px] text-tinta-4">
              <Star size={9} className="shrink-0 fill-amber text-amber" />
              4.9 · 150m
            </p>
          </div>
          <span className="shrink-0 rounded-pil bg-hijau-lembut px-1.5 py-0.5 text-[8.5px] font-extrabold text-hijau">
            BUKA
          </span>
        </div>
      </div>

      {/* Kartu titik kumpul */}
      <div className="absolute bottom-0 right-0 w-[214px] rotate-[4deg] rounded-[18px] border border-garis bg-white p-3 shadow-[0_14px_34px_rgb(0_90_10/0.13)]">
        <div className="flex items-center gap-2">
          <Users size={13} strokeWidth={2.3} className="shrink-0 text-hijau" />
          <p className="truncate text-[12px] font-bold text-tinta">RT 05 Blok C</p>
          <span className="ml-auto shrink-0 text-[10.5px] font-bold text-tinta-4">3/5</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pil bg-hijau-lembut">
          <span className="block h-full w-3/5 rounded-pil bg-hijau-terang" />
        </div>
        <p className="mt-1.5 text-[10px] text-tinta-4">Butuh 2 warga lagi</p>
      </div>
    </div>
  );
}

/**
 * Lambang, nama, dan sapaan tulisan tangan di puncak layar sambutan.
 *
 * Sapaannya dipertahankan dari rancangan asli. Ia satu-satunya unsur di
 * seluruh aplikasi yang memakai huruf tulisan tangan, dan justru itu
 * gunanya: di antara layar yang serba rapi dan geometris, satu coretan
 * yang terasa ditulis tangan mengingatkan bahwa yang dihubungkan
 * aplikasi ini orang-orang di satu kampung, bukan lapak dalam katalog.
 */
export function KepalaMerek({ sapaan = true }: { sapaan?: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <LogoGerak size={78} bergerak={false} />
      {/* Lambang katanya memakai gradasi hijau yang sama dengan layar
          pembuka, jadi huruf yang dilihat orang di detik pertama dan di
          detik ketiga benar-benar huruf yang sama. */}
      <p className="tulisan-judul tulisan-gradasi mt-2.5 text-[30px] font-extrabold leading-none tracking-[0.06em]">
        SEKETIKA
      </p>

      {sapaan && (
        /* Coretan oranyenya menempel pada teks, bukan diletakkan pada
           koordinat tetap, supaya tetap sejajar kalau lebar hurufnya
           bergeser sedikit. */
        <p className="relative mt-3 font-[family-name:var(--font-tangan)] text-[19px] font-bold leading-none text-tinta-4">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[8px] right-[6px] h-[13px] w-[44px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      )}
    </div>
  );
}
