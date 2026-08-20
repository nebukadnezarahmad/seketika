"use client";

import Link from "next/link";
import { Lock, Minus, Plus } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Gambar } from "@/komponen/ui/gambar";
import { TombolTaut } from "@/komponen/ui/tombol";
import { fotoMenu, gerobakSaya } from "@/lib/data/pedagang";
import { fotoDariMenu, menuBerlaku } from "@/lib/menu";
import { useToko } from "@/lib/toko";

/** Di bawah angka ini menunya dianggap hampir habis. */
const AMBANG_MENIPIS = 5;

/**
 * Catatan sisa stok per menu, salah satu isi langganan berbayar.
 *
 * Angkanya diketuk naik-turun, bukan diketik. Pedagang mencatat ini sambil
 * berdiri di samping gerobak, sering dengan satu tangan; papan ketik
 * angka yang menutup separuh layar untuk mengubah 12 jadi 11 lebih lambat
 * daripada satu ketukan.
 *
 * Menu yang stoknya habis tidak dimatikan otomatis. Mematikannya sendiri
 * berarti aplikasi mengambil keputusan dagang atas nama pedagang,
 * padahal ia mungkin sedang dalam perjalanan mengambil bahan tambahan.
 * Yang dilakukan cuma memberitahu, dan tombol mematikannya tetap ada di
 * layar Kelola Menu.
 */
export function CatatanStok() {
  const gerobak = gerobakSaya();
  const menuSaya = useToko((s) => s.menuSaya);
  const stok = useToko((s) => s.stok);
  const aturStok = useToko((s) => s.aturStok);
  const fotoUnggahan = useToko((s) => s.fotoMenuSaya);
  const pro = useToko((s) => s.pro);

  const daftar = menuBerlaku(menuSaya, gerobak.menu);
  const habis = daftar.filter((m) => (stok[m.id] ?? 0) === 0).length;

  if (!pro) {
    return (
      <Layar nav peran="pedagang">
        <Kepala judul="Catatan Stok" />
        <div className="px-4 pt-6">
          <div className="rounded-[20px] border border-dashed border-garis bg-white px-5 py-10 text-center">
            <Lock size={24} className="mx-auto text-tinta-5" aria-hidden />
            <p className="mt-3 text-[14px] font-bold text-tinta">Fitur langganan</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-tinta-4">
              Catatan stok termasuk dalam SEKETIKA Pro. Aktifkan dulu dari
              Buku Kas untuk memakainya.
            </p>
            <TombolTaut href="/d/rekap" ukur="md" className="mt-4">
              Buka Buku Kas
            </TombolTaut>
          </div>
        </div>
      </Layar>
    );
  }

  return (
    <Layar nav peran="pedagang">
      <Kepala
        judul="Catatan Stok"
        subjudul={habis > 0 ? `${habis} menu tercatat habis` : "Semua menu masih ada"}
      />

      <div className="px-4 pb-6 pt-3">
        <p className="rounded-[16px] border border-garis bg-white px-3.5 py-3 text-[12px] leading-relaxed text-tinta-3">
          Catat sisa porsi tiap kali berangkat. Menu yang habis tidak
          dimatikan sendiri; kamu yang memutuskan lewat{" "}
          <Link href="/d/menu" className="font-bold text-hijau underline underline-offset-2">
            Kelola Menu
          </Link>
          .
        </p>

        <ul className="mt-3 flex flex-col gap-2.5">
          {daftar.map((m) => {
            const sisa = stok[m.id] ?? 0;
            const menipis = sisa > 0 && sisa <= AMBANG_MENIPIS;
            return (
              <li
                key={m.id}
                className="bayang-kartu flex items-center gap-3 rounded-[20px] border border-garis bg-white p-2.5"
              >
                <Gambar
                  src={fotoDariMenu(m.id, fotoUnggahan, fotoMenu)}
                  alt=""
                  lebar={52}
                  tinggi={52}
                  className="shrink-0 rounded-[13px] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-tinta">{m.nama}</p>
                  {/* Keadaan stok tidak hanya dibedakan lewat warna; kata
                      "Habis" dan "tinggal sedikit" ikut ditulis supaya
                      terbaca oleh siapa pun. */}
                  <p
                    className={`mt-0.5 text-[11.5px] font-semibold ${
                      sisa === 0 ? "text-merah" : menipis ? "text-amber-tua" : "text-tinta-4"
                    }`}
                  >
                    {sisa === 0
                      ? "Habis"
                      : menipis
                        ? `Tinggal sedikit · ${sisa} porsi`
                        : `${sisa} porsi tersisa`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full bg-krem p-1">
                  <button
                    type="button"
                    aria-label={`Kurangi stok ${m.nama}`}
                    onClick={() => aturStok(m.id, sisa - 1)}
                    disabled={sisa === 0}
                    className="grid size-8 place-items-center rounded-full text-tinta-2 transition-transform active:scale-90 disabled:text-tinta-5"
                  >
                    <Minus size={15} strokeWidth={2.6} />
                  </button>
                  <span className="min-w-7 text-center text-[14px] font-extrabold tabular-nums text-tinta">
                    {sisa}
                  </span>
                  <button
                    type="button"
                    aria-label={`Tambah stok ${m.nama}`}
                    onClick={() => aturStok(m.id, sisa + 1)}
                    className="grid size-8 place-items-center rounded-full bg-hijau text-white transition-transform active:scale-90"
                  >
                    <Plus size={15} strokeWidth={2.6} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {daftar.length === 0 && (
          <p className="mt-3 rounded-[20px] border border-dashed border-garis bg-white px-4 py-10 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada menu untuk dicatat stoknya.
          </p>
        )}
      </div>
    </Layar>
  );
}
