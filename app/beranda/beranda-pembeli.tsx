"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Map, Receipt, Users, UtensilsCrossed } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { IkonCari, IkonPin } from "@/komponen/ui/ikon";
import { AksiCepat, type Pintasan } from "@/komponen/ui/aksi-cepat";
import { Peta } from "@/komponen/peta/peta";
import { KartuPedagang } from "@/komponen/pedagang/kartu-pedagang";
import { IsiPedagang } from "@/komponen/pedagang/isi-pedagang";
import { daftarPedagang, kategoriPenyaring } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";
import type { Pedagang } from "@/lib/tipe";

/** Harga menu termurah di seluruh gerobak, untuk keping "mulai …". */
const TERMURAH = Math.min(...daftarPedagang.flatMap((p) => p.menu.map((m) => m.harga)));

export function BerandaPembeli() {
  const [saring, setSaring] = React.useState<string>("Dekat Anda");
  /* Pedagang yang lembarnya sedang naik.
     Nilainya ditahan terpisah dari `buka` supaya isi lembar tidak
     berkedip kosong selama animasi turun; yang disetel null hanya
     setelah lembarnya benar-benar tertutup. */
  const [dipilih, setDipilih] = React.useState<Pedagang | null>(null);
  const [lembarBuka, setLembarBuka] = React.useState(false);
  const profil = useToko((s) => s.profil);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const pesanan = useToko((s) => s.pesanan);
  const alamat = profil?.alamat ?? "Bumi Marina Emas Selatan No.12";
  const nama = profil?.nama?.split(" ")[0] ?? "Warga";

  /* Keping pada tiap ubin diambil dari keadaan yang sedang berjalan, jadi
     angkanya ikut berubah begitu pengguna bergabung ke titik kumpul atau
     memesan. Yang tidak punya angka jujur dibiarkan tanpa keping. */
  const pintasan: readonly Pintasan[] = React.useMemo(() => {
    const mengumpulkan = titikKumpul.filter((t) => t.status === "mengumpulkan").length;
    const buka = daftarPedagang.filter((p) => p.buka).length;
    const berjalan = pesanan.filter(
      (p) => p.status === "menunggu" || p.status === "diproses",
    ).length;

    return [
      {
        label: "Titik Kumpul",
        href: "/kolab",
        Ikon: Users,
        warna: "bg-hijau-lembut text-hijau",
        keping: mengumpulkan > 0 ? `${mengumpulkan} aktif` : undefined,
      },
      {
        label: "Peta Gerobak",
        href: "/peta",
        Ikon: Map,
        warna: "bg-biru-lembut text-biru",
        keping: buka > 0 ? `${buka} buka` : undefined,
      },
      {
        label: "Jajanan",
        href: "/hasil",
        Ikon: UtensilsCrossed,
        warna: "bg-amber-lembut text-amber-tua",
        keping: `mulai ${Math.round(TERMURAH / 1000)}rb`,
      },
      {
        label: "Pesanan",
        href: "/pesanan",
        Ikon: Receipt,
        warna: "bg-ungu-lembut text-ungu",
        keping: berjalan > 0 ? `${berjalan} jalan` : undefined,
      },
    ];
  }, [titikKumpul, pesanan]);

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
    <Layar
      nav
      /* Lembar pedagang naik di atas beranda, jadi peta yang sudah
         tergambar tetap terlihat di belakangnya dan tidak perlu digambar
         ulang. Ini yang membedakannya dari berpindah ke halaman pedagang:
         di sana peta kedua dimuat hanya untuk menampilkan kartu sama. */
      lembar={
        <Lembar buka={lembarBuka} tutup={() => setLembarBuka(false)} judul={dipilih?.nama}>
          {dipilih && (
            <div className="px-4 pb-6 pt-1">
              <IsiPedagang pedagang={dipilih} />
            </div>
          )}
        </Lembar>
      }
    >
      {/* Beranda tidak punya judul yang terlihat, tapi tetap butuh titik
          masuk bagi pengguna yang menjelajah lewat daftar heading. */}
      <h1 className="khusus-pembaca-layar">Beranda</h1>

      {/* Bilah atas: kolom cari memanjang di kiri, avatar di kanan.

          Susunan ini menggantikan sapaan bertumpuk yang sempat dipakai.
          Pada aplikasi sejenis, baris teratas dipakai untuk bertindak,
          bukan untuk menyapa: kolom cari adalah unsur paling sering
          disentuh, jadi dialah yang berhak atas baris paling mudah
          dijangkau. Nama pengguna tetap muncul, tapi pindah ke kolom
          lokasi di bawahnya yang memang menerangkan konteks. */}
      <header className="flex items-center gap-2.5 px-4 pb-1 pt-2.5">
        <Link
          href="/cari"
          className="flex h-[46px] min-w-0 flex-1 items-center gap-2.5 rounded-full border border-garis bg-white px-4"
        >
          <IkonCari size={17} className="shrink-0 text-tinta-3" />
          <span className="truncate text-[13.5px] text-tinta-4">Mau jajan apa hari ini?</span>
        </Link>
        <Link
          href="/profil"
          aria-label="Buka profil saya"
          className="grid size-[46px] shrink-0 place-items-center rounded-full border border-garis bg-white text-[15px] font-extrabold text-hijau transition-transform active:scale-90"
        >
          {nama.slice(0, 1).toUpperCase()}
        </Link>
      </header>

      {/* Kolom lokasi. Bukan lagi pintu ke pencarian karena pencarian
          sudah punya kolomnya sendiri di atas; ini murni menerangkan
          "dari mana jarak gerobak dihitung", dan mengantar ke layar yang
          bisa mengubahnya. */}
      <section className="px-4 pb-1 pt-2">
        <Link href="/cari" className="flex items-center gap-2 py-1">
          <IkonPin size={15} className="shrink-0 text-hijau" />
          <span className="min-w-0 flex-1 truncate text-[12px] leading-tight text-tinta-3">
            <span className="font-semibold text-tinta-2">{alamat}</span>
          </span>
          <span aria-hidden className="shrink-0 text-[11px] font-bold text-hijau">
            Ubah
          </span>
        </Link>
      </section>

      <AksiCepat pintasan={pintasan} />

      {/* Spanduk ajakan.

          Tempat yang di aplikasi rujukan diisi iklan, di sini diisi satu
          ajakan yang benar-benar mengarah ke fitur andalan aplikasi ini.
          Isinya tidak menjanjikan diskon atau hadiah yang tidak ada;
          yang dijanjikan cuma apa yang memang terjadi kalau tombolnya
          ditekan, yaitu membuat titik kumpul baru. */}
      <section className="px-4 pt-4">
        <Link
          href="/kolab/buat"
          className="gradasi-kumpul relative flex items-center gap-3 overflow-hidden rounded-[20px] px-4 py-3.5"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-extrabold leading-tight text-white">
              Patungan sama tetangga
            </span>
            <span className="mt-1 block text-[11.5px] leading-snug text-white/80">
              Kumpulin warga di satu titik, gerobak datang sekaligus
            </span>
          </span>
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-hijau"
          >
            <ArrowRight size={17} strokeWidth={2.4} />
          </span>
        </Link>
      </section>

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

      {/* Peta.

          Label "N pedagang aktif" di atasnya menghitung gerobak yang
          benar-benar buka, bukan semua pin yang tergambar. Sebelumnya ia
          memakai jumlah seluruh pedagang yang lolos penyaring, sehingga
          gerobak yang sedang tutup ikut disebut aktif. Selisihnya baru
          ketahuan setelah keping "N buka" muncul di pintasan layanan dan
          kedua angka itu bertengkar di layar yang sama. */}
      <section className="bg-krem px-4">
        <Link href="/peta" className="bayang-peta block overflow-hidden rounded-[24px]">
          <Peta
            tinggi={300}
            jumlahAktif={terlihat.filter((p) => p.buka).length}
            saya={{ x: 50.11, y: 42.72 }}
            tanda={terlihat.map((p) => ({ id: p.id, x: p.posisi.x, y: p.posisi.y }))}
          />
        </Link>
      </section>

      {/* Rekomendasi */}
      <section className="pb-2 pt-[18px]">
        <div className="flex items-center justify-between px-4">
          <div className="min-w-0">
            {/* Judul bagian memakai tinta pekat, bukan hijau merek.
                Kalau judul ikut hijau, warna merek kehilangan artinya
                sebagai penanda "ini bisa ditekan" — dan di layar ini
                justru "Lihat semua" di sebelahnya yang perlu terbaca
                sebagai tautan. */}
            <h2 className="tulisan-judul text-[17px] font-extrabold leading-6 tracking-[-0.2px] text-tinta">
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
              <KartuPedagang
                key={p.id}
                pedagang={p}
                utama={i === 0}
                onPilih={(pd) => {
                  setDipilih(pd);
                  setLembarBuka(true);
                }}
              />
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
