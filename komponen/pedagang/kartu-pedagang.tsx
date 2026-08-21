import Image from "next/image";
import Link from "next/link";
import { IkonBintang } from "@/komponen/ui/ikon";
import { jarakSingkat } from "@/lib/format";
import type { Pedagang } from "@/lib/tipe";

/** Kartu pedagang pada rel mendatar di beranda. */
export function KartuPedagang({
  pedagang,
  utama,
  onPilih,
}: {
  pedagang: Pedagang;
  /** Kartu pertama pada rel; fotonya biasanya jadi elemen LCP. */
  utama?: boolean;
  /** Kalau ada, kartu jadi tombol dan ini dipanggil saat diketuk. */
  onPilih?: (pedagang: Pedagang) => void;
}) {
  const { slug, nama, jenis, rating, jarak, buka, foto } = pedagang;

  const kelas =
    "bayang-kartu block w-[148px] shrink-0 overflow-hidden rounded-[20px] border border-garis bg-white text-left transition-transform active:scale-[0.98]";

  const isi = (
    <>
      <div className="relative h-[100px] w-full">
        <Image
          src={foto}
          alt={nama}
          fill
          sizes="148px"
          priority={utama}
          className="object-cover"
        />
        <span
          className={`absolute right-2 top-2 rounded-pil px-[7px] py-[3px] text-[9px] font-bold leading-[13.5px] tracking-[0.36px] text-white ${
            buka ? "bg-hijau/88" : "bg-black/55"
          }`}
        >
          {buka ? "BUKA" : "TUTUP"}
        </span>
      </div>

      <div className="px-2.5 pb-3 pt-2.5">
        <p className="truncate text-[12px] font-bold leading-[15.6px] tracking-[-0.12px] text-tinta">
          {nama}
        </p>
        <p className="mt-0.5 truncate text-[10px] leading-[10px] text-tinta-4">
          {jenis}
        </p>

        <div className="mt-[7px] flex items-center justify-between">
          <span className="flex items-center gap-[3px]">
            <IkonBintang size={11} />
            <span className="text-[11px] font-semibold leading-[16.5px] text-tinta-2">
              {rating.toFixed(1)}
            </span>
          </span>
          <span className="rounded-pil bg-hijau-lembut px-[7px] py-0.5 text-[10px] font-semibold leading-[15px] text-hijau">
            {jarakSingkat(jarak)}
          </span>
        </div>
      </div>
    </>
  );

  if (onPilih) {
    return (
      <button
        type="button"
        onClick={() => onPilih(pedagang)}
        aria-haspopup="dialog"
        className={kelas}
      >
        {isi}
      </button>
    );
  }

  return (
    <Link href={`/pedagang/${slug}`} className={kelas}>
      {isi}
    </Link>
  );
}
