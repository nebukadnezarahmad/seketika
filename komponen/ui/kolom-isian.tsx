import type { ComponentProps, ElementType } from "react";

/** Sebaris isian formulir: label kecil di atas, kotak isian di bawah, dengan ikon di dalam kotak. */
export function KolomIsian({
  label,
  Ikon,
  panjang,
  batas,
  ...p
}: ComponentProps<"input"> & {
  label: string;
  Ikon: ElementType;
  /** Pakai area teks bertingkat, bukan satu baris. */
  panjang?: boolean;
  /** Garis pemisah tipis di atas kolom, seperti pada kartu di desain. */
  batas?: boolean;
}) {
  const isi =
    "w-full bg-transparent text-[13px] text-tinta placeholder:text-tinta-3 focus:outline-none";

  return (
    <label className={`block ${batas ? "border-t border-garis pt-3.5" : ""}`}>
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
        {label}
      </span>
      <span className="flex items-start gap-2.5 rounded-[12px] border border-garis bg-krem px-3 py-2 transition-colors focus-within:border-hijau/50">
        <Ikon size={15} className="mt-px shrink-0 text-tinta-5" />
        {panjang ? (
          <textarea
            {...(p as ComponentProps<"textarea">)}
            rows={2}
            className={`${isi} resize-none leading-snug`}
          />
        ) : (
          <input {...p} className={isi} />
        )}
      </span>
    </label>
  );
}
