"use client";

import { Clock, Footprints, House, MapPin, Navigation } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Peta } from "@/komponen/peta/peta";
import { Pin } from "@/komponen/peta/pin";
import { cariPedagang, SLUG_GEROBAK_SAYA } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";

/** Panjang rute berjalan kaki, sedikit lebih jauh dari jarak lurus. */
const KELOK = 1.35;

/**
 * Rute menuju satu titik kumpul.
 *
 * Tujuannya sama untuk kedua peran, yang berbeda titik berangkatnya:
 * pedagang mendorong gerobaknya dari lapaknya, warga berjalan dari
 * rumahnya. Sebelumnya layar ini campur aduk — judul dan petunjuk
 * arahnya ditulis dari sisi pedagang, sementara kartu ringkasannya
 * menyebut pembacanya "Pembeli" dan navigasinya navigasi warga.
 */
export function RuteTitik({ id }: { id: string }) {
  const titik = useToko((s) => s.titikKumpul.find((t) => t.id === id));
  const namaSaya = useToko((s) => s.profil?.nama) ?? "Anda";
  const peran = useToko((s) => s.profil?.peran);

  const sisiPedagang = peran === "pedagang";

  if (!titik) {
    return (
      <Layar nav peran={sisiPedagang ? "pedagang" : "pembeli"}>
        <Kepala judul="Rute ke Titik Kumpul" />
        <p className="px-6 py-16 text-center text-[13px] text-tinta-4">
          Titik kumpul tidak ditemukan.
        </p>
      </Layar>
    );
  }

  const pedagang = cariPedagang(titik.pedagangSlug);
  const lurus = pedagang?.jarak ?? 150;
  const rute = Math.round((lurus * KELOK) / 10) * 10;
  const menit = Math.max(1, Math.round(rute / 85));

  const sayaPemilik = sisiPedagang && titik.pedagangSlug === SLUG_GEROBAK_SAYA;

  const langkah = [
    sayaPemilik
      ? "Keluar dari lapak gerobakmu menuju jalan utama."
      : `Keluar dari rumahmu menuju jalan utama.`,
    `Lurus terus sejauh ${Math.round(rute * 0.6)} meter mengikuti jalan.`,
    `Belok mengikuti papan penunjuk ke arah ${titik.nama}.`,
    `Titik kumpul berada di ${titik.patokan}.`,
  ];

  return (
    <Layar nav peran={sisiPedagang ? "pedagang" : "pembeli"}>
      <Kepala judul="Rute ke Titik Kumpul" />

      <div className="px-4 pb-4 pt-3">
        {/* Dua ujung rute */}
        <div className="bayang-kartu rounded-[16px] border border-garis bg-white p-3.5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-amber/15 text-amber-tua">
                <House size={17} strokeWidth={2} />
              </span>
              <span aria-hidden className="my-1 w-px flex-1 bg-garis" />
              <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-biru-lembut text-biru">
                <MapPin size={17} strokeWidth={2} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
                  Titik Berangkat
                </p>
                <p className="mt-0.5 truncate text-[14px] font-bold text-tinta">
                  {sayaPemilik ? `Gerobak ${pedagang?.nama}` : "Rumahmu"}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
                  Titik Kumpul
                </p>
                <p className="mt-0.5 truncate text-[14px] font-bold text-tinta">
                  {titik.nama}, {titik.patokan}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Peta rute */}
        <div className="bayang-kartu mt-3 overflow-hidden rounded-[16px]">
          <Peta tinggi={210} skala={false}>
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full"
            >
              <path
                d="M28 82 L 28 46 L 74 46 L 74 20"
                fill="none"
                stroke="var(--color-biru)"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 4 }}
              />
            </svg>
            <span
              className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-biru"
              style={{ left: "28%", top: "82%" }}
            />
            <span
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: "74%", top: "20%" }}
            >
              <Pin size={24} warna="var(--color-merah)" mata="polos" />
            </span>
            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 items-center gap-2 rounded-pil bg-white px-3 py-1.5 shadow-[0_2px_8px_rgb(0_0_0/0.16)]">
              <span aria-hidden className="size-2 rounded-full bg-biru" />
              <span className="text-[12px] font-bold text-tinta">{rute} meter</span>
              <span className="text-[11px] text-tinta-4">{menit} menit</span>
            </span>
          </Peta>
        </div>

        {/* Ringkasan */}
        <div className="bayang-kartu mt-3 rounded-[16px] border border-garis bg-white p-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[14px] font-bold text-hijau">
              {namaSaya.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-extrabold text-hijau">{namaSaya}</p>
              <p className="text-[11.5px] text-tinta-4">
                {sayaPemilik ? "Pedagang" : "Pembeli"} · Titik Kumpul {titik.nama}
              </p>
            </div>
          </div>

          <dl className="mt-3.5 grid grid-cols-3 gap-2">
            {[
              { Ikon: Footprints, nilai: `${lurus}m`, label: "Dari Anda", kelas: "bg-hijau-lembut text-hijau" },
              { Ikon: Navigation, nilai: `${rute}m`, label: "Total Rute", kelas: "bg-biru-lembut text-biru" },
              { Ikon: Clock, nilai: `${menit} min`, label: "Estimasi", kelas: "bg-amber/12 text-amber-tua" },
            ].map(({ Ikon, nilai, label, kelas }) => (
              <div key={label} className={`rounded-[13px] px-2 py-3 text-center ${kelas}`}>
                <Ikon size={16} strokeWidth={2} className="mx-auto" />
                <dd className="mt-1.5 text-[14px] font-extrabold">{nilai}</dd>
                <dt className="mt-0.5 text-[10px] opacity-70">{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Petunjuk arah */}
        <div className="bayang-kartu mt-3 rounded-[16px] border border-garis bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Petunjuk Arah
          </p>
          <ol className="mt-3 flex flex-col gap-2.5">
            {langkah.map((l, i) => (
              <li key={l} className="flex gap-3 text-[12.5px] leading-snug text-tinta-2">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[10px] font-bold text-hijau">
                  {i + 1}
                </span>
                {l}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Layar>
  );
}
