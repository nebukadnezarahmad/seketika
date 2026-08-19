"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock, MapPin, Plus, Share2 } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { BatangKemajuan, TumpukanPeserta } from "@/komponen/kolab/kemajuan";
import { cariPedagang } from "@/lib/data/pedagang";
import { sisaWaktu } from "@/lib/format";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";
import { salinTeks, tautTitik } from "@/lib/berbagi";

export function PesanKolaborasi() {
  const cari = useSearchParams();
  const slug = cari.get("pedagang") ?? "siomay-pak-agus";
  const pedagang = cariPedagang(slug);

  const titikKumpul = useToko((s) => s.titikKumpul);
  const namaSaya = useToko((s) => s.profil?.nama);
  const sekarang = useSekarang();

  const aktif = titikKumpul.filter((t) => t.status !== "selesai");

  return (
    <Layar nav>
      <Kepala judul="Pesan Kolaborasi" subjudul={pedagang?.nama} />

      <div className="px-4 pb-4 pt-3">
        {/* Ajakan membuat titik kumpul baru */}
        <Link
          href={`/kolab/buat?pedagang=${slug}`}
          className="gradasi-kumpul relative block overflow-hidden rounded-[18px] p-5 transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="absolute -right-6 -top-6 size-28 rounded-full bg-white/[0.07]"
          />
          <span className="relative grid size-10 place-items-center rounded-full bg-white/15 text-white">
            <Plus size={20} strokeWidth={2.2} />
          </span>
          <p className="relative mt-3.5 text-[19px] font-extrabold text-white">
            Buat Titik Kumpul Baru
          </p>
          <p className="relative mt-1.5 max-w-[15rem] text-[12.5px] leading-snug text-white/70">
            Pesan bareng tetangga agar pedagang datang ke lingkunganmu.
          </p>
          <span className="relative mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-hijau-neon">
            Mulai sekarang
            <ArrowRight size={15} strokeWidth={2.6} />
          </span>
        </Link>

        <h2 className="mb-2.5 mt-5 text-[14px] font-bold text-tinta">Titik Kumpul Aktif</h2>

        <ul className="rentet flex flex-col gap-3">
          {aktif.map((t) => {
            const punyaSaya = t.peserta.some((p) => p.id === "saya");
            const kurang = Math.max(0, t.target - t.peserta.length);
            const penuh = kurang === 0;
            const pembuat = t.peserta[0]?.nama ?? "Warga";

            return (
              <li
                key={t.id}
                className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white"
              >
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1.5 text-[15px] font-bold text-tinta">
                      <MapPin size={15} strokeWidth={2.1} className="shrink-0 text-hijau" />
                      <span className="truncate">{t.nama}</span>
                    </p>
                    <span
                      className={`shrink-0 rounded-[7px] px-2 py-1 text-[10px] font-bold ${
                        penuh ? "bg-amber/15 text-amber-tua" : "bg-hijau-lembut text-hijau"
                      }`}
                    >
                      {penuh ? "Target tercapai" : "Aktif"}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-tinta-4">
                    Dibuat oleh {punyaSaya ? "Anda" : pembuat} · {sisaWaktu(t.kedaluwarsa, sekarang)}
                  </p>

                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <p className="text-[12.5px] font-medium text-tinta-2">
                      {t.peserta.length}/{t.target} warga bergabung
                    </p>
                    <p className="shrink-0 text-[11px] text-tinta-4">
                      {penuh ? "Sudah penuh" : `Butuh ${kurang} lagi`}
                    </p>
                  </div>

                  <div className="mt-1.5">
                    <BatangKemajuan nilai={t.peserta.length} target={t.target} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <TumpukanPeserta peserta={t.peserta} target={t.target} />

                    {punyaSaya ? (
                      <span className="flex shrink-0 items-center gap-1.5 rounded-[11px] bg-tinta-5/15 px-3 py-2 text-[12px] font-semibold text-tinta-3">
                        <Clock size={13} strokeWidth={2.2} />
                        Menunggu Warga ({t.peserta.length}/{t.target})
                      </span>
                    ) : (
                      <Link
                        href={`/kolab/${t.id}`}
                        className="flex shrink-0 items-center gap-1.5 rounded-[11px] bg-hijau-lembut px-3 py-2 text-[12px] font-bold text-hijau transition-transform active:scale-95"
                      >
                        Ikut Bergabung
                        <ArrowRight size={13} strokeWidth={2.6} />
                      </Link>
                    )}
                  </div>
                </div>

                {punyaSaya && (
                  <div className="flex items-center gap-2.5 border-t border-garis bg-krem px-3.5 py-2.5">
                    <Share2 size={14} className="shrink-0 text-tinta-4" />
                    <p className="min-w-0 flex-1 text-[11px] leading-snug text-tinta-3">
                      Bagikan link ke tetangga agar kuota cepat terpenuhi.
                    </p>
                    <button
                      type="button"
                      onClick={() => salinTeks(tautTitik(t.id))}
                      className="shrink-0 text-[11.5px] font-bold text-hijau underline underline-offset-2"
                    >
                      Salin link
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {aktif.length === 0 && (
          <p className="rounded-[16px] border border-dashed border-garis bg-white px-4 py-8 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada titik kumpul aktif{namaSaya ? `, ${namaSaya}` : ""}.
            <br />
            Buat yang pertama di lingkunganmu.
          </p>
        )}
      </div>
    </Layar>
  );
}
