"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, ChevronUp, MapPin, Navigation, Users, Zap } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { PilMelayang } from "@/komponen/nav/pil-melayang";
import { SLUG_GEROBAK_SAYA, gerobakSaya } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";

/** Perkiraan sisa waktu tempuh dari lama pesanan sudah berjalan. */
function sisaMenit(menitLalu: number): number {
  return Math.max(1, 10 - Math.floor(menitLalu / 4));
}


export function BerandaPedagang() {
  const router = useRouter();
  const gerobak = gerobakSaya();

  const buka = useToko((s) => s.gerobakBuka);
  const setGerobak = useToko((s) => s.setGerobak);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const ubahStatusMasuk = useToko((s) => s.ubahStatusMasuk);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const profil = useToko((s) => s.profil);

  const [lembarBuka, setLembarBuka] = React.useState(false);
  const [ringkasTerbuka, setRingkasTerbuka] = React.useState(false);

  const baru = pesananMasuk.filter((p) => p.status === "baru");
  const diproses = pesananMasuk.filter((p) => p.status === "diproses");
  /* Satu gerobak hanya bisa menuju satu tujuan, jadi yang melayang cukup
     pesanan tertua yang sedang dikerjakan. */
  const sedangDiantar = diproses[0];
  const selesai = pesananMasuk.filter((p) => p.status === "selesai");
  const permintaan = titikKumpul.filter((t) => t.pedagangSlug === SLUG_GEROBAK_SAYA).length;

  return (
    <Layar
      nav
      peran="pedagang"
      melayang={
        sedangDiantar && (
          <PilMelayang
            judul={`Menuju Lokasi ${sedangDiantar.warga}`}
            keterangan={`Sedang menuju · ${sisaMenit(sedangDiantar.menitLalu)} mnt lagi`}
            menit={sisaMenit(sedangDiantar.menitLalu)}
            href={`/d/antar/${sedangDiantar.id}`}
            aksi={() => ubahStatusMasuk(sedangDiantar.id, "selesai")}
          />
        )
      }
    >
      {/* Kepala toko */}
      <header className="flex items-center gap-3 px-4 pb-3 pt-2">
        <Image
          src={gerobak.foto}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-extrabold leading-tight text-hijau">
            {profil?.namaUsaha || gerobak.nama}
          </p>
          <p className="text-[11px] text-tinta-4">{gerobak.jenis}</p>
        </div>
        <button
          type="button"
          aria-label="Notifikasi"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-hijau transition-transform active:scale-90"
        >
          <Bell size={17} strokeWidth={2} />
        </button>
      </header>

      <div className="px-4 pb-4 data-[melayang]:pb-32" data-melayang={sedangDiantar ? "" : undefined}>
        {/* Status gerobak */}
        <section
          className={`relative overflow-hidden rounded-[18px] p-4 ${
            buka ? "gradasi-gerobak" : "bg-[#3d4a42]"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
            Status Gerobak
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[22px] font-extrabold text-white">
              Sedang {buka ? "BUKA" : "TUTUP"}
              <span
                aria-hidden
                className={`size-3 rounded-full ${buka ? "bg-[#22c55e]" : "bg-merah"}`}
              />
            </p>

            <label className="relative shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={buka}
                onChange={(e) => setGerobak(e.target.checked)}
                className="peer khusus-pembaca-layar"
              />
              <span className="sr-only">Buka gerobak</span>
              <span
                aria-hidden
                className="block h-8 w-[54px] rounded-pil bg-white/25 transition-colors peer-checked:bg-[#22c55e] peer-focus-visible:ring-2 peer-focus-visible:ring-white/60"
              />
              <span
                aria-hidden
                className="absolute left-1 top-1 size-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[22px]"
              />
            </label>
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-snug text-white/65">
            <MapPin size={13} strokeWidth={2.1} className="mt-px shrink-0" />
            Bumi Marina Emas Selatan · 150m dari titik kumpul terdekat
          </p>

          {/* Ketika tutup, ajakan berisi alasan konkret untuk membuka. */}
          {!buka && permintaan > 0 && (
            <p className="mt-3 flex items-start gap-2 rounded-[12px] bg-white/10 px-3 py-2.5 text-[11.5px] leading-snug text-white/80">
              <Zap size={14} strokeWidth={2.2} className="mt-px shrink-0 text-amber" />
              <span>
                Ada <strong className="font-bold text-white">{permintaan} permintaan titik kumpul</strong>.
                Aktifkan gerobak untuk mulai menerima pesanan!
              </span>
            </p>
          )}
        </section>

        {/* Ringkasan pesanan hari ini */}
        <button
          type="button"
          onClick={() => {
            setRingkasTerbuka((v) => !v);
            setLembarBuka(true);
          }}
          aria-expanded={ringkasTerbuka}
          className="bayang-kartu mt-3 flex w-full flex-col items-center rounded-[16px] border border-garis bg-white py-3"
        >
          <span className="text-[20px] font-extrabold leading-none text-tinta">
            {pesananMasuk.length}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Pesanan
          </span>
          <span aria-hidden className="mt-1 text-tinta-5">
            {ringkasTerbuka ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {/* Pesanan baru */}
        <div className="mt-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
            Pesanan Baru
            {baru.length > 0 && (
              <span className="grid min-w-[18px] place-items-center rounded-full bg-merah px-1.5 py-0.5 text-[10px] font-bold text-white">
                {baru.length}
              </span>
            )}
          </h2>
          <Link href="/d/pesanan" className="text-[12px] font-semibold text-hijau-terang">
            Lihat semua →
          </Link>
        </div>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {baru.map((p) => (
            <li
              key={p.id}
              className="bayang-kartu overflow-hidden rounded-[14px] border border-garis border-t-[3px] border-t-[#3b82f6] bg-white p-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[13px] font-bold text-hijau">
                  {p.inisial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-tinta">
                    {p.warga}
                    <span className="ml-1.5 text-[11px] font-normal text-tinta-4">
                      · {p.menitLalu} mnt lalu
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-tinta-4">
                    <MapPin size={11} strokeWidth={2.2} className="shrink-0" />
                    {p.titik}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => ubahStatusMasuk(p.id, "selesai")}
                  className="h-10 shrink-0 rounded-[12px] border border-garis px-5 text-[12.5px] font-bold text-tinta-3 transition-transform active:scale-95"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ubahStatusMasuk(p.id, "diproses");
                    router.push(`/d/antar/${p.id}`);
                  }}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-hijau text-[12.5px] font-bold text-white transition-transform active:scale-[0.98]"
                >
                  <Navigation size={14} strokeWidth={2.3} />
                  Terima &amp; Berangkat
                </button>
              </div>
            </li>
          ))}

          {baru.length === 0 && (
            <li className="rounded-[14px] border border-dashed border-garis bg-white px-4 py-7 text-center text-[12px] leading-relaxed text-tinta-4">
              Tidak ada pesanan baru saat ini.
            </li>
          )}
        </ul>


        {/* Permintaan titik kumpul */}
        <div className="mt-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
            Permintaan Titik Kumpul
            {permintaan > 0 && (
              <span className="grid min-w-[18px] place-items-center rounded-full bg-hijau px-1.5 py-0.5 text-[10px] font-bold text-white">
                {permintaan}
              </span>
            )}
          </h2>
        </div>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {titikKumpul
            .filter((t) => t.pedagangSlug === SLUG_GEROBAK_SAYA)
            .map((t) => (
              <li key={t.id} className="bayang-kartu rounded-[14px] border border-garis bg-white p-3">
                <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-tinta">
                  <Users size={14} strokeWidth={2.1} className="shrink-0 text-hijau" />
                  {t.nama}
                </p>
                <p className="mt-0.5 text-[11px] text-tinta-4">
                  {t.peserta.length}/{t.target} warga · {t.patokan}
                </p>
              </li>
            ))}
          {permintaan === 0 && (
            <li className="rounded-[14px] border border-dashed border-garis bg-white px-4 py-6 text-center text-[12px] text-tinta-4">
              Belum ada permintaan titik kumpul untuk gerobak ini.
            </li>
          )}
        </ul>
      </div>

      {/* Lembar rekap pesanan hari ini */}
      <Lembar buka={lembarBuka} tutup={() => setLembarBuka(false)} judul="Pesanan Hari Ini">
        <div className="px-4 pb-6">
          <h2 className="text-[16px] font-extrabold text-tinta">Pesanan Hari Ini</h2>
          <p className="mt-0.5 text-[11.5px] text-tinta-4">{selesai.length} pesanan berhasil</p>

          <ul className="mt-3 flex flex-col gap-2">
            {pesananMasuk.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-2.5 rounded-[13px] border border-garis bg-white p-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[13px] font-bold text-hijau">
                  {p.inisial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[13px] font-bold text-tinta">
                    {p.warga}
                    <span
                      className={`rounded-[6px] px-1.5 py-0.5 text-[9.5px] font-bold ${
                        p.status === "selesai"
                          ? "bg-hijau-lembut text-hijau"
                          : p.status === "diproses"
                            ? "bg-amber/15 text-amber-tua"
                            : "bg-[#e8f0fe] text-[#2563eb]"
                      }`}
                    >
                      {p.status === "selesai" ? "Selesai" : p.status === "diproses" ? "Diproses" : "Baru"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-tinta-3">
                    {p.baris.map((b) => `${b.nama} ×${b.jumlah}`).join(" · ")}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-tinta-4">
                    {p.titik} · {p.menitLalu} mnt lalu
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Lembar>
    </Layar>
  );
}
