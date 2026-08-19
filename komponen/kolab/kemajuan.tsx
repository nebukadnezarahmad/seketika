import type { Peserta } from "@/lib/tipe";

/** Batang kemajuan titik kumpul. */
export function BatangKemajuan({
  nilai,
  target,
  label,
}: {
  nilai: number;
  target: number;
  /** Ganti keterangan bawaan kalau satuannya bukan jumlah warga. */
  label?: string;
}) {
  const persen = Math.min(100, Math.round((nilai / Math.max(1, target)) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={nilai}
      aria-valuemin={0}
      aria-valuemax={target}
      aria-label={label ?? `${nilai} dari ${target} warga bergabung`}
      className="h-[7px] w-full overflow-hidden rounded-pil bg-hijau/12"
    >
      <span
        className="block h-full rounded-pil bg-hijau transition-[width] duration-500 ease-out"
        style={{ width: `${persen}%` }}
      />
    </div>
  );
}

/**
 * Tumpukan avatar peserta.
 *
 * Slot yang belum terisi digambar sebagai lingkaran putus-putus, bukan
 * dihilangkan. Kekosongan yang terlihat itulah yang mendorong orang
 * mengajak tetangganya.
 */
export function TumpukanPeserta({
  peserta,
  target,
  tampil = 3,
  kosong = false,
}: {
  peserta: Peserta[];
  target: number;
  tampil?: number;
  /** Gambar juga slot yang masih kosong. */
  kosong?: boolean;
}) {
  const terlihat = peserta.slice(0, tampil);
  const sisa = peserta.length - terlihat.length;
  const slotKosong = kosong ? Math.max(0, target - peserta.length) : 0;

  return (
    <div className="flex items-center">
      {terlihat.map((p, i) => (
        <span
          key={p.id}
          title={p.nama}
          className="grid size-8 place-items-center rounded-full border-2 border-white bg-hijau text-[11px] font-bold text-white"
          style={{ marginLeft: i === 0 ? 0 : -10, zIndex: tampil - i }}
        >
          {p.inisial}
        </span>
      ))}

      {sisa > 0 && (
        <span
          className="grid size-8 place-items-center rounded-full border-2 border-white bg-hijau-lembut text-[10px] font-bold text-hijau"
          style={{ marginLeft: -10 }}
        >
          +{sisa}
        </span>
      )}

      {Array.from({ length: slotKosong }, (_, i) => (
        <span
          key={`kosong-${i}`}
          aria-hidden
          className="grid size-8 place-items-center rounded-full border-2 border-dashed border-tinta-5/60 text-[11px] text-tinta-5"
          style={{ marginLeft: -10 }}
        >
          ?
        </span>
      ))}
    </div>
  );
}
