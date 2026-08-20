"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Circle, MapPin, MessageSquare } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { BeriNilai } from "@/komponen/pesanan/beri-nilai";
import { cariPedagang } from "@/lib/data/pedagang";
import { jarakSingkat, rp, totalBaris } from "@/lib/format";
import { useToko } from "@/lib/toko";
import type { StatusPesanan } from "@/lib/tipe";

/** Empat tahap pelacakan seperti pada layar detail di desain. */
const tahap = [
  { label: "Menunggu konfirmasi penjual", jam: "09:41" },
  { label: "Pesanan dikonfirmasi", jam: "09:45 (estimasi)" },
  { label: "Menuju ke lokasi Anda / Siap diambil", jam: "" },
  { label: "Selesai", jam: "" },
];

/** Sejauh mana rantai tahap sudah tercentang untuk tiap status. */
function sampaiTahap(status: StatusPesanan): number {
  if (status === "selesai") return 4;
  if (status === "diproses") return 3;
  if (status === "dibatalkan") return 2;
  return 1;
}

export function DetailPesanan({ id }: { id: string }) {
  const pesanan = useToko((s) => s.pesanan.find((p) => p.id === id));
  const percakapan = useToko((s) => s.percakapan);

  if (!pesanan) {
    return (
      <Layar nav>
        <Kepala judul="Detail Pesanan" />
        <p className="px-6 py-16 text-center text-[13px] text-tinta-4">
          Pesanan ini tidak ditemukan.
        </p>
      </Layar>
    );
  }

  const pedagang = cariPedagang(pesanan.pedagangSlug);
  const batas = sampaiTahap(pesanan.status);
  const total = totalBaris(pesanan.baris);
  const obrolan = percakapan.find((c) => c.pedagangSlug === pesanan.pedagangSlug);

  return (
    <Layar nav>
      <Kepala judul="Detail Pesanan" subjudul={`#${pesanan.id}`} />

      <div className="px-4 pb-4 pt-3">
        {/* Identitas pedagang */}
        <div className="bayang-kartu flex items-center gap-3 rounded-2xl border border-garis bg-white p-3.5">
          {pedagang && (
            <Image
              src={pedagang.foto}
              alt=""
              width={44}
              height={44}
              className="size-11 shrink-0 rounded-[12px] object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold text-hijau">{pedagang?.nama}</p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="rounded-pil bg-hijau-lembut px-2 py-0.5 text-[10.5px] font-semibold text-hijau">
                {pedagang?.jenis}
              </span>
              <span className="flex items-center gap-1 rounded-pil bg-krem px-2 py-0.5 text-[10.5px] font-semibold text-tinta-3">
                <MapPin size={10} strokeWidth={2.4} className="text-merah" />
                {pedagang ? jarakSingkat(pedagang.jarak) : ""}
              </span>
            </p>
          </div>
        </div>

        {/* Penilaian hanya ditawarkan setelah pesanan benar-benar selesai.
            Meminta bintang untuk sesuatu yang belum diterima warga cuma
            menghasilkan angka yang tidak berarti apa-apa. */}
        {pesanan.status === "selesai" && (
          <BeriNilai pesananId={pesanan.id} namaPedagang={pedagang?.nama} />
        )}

        {/* Rincian belanja */}
        <div className="bayang-kartu mt-3 rounded-2xl border border-garis bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Rincian Pesanan
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {pesanan.baris.map((b) => (
              <li key={b.menuId} className="flex items-baseline justify-between gap-3 text-[12.5px]">
                <span className="min-w-0 text-tinta-2">
                  <span className="font-semibold text-tinta">{b.jumlah}×</span> {b.nama}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-tinta">
                  {rp(b.harga * b.jumlah)}
                </span>
              </li>
            ))}
          </ul>

          {/* Penjual bisa dipanggil tanpa memesan apa pun dulu; warga
              memilih dagangannya setelah gerobak sampai. Tanpa baris ini
              layarnya cuma memperlihatkan daftar kosong dan Rp 0, yang
              terbaca seperti pesanan gagal padahal justru begitu memang
              cara kerjanya. */}
          {pesanan.baris.length === 0 && (
            <p className="text-[12.5px] leading-relaxed text-tinta-4">
              Belum ada rincian. Penjual dipanggil lebih dulu, menunya dipilih
              setelah gerobak sampai.
            </p>
          )}

          <p className="mt-3 flex items-baseline justify-between border-t border-garis pt-3">
            <span className="text-[12px] text-tinta-4">
              {pesanan.baris.length === 0 ? "Dihitung di tempat" : "Total · bayar di tempat"}
            </span>
            <span className="text-[15px] font-extrabold tabular-nums text-hijau">
              {pesanan.baris.length === 0 ? "—" : rp(total)}
            </span>
          </p>
        </div>

        {/* Pelacakan */}
        <div className="bayang-kartu mt-3 rounded-2xl border border-garis bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Tracking Pesanan
          </p>

          <ol className="mt-3.5">
            {tahap.map((t, i) => {
              const lewat = i < batas;
              const terakhir = i === tahap.length - 1;
              return (
                <li key={t.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-[18px] shrink-0 place-items-center rounded-full ${
                        lewat ? "bg-hijau text-white" : "border-2 border-garis bg-white"
                      }`}
                    >
                      {lewat ? (
                        <Check size={11} strokeWidth={3.4} />
                      ) : (
                        <Circle size={6} className="fill-tinta-5 text-tinta-5" />
                      )}
                    </span>
                    {!terakhir && (
                      <span
                        aria-hidden
                        className={`w-[2px] flex-1 ${lewat ? "bg-hijau/45" : "bg-garis"}`}
                        style={{ minHeight: 22 }}
                      />
                    )}
                  </div>
                  <div className={terakhir ? "pb-0" : "pb-3"}>
                    <p
                      className={`text-[12.5px] leading-tight ${
                        lewat ? "font-semibold text-tinta" : "text-tinta-4"
                      }`}
                    >
                      {t.label}
                    </p>
                    {t.jam && lewat && (
                      <p className="mt-0.5 text-[10.5px] text-tinta-4">{t.jam}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Bantuan */}
        <div className="bayang-kartu mt-3 flex items-center gap-3 rounded-2xl border border-garis bg-white p-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-tinta">Butuh bantuan?</p>
            <p className="text-[11px] text-tinta-4">Hubungi penjual langsung</p>
          </div>
          <Link
            href={obrolan ? `/chat/${obrolan.id}` : "/chat"}
            className="flex shrink-0 items-center gap-1.5 rounded-pil border border-hijau px-3.5 py-2 text-[12px] font-bold text-hijau transition-transform active:scale-95"
          >
            <MessageSquare size={13} strokeWidth={2.2} />
            Chat Penjual
          </Link>
        </div>
      </div>
    </Layar>
  );
}
