import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { GarisTanya } from "@/komponen/ui/logo";

/**
 * Lambang, nama, dan sapaan tulisan tangan di puncak layar masuk.
 *
 * Menggantikan berkas `panggung-sambutan.tsx` yang selain ini juga
 * memuat latar berhias dan dua kartu mengambang: bidang gradasi kabur,
 * jala peta, jalur bertitik, kartu miring bertumpuk bayangan. Semua itu
 * dibuang. Susunan seperti itu adalah ciri gambar rakitan mesin, dan
 * satu layar yang tenang lebih meyakinkan daripada layar yang sibuk
 * membuktikan dirinya dirancang.
 *
 * Yang tersisa cuma tiga baris, tanpa bayangan dan tanpa gradasi.
 * Sapaannya dipertahankan dari rancangan asli: ia satu-satunya unsur di
 * seluruh aplikasi yang memakai huruf tulisan tangan, dan justru itu
 * gunanya, mengingatkan bahwa yang dihubungkan aplikasi ini orang-orang
 * di satu kampung, bukan lapak dalam katalog.
 */
export function KepalaMerek({ sapaan = true }: { sapaan?: boolean }) {
  return (
    <div className="relative flex flex-col items-center">
      <LogoGerak size={72} bergerak={false} />
      <p className="tulisan-judul mt-3 text-[28px] font-extrabold leading-none tracking-[0.06em] text-hijau">
        SEKETIKA
      </p>

      {sapaan && (
        /* Coretan oranyenya menempel pada teks, bukan diletakkan pada
           koordinat tetap, supaya tetap sejajar kalau lebar hurufnya
           bergeser sedikit. */
        <p className="relative mt-3 font-[family-name:var(--font-tangan)] text-[18px] font-bold leading-none text-tinta-4">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[8px] right-[6px] h-[12px] w-[42px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      )}
    </div>
  );
}
