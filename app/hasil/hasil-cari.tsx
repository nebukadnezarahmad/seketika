"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { IkonBintang } from "@/komponen/ui/ikon";
import { daftarPedagang } from "@/lib/data/pedagang";
import { jarakSingkat, rp } from "@/lib/format";
import type { Menu, Pedagang } from "@/lib/tipe";

/** Menguraikan "10000-20000" atau "20000-" menjadi batas bawah dan atas. */
function rentang(nilai: string | null): [number, number] {
  if (!nilai) return [0, Infinity];
  const [bawah, atas] = nilai.split("-");
  return [Number(bawah) || 0, atas ? Number(atas) : Infinity];
}

export function HasilCari() {
  const cari = useSearchParams();
  const kata = (cari.get("q") ?? "").trim().toLowerCase();
  const [min, maks] = rentang(cari.get("budget"));

  /* Pencarian menjangkau nama pedagang sekaligus nama menunya, karena
     warga lebih sering mencari "bakso" daripada nama gerobaknya. */
  const hasil: { pedagang: Pedagang; menu: Menu[] }[] = daftarPedagang
    .map((p) => {
      const cocokNama = !kata || p.nama.toLowerCase().includes(kata) || p.jenis.toLowerCase().includes(kata);
      const menu = p.menu.filter((m) => {
        const cocokKata = !kata || cocokNama || m.nama.toLowerCase().includes(kata);
        return cocokKata && m.harga >= min && m.harga <= maks;
      });
      return { pedagang: p, menu };
    })
    .filter((r) => r.menu.length > 0);

  return (
    <Layar nav>
      <Kepala
        judul="Hasil Pencarian"
        subjudul={kata ? `"${kata}"` : "Semua pedagang"}
      />

      <div className="px-4 pb-4 pt-3">
        {hasil.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-hijau-lembut text-hijau">
              <SearchX size={26} strokeWidth={1.9} />
            </span>
            <p className="mt-4 text-[15px] font-bold text-tinta">Tidak ada yang cocok</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-tinta-4">
              Coba kata lain, atau longgarkan estimasi harganya.
            </p>
            <Link
              href="/cari"
              className="mt-5 rounded-[12px] bg-hijau-lembut px-4 py-2.5 text-[12.5px] font-bold text-hijau"
            >
              Ubah pencarian
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {hasil.map(({ pedagang, menu }) => (
              <li
                key={pedagang.id}
                className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white"
              >
                <Link
                  href={`/pedagang/${pedagang.slug}/menu`}
                  className="flex items-center gap-3 p-3.5"
                >
                  <Image
                    src={pedagang.foto}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-[12px] object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-bold text-tinta">
                      {pedagang.nama}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-tinta-4">
                      <span className="flex items-center gap-1">
                        <IkonBintang size={10} />
                        {pedagang.rating.toFixed(1)}
                      </span>
                      · {jarakSingkat(pedagang.jarak)} · {pedagang.jenis}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-[7px] px-2 py-1 text-[10px] font-bold ${
                      pedagang.buka ? "bg-hijau-lembut text-hijau" : "bg-tinta-5/20 text-tinta-3"
                    }`}
                  >
                    {pedagang.buka ? "BUKA" : "TUTUP"}
                  </span>
                </Link>

                <ul className="border-t border-garis bg-krem px-3.5 py-2.5">
                  {menu.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-baseline justify-between gap-3 py-1 text-[12px]"
                    >
                      <span className="min-w-0 truncate text-tinta-2">{m.nama}</span>
                      <span className="shrink-0 font-bold tabular-nums text-hijau">
                        {rp(m.harga)}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layar>
  );
}
