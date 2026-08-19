"use client";

import * as React from "react";
import Link from "next/link";
import { Map, Receipt, Users, UtensilsCrossed } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { IkonCari, IkonPin } from "@/komponen/ui/ikon";
import { AksiCepat, type Pintasan } from "@/komponen/ui/aksi-cepat";
import { Peta } from "@/komponen/peta/peta";
import { KartuPedagang } from "@/komponen/pedagang/kartu-pedagang";
import { daftarPedagang, kategoriPenyaring } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";

/* Empat jalur yang paling sering dituju warga. Semuanya rute yang memang
   sudah ada; tidak ada pintasan ke halaman yang belum dibangun. */
const PINTASAN: readonly Pintasan[] = [
  { label: "Titik Kumpul", href: "/kolab", Ikon: Users, warna: "bg-hijau-lembut text-hijau" },
  {
    label: "Peta Gerobak",
    href: "/peta",
    Ikon: Map,
    warna: "bg-biru-lembut text-biru",
  },
  {
    label: "Jajanan",
    href: "/hasil",
    Ikon: UtensilsCrossed,
    warna: "bg-amber-lembut text-amber-tua",
  },
  { label: "Pesanan", href: "/pesanan", Ikon: Receipt, warna: "bg-ungu-lembut text-ungu" },
];

export function BerandaPembeli() {
  const [saring, setSaring] = React.useState<string>("Dekat Anda");
  const profil = useToko((s) => s.profil);
  const alamat = profil?.alamat ?? "Bumi Marina Emas Selatan No.12";
  const nama = profil?.nama?.split(" ")[0] ?? "Warga";

  /* "Dekat Anda" bukan kategori, melainkan keadaan tanpa penyaringan.
     Sisanya dicocokkan pada kategori pedagang. */
  const terlihat = React.useMemo(
    () =>
      saring === "Dekat Anda"
        ? daftarPedagang
        : daftarPedagang.filter((p) => p.kategori === saring),
    [saring],
  );

  return (
    <Layar nav>
      {/* Beranda tidak punya judul yang terlihat, tapi tetap butuh titik
          masuk bagi pengguna yang menjelajah lewat daftar heading. */}
      <h1 className="khusus-pembaca-layar">Beranda</h1>

      {/* Sapaan. Sisi pedagang sudah punya kepala bernama sejak awal;
          sisi warga langsung menjatuhkan pengguna ke kolom lokasi tanpa
          menyebut siapa yang sedang masuk. Avatarnya menuju profil, bukan
          tombol mati: setiap sasaran ketuk di sini harus punya tujuan. */}
      <header className="flex items-center gap-3 px-4 pb-1 pt-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] leading-tight text-tinta-4">Selamat datang,</p>
          <p className="tulisan-judul truncate text-[17px] font-bold leading-tight text-hijau">
            {nama}
          </p>
        </div>
        <Link
          href="/profil"
          aria-label="Buka profil saya"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[14px] font-extrabold text-hijau transition-transform active:scale-90"
        >
          {nama.slice(0, 1).toUpperCase()}
        </Link>
      </header>

      {/* Kolom lokasi, sekaligus pintu ke pencarian. */}
      <section className="bg-krem px-4 pb-2.5 pt-2">
        <Link
          href="/cari"
          className="bayang-kendali flex h-[50px] items-center gap-2.5 rounded-[20px] border border-garis bg-white px-[15px]"
        >
          <IkonPin size={18} className="shrink-0 text-hijau" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-medium leading-3 text-tinta-4">Lokasi Anda</span>
            <span className="mt-0.5 block truncate text-[13px] font-semibold leading-[15.6px] text-tinta-2">
              {alamat}
            </span>
          </span>
          <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-hijau-lembut text-hijau">
            <IkonCari size={16} />
          </span>
        </Link>
      </section>

      <AksiCepat pintasan={PINTASAN} />

      {/* Penyaring kategori. Berada tepat di atas peta karena yang
          disaringnya memang peta dan daftar rekomendasi di bawahnya,
          bukan pintasan layanan di atasnya. */}
      <section className="bg-krem px-4 pb-2.5 pt-3.5">
        <div className="rel-gulir flex gap-[7px] pb-0.5">
          {kategoriPenyaring.map((k) => {
            const on = saring === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setSaring(k)}
                aria-pressed={on}
                className={`flex h-9 shrink-0 items-center gap-[5px] rounded-pil border px-[15px] text-[12px] transition-colors ${
                  on
                    ? "bayang-pil-aktif border-hijau bg-hijau font-bold text-white"
                    : "border-garis-pil bg-white font-medium text-tinta-3"
                }`}
              >
                {on && <span aria-hidden className="size-[5px] rounded-pil bg-white/80" />}
                {k}
              </button>
            );
          })}
        </div>
      </section>

      {/* Peta */}
      <section className="bg-krem px-4">
        <Link href="/peta" className="bayang-peta block overflow-hidden rounded-[24px]">
          <Peta
            tinggi={300}
            jumlahAktif={terlihat.length}
            saya={{ x: 50.11, y: 42.72 }}
            tanda={terlihat.map((p) => ({ id: p.id, x: p.posisi.x, y: p.posisi.y }))}
          />
        </Link>
      </section>

      {/* Rekomendasi */}
      <section className="pb-2 pt-[18px]">
        <div className="flex items-center justify-between px-4">
          <div className="min-w-0">
            <h2 className="tulisan-judul text-[16px] font-extrabold leading-6 tracking-[-0.16px] text-hijau">
              Rekomendasi Terdekat
            </h2>
            <p className="mt-0.5 text-[12px] leading-[18px] text-tinta-4">
              Berdasarkan lokasi kamu sekarang
            </p>
          </div>
          <Link
            href="/peta"
            className="shrink-0 text-[12px] font-semibold leading-[18px] text-hijau-terang"
          >
            Lihat semua
          </Link>
        </div>

        {terlihat.length > 0 ? (
          <div className="rel-gulir rentet mt-3 flex gap-3 px-4 pb-1">
            {terlihat.map((p, i) => (
              <KartuPedagang key={p.id} pedagang={p} utama={i === 0} />
            ))}
          </div>
        ) : (
          <p className="mx-4 mt-3 rounded-[20px] border border-dashed border-garis bg-white px-4 py-8 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada pedagang {saring.toLowerCase()} di sekitarmu.
            <br />
            Coba pilih kategori lain.
          </p>
        )}
      </section>
    </Layar>
  );
}
