import Image from "next/image";
import { IkonKompas } from "@/komponen/ui/ikon";
import { PinPedagang, PinKumpul, PinSaya } from "./pin";

export type Tanda = {
  id: string;
  x: number;
  y: number;
  rupa?: "pedagang" | "kumpul";
  /** Label melayang di atas pin, misalnya nama dan jarak. */
  label?: { judul: string; isi: string };
};

/**
 * Kartu peta.
 *
 * Latarnya gambar peta yang sama dengan yang dipakai di berkas desain,
 * dan pin ditempatkan di atasnya memakai persen, bukan piksel, supaya
 * letaknya tetap benar ketika lebar layar berubah. Pin dijangkarkan
 * pada ujung bawahnya karena di situlah letak yang ia tunjuk.
 */
export function Peta({
  tanda = [],
  saya,
  tinggi = 300,
  penuh,
  jumlahAktif,
  skala = true,
  className = "",
  children,
}: {
  tanda?: Tanda[];
  /** Posisi pengguna dalam persen. */
  saya?: { x: number; y: number };
  tinggi?: number;
  /** Memenuhi seluruh induknya alih-alih memakai tinggi tetap. */
  penuh?: boolean;
  /** Menampilkan lencana "N pedagang aktif" di kiri atas. */
  jumlahAktif?: number;
  skala?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#eceae4] ${penuh ? "absolute inset-0" : ""} ${className}`}
      style={penuh ? undefined : { height: tinggi }}
    >
      <Image
        src="/img/map-bg.png"
        alt="Peta wilayah sekitar"
        fill
        sizes="390px"
        className="object-cover"
        priority
      />

      {tanda.map((t) => (
        <div
          key={t.id}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
        >
          {t.rupa === "kumpul" ? <PinKumpul /> : <PinPedagang />}
          {/* Label menggantung di bawah pin tanpa menambah tinggi kotaknya,
              supaya ujung pin tetap menunjuk titik yang benar. */}
          {t.label && (
            <div className="absolute top-full mt-0.5 whitespace-nowrap rounded-[10px] bg-white/95 px-2 py-1 text-center shadow-[0_2px_8px_rgb(0_0_0/0.12)]">
              <p className="text-[10.5px] font-bold leading-tight text-tinta">{t.label.judul}</p>
              <p className="mt-px text-[9.5px] leading-tight text-tinta-4">{t.label.isi}</p>
            </div>
          )}
        </div>
      ))}

      {saya && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${saya.x}%`, top: `${saya.y}%` }}
        >
          <PinSaya />
        </div>
      )}

      {jumlahAktif !== undefined && (
        <div className="absolute left-1.5 top-3 flex items-center gap-1.5 rounded-[12px] bg-hijau px-3 py-1.5 shadow-[0_4px_7px_rgb(26_77_46/0.27)]">
          <span aria-hidden className="size-1.5 rounded-pil bg-hijau-neon" />
          <span className="text-[11px] font-bold leading-[16.5px] tracking-[0.22px] text-white">
            {jumlahAktif} pedagang aktif
          </span>
        </div>
      )}

      {skala && (
        <div className="absolute bottom-[11%] right-[4.7%] flex flex-col items-center gap-1.5 rounded-[12px] bg-white/90 px-2.5 py-2 shadow-[0_2px_8px_rgb(0_0_0/0.1)]">
          <IkonKompas size={18} className="text-tinta-6" />
          <span aria-hidden className="relative h-px w-10 bg-tinta-2">
            <span className="absolute -top-[1.5px] left-[-1px] h-1 w-px bg-tinta-2" />
            <span className="absolute -top-[1.5px] right-0 h-1 w-px bg-tinta-2" />
          </span>
          <span className="text-[8px] font-medium leading-3 tracking-[0.4px] text-tinta-6">100m</span>
        </div>
      )}

      {children}
    </div>
  );
}
