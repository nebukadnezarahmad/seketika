"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { fotoMenu } from "@/lib/data/pedagang";
import { jarakSingkat, rp, totalBaris } from "@/lib/format";
import { useToko } from "@/lib/toko";
import type { Pedagang } from "@/lib/tipe";

export function DaftarMenu({ pedagang }: { pedagang: Pedagang }) {
  const router = useRouter();
  const keranjang = useToko((s) => s.keranjang);
  const ubahJumlah = useToko((s) => s.ubahJumlah);
  const buatPesanan = useToko((s) => s.buatPesanan);
  const alamat = useToko((s) => s.profil?.alamat) ?? "Bumi Marina Emas Selatan No.12";

  /* Keranjang milik pedagang lain tidak boleh ikut terhitung di layar ini. */
  const baris = keranjang.pedagangSlug === pedagang.slug ? keranjang.baris : [];
  const total = totalBaris(baris);
  const butir = baris.reduce((n, b) => n + b.jumlah, 0);

  const jumlahDari = (menuId: string) => baris.find((b) => b.menuId === menuId)?.jumlah ?? 0;

  return (
    <Layar nav>
      <Kepala
        judul={pedagang.nama}
        subjudul={`${jarakSingkat(pedagang.jarak)} · ${pedagang.jenis}`}
      />

      <div className="px-4 pb-4 pt-3">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Menu
        </p>

        <ul className="rentet flex flex-col gap-2.5">
          {pedagang.menu.map((m) => {
            const n = jumlahDari(m.id);
            return (
              <li
                key={m.id}
                className="bayang-kartu flex gap-3 overflow-hidden rounded-[20px] border border-garis bg-white"
              >
                <Image
                  src={fotoMenu[m.id]}
                  alt={m.nama}
                  width={88}
                  height={88}
                  className="size-[88px] shrink-0 object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-center py-2.5 pr-2.5">
                  <p className="text-[14px] font-bold leading-tight text-tinta">{m.nama}</p>
                  <p className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-tinta-4">
                    {m.deskripsi}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[14px] font-extrabold text-hijau">{rp(m.harga)}</span>

                    {n === 0 ? (
                      <button
                        type="button"
                        onClick={() =>
                          ubahJumlah(pedagang.slug, { menuId: m.id, nama: m.nama, harga: m.harga }, 1)
                        }
                        className="flex shrink-0 items-center gap-1 rounded-full bg-hijau-lembut px-2.5 py-1.5 text-[11.5px] font-bold text-hijau transition-transform active:scale-95"
                      >
                        <Plus size={13} strokeWidth={2.6} />
                        Tambah
                      </button>
                    ) : (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-hijau-lembut p-1">
                        <button
                          type="button"
                          aria-label={`Kurangi ${m.nama}`}
                          onClick={() =>
                            ubahJumlah(pedagang.slug, { menuId: m.id, nama: m.nama, harga: m.harga }, -1)
                          }
                          className="grid size-6 place-items-center rounded-full text-hijau transition-transform active:scale-90"
                        >
                          <Minus size={13} strokeWidth={2.6} />
                        </button>
                        <span className="min-w-5 text-center text-[12px] font-bold tabular-nums text-hijau">
                          {n}
                        </span>
                        <button
                          type="button"
                          aria-label={`Tambah ${m.nama}`}
                          onClick={() =>
                            ubahJumlah(pedagang.slug, { menuId: m.id, nama: m.nama, harga: m.harga }, 1)
                          }
                          className="grid size-6 place-items-center rounded-full bg-hijau text-white transition-transform active:scale-90"
                        >
                          <Plus size={13} strokeWidth={2.6} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bilah pemesanan hanya muncul setelah ada yang dipilih, jadi ia
          tidak menutupi daftar saat pengguna masih menimbang-nimbang. */}
      {butir > 0 && (
        <div className="sticky bottom-0 z-20 border-t border-garis bg-krem/95 px-4 py-3 backdrop-blur-sm">
          <Tombol
            penuh
            onClick={() => {
              const id = buatPesanan(alamat);
              router.push(`/pesanan/${id}`);
            }}
          >
            Pesan {butir} item · {rp(total)}
          </Tombol>
        </div>
      )}
    </Layar>
  );
}
