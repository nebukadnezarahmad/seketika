"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Info,
  MapPin,
  MessagesSquare,
  Navigation,
  PackageCheck,
  Ruler,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { BatangKemajuan, TumpukanPeserta } from "@/komponen/kolab/kemajuan";
import { ObrolanTitik } from "@/komponen/kolab/obrolan-titik";
import { cariPedagang, SLUG_GEROBAK_SAYA } from "@/lib/data/pedagang";
import { sisaWaktu } from "@/lib/format";
import { labelStatusTitik, statusTitik } from "@/lib/kolab";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/** Satu titik kumpul, dilihat dari dua sisi. */
export function DetailTitikKumpul({ id }: { id: string }) {
  const router = useRouter();
  const titik = useToko((s) => s.titikKumpul.find((t) => t.id === id));
  const gabung = useToko((s) => s.gabungTitikKumpul);
  const ubahStatus = useToko((s) => s.ubahStatusTitik);
  const peran = useToko((s) => s.profil?.peran);
  const namaSaya = useToko((s) => s.profil?.nama) ?? "Anda";
  const jumlahObrolan = useToko((s) =>
    id in s.obrolanTitik ? s.obrolanTitik[id].length : 0,
  );
  const sekarang = useSekarang();
  const [obrolanBuka, setObrolanBuka] = React.useState(false);

  if (!titik) {
    return (
      <Layar nav>
        <Kepala judul="Detail Titik Kumpul" />
        <p className="px-6 py-16 text-center text-[13px] leading-relaxed text-tinta-4">
          Titik kumpul ini sudah berakhir atau tautannya tidak berlaku lagi.
        </p>
      </Layar>
    );
  }

  const pedagang = cariPedagang(titik.pedagangSlug);
  const ikut = titik.peserta.some((p) => p.id === "saya");
  const kurang = Math.max(0, titik.target - titik.peserta.length);
  const penuh = kurang === 0;
  /* Kehangusan disimpulkan dari jam lewat `statusTitik`, bukan dibaca dari status tersimpan. */
  const status = statusTitik(titik, sekarang);
  const habis = status === "hangus";
  const dijemput = status === "dijemput";
  const beres = status === "selesai";

  /* Pemiliknya, bukan sekadar "pengguna berperan pedagang": aplikasi ini hanya mengenal satu gerobak milik sendiri, dan titik kumpul untuk gerobak lain tetap dilihat sebagai warga. */
  const sayaPemilik =
    peran === "pedagang" && titik.pedagangSlug === SLUG_GEROBAK_SAYA;

  /* Menerima berarti dua hal sekaligus: statusnya berubah, lalu rutenya dibuka. */
  const terimaLaluBerangkat = () => {
    ubahStatus(titik.id, "dijemput");
    router.push(`/kolab/${titik.id}/rute`);
  };

  return (
    <Layar
      nav
      peran={sayaPemilik ? "pedagang" : "pembeli"}
      lembar={
        <Lembar
          buka={obrolanBuka}
          tutup={() => setObrolanBuka(false)}
          judul={`Obrolan ${titik.nama}`}
        >
          <ObrolanTitik titikId={titik.id} nama={namaSaya} />
        </Lembar>
      }
    >
      <Kepala
        judul={sayaPemilik ? "Permintaan Titik Kumpul" : "Detail Titik Kumpul"}
      />

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Kartu identitas titik kumpul */}
        <div className="gradasi-kumpul relative overflow-hidden rounded-[18px] p-4">
          <span
            aria-hidden
            className="absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.07]"
          />

          <div className="relative flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-2 text-[19px] font-extrabold text-white">
              <MapPin
                size={17}
                strokeWidth={2.2}
                className="shrink-0 text-white/80"
              />
              <span className="truncate">{titik.nama}</span>
            </p>
            {/* Lencananya membaca `statusTitik`, bukan cuma penuh atau belum. */}
            <span className="flex shrink-0 items-center gap-1.5 rounded-pil bg-hijau-neon px-2.5 py-1 text-[10.5px] font-bold text-hijau-gelap">
              <span aria-hidden className="size-1.5 rounded-pil bg-hijau" />
              {labelStatusTitik[status]}
            </span>
          </div>

          <p className="relative mt-1.5 text-[12.5px] text-white/65">
            {titik.patokan}
          </p>

          {/* Warga perlu tahu gerobak mana yang dipanggil. */}
          <div className="relative mt-3.5 flex items-center gap-2.5">
            {sayaPemilik ? (
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-white/15 text-white">
                <Ruler size={15} strokeWidth={2.1} />
              </span>
            ) : (
              pedagang && (
                <Image
                  src={pedagang.foto}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-[9px] object-cover"
                />
              )
            )}
            <p className="min-w-0 truncate text-[13px] font-semibold text-white">
              {sayaPemilik ? `${titik.jarak} m dari lokasimu` : pedagang?.nama}
              <span className="ml-2 font-normal text-white/55">
                · Berakhir dalam{" "}
                {sisaWaktu(titik.kedaluwarsa, sekarang).replace(" lagi", "")}
              </span>
            </p>
          </div>
        </div>

        {/* Kemajuan */}
        <div className="bayang-kartu mt-3.5 rounded-[16px] border border-garis bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
              Progress Pesanan
            </p>
            <span className="rounded-[7px] bg-hijau-lembut px-2 py-1 text-[10.5px] font-bold text-hijau">
              {titik.peserta.length}/{titik.target} warga
            </span>
          </div>

          <div className="mt-3">
            <BatangKemajuan
              nilai={titik.peserta.length}
              target={titik.target}
            />
          </div>

          {/* Kalimatnya menyapa pembacanya. */}
          <p className="mt-3 text-[12.5px] leading-snug text-tinta-3">
            {sayaPemilik ? (
              penuh ? (
                <>
                  Target terpenuhi.{" "}
                  <strong className="font-bold text-hijau">
                    {titik.peserta.length} warga
                  </strong>{" "}
                  menunggu di {titik.patokan}.
                </>
              ) : (
                <>
                  Warga masih mengumpulkan, baru{" "}
                  <strong className="font-bold text-hijau">
                    {titik.peserta.length} dari {titik.target}
                  </strong>
                  . Permintaan ini masuk ke berandamu begitu targetnya
                  terpenuhi.
                </>
              )
            ) : penuh ? (
              <>
                Target sudah terpenuhi.{" "}
                <strong className="font-bold text-hijau">
                  {pedagang?.nama}
                </strong>{" "}
                segera menuju titik kumpul.
              </>
            ) : (
              <>
                Masih butuh{" "}
                <strong className="font-bold text-hijau">
                  {kurang} warga lagi
                </strong>{" "}
                untuk memenuhi target
              </>
            )}
          </p>

          <div className="mt-3.5 flex items-center gap-3">
            <TumpukanPeserta
              peserta={titik.peserta}
              target={titik.target}
              kosong
            />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-tinta">
                {titik.peserta.length} bergabung
              </p>
              {!penuh && (
                <p className="text-[11px] text-tinta-4">butuh {kurang} lagi</p>
              )}
            </div>
          </div>
        </div>

        {/* Obrolan warga. */}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setObrolanBuka(true)}
          className="bayang-kartu mt-3 flex items-center gap-3 rounded-[16px] border border-garis bg-white p-3.5 text-left transition-transform active:scale-[0.99]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau">
            <MessagesSquare size={18} strokeWidth={1.9} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold text-tinta">
              Obrolan Warga
            </span>
            <span className="mt-0.5 block text-[11.5px] text-tinta-4">
              {jumlahObrolan > 0
                ? `${jumlahObrolan} pesan · janjian jam berkumpul`
                : "Belum ada pesan · mulai duluan"}
            </span>
          </span>
          {jumlahObrolan > 0 && (
            <span className="grid min-w-[22px] shrink-0 place-items-center rounded-full bg-hijau px-1.5 py-0.5 text-[11px] font-bold text-white">
              {jumlahObrolan}
            </span>
          )}
        </button>

        {titik.catatan && (
          <p className="mt-3 rounded-[14px] border border-garis bg-white px-3.5 py-3 text-[12px] leading-relaxed text-tinta-3">
            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Catatan
            </span>
            {titik.catatan}
          </p>
        )}

        {!sayaPemilik && ikut && !penuh && (
          <p className="mt-3 flex gap-2.5 rounded-[14px] bg-hijau-lembut/70 p-3.5">
            <CheckCircle2 size={15} className="mt-px shrink-0 text-hijau" />
            <span className="text-[11.5px] leading-relaxed text-tinta-3">
              <strong className="block font-bold text-tinta">
                Kamu sudah ikut pesan
              </strong>
              Menunggu warga lain untuk memenuhi target bersama. Kami akan beri
              tahu begitu targetnya terpenuhi.
            </span>
          </p>
        )}

        {habis && !penuh && (
          <p className="mt-3 flex gap-2.5 rounded-[14px] bg-amber/12 p-3.5">
            <TriangleAlert
              size={15}
              className="mt-px shrink-0 text-amber-tua"
            />
            <span className="text-[11.5px] leading-relaxed text-tinta-3">
              <strong className="block font-bold text-tinta">
                Waktu habis
              </strong>
              {sayaPemilik
                ? `Sampai batas waktu cuma ${titik.peserta.length} warga yang bergabung. Permintaan ini ditutup dan tidak perlu didatangi.`
                : "Target tidak terpenuhi sampai batas waktu. Titik kumpul ini akan ditutup."}
            </span>
          </p>
        )}

        {/* Tindakan di kaki layar. */}
        <div className="mt-auto pt-5">
          {sayaPemilik ? (
            beres ? (
              <p className="flex items-center justify-center gap-2 rounded-[14px] bg-hijau-lembut py-3.5 text-[13px] font-semibold text-hijau">
                <CheckCircle2 size={15} />
                Titik kumpul ini sudah selesai
              </p>
            ) : dijemput ? (
              <div className="flex flex-col gap-2.5">
                <Tombol penuh onClick={() => ubahStatus(titik.id, "selesai")}>
                  <PackageCheck size={16} strokeWidth={2.2} />
                  Selesaikan Titik Kumpul
                </Tombol>
                <Tombol
                  rupa="garis"
                  penuh
                  onClick={() => router.push(`/kolab/${titik.id}/rute`)}
                >
                  <Navigation size={16} strokeWidth={2.3} />
                  Buka Rute Lagi
                </Tombol>
              </div>
            ) : habis ? (
              <p className="flex items-center justify-center gap-2 rounded-[14px] bg-tinta-5/12 py-3.5 text-[13px] font-semibold text-tinta-3">
                <Info size={15} />
                Sudah lewat batas waktu
              </p>
            ) : !penuh ? (
              /* Pedagang baru dipanggil setelah warganya terkumpul cukup, jadi yang belum tercapai tidak menawarkan tombol berangkat. */
              <p className="flex items-center justify-center gap-2 rounded-[14px] bg-tinta-5/12 py-3.5 text-[13px] font-semibold text-tinta-3">
                <Info size={15} />
                Menunggu warga terkumpul ({titik.peserta.length}/{titik.target})
              </p>
            ) : (
              <Tombol rupa="amber" penuh onClick={terimaLaluBerangkat}>
                <Navigation size={16} strokeWidth={2.3} />
                Terima &amp; Berangkat
              </Tombol>
            )
          ) : beres ? (
            <p className="flex items-center justify-center gap-2 rounded-[14px] bg-hijau-lembut py-3.5 text-[13px] font-semibold text-hijau">
              <CheckCircle2 size={15} />
              Titik kumpul ini sudah selesai
            </p>
          ) : dijemput ? (
            <div className="flex flex-col gap-2.5">
              <p className="flex items-center justify-center gap-2 rounded-[14px] bg-hijau-lembut py-3.5 text-[13px] font-semibold text-hijau">
                <Navigation size={15} />
                {pedagang?.nama} sedang menuju lokasi
              </p>
              <Tombol
                rupa="garis"
                penuh
                onClick={() => router.push(`/kolab/${titik.id}/rute`)}
              >
                <MapPin size={16} strokeWidth={2.3} />
                Lihat Lokasi Titik Kumpul
              </Tombol>
            </div>
          ) : penuh ? (
            <Tombol
              rupa="amber"
              penuh
              onClick={() => router.push(`/kolab/${titik.id}/rute`)}
            >
              <Navigation size={16} strokeWidth={2.3} />
              Arahkan Saya ke Lokasi Titik Kumpul
            </Tombol>
          ) : habis ? (
            <p className="flex items-center justify-center gap-2 rounded-[14px] bg-tinta-5/12 py-3.5 text-[13px] font-semibold text-tinta-3">
              <Info size={15} />
              Sudah lewat batas waktu
            </p>
          ) : ikut ? (
            <p className="flex items-center justify-center gap-2 rounded-[14px] bg-tinta-5/12 py-3.5 text-[13px] font-semibold text-tinta-3">
              <Info size={15} />
              Menunggu Warga ({titik.peserta.length}/{titik.target})
            </p>
          ) : (
            <Tombol penuh onClick={() => gabung(titik.id, namaSaya)}>
              <Users size={16} strokeWidth={2.2} />
              Ikut Pesan Sekarang
            </Tombol>
          )}
        </div>
      </div>
    </Layar>
  );
}
