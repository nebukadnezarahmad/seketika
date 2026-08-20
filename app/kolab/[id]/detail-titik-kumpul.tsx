"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info, MapPin, Navigation, TriangleAlert, Users } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { BatangKemajuan, TumpukanPeserta } from "@/komponen/kolab/kemajuan";
import { cariPedagang } from "@/lib/data/pedagang";
import { sisaWaktu } from "@/lib/format";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

export function DetailTitikKumpul({ id }: { id: string }) {
  const router = useRouter();
  const titik = useToko((s) => s.titikKumpul.find((t) => t.id === id));
  const gabung = useToko((s) => s.gabungTitikKumpul);
  const namaSaya = useToko((s) => s.profil?.nama) ?? "Anda";
  const sekarang = useSekarang();

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
  /* Sebelum peramban menghidupkan komponennya, waktu belum diketahui.
     Dalam keadaan itu titik kumpul dianggap belum habis supaya peringatan
     tidak berkedip muncul lalu hilang. */
  const habis = sekarang !== null && new Date(titik.kedaluwarsa).getTime() <= sekarang;

  return (
    <Layar nav>
      <Kepala judul="Detail Titik Kumpul" />

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Kartu identitas titik kumpul */}
        <div className="gradasi-kumpul relative overflow-hidden rounded-[18px] p-4">
          <span aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-white/[0.07]" />

          <div className="relative flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-2 text-[19px] font-extrabold text-white">
              <MapPin size={17} strokeWidth={2.2} className="shrink-0 text-white/80" />
              <span className="truncate">{titik.nama}</span>
            </p>
            <span
              className={`flex shrink-0 items-center gap-1.5 rounded-pil px-2.5 py-1 text-[10.5px] font-bold ${
                penuh ? "bg-hijau-neon text-hijau-gelap" : "bg-hijau-neon/90 text-hijau-gelap"
              }`}
            >
              <span aria-hidden className="size-1.5 rounded-pil bg-hijau" />
              {penuh ? "Tercapai" : "Aktif"}
            </span>
          </div>

          <p className="relative mt-1.5 text-[12.5px] text-white/65">{titik.patokan}</p>

          <div className="relative mt-3.5 flex items-center gap-2.5">
            {pedagang && (
              <Image
                src={pedagang.foto}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-[9px] object-cover"
              />
            )}
            <p className="min-w-0 truncate text-[13px] font-semibold text-white">
              {pedagang?.nama}
              <span className="ml-2 font-normal text-white/55">
                · Berakhir dalam {sisaWaktu(titik.kedaluwarsa, sekarang).replace(" lagi", "")}
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
            <BatangKemajuan nilai={titik.peserta.length} target={titik.target} />
          </div>

          <p className="mt-3 text-[12.5px] leading-snug text-tinta-3">
            {penuh ? (
              <>
                Target sudah terpenuhi. <strong className="font-bold text-hijau">{pedagang?.nama}</strong>{" "}
                segera menuju titik kumpul.
              </>
            ) : (
              <>
                Masih butuh{" "}
                <strong className="font-bold text-hijau">{kurang} warga lagi</strong> untuk memenuhi
                target
              </>
            )}
          </p>

          <div className="mt-3.5 flex items-center gap-3">
            <TumpukanPeserta peserta={titik.peserta} target={titik.target} kosong />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-tinta">{titik.peserta.length} bergabung</p>
              {!penuh && <p className="text-[11px] text-tinta-4">butuh {kurang} lagi</p>}
            </div>
          </div>
        </div>

        {titik.catatan && (
          <p className="mt-3 rounded-[14px] border border-garis bg-white px-3.5 py-3 text-[12px] leading-relaxed text-tinta-3">
            <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Catatan
            </span>
            {titik.catatan}
          </p>
        )}

        {ikut && !penuh && (
          <p className="mt-3 flex gap-2.5 rounded-[14px] bg-hijau-lembut/70 p-3.5">
            <CheckCircle2 size={15} className="mt-px shrink-0 text-hijau" />
            <span className="text-[11.5px] leading-relaxed text-tinta-3">
              <strong className="block font-bold text-tinta">Kamu sudah ikut pesan</strong>
              Menunggu warga lain untuk memenuhi target bersama. Kami akan beri tahu begitu
              targetnya terpenuhi.
            </span>
          </p>
        )}

        {habis && !penuh && (
          <p className="mt-3 flex gap-2.5 rounded-[14px] bg-amber/12 p-3.5">
            <TriangleAlert size={15} className="mt-px shrink-0 text-amber-tua" />
            <span className="text-[11.5px] leading-relaxed text-tinta-3">
              <strong className="block font-bold text-tinta">Waktu habis</strong>
              Target tidak terpenuhi sampai batas waktu. Titik kumpul ini akan ditutup.
            </span>
          </p>
        )}

        <div className="mt-auto pt-5">
          {penuh ? (
            <Tombol rupa="amber" penuh onClick={() => router.push(`/kolab/${titik.id}/rute`)}>
              <Navigation size={16} strokeWidth={2.3} />
              Arahkan Saya ke Lokasi Titik Kumpul
            </Tombol>
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
