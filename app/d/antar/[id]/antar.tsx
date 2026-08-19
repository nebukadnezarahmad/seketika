"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronUp, Crosshair, MapPin, MessageSquare, Navigation, Volume2 } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Peta } from "@/komponen/peta/peta";
import { Pin } from "@/komponen/peta/pin";
import { Tombol } from "@/komponen/ui/tombol";
import { BatangKemajuan } from "@/komponen/kolab/kemajuan";
import { useToko } from "@/lib/toko";

/**
 * Layar navigasi pengantaran.
 *
 * Kemajuan perjalanan merambat pelan dari nilai awalnya supaya demo
 * terasa hidup tanpa perlu GPS sungguhan. Perambatannya berhenti di 100
 * dan pewaktunya dibersihkan saat layar ditinggalkan.
 */
export function Antar({ id }: { id: string }) {
  const router = useRouter();
  const pesanan = useToko((s) => s.pesananMasuk.find((p) => p.id === id));
  const ubahStatusMasuk = useToko((s) => s.ubahStatusMasuk);
  const [maju, setMaju] = React.useState(8);
  const [panduanBuka, setPanduanBuka] = React.useState(true);

  React.useEffect(() => {
    const t = setInterval(() => setMaju((n) => (n >= 100 ? 100 : n + 1)), 900);
    return () => clearInterval(t);
  }, []);

  if (!pesanan) {
    return (
      <Layar nav peran="pedagang">
        <p className="px-6 py-16 text-center text-[13px] text-tinta-4">Pesanan tidak ditemukan.</p>
      </Layar>
    );
  }

  const menit = Math.max(1, Math.round((100 - maju) / 12));

  return (
    <Layar nav peran="pedagang">
      <div className="relative flex-1">
        <Peta penuh utama skala={false} saya={{ x: 62, y: 38 }}>
          {/* Garis rute dari posisi gerobak menuju titik tujuan */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <path
              d="M62 38 L 40 55 L 22 72"
              fill="none"
              stroke="#1A4D2E"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeDasharray="3 2.4"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 3 }}
            />
          </svg>

          <div className="absolute" style={{ left: "22%", top: "72%" }}>
            <span className="relative -ml-[15px] -mt-[44px] block">
              <span className="absolute left-[30px] top-2 whitespace-nowrap rounded-[8px] bg-hijau px-2 py-1 text-[9.5px] font-bold text-white">
                Titik Tujuan
              </span>
              <Pin size={30} />
            </span>
          </div>
        </Peta>

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-white text-hijau shadow-[0_2px_10px_rgb(0_0_0/0.15)] transition-transform active:scale-90"
        >
          <ChevronLeft size={19} strokeWidth={2.4} />
        </button>

        {/* Perkiraan tiba */}
        <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-[14px] bg-white px-3.5 py-2 shadow-[0_3px_12px_rgb(0_0_0/0.16)]">
          <Navigation size={16} strokeWidth={2.4} className="text-hijau" />
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold text-tinta">{menit} menit</span>
            <span className="block text-[10px] text-tinta-4">estimasi tiba</span>
          </span>
        </div>

        {/* Panduan suara */}
        <div className="absolute inset-x-4 top-[76px] flex items-center gap-2.5 rounded-[14px] bg-white px-3 py-2.5 shadow-[0_3px_12px_rgb(0_0_0/0.14)]">
          <Volume2 size={17} strokeWidth={2.1} className="shrink-0 text-hijau" />
          {panduanBuka ? (
            <p className="min-w-0 flex-1 truncate text-[12px] font-medium text-tinta-2">
              Lurus terus sejauh {Math.max(20, 350 - maju * 3)} meter.
            </p>
          ) : (
            <p className="min-w-0 flex-1 text-[12px] text-tinta-4">Panduan suara disembunyikan</p>
          )}
          <button
            type="button"
            onClick={() => setPanduanBuka((v) => !v)}
            aria-label={panduanBuka ? "Sembunyikan panduan" : "Tampilkan panduan"}
            aria-expanded={panduanBuka}
            className="grid size-7 shrink-0 place-items-center rounded-full bg-krem text-tinta-4"
          >
            <ChevronUp size={14} className={panduanBuka ? "" : "rotate-180"} />
          </button>
        </div>

        <button
          type="button"
          aria-label="Pusatkan peta"
          className="absolute right-4 top-1/2 grid size-10 place-items-center rounded-full bg-white text-tinta-6 shadow-[0_2px_10px_rgb(0_0_0/0.15)] transition-transform active:scale-90"
        >
          <Crosshair size={18} strokeWidth={2} />
        </button>

        {/* Lembar tujuan */}
        <div className="bayang-lembar absolute inset-x-0 bottom-0 rounded-t-[22px] bg-krem px-4 pb-4 pt-2.5">
          <span aria-hidden className="mx-auto mb-3 block h-1 w-9 rounded-pil bg-tinta-5/60" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Tujuan Pengiriman
          </p>

          <div className="mt-2.5 flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[15px] font-bold text-hijau">
              {pesanan.inisial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-extrabold text-tinta">{pesanan.warga}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-tinta-4">
                <MapPin size={11} strokeWidth={2.2} className="shrink-0" />
                {pesanan.titik}
              </p>
            </div>
            <Link
              href="/d/chat/ch-01"
              aria-label={`Chat ${pesanan.warga}`}
              className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau transition-transform active:scale-90"
            >
              <MessageSquare size={17} strokeWidth={2.1} />
            </Link>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <p className="text-[11.5px] text-tinta-3">Progres perjalanan</p>
            <p className="text-[12px] font-bold tabular-nums text-tinta">{maju}%</p>
          </div>
          <div className="mt-1.5">
            <BatangKemajuan nilai={maju} target={100} label={`Progres perjalanan ${maju} persen`} />
          </div>

          {maju >= 100 && (
            <div className="mt-3.5">
              <Tombol
                penuh
                onClick={() => {
                  ubahStatusMasuk(pesanan.id, "selesai");
                  router.push("/d");
                }}
              >
                Tandai Selesai
              </Tombol>
            </div>
          )}
        </div>
      </div>
    </Layar>
  );
}
