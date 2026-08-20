import { MapPin, Star, Users } from "lucide-react";
import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { GarisTanya } from "@/komponen/ui/logo";

/**
 * Latar layar sambutan, digambar seluruhnya di kode.
 *
 * Menggantikan satu foto ilustrasi berukuran 79 KB. Selain jadi berkas
 * terbesar pada layar pertama, gambar itu juga hasil rakitan mesin, dan
 * pada purwarupa yang dinilai orang, unsur yang tidak bisa dijelaskan
 * asal-usulnya lebih baik tidak ada. Yang digambar di kode tajam di
 * kerapatan piksel berapa pun, ikut berubah kalau warnanya disetel
 * ulang, dan tidak menambah satu pun permintaan jaringan.
 *
 * Isinya bukan hiasan acak. Dua kartu yang mengambang itu memperlihatkan
 * dua hal yang benar-benar ada di dalam aplikasi: satu gerobak yang
 * sedang buka lengkap dengan jaraknya, dan satu titik kumpul yang sedang
 * mengumpulkan warga. Kesan pertama yang menjanjikan sesuatu yang tidak
 * ditemukan di dalam adalah kesan pertama yang berbohong.
 */
export function PanggungSambutan() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dasar: gradasi hijau pekat yang menua ke bawah. */}
      <div className="absolute inset-0 bg-[linear-gradient(168deg,#00470f_0%,#002e0a_52%,#001c06_100%)]" />

      {/* Dua nyala cahaya. Yang hijau di atas menahan pandangan pada
          lambang, yang oranye di bawah menghangatkan tempat tombolnya
          berada supaya layarnya tidak terasa dingin dan rata. */}
      <div className="absolute -left-24 -top-16 size-[22rem] rounded-full bg-hijau-terang/25 blur-[70px]" />
      <div className="absolute -right-24 top-[26%] size-[18rem] rounded-full bg-amber/15 blur-[80px]" />
      <div className="absolute -bottom-24 left-1/4 size-[20rem] rounded-full bg-hijau/20 blur-[80px]" />

      {/* Jala peta yang sangat samar, mengingatkan bahwa yang dijual
          aplikasi ini adalah menemukan sesuatu di sekitar. */}
      <svg className="absolute inset-0 size-full opacity-[0.07]" aria-hidden>
        <defs>
          <pattern id="jala" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0H0V34" fill="none" stroke="#fff" strokeWidth="1" />
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
          stroke="#fff"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
        <circle cx="34" cy="120" r="5" fill="#00AA13" stroke="#fff" strokeOpacity="0.5" />
        <circle cx="366" cy="78" r="5" fill="#FF9500" stroke="#fff" strokeOpacity="0.5" />
      </svg>
    </div>
  );
}

/**
 * Dua kartu kaca yang mengambang, isinya cuplikan nyata dari aplikasi.
 *
 * Dipisah dari latarnya karena keduanya berada di atas lapisan gradasi
 * peredup, sedangkan latar berada di bawahnya. Menggabungkan keduanya
 * berarti kartunya ikut teredam dan justru kehilangan gunanya.
 */
export function KartuMengambang() {
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto h-[176px] w-full max-w-[330px]">
      {/* Kartu gerobak. Lebarnya cukup untuk memuat namanya utuh; pada
          lebar yang lebih sempit nama pedagangnya terpotong dan baris
          ratingnya membungkus jadi dua, sehingga kartu cuplikan justru
          memperlihatkan tata letak yang berantakan. */}
      <div className="absolute left-0 top-0 w-[248px] -rotate-[5deg] rounded-[18px] border border-white/20 bg-white/12 p-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-white/20 text-white">
            <MapPin size={16} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold text-white">Bakso Pak Anton</p>
            <p className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10.5px] text-white/70">
              <Star size={9} className="shrink-0 fill-amber text-amber" />
              4.9 · 150m
            </p>
          </div>
          <span className="shrink-0 rounded-pil bg-hijau-neon px-1.5 py-0.5 text-[8.5px] font-extrabold text-hijau-gelap">
            BUKA
          </span>
        </div>
      </div>

      {/* Kartu titik kumpul */}
      <div className="absolute bottom-0 right-0 w-[214px] rotate-[4deg] rounded-[18px] border border-white/20 bg-white/12 p-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Users size={13} strokeWidth={2.3} className="shrink-0 text-hijau-neon" />
          <p className="truncate text-[12px] font-bold text-white">RT 05 Blok C</p>
          <span className="ml-auto shrink-0 text-[10.5px] font-bold text-white/85">3/5</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-pil bg-white/20">
          <span className="block h-full w-3/5 rounded-pil bg-hijau-neon" />
        </div>
        <p className="mt-1.5 text-[10px] text-white/70">Butuh 2 warga lagi</p>
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
      <p className="tulisan-judul mt-2.5 text-[30px] font-extrabold leading-none tracking-[0.06em] text-white">
        SEKETIKA
      </p>

      {sapaan && (
        /* Coretan oranyenya menempel pada teks, bukan diletakkan pada
           koordinat tetap, supaya tetap sejajar kalau lebar hurufnya
           bergeser sedikit. */
        <p className="relative mt-3 font-[family-name:var(--font-tangan)] text-[19px] font-bold leading-none text-white/85">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[8px] right-[6px] h-[13px] w-[44px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      )}
    </div>
  );
}
