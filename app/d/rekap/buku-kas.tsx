"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  ClipboardCheck,
  Copy,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { salinTeks } from "@/lib/berbagi";
import { rp } from "@/lib/format";
import {
  bandingHari,
  deretTujuhHari,
  jamRamai,
  jamRapi,
  menuTerlaris,
  pendapatanHari,
} from "@/lib/rekap";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/** Berapa lama tulisan "Tersalin" bertahan sebelum kembali. */
const JEDA_SALIN = 2000;

export function BukuKas() {
  const riwayat = useToko((s) => s.riwayatPedagang);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const sekarang = useSekarang();
  const [tersalin, setTersalin] = React.useState(false);

  /* Buku Kas membaca dua sumber sekaligus: riwayat hari-hari sebelumnya
     dan pesanan hari ini yang sudah ditandai selesai. Keduanya digabung
     di sini, bukan disatukan di penyimpanan, supaya kotak masuk hari ini
     tetap bersih dari riwayat. */
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
    };
  }, [sumber, sekarang]);

  /* Puncak dipakai sebagai penyebut tinggi batang. Kalau seluruh minggu
     nol, penyebutnya diganti satu supaya tidak ada pembagian dengan nol
     yang menghasilkan NaN pada atribut gaya. */
  const puncak = Math.max(1, ...(angka?.deret.map((d) => d.total) ?? [0]));
  const adaTransaksi = (angka?.deret.some((d) => d.total > 0) ?? false) || (angka?.menu.length ?? 0) > 0;

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
      ...angka.menu.map((m, i) => `${i + 1}. ${m.nama} — ${m.porsi} porsi · ${rp(m.total)}`),
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
          <span aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.07]" />
          <p className="relative text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
            Pendapatan Hari Ini
          </p>
          <p className="relative mt-1 text-[30px] font-extrabold leading-none text-white">
            {angka ? rp(angka.hariIni) : "—"}
          </p>

          {/* Arah perubahan disampaikan tiga kali sekaligus: lewat tanda
              plus-minus, lewat arah panah, dan lewat warna. Warna sendirian
              tidak cukup; ada pengguna yang tidak bisa membedakan hijau dan
              merah, dan bagi mereka kartu ini harus tetap terbaca. */}
          {angka && angka.kemarin > 0 && (
            <p
              className={`relative mt-2.5 inline-flex items-center gap-1.5 rounded-pil px-2.5 py-1 text-[11.5px] font-bold ${
                angka.banding.naik ? "bg-white/15 text-hijau-neon" : "bg-white/15 text-white"
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
              <h2 className="text-[14px] font-bold text-tinta">Tujuh Hari Terakhir</h2>
              <p className="mt-0.5 text-[11.5px] text-tinta-4">
                Total {rp(angka?.deret.reduce((j, d) => j + d.total, 0) ?? 0)}
              </p>

              {/* Batangnya digambar dengan tinggi persen, bukan pustaka
                  grafik. Untuk tujuh angka, memuat pustaka berukuran
                  ratusan kilobita hanya untuk menggambar tujuh persegi
                  adalah ongkos yang tidak sebanding.

                  Sebagai daftar, bukan kumpulan div: tiap batang adalah
                  satu butir data, dan pembaca layar menyuarakannya
                  berurutan lengkap dengan nominalnya. Tinggi batang tidak
                  berarti apa-apa buat yang tidak melihatnya, jadi angkanya
                  ikut ditulis. */}
              <ul className="mt-4 flex h-[132px] items-end gap-1.5">
                {(angka?.deret ?? []).map((d, i) => {
                  const iniHariIni = i === (angka?.deret.length ?? 0) - 1;
                  return (
                    <li key={d.iso} className="flex h-full flex-1 flex-col justify-end gap-1.5">
                      <span
                        aria-hidden
                        className={`w-full rounded-t-[6px] transition-[height] duration-[var(--gerak-lambat)] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          iniHariIni ? "bg-hijau" : "bg-hijau-lembut"
                        }`}
                        /* Minimum dua piksel supaya hari tanpa pemasukan
                           tetap kelihatan sebagai batang kosong, bukan
                           menghilang seolah harinya tidak ada. */
                        style={{ height: `${Math.max(2, (d.total / puncak) * 100)}%` }}
                      />
                      <span
                        aria-hidden
                        className={`text-center text-[10px] leading-none ${
                          iniHariIni ? "font-bold text-hijau" : "text-tinta-4"
                        }`}
                      >
                        {d.label}
                      </span>
                      <span className="khusus-pembaca-layar">
                        {d.label}
                        {iniHariIni ? " (hari ini)" : ""}: {rp(d.total)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 3. Menu terlaris */}
            {(angka?.menu.length ?? 0) > 0 && (
              <section className="bayang-kartu mt-4 overflow-hidden rounded-[20px] border border-garis bg-white">
                <h2 className="border-b border-garis px-4 py-3 text-[14px] font-bold text-tinta">
                  Menu Terlaris
                  <span className="ml-1.5 text-[11px] font-normal text-tinta-4">7 hari</span>
                </h2>
                <ol>
                  {(angka?.menu ?? []).map((m, i) => (
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
                        <span className="text-[11.5px] text-tinta-4">{rp(m.total)}</span>
                      </span>
                      {/* Porsi yang ditebalkan, bukan rupiahnya, karena
                          porsi itulah kunci pengurutan daftar ini. Waktu
                          rupiah yang ditonjolkan, kolomnya terbaca menurun
                          ke arah yang salah dan daftarnya terlihat seperti
                          gagal diurutkan padahal urutannya benar. */}
                      <span className="shrink-0 text-[13px] font-bold text-hijau">
                        {m.porsi} porsi
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 4. Jam paling ramai */}
            {(angka?.jam.length ?? 0) > 0 && (
              <section className="bayang-kartu mt-4 rounded-[20px] border border-garis bg-white p-4">
                <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
                  <TrendingUp size={16} strokeWidth={2.1} className="shrink-0 text-hijau" />
                  Jam Paling Ramai
                </h2>

                <ul className="mt-3 flex flex-col gap-2">
                  {(angka?.jam ?? []).map((j, i) => (
                    <li key={j.mulai} className="flex items-center gap-3">
                      <span className="w-[92px] shrink-0 text-[12.5px] font-semibold text-tinta-2">
                        {jamRapi(j.mulai)}–{jamRapi(j.selesai)}
                      </span>
                      <span
                        aria-hidden
                        className={`h-2 rounded-pil ${i === 0 ? "bg-hijau" : "bg-hijau-lembut"}`}
                        style={{
                          width: `${(j.jumlah / (angka?.jam[0].jumlah ?? 1)) * 100}%`,
                          minWidth: "8px",
                        }}
                      />
                      <span className="shrink-0 text-[11.5px] text-tinta-4">
                        {j.jumlah} pesanan
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Kalimat yang mengubah tabel angka jadi saran. Latar
                    belakang proposal ini justru soal rute pedagang yang
                    ditentukan kebiasaan alih-alih data; di sinilah datanya
                    berbicara. */}
                {angka && angka.jam.length > 0 && (
                  <p className="mt-3.5 flex gap-2.5 rounded-[14px] bg-hijau-lembut px-3.5 py-3 text-[12px] leading-relaxed text-hijau-gelap">
                    <Sparkles size={15} strokeWidth={2.1} className="mt-px shrink-0" aria-hidden />
                    <span>
                      Paling ramai jam{" "}
                      <strong className="font-bold">
                        {jamRapi(angka.jam[0].mulai)}–{jamRapi(angka.jam[0].selesai)}
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

        {/* 7. Tawaran berbayar */}
        <section className="mt-5 overflow-hidden rounded-[20px] border border-garis bg-white">
          <div className="gradasi-amber flex items-center gap-2.5 px-4 py-3">
            <Lock size={15} strokeWidth={2.3} className="shrink-0 text-white" aria-hidden />
            <p className="text-[13.5px] font-extrabold text-white">SEKETIKA Pro</p>
          </div>

          <ul className="px-4 py-3">
            {[
              { Ikon: TrendingUp, teks: "Laporan bulanan lengkap" },
              { Ikon: Sparkles, teks: "Prediksi kawasan & jam ramai" },
              { Ikon: Box, teks: "Catatan stok dagangan" },
            ].map(({ Ikon, teks }) => (
              <li key={teks} className="flex items-center gap-2.5 py-1.5">
                <Ikon size={15} strokeWidth={2} className="shrink-0 text-tinta-5" aria-hidden />
                <span className="flex-1 text-[12.5px] text-tinta-3">{teks}</span>
                <Lock size={12} strokeWidth={2.2} className="shrink-0 text-tinta-5" aria-hidden />
                <span className="khusus-pembaca-layar">terkunci</span>
              </li>
            ))}
          </ul>

          <div className="px-4 pb-4">
            {/* Sengaja mati. Halamannya memang belum ada, dan tombol yang
                menjanjikan halaman kosong lebih buruk daripada tombol yang
                jujur mengaku belum bisa ditekan. */}
            <Tombol rupa="halus" ukur="md" penuh disabled>
              Pelajari
            </Tombol>
            <p className="mt-2 text-center text-[11px] text-tinta-4">Segera hadir</p>
          </div>
        </section>
      </div>
    </Layar>
  );
}
