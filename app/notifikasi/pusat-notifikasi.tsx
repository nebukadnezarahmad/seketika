"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  MapPin,
  Receipt,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { SLUG_GEROBAK_SAYA } from "@/lib/data/pedagang";
import { pemberitahuan, type Nada } from "@/lib/notifikasi";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

const warna: Record<Nada, string> = {
  hijau: "bg-hijau-lembut text-hijau",
  biru: "bg-biru-lembut text-biru",
  amber: "bg-amber-lembut text-amber-tua",
  merah: "bg-merah-lembut text-merah",
  ungu: "bg-ungu-lembut text-ungu",
};

const ikon: Record<Nada, typeof Bell> = {
  hijau: Receipt,
  biru: Receipt,
  amber: Receipt,
  merah: TriangleAlert,
  ungu: Users,
};

export function PusatNotifikasi() {
  const profil = useToko((s) => s.profil);
  const pesanan = useToko((s) => s.pesanan);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const dibaca = useToko((s) => s.notifikasiDibaca);
  const tandai = useToko((s) => s.tandaiNotifikasiDibaca);
  const sekarang = useSekarang();

  const peran = profil?.peran ?? "pembeli";
  const daftar = React.useMemo(
    () =>
      pemberitahuan(
        peran,
        { pesanan, pesananMasuk, titikKumpul, slugGerobak: SLUG_GEROBAK_SAYA },
        sekarang,
      ),
    [peran, pesanan, pesananMasuk, titikKumpul, sekarang],
  );

  /* Membuka layarnya berarti membacanya. */
  const belum = daftar.filter((n) => !dibaca.includes(n.id)).map((n) => n.id);
  const kunci = daftar.map((n) => n.id).join("|");
  React.useEffect(() => {
    const semua = kunci ? kunci.split("|") : [];
    if (semua.length > 0) tandai(semua);
  }, [kunci, tandai]);

  return (
    <Layar nav peran={peran}>
      <Kepala
        judul="Notifikasi"
        subjudul={
          daftar.length > 0 ? `${daftar.length} pemberitahuan` : undefined
        }
      />

      <div className="px-4 pb-6 pt-3">
        <ul className="rentet flex flex-col gap-2.5">
          {daftar.map((n) => {
            const Ikon = ikon[n.nada];
            const baru = belum.includes(n.id);
            return (
              <li key={n.id}>
                <Link
                  href={n.href}
                  className="bayang-kartu flex items-start gap-3 rounded-[18px] border border-garis bg-white p-3.5 transition-transform active:scale-[0.99]"
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-[12px] ${warna[n.nada]}`}
                  >
                    <Ikon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 truncate text-[13.5px] font-bold text-tinta">
                        {n.judul}
                      </span>
                      {baru && (
                        <span className="shrink-0 rounded-pil bg-merah px-1.5 py-0.5 text-[9px] font-bold text-white">
                          BARU
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-tinta-4">
                      {n.isi}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 text-tinta-5"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {daftar.length === 0 && (
          <p className="rounded-[20px] border border-dashed border-garis bg-white px-4 py-12 text-center text-[12.5px] leading-relaxed text-tinta-4">
            <MapPin
              size={22}
              className="mx-auto mb-2 text-tinta-5"
              aria-hidden
            />
            Belum ada pemberitahuan.
            <br />
            Kabar pesanan dan titik kumpul akan muncul di sini.
          </p>
        )}
      </div>
    </Layar>
  );
}
