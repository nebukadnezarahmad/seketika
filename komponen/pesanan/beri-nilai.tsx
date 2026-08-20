"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { useToko } from "@/lib/toko";

const KETERANGAN = ["", "Mengecewakan", "Kurang", "Lumayan", "Bagus", "Memuaskan"];

/**
 * Memberi bintang untuk satu pesanan yang sudah selesai.
 *
 * Dibuat sebagai kelompok tombol radio sungguhan, bukan deretan ikon yang
 * bisa diklik. Bintang yang cuma gambar tidak bisa dicapai papan ketik,
 * tidak bisa dipilih dengan panah, dan pembaca layar tidak punya cara
 * menyuarakan berapa yang sedang terpilih. Bentuk radio memberi semuanya
 * secara cuma-cuma.
 *
 * Sekali terkirim, nilainya tidak bisa diubah lagi. Bintang yang masih
 * bisa diputar-putar setelah dikirim membuat angkanya kehilangan arti
 * bagi pedagang yang sudah melihatnya.
 */
export function BeriNilai({ pesananId, namaPedagang }: { pesananId: string; namaPedagang?: string }) {
  const nilaiTersimpan = useToko((s) => s.penilaian[pesananId]);
  const beriNilai = useToko((s) => s.beriNilai);
  const [pilihan, setPilihan] = React.useState(0);

  if (nilaiTersimpan) {
    return (
      /* Susunannya rata tengah persis seperti keadaan sebelum dinilai.
         Kalau yang satu rata kiri dan yang lain rata tengah, kartunya
         melompat berpindah tata letak tepat pada saat tombol ditekan. */
      <div className="bayang-kartu mt-3 rounded-2xl border border-garis bg-white p-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Penilaian Anda
        </p>
        <p aria-hidden className="mt-2.5 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={24}
              strokeWidth={1.7}
              className={n <= nilaiTersimpan ? "fill-amber text-amber" : "text-tinta-5"}
            />
          ))}
        </p>
        <p className="mt-2 text-[13px] font-bold text-tinta">
          {nilaiTersimpan} dari 5 · {KETERANGAN[nilaiTersimpan]}
        </p>
        <p className="mt-1 text-[11.5px] leading-snug text-tinta-4">
          Terima kasih, penilaianmu membantu tetangga lain memilih.
        </p>
      </div>
    );
  }

  return (
    <div className="bayang-kartu mt-3 rounded-2xl border border-garis bg-white p-4 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
        Beri Penilaian
      </p>
      <p className="mt-1 text-[13px] font-bold text-tinta">
        Bagaimana pesanan dari {namaPedagang ?? "penjual"}?
      </p>

      <fieldset className="mt-3.5">
        <legend className="khusus-pembaca-layar">Pilih jumlah bintang, satu sampai lima</legend>

        {/* Deret bintangnya rata tengah, jaraknya sama di kiri dan kanan. */}
        <div className="flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name={`nilai-${pesananId}`}
                value={n}
                checked={pilihan === n}
                onChange={() => setPilihan(n)}
                className="peer khusus-pembaca-layar"
              />
              <span className="khusus-pembaca-layar">
                {n} bintang, {KETERANGAN[n]}
              </span>
              <span
                aria-hidden
                className="block rounded-full p-1 transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-hijau/50 active:scale-90"
              >
                <Star
                  size={30}
                  strokeWidth={1.6}
                  className={n <= pilihan ? "fill-amber text-amber" : "text-tinta-5"}
                />
              </span>
            </label>
          ))}
        </div>

        {/* Keterangannya turun ke bawah deret, bukan menempel di sebelah
            kanan bintang terakhir. Waktu ia berada di samping, munculnya
            kata "Memuaskan" mendorong seluruh deret ke kiri, sehingga
            bintangnya berhenti rata tengah justru pada saat pengguna
            sedang memilih. Tingginya dikunci supaya kartunya tidak
            tersentak memanjang saat kata itu muncul. */}
        <p className="mt-2 flex h-[18px] items-center justify-center text-[12.5px] font-semibold text-tinta-3">
          {pilihan > 0 ? KETERANGAN[pilihan] : ""}
        </p>
      </fieldset>

      <button
        type="button"
        disabled={pilihan === 0}
        onClick={() => beriNilai(pesananId, pilihan)}
        className="mt-3.5 h-11 w-full rounded-full bg-hijau text-[13px] font-bold text-white transition-[transform,opacity] active:scale-[0.98] disabled:bg-tinta-5/30 disabled:text-tinta-3"
      >
        Kirim Penilaian
      </button>
    </div>
  );
}
