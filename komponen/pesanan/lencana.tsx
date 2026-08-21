import type { StatusPesanan } from "@/lib/tipe";

const rupa: Record<StatusPesanan, { label: string; kelas: string }> = {
  menunggu: { label: "Menunggu", kelas: "bg-amber/15 text-amber-tua" },
  diproses: { label: "Dalam Proses", kelas: "bg-amber/15 text-amber-tua" },
  selesai: { label: "Selesai", kelas: "bg-hijau-lembut text-hijau" },
  dibatalkan: { label: "Dibatalkan", kelas: "bg-merah/12 text-merah" },
};

export function LencanaStatus({ status }: { status: StatusPesanan }) {
  const { label, kelas } = rupa[status];
  return (
    <span
      className={`shrink-0 rounded-pil px-2.5 py-1 text-[10.5px] font-bold ${kelas}`}
    >
      {label}
    </span>
  );
}

/** Tiga titik penanda tahap pesanan: Dipesan, Diproses, Selesai. */
export function TahapPesanan({ status }: { status: StatusPesanan }) {
  const sampai = status === "selesai" ? 2 : status === "diproses" ? 1 : 0;
  const batal = status === "dibatalkan";
  const label = ["Dipesan", "Diproses", "Selesai"];

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <span
          aria-hidden
          className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 rounded-pil bg-garis"
        />
        <span
          aria-hidden
          className={`absolute left-1 top-1/2 h-[2px] -translate-y-1/2 rounded-pil transition-[width] ${
            batal ? "bg-tinta-5" : "bg-hijau"
          }`}
          style={{
            width: `calc(${(sampai / 2) * 100}% - ${sampai === 0 ? 0 : 4}px)`,
          }}
        />
        {label.map((l, i) => (
          <span
            key={l}
            aria-hidden
            className={`relative z-10 size-2 rounded-pil ${
              batal
                ? i === 0
                  ? "bg-tinta-5"
                  : "bg-white ring-1 ring-garis"
                : i <= sampai
                  ? "bg-hijau"
                  : "bg-white ring-1 ring-garis"
            }`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        {label.map((l, i) => (
          <span
            key={l}
            className={`text-[10px] ${
              i <= sampai && !batal
                ? "font-medium text-tinta-3"
                : "text-tinta-5"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
