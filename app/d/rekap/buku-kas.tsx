"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Lock,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { salinTeks } from "@/lib/berbagi";
import { rp } from "@/lib/format";
import {
  HARI_BULANAN,
  bandingHari,
  deretTujuhHari,
  jamRamai,
  jamRapi,
  laporanBulanan,
  labelHari,
  menuTerlaris,
  pendapatanHari,
  prakiraanRamai,
  rincianHari,
} from "@/lib/rekap";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/** Berapa lama tulisan "Tersalin" bertahan sebelum kembali. */
const JEDA_SALIN = 2000;

export function BukuKas() {
  const riwayat = useToko((s) => s.riwayatPedagang);
  const pro = useToko((s) => s.pro);
  const setPro = useToko((s) => s.setPro);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const sekarang = useSekarang();
  const [tersalin, setTersalin] = React.useState(false);
  /* Offset hari yang batangnya sedang diketuk; null berarti sedang melihat rangkuman tujuh hari. */
  const [hariDipilih, setHariDipilih] = React.useState<number | null>(null);

  /* Buku Kas membaca dua sumber sekaligus: riwayat hari-hari sebelumnya dan pesanan hari ini yang sudah ditandai selesai. */
  const sumber = React.useMemo(
    () => [...riwayat, ...pesananMasuk.filter((p) => p.status === "selesai")],
    [riwayat, pesananMasuk],
  );

  const angka = React.useMemo(() => {
    if (sekarang === null) return null;
    const hariIni = pendapatanHari(sumber, sekarang, 0);
    const kemarin = pendapatanHari(sumber, sekarang, 1);
    return {
      hariIni,
      kemarin,
      banding: bandingHari(hariIni, kemarin),
      deret: deretTujuhHari(sumber, sekarang),
      menu: menuTerlaris(sumber, sekarang).slice(0, 3),
      jam: jamRamai(sumber, sekarang).slice(0, 3),
      bulanan: laporanBulanan(sumber, sekarang),
      prakiraan: prakiraanRamai(sumber, sekarang).slice(0, 3),
    };
  }, [sumber, sekarang]);

  /* Rincian hari yang dipilih. */
  const rincian = React.useMemo(
    () =>
      sekarang === null || hariDipilih === null
        ? null
        : {
            ...rincianHari(sumber, sekarang, hariDipilih),
            label: labelHari(sekarang, hariDipilih),
          },
    [sumber, sekarang, hariDipilih],
  );

  /* Yang ditampilkan di bawah grafik: rincian satu hari kalau ada yang dipilih, kalau tidak rangkuman tujuh hari seperti semula. */
  const menuTampil = rincian ? rincian.menu.slice(0, 3) : (angka?.menu ?? []);
  const jamTampil = rincian ? rincian.jam.slice(0, 3) : (angka?.jam ?? []);
  const rentang = rincian ? rincian.label : "7 hari";

  /* Puncak dipakai sebagai penyebut tinggi batang. */
  const puncak = Math.max(1, ...(angka?.deret.map((d) => d.total) ?? [0]));
  const adaTransaksi =
    (angka?.deret.some((d) => d.total > 0) ?? false) ||
    (angka?.menu.length ?? 0) > 0;

  const salin = async () => {
    if (!angka) return;
    const baris = [
      "Rekap SEKETIKA",
      `Pendapatan hari ini: ${rp(angka.hariIni)}`,
      angka.kemarin > 0
        ? `Kemarin: ${rp(angka.kemarin)} (${angka.banding.naik ? "+" : "−"}${angka.banding.persen}%)`
        : "Kemarin: belum ada transaksi",
      "",
      "Menu terlaris 7 hari:",
      ...angka.menu.map(
        (m, i) => `${i + 1}. ${m.nama} — ${m.porsi} porsi · ${rp(m.total)}`,
      ),
      "",
      angka.jam.length > 0
        ? `Jam paling ramai: ${jamRapi(angka.jam[0].mulai)}–${jamRapi(angka.jam[0].selesai)}`
        : "Jam paling ramai: belum cukup data",
    ];
    if (await salinTeks(baris.join("\n"))) {
      setTersalin(true);
      setTimeout(() => setTersalin(false), JEDA_SALIN);
    }
  };

  return (
    <Layar nav peran="pedagang">
      <Kepala judul="Buku Kas" subjudul="Pendapatan, menu, dan jam ramai" />

      <div className="px-4 pb-6 pt-3">
        {/* 1. Pendapatan hari ini */}
        <section className="gradasi-gerobak relative overflow-hidden rounded-[20px] p-4">
          <span
            aria-hidden
            className="absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.07]"
          />
          <p className="relative text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
            Pendapatan Hari Ini
          </p>
          <p className="relative mt-1 text-[30px] font-extrabold leading-none text-white">
            {angka ? rp(angka.hariIni) : "—"}
          </p>

          {/* Arah perubahan disampaikan tiga kali sekaligus: lewat tanda plus-minus, lewat arah panah, dan lewat warna. */}
          {angka && angka.kemarin > 0 && (
            <p
              className={`relative mt-2.5 inline-flex items-center gap-1.5 rounded-pil px-2.5 py-1 text-[11.5px] font-bold ${
                angka.banding.naik
                  ? "bg-white/15 text-hijau-neon"
                  : "bg-white/15 text-white"
              }`}
            >
              {angka.banding.naik ? (
                <ArrowUpRight size={13} strokeWidth={2.6} aria-hidden />
              ) : (
                <ArrowDownRight size={13} strokeWidth={2.6} aria-hidden />
              )}
              {angka.banding.naik ? "+" : "−"}
              {angka.banding.persen}% dari kemarin
            </p>
          )}
          {angka && angka.kemarin === 0 && (
            <p className="relative mt-2.5 text-[11.5px] text-white/70">
              Belum ada transaksi kemarin sebagai pembanding.
            </p>
          )}
        </section>

        {!adaTransaksi && sekarang !== null ? (
          /* 6. Belum ada apa pun untuk direkap */
          <p className="mt-4 rounded-[20px] border border-dashed border-garis bg-white px-4 py-10 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada transaksi tercatat.
            <br />
            Rekap muncul setelah pesanan pertama selesai.
          </p>
        ) : (
          <>
            {/* 2. Grafik tujuh hari */}
            <section className="bayang-kartu mt-4 rounded-[20px] border border-garis bg-white p-4">
              <h2 className="text-[14px] font-bold text-tinta">
                Tujuh Hari Terakhir
              </h2>
              <p className="mt-0.5 text-[11.5px] text-tinta-4">
                Total {rp(angka?.deret.reduce((j, d) => j + d.total, 0) ?? 0)}
              </p>

              {/* Batangnya digambar dengan tinggi persen, bukan pustaka grafik. */}
              <ul className="mt-4 flex h-[132px] items-end gap-1.5">
                {(angka?.deret ?? []).map((d, i) => {
                  const offset = (angka?.deret.length ?? 7) - 1 - i;
                  const iniHariIni = offset === 0;
                  const terpilih = hariDipilih === offset;
                  return (
                    <li key={d.iso} className="flex h-full flex-1">
                      {/* Tiap batang tombol sungguhan, bukan div berwarna. */}
                      <button
                        type="button"
                        aria-pressed={terpilih}
                        onClick={() => setHariDipilih(terpilih ? null : offset)}
                        className="flex h-full w-full flex-col justify-end gap-1.5 rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hijau"
                      >
                        <span
                          aria-hidden
                          className={`w-full rounded-t-[6px] transition-[height,background-color] duration-[var(--gerak-lambat)] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            terpilih
                              ? "bg-amber"
                              : iniHariIni
                                ? "bg-hijau"
                                : "bg-hijau-lembut"
                          }`}
                          /* Minimum dua piksel supaya hari tanpa pemasukan tetap kelihatan sebagai batang kosong, bukan menghilang seolah harinya tidak ada. */
                          style={{
                            height: `${Math.max(2, (d.total / puncak) * 100)}%`,
                          }}
                        />
                        <span
                          aria-hidden
                          className={`text-center text-[10px] leading-none ${
                            terpilih
                              ? "font-bold text-amber-tua"
                              : iniHariIni
                                ? "font-bold text-hijau"
                                : "text-tinta-4"
                          }`}
                        >
                          {d.label}
                        </span>
                        <span className="khusus-pembaca-layar">
                          {d.label}
                          {iniHariIni ? " (hari ini)" : ""}: {rp(d.total)}.
                          Ketuk untuk rinciannya.
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-2.5 text-center text-[11px] text-tinta-4">
                {rincian
                  ? "Ketuk batang yang sama untuk kembali ke rangkuman tujuh hari"
                  : "Ketuk satu batang untuk melihat rincian hari itu"}
              </p>
            </section>

            {/* Rincian hari yang batangnya diketuk */}
            {rincian && (
              <section className="bayang-kartu mt-4 rounded-[20px] border border-amber/40 bg-amber-lembut p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[14px] font-bold text-tinta">
                      {rincian.label}
                    </h2>
                    <p className="mt-0.5 text-[11.5px] text-amber-tua">
                      {rincian.jumlahPesanan} pesanan selesai
                    </p>
                  </div>
                  <p className="shrink-0 text-[18px] font-extrabold text-tinta">
                    {rp(rincian.total)}
                  </p>
                </div>

                {rincian.jumlahPesanan === 0 && (
                  <p className="mt-2.5 text-[12px] leading-relaxed text-amber-tua">
                    Tidak ada pesanan yang selesai pada hari ini. Bagian di
                    bawah ikut kosong, bukan menampilkan angka hari lain.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setHariDipilih(null)}
                  className="mt-3 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-amber-tua transition-transform active:scale-95"
                >
                  Kembali ke tujuh hari
                </button>
              </section>
            )}

            {/* 3. Menu terlaris */}
            {menuTampil.length > 0 && (
              <section className="bayang-kartu mt-4 overflow-hidden rounded-[20px] border border-garis bg-white">
                <h2 className="border-b border-garis px-4 py-3 text-[14px] font-bold text-tinta">
                  Menu Terlaris
                  <span className="ml-1.5 text-[11px] font-normal text-tinta-4">
                    {rentang}
                  </span>
                </h2>
                <ol>
                  {menuTampil.map((m, i) => (
                    <li
                      key={m.nama}
                      className="flex items-center gap-3 border-b border-garis px-4 py-3 last:border-b-0"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[12px] font-extrabold text-hijau">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold text-tinta">
                          {m.nama}
                        </span>
                        <span className="text-[11.5px] text-tinta-4">
                          {rp(m.total)}
                        </span>
                      </span>
                      {/* Porsi yang ditebalkan, bukan rupiahnya, karena porsi itulah kunci pengurutan daftar ini. */}
                      <span className="shrink-0 text-[13px] font-bold text-hijau">
                        {m.porsi} porsi
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 4. Jam paling ramai */}
            {jamTampil.length > 0 && (
              <section className="bayang-kartu mt-4 rounded-[20px] border border-garis bg-white p-4">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
                  <TrendingUp
                    size={16}
                    strokeWidth={2.1}
                    className="shrink-0 text-hijau"
                  />
                  Jam Paling Ramai
                  <span className="text-[11px] font-normal text-tinta-4">
                    {rentang}
                  </span>
                </h2>

                <ul className="mt-3 flex flex-col gap-2">
                  {jamTampil.map((j, i) => (
                    <li key={j.mulai} className="flex items-center gap-3">
                      <span className="w-[92px] shrink-0 text-[12.5px] font-semibold text-tinta-2">
                        {jamRapi(j.mulai)}–{jamRapi(j.selesai)}
                      </span>
                      <span
                        aria-hidden
                        className={`h-2 rounded-pil ${i === 0 ? "bg-hijau" : "bg-hijau-lembut"}`}
                        style={{
                          width: `${(j.jumlah / (jamTampil[0]?.jumlah || 1)) * 100}%`,
                          minWidth: "8px",
                        }}
                      />
                      <span className="shrink-0 text-[11.5px] text-tinta-4">
                        {j.jumlah} pesanan
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Kalimat yang mengubah tabel angka jadi saran. */}
                {!rincian && angka && angka.jam.length > 0 && (
                  <p className="mt-3.5 flex gap-2.5 rounded-[14px] bg-hijau-lembut px-3.5 py-3 text-[12px] leading-relaxed text-hijau-gelap">
                    <Sparkles
                      size={15}
                      strokeWidth={2.1}
                      className="mt-px shrink-0"
                      aria-hidden
                    />
                    <span>
                      Paling ramai jam{" "}
                      <strong className="font-bold">
                        {jamRapi(angka.jam[0].mulai)}–
                        {jamRapi(angka.jam[0].selesai)}
                      </strong>
                      . Coba mulai keliling dari RT 05 sekitar jam segitu.
                    </span>
                  </p>
                )}
              </section>
            )}

            {/* 5. Salin rekap */}
            <Tombol rupa="garis" penuh onClick={salin} className="mt-4">
              {tersalin ? (
                <ClipboardCheck size={16} strokeWidth={2.2} aria-hidden />
              ) : (
                <Copy size={16} strokeWidth={2.2} aria-hidden />
              )}
              {tersalin ? "Tersalin" : "Salin Rekap"}
            </Tombol>
          </>
        )}

        {/* 7. */}
        <section className="mt-5 overflow-hidden rounded-[20px] border border-garis bg-white">
          <div className="gradasi-amber flex items-center gap-2.5 px-4 py-3">
            <Sparkles
              size={15}
              strokeWidth={2.3}
              className="shrink-0 text-white"
              aria-hidden
            />
            <p className="flex-1 text-[13.5px] font-extrabold text-white">
              SEKETIKA Pro
            </p>
            <span className="rounded-pil bg-white/25 px-2.5 py-1 text-[10px] font-bold text-white">
              {pro ? "Aktif" : "Nonaktif"}
            </span>
          </div>

          {pro ? (
            <>
              <p className="border-b border-garis px-4 py-3 text-[12px] leading-relaxed text-tinta-3">
                Langganan menyala. Laporan bulanan dan prakiraan kawasan muncul
                di bawah, catatan stok ada di layarnya sendiri.
              </p>
              <Link
                href="/d/stok"
                className="flex items-center gap-3 border-b border-garis px-4 py-3.5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-amber-lembut text-amber-tua">
                  <Box size={18} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-bold text-tinta">
                    Catatan Stok
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-tinta-4">
                    Sisa porsi tiap menu
                  </span>
                </span>
                <ChevronRight
                  size={17}
                  className="shrink-0 text-tinta-5"
                  aria-hidden
                />
              </Link>
            </>
          ) : (
            <ul className="border-b border-garis px-4 py-3">
              {[
                { Ikon: TrendingUp, teks: "Laporan bulanan lengkap" },
                { Ikon: MapPin, teks: "Prakiraan kawasan & jam ramai" },
                { Ikon: Box, teks: "Catatan stok dagangan" },
              ].map(({ Ikon, teks }) => (
                <li key={teks} className="flex items-center gap-2.5 py-1.5">
                  <Ikon
                    size={15}
                    strokeWidth={2}
                    className="shrink-0 text-tinta-5"
                    aria-hidden
                  />
                  <span className="flex-1 text-[12.5px] text-tinta-3">
                    {teks}
                  </span>
                  <Lock
                    size={12}
                    strokeWidth={2.2}
                    className="shrink-0 text-tinta-5"
                    aria-hidden
                  />
                  <span className="khusus-pembaca-layar">terkunci</span>
                </li>
              ))}
            </ul>
          )}

          <div className="px-4 py-4">
            <Tombol
              rupa={pro ? "garis" : "amber"}
              ukur="md"
              penuh
              onClick={() => setPro(!pro)}
            >
              {pro ? "Nonaktifkan Langganan" : "Aktifkan SEKETIKA Pro"}
            </Tombol>
            {/* Purwarupa ini tidak memungut pembayaran. */}
            <p className="mt-2 text-center text-[11px] leading-snug text-tinta-4">
              Purwarupa lomba, belum ada pembayaran sungguhan
            </p>
          </div>
        </section>

        {pro && angka && adaTransaksi && (
          <>
            {/* Laporan bulanan */}
            <section className="bayang-kartu mt-4 rounded-[20px] border border-garis bg-white p-4">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
                <TrendingUp
                  size={16}
                  strokeWidth={2.1}
                  className="shrink-0 text-amber-tua"
                />
                Laporan {HARI_BULANAN} Hari
              </h2>

              <p className="mt-2.5 text-[26px] font-extrabold leading-none text-tinta">
                {rp(angka.bulanan.total)}
              </p>
              <p className="mt-1 text-[11.5px] text-tinta-4">
                {angka.bulanan.jumlahPesanan} pesanan ·{" "}
                {angka.bulanan.hariBerjualan} hari berjualan
              </p>

              <dl className="mt-3.5 grid grid-cols-2 gap-2">
                <div className="rounded-[14px] bg-krem px-3 py-2.5">
                  <dt className="text-[10.5px] text-tinta-4">
                    Rata-rata per hari jualan
                  </dt>
                  <dd className="mt-0.5 text-[14px] font-extrabold text-tinta">
                    {rp(angka.bulanan.rataRataHarian)}
                  </dd>
                </div>
                <div className="rounded-[14px] bg-krem px-3 py-2.5">
                  <dt className="text-[10.5px] text-tinta-4">Hari terbaik</dt>
                  <dd className="mt-0.5 text-[14px] font-extrabold text-tinta">
                    {angka.bulanan.terbaik
                      ? `${angka.bulanan.terbaik.label} · ${rp(angka.bulanan.terbaik.total)}`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <ul className="mt-3.5 flex flex-col gap-2">
                {angka.bulanan.mingguan.map((m) => {
                  const puncakMinggu = Math.max(
                    1,
                    ...angka.bulanan.mingguan.map((x) => x.total),
                  );
                  return (
                    <li key={m.label} className="flex items-center gap-3">
                      <span className="w-[86px] shrink-0 text-[11.5px] text-tinta-3">
                        {m.label}
                      </span>
                      <span
                        aria-hidden
                        className="h-2 rounded-pil bg-amber"
                        style={{
                          width: `${(m.total / puncakMinggu) * 100}%`,
                          minWidth: "8px",
                        }}
                      />
                      <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-tinta-2">
                        {rp(m.total)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Prakiraan kawasan */}
            <section className="bayang-kartu mt-4 rounded-[20px] border border-garis bg-white p-4">
              <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
                <MapPin
                  size={16}
                  strokeWidth={2.1}
                  className="shrink-0 text-amber-tua"
                />
                Prakiraan Kawasan
              </h2>
              <p className="mt-0.5 text-[11.5px] text-tinta-4">
                Dari {HARI_BULANAN} hari terakhir, bukan cuma sepekan
              </p>

              <ol className="mt-3 flex flex-col gap-2">
                {angka.prakiraan.map((k, i) => (
                  <li
                    key={`${k.titik}-${k.mulai}`}
                    className="flex items-center gap-3 rounded-[14px] bg-krem px-3 py-2.5"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber text-[11px] font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-bold text-tinta">
                        {k.titik}
                      </span>
                      <span className="text-[11px] text-tinta-4">
                        {jamRapi(k.mulai)}–{jamRapi(k.selesai)} · {rp(k.total)}
                      </span>
                    </span>
                    {/* Jumlah pesanan yang ditebalkan, bukan rupiahnya, karena itulah kunci pengurutan daftar ini. */}
                    <span className="shrink-0 text-right text-[12px] font-bold text-hijau">
                      {k.jumlah}
                      <span className="block text-[10px] font-normal text-tinta-4">
                        pesanan
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              {angka.prakiraan.length > 0 && (
                <p className="mt-3.5 flex gap-2.5 rounded-[14px] bg-amber-lembut px-3.5 py-3 text-[12px] leading-relaxed text-amber-tua">
                  <Sparkles
                    size={15}
                    strokeWidth={2.1}
                    className="mt-px shrink-0"
                    aria-hidden
                  />
                  <span>
                    Besok mulai dari{" "}
                    <strong className="font-bold">
                      {angka.prakiraan[0].titik}
                    </strong>{" "}
                    sekitar{" "}
                    <strong className="font-bold">
                      {jamRapi(angka.prakiraan[0].mulai)}
                    </strong>
                    . Kawasan itu paling sering menghasilkan pesanan pada jam
                    tersebut.
                  </span>
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </Layar>
  );
}
