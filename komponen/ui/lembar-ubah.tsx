"use client";

import * as React from "react";
import { Lembar } from "@/komponen/ui/lembar";
import { Tombol } from "@/komponen/ui/tombol";

/** Lembar berisi formulir pendek untuk mengubah beberapa kolom. */
export function LembarUbah({
  buka,
  tutup,
  judul,
  keterangan,
  simpan,
  labelSimpan = "Simpan",
  children,
}: {
  buka: boolean;
  tutup: () => void;
  judul: string;
  keterangan?: string;
  /** Kembalikan false untuk menahan lembarnya tetap terbuka. */
  simpan?: () => boolean | void;
  labelSimpan?: string;
  children: React.ReactNode;
}) {
  return (
    <Lembar buka={buka} tutup={tutup} judul={judul}>
      <div className="px-4 pb-6 pt-1">
        <h2 className="tulisan-judul text-[18px] font-extrabold text-tinta">
          {judul}
        </h2>
        {keterangan && (
          <p className="mt-1 text-[12px] leading-relaxed text-tinta-4">
            {keterangan}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-3">{children}</div>

        {simpan && (
          <Tombol
            penuh
            className="mt-5"
            onClick={() => {
              if (simpan() !== false) tutup();
            }}
          >
            {labelSimpan}
          </Tombol>
        )}
      </div>
    </Lembar>
  );
}

/** Satu kolom isian dalam `LembarUbah`. */
export function Kolom({
  label,
  nilai,
  ubah,
  contoh,
  banyakBaris,
  salah,
  mode,
}: {
  label: string;
  nilai: string;
  ubah: (v: string) => void;
  contoh?: string;
  banyakBaris?: boolean;
  salah?: string;
  mode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const kelas =
    "mt-1.5 w-full rounded-[14px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-tinta-4 focus:outline-none focus:ring-2 focus:ring-hijau/35";

  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold text-tinta-3">
        {label}
      </span>
      {banyakBaris ? (
        <textarea
          value={nilai}
          onChange={(e) => ubah(e.target.value)}
          rows={3}
          placeholder={contoh}
          className={`${kelas} resize-none`}
        />
      ) : (
        <input
          value={nilai}
          onChange={(e) => ubah(e.target.value)}
          placeholder={contoh}
          inputMode={mode}
          aria-invalid={Boolean(salah)}
          className={kelas}
        />
      )}
      {salah && (
        <span className="mt-1 block text-[11px] text-merah">{salah}</span>
      )}
    </label>
  );
}
