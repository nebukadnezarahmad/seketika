"use client";

import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { fotoMenu, gerobakSaya } from "@/lib/data/pedagang";
import { rp } from "@/lib/format";
import { useToko } from "@/lib/toko";

/**
 * Kelola menu dari sisi pedagang.
 *
 * Sebelum layar ini ada, tautan "Kelola Menu" di halaman toko mengarah ke
 * daftar menu milik pembeli. Setelah daftar itu berubah jadi layar
 * memanggil penjual, pedagang yang menekannya mendarat di tombol untuk
 * memanggil gerobaknya sendiri.
 *
 * Yang bisa diubah di sini baru satu hal: menyalakan atau mematikan menu.
 * Itu keputusan yang paling sering diambil pedagang keliling dalam sehari
 * — bahan habis, hari ini tidak jualan yang itu — dan cukup untuk membuat
 * daftar menu berhenti jadi angka mati. Mengubah nama dan harga belum
 * dibuka karena harga dipakai riwayat pesanan yang sudah terjadi, dan
 * mengubahnya di tempat akan menulis ulang masa lalu.
 */
export function KelolaMenu() {
  const gerobak = gerobakSaya();
  const nonaktif = useToko((s) => s.menuNonaktif);
  const ubahAktifMenu = useToko((s) => s.ubahAktifMenu);

  const jumlahAktif = gerobak.menu.filter((m) => !nonaktif.includes(m.id)).length;

  return (
    <Layar nav peran="pedagang">
      <Kepala
        judul="Kelola Menu"
        subjudul={`${jumlahAktif} dari ${gerobak.menu.length} menu menyala`}
      />

      <div className="px-4 pb-6 pt-3">
        <p className="rounded-[16px] border border-garis bg-white px-3.5 py-3 text-[12px] leading-relaxed text-tinta-3">
          Menu yang dimatikan tidak muncul di aplikasi warga. Pakai ini kalau
          bahannya habis, lalu nyalakan lagi besok.
        </p>

        <ul className="mt-3 flex flex-col gap-2.5">
          {gerobak.menu.map((m) => {
            const aktif = !nonaktif.includes(m.id);
            return (
              <li
                key={m.id}
                className={`bayang-kartu flex items-center gap-3 rounded-[20px] border border-garis bg-white p-2.5 ${
                  aktif ? "" : "opacity-70"
                }`}
              >
                <Image
                  src={fotoMenu[m.id]}
                  alt=""
                  width={64}
                  height={64}
                  className={`size-16 shrink-0 rounded-[14px] object-cover ${
                    aktif ? "" : "grayscale"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-tinta">{m.nama}</p>
                  <p className="mt-0.5 text-[13px] font-extrabold text-hijau">{rp(m.harga)}</p>
                  <p className="mt-0.5 text-[11px] text-tinta-4">
                    {aktif ? "Tampil di aplikasi warga" : "Disembunyikan"}
                  </p>
                </div>

                {/* Sakelar berupa input sungguhan yang disembunyikan dari
                    mata dan dibungkus label. Sakelar yang dibuat dari div
                    tidak bisa dicapai papan ketik dan tidak menyuarakan
                    keadaannya ke pembaca layar. */}
                <label className="relative shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(e) => ubahAktifMenu(m.id, e.target.checked)}
                    className="peer khusus-pembaca-layar"
                  />
                  <span className="khusus-pembaca-layar">Tampilkan {m.nama}</span>
                  <span
                    aria-hidden
                    className="block h-7 w-[46px] rounded-pil bg-tinta-5/45 transition-colors peer-checked:bg-hijau peer-focus-visible:ring-2 peer-focus-visible:ring-hijau/40 peer-focus-visible:ring-offset-2"
                  />
                  <span
                    aria-hidden
                    className="absolute left-1 top-1 grid size-5 place-items-center rounded-full bg-white text-tinta-3 shadow-sm transition-transform peer-checked:translate-x-[18px] peer-checked:text-hijau"
                  >
                    {aktif ? <Eye size={11} strokeWidth={2.4} /> : <EyeOff size={11} strokeWidth={2.4} />}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {jumlahAktif === 0 && (
          <p className="mt-3 rounded-[16px] border border-dashed border-merah/40 bg-merah-lembut px-4 py-4 text-center text-[12px] leading-relaxed text-merah">
            Semua menu dimatikan. Warga tidak akan melihat satu pun dagangan
            saat membuka gerobakmu.
          </p>
        )}
      </div>
    </Layar>
  );
}
