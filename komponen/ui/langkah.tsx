/** Tiga titik penanda langkah pengenalan. Yang aktif memanjang. */
export function TitikLangkah({ ke }: { ke: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1.5" role="presentation">
      {([1, 2, 3] as const).map((n) => (
        <span
          key={n}
          className={`h-[5px] rounded-pil transition-all ${
            n === ke ? "w-6 bg-hijau" : "w-2.5 bg-tinta-5/50"
          }`}
        />
      ))}
    </div>
  );
}

export function Kicker({ anak }: { anak: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-tinta-4">
      {anak}
    </p>
  );
}

export function JudulLangkah({ anak }: { anak: React.ReactNode }) {
  return (
    <h1 className="mt-1.5 text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-hijau">
      {anak}
    </h1>
  );
}

export function KakiVersi() {
  return (
    <p className="pb-4 pt-3 text-center text-[10px] tracking-[0.04em] text-tinta-5">
      SEKETIKA · versi 1.0
    </p>
  );
}
