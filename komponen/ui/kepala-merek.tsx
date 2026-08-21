import { LogoGerak } from "@/komponen/ui/logo-gerak";
import { GarisTanya } from "@/komponen/ui/logo";

/** Lambang, nama, dan sapaan tulisan tangan di puncak layar masuk. */
export function KepalaMerek({
  sapaan = true,
  ukuran = 72,
}: {
  sapaan?: boolean;
  /** Lambang mengecil di layar yang isinya lebih padat. */
  ukuran?: number;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <LogoGerak size={ukuran} bergerak={false} />
      <p className="tulisan-judul mt-2.5 text-[26px] font-extrabold leading-none tracking-[0.06em] text-hijau">
        SEKETIKA
      </p>

      {sapaan && (
        /* Coretan oranyenya menempel pada teks, bukan diletakkan pada koordinat tetap, supaya tetap sejajar kalau lebar hurufnya bergeser sedikit. */
        <p className="relative mt-2.5 font-[family-name:var(--font-tangan)] text-[17px] font-bold leading-none text-tinta-4">
          &ldquo;Mau ngapain hari ini?&rdquo;
          <GarisTanya className="absolute -bottom-[8px] right-[6px] h-[12px] w-[42px] -scale-x-100 rotate-[4.93deg]" />
        </p>
      )}
    </div>
  );
}
