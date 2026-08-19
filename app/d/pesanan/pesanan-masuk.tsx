"use client";

import * as React from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { rp, totalBaris } from "@/lib/format";
import { useToko } from "@/lib/toko";
import type { PesananMasuk } from "@/lib/tipe";

const rupaStatus: Record<PesananMasuk["status"], { label: string; kelas: string }> = {
  baru: { label: "Pesanan Baru", kelas: "bg-[#e8f0fe] text-[#2563eb]" },
  diproses: { label: "Diproses", kelas: "bg-amber/15 text-amber-tua" },
  diantar: { label: "Sedang Diantar", kelas: "bg-hijau/12 text-hijau" },
  selesai: { label: "Selesai", kelas: "bg-hijau-lembut text-hijau" },
};

/** Yang masih berjalan, dilihat dari sisi penyaring. */
const berjalan = (s: PesananMasuk["status"]) => s === "diproses" || s === "diantar";

export function PesananMasukLayar() {
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const ubahStatusMasuk = useToko((s) => s.ubahStatusMasuk);
  const [aktif, setAktif] = React.useState<"semua" | PesananMasuk["status"]>("semua");
  const [terbuka, setTerbuka] = React.useState<string | null>(null);

  /* Tab "Diproses" menghitung pesanan yang sudah diterima maupun yang
     sedang diantar. Bagi pedagang keduanya sama-sama belum kelar, dan
     memecahnya jadi dua tab hanya menambah tab yang jarang berisi. */
  const hitung = {
    semua: pesananMasuk.length,
    baru: pesananMasuk.filter((p) => p.status === "baru").length,
    diproses: pesananMasuk.filter((p) => berjalan(p.status)).length,
    selesai: pesananMasuk.filter((p) => p.status === "selesai").length,
  };

  const tab = [
    { kunci: "semua", label: "Semua" },
    { kunci: "baru", label: "Baru" },
    { kunci: "diproses", label: "Diproses" },
    { kunci: "selesai", label: "Selesai" },
  ] as const;

  const terlihat = pesananMasuk.filter((p) => {
    if (aktif === "semua") return true;
    if (aktif === "diproses") return berjalan(p.status);
    return p.status === aktif;
  });

  return (
    <Layar nav peran="pedagang">
      <header className="px-4 pb-3 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[20px] font-extrabold text-hijau">Pesanan Masuk</h1>
          {hitung.baru > 0 && (
            <span className="shrink-0 rounded-pil bg-merah px-2.5 py-1 text-[11px] font-bold text-white">
              {hitung.baru} baru
            </span>
          )}
        </div>
        <p className="mt-1 text-[12px] text-tinta-4">
          {hitung.selesai} pesanan selesai hari ini · bayar di tempat
        </p>
      </header>

      {/* Tab bergaris bawah, sesuai desain pedagang */}
      <div className="rel-gulir flex gap-5 border-b border-garis px-4">
        {tab.map((t) => {
          const on = aktif === t.kunci;
          return (
            <button
              key={t.kunci}
              type="button"
              onClick={() => setAktif(t.kunci)}
              aria-pressed={on}
              className={`relative shrink-0 pb-2.5 pt-1 text-[13px] transition-colors ${
                on ? "font-bold text-hijau" : "font-medium text-tinta-4"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  on ? "bg-hijau text-white" : "bg-tinta-5/20 text-tinta-3"
                }`}
              >
                {hitung[t.kunci]}
              </span>
              {on && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-pil bg-hijau"
                />
              )}
            </button>
          );
        })}
      </div>

      <ul className="rentet flex flex-col gap-2.5 px-4 py-3">
        {terlihat.map((p) => {
          const buka = terbuka === p.id;
          const total = totalBaris(p.baris);
          const butir = p.baris.reduce((n, b) => n + b.jumlah, 0);
          const { label, kelas } = rupaStatus[p.status];

          return (
            <li
              key={p.id}
              className={`bayang-kartu overflow-hidden rounded-[14px] border border-garis bg-white ${
                p.status === "baru" ? "border-t-[3px] border-t-[#3b82f6]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setTerbuka(buka ? null : p.id)}
                aria-expanded={buka}
                className="flex w-full items-start gap-2.5 p-3 text-left"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[14px] font-bold text-hijau">
                  {p.inisial}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13.5px] font-bold text-tinta">
                      {p.warga}
                      <span className="ml-1.5 text-[11px] font-normal text-tinta-4">
                        · {p.menitLalu} mnt lalu
                      </span>
                    </span>
                    <span className="shrink-0 text-[12.5px] font-bold text-tinta">
                      {butir} item
                    </span>
                  </span>

                  <span className="mt-1 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1 truncate text-[11px] text-tinta-4">
                      <MapPin size={11} strokeWidth={2.2} className="shrink-0" />
                      {p.titik}
                    </span>
                    <span className={`shrink-0 rounded-[7px] px-2 py-0.5 text-[10px] font-bold ${kelas}`}>
                      {label}
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={`mt-1 shrink-0 text-tinta-5 transition-transform ${buka ? "rotate-180" : ""}`}
                />
              </button>

              {buka && (
                <div className="border-t border-garis bg-krem px-3 py-3">
                  <ul className="flex flex-col gap-1.5">
                    {p.baris.map((b) => (
                      <li
                        key={b.menuId}
                        className="flex items-baseline justify-between gap-3 text-[12px]"
                      >
                        <span className="text-tinta-2">
                          <span className="font-semibold text-tinta">{b.jumlah}×</span> {b.nama}
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums text-tinta">
                          {rp(b.harga * b.jumlah)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2.5 flex items-baseline justify-between border-t border-garis pt-2.5">
                    <span className="text-[11.5px] text-tinta-4">Total</span>
                    <span className="text-[14px] font-extrabold tabular-nums text-hijau">
                      {rp(total)}
                    </span>
                  </p>

                  {p.status !== "selesai" && (
                    <button
                      type="button"
                      onClick={() => ubahStatusMasuk(p.id, "selesai")}
                      className="mt-3 h-10 w-full rounded-[12px] bg-hijau text-[12.5px] font-bold text-white transition-transform active:scale-[0.98]"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}

        {terlihat.length === 0 && (
          <li className="rounded-[14px] border border-dashed border-garis bg-white px-4 py-10 text-center text-[12.5px] text-tinta-4">
            Belum ada pesanan di kelompok ini.
          </li>
        )}
      </ul>
    </Layar>
  );
}
