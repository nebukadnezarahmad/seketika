"use client";

import * as React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, BookOpen, Camera, Clock, MapPin, RotateCcw, Settings, ShoppingBag, Star, Wallet,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { BarisMenu } from "@/komponen/ui/baris-menu";
import { Kolom, LembarUbah } from "@/komponen/ui/lembar-ubah";
import { SLUG_GEROBAK_SAYA, fotoMenu, gerobakSaya } from "@/lib/data/pedagang";
import { menuBerlaku } from "@/lib/menu";
import { nilaiRataRata } from "@/lib/rekap";
import { useToko } from "@/lib/toko";


export function TokoSaya() {
  const router = useRouter();
  const gerobak = gerobakSaya();
  const profil = useToko((s) => s.profil);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const menuNonaktif = useToko((s) => s.menuNonaktif);
  const menuSaya = useToko((s) => s.menuSaya);
  const riwayat = useToko((s) => s.riwayatPedagang);
  const pesanan = useToko((s) => s.pesanan);
  const penilaian = useToko((s) => s.penilaian);
  const gantiPeran = useToko((s) => s.gantiPeran);
  const setelUlang = useToko((s) => s.setelUlang);

  /* Dua angka ini dulu ditulis langsung sebagai 248 dan 1.2K, padahal
     tidak berasal dari mana-mana. Sejak Buku Kas ada, angka karangan itu
     berdiri tepat di layar yang sama dengan angka yang benar-benar
     dihitung, dan siapa pun yang membandingkan keduanya akan menemukan
     dua kenyataan yang berbeda tentang gerobak yang sama.

     Sekarang keduanya dihitung dari sumber yang sama dengan Buku Kas:
     seluruh pesanan yang pernah selesai, dan berapa nama warga berbeda
     di dalamnya. Angkanya jadi jauh lebih kecil, tapi angka kecil yang
     benar lebih berguna daripada angka besar yang tidak bisa
     dipertanggungjawabkan. */
  const selesai = [...riwayat, ...pesananMasuk].filter((p) => p.status === "selesai");
  const wargaTerlayani = new Set(selesai.map((p) => p.warga)).size;

  /* Bintang yang benar-benar diberikan warga, bukan angka rating pada
     data contoh. Kalau belum ada yang menilai, yang ditulis tanda pisah,
     bukan 0,0: nol terbaca seperti gerobak terburuk padahal yang benar
     adalah belum ada yang menilai. */
  const nilai = nilaiRataRata(pesanan, penilaian, SLUG_GEROBAK_SAYA);
  const daftarMenu = menuBerlaku(menuSaya, gerobak.menu);
  const namaToko = profil?.namaUsaha || gerobak.nama;
  const pemilik = profil?.nama;
  const area = profil?.areaJangkauan || "Bumi Marina Emas";
  const buka2 = profil?.jamBuka || "07.00";
  const tutup2 = profil?.jamTutup || "20.00";

  const [lembar, setLembar] = React.useState<
    "toko" | "area" | "jam" | "galeri" | null
  >(null);
  const perbaruiProfil = useToko((s) => s.perbaruiProfil);

  const [namaUsaha, setNamaUsaha] = React.useState("");
  const [jenisUsaha, setJenisUsaha] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");
  const [isiArea, setIsiArea] = React.useState("");
  const [isiBuka, setIsiBuka] = React.useState("");
  const [isiTutup, setIsiTutup] = React.useState("");

  const bukaLembar = (mana: typeof lembar) => {
    setNamaUsaha(profil?.namaUsaha ?? "");
    setJenisUsaha(profil?.jenisUsaha ?? gerobak.jenis);
    setDeskripsi(profil?.deskripsiUsaha ?? "");
    setIsiArea(area);
    setIsiBuka(buka2);
    setIsiTutup(tutup2);
    setLembar(mana);
  };

  /* Galeri menampilkan foto yang memang sudah dimiliki gerobak ini: foto
     gerobaknya sendiri dan foto tiap menunya. Tidak ada pengunggahan di
     purwarupa ini, dan tombol unggah yang tidak mengunggah apa pun lebih
     buruk daripada galeri yang jujur cuma menampilkan yang ada. */
  const galeri = [gerobak.foto, ...daftarMenu.map((m) => fotoMenu[m.id]).filter(Boolean)];

  return (
    <Layar
      nav
      peran="pedagang"
      lembar={
        <>
          <LembarUbah
            buka={lembar === "toko"}
            tutup={() => setLembar(null)}
            judul="Edit Profil Toko"
            keterangan="Nama toko inilah yang dilihat warga saat mencari gerobakmu."
            simpan={() =>
              perbaruiProfil({
                namaUsaha: namaUsaha.trim(),
                jenisUsaha: jenisUsaha.trim(),
                deskripsiUsaha: deskripsi.trim(),
              })
            }
          >
            <Kolom
              label="Nama toko"
              nilai={namaUsaha}
              ubah={setNamaUsaha}
              contoh={gerobak.nama}
            />
            <Kolom
              label="Jenis dagangan"
              nilai={jenisUsaha}
              ubah={setJenisUsaha}
              contoh="Bakso & Mie"
            />
            <Kolom
              label="Keterangan singkat"
              nilai={deskripsi}
              ubah={setDeskripsi}
              contoh="Bakso sapi asli, keliling tiap sore"
              banyakBaris
            />
          </LembarUbah>

          <LembarUbah
            buka={lembar === "area"}
            tutup={() => setLembar(null)}
            judul="Area Jangkauan"
            keterangan="Kawasan yang sanggup kamu datangi. Warga di luar area masih bisa melihat gerobakmu, tapi tahu jaraknya lebih jauh."
            simpan={() => perbaruiProfil({ areaJangkauan: isiArea.trim() })}
          >
            <Kolom
              label="Kawasan"
              nilai={isiArea}
              ubah={setIsiArea}
              contoh="Bumi Marina Emas"
            />
          </LembarUbah>

          <LembarUbah
            buka={lembar === "jam"}
            tutup={() => setLembar(null)}
            judul="Jam Operasional"
            keterangan="Jam ini keterangan bagi warga. Yang benar-benar menentukan gerobakmu menerima pesanan adalah sakelar buka-tutup di beranda."
            simpan={() =>
              perbaruiProfil({ jamBuka: isiBuka.trim(), jamTutup: isiTutup.trim() })
            }
          >
            <Kolom label="Mulai" nilai={isiBuka} ubah={setIsiBuka} contoh="07.00" />
            <Kolom label="Sampai" nilai={isiTutup} ubah={setIsiTutup} contoh="20.00" />
          </LembarUbah>

          <LembarUbah
            buka={lembar === "galeri"}
            tutup={() => setLembar(null)}
            judul="Foto & Galeri"
            keterangan="Foto gerobak dan tiap menu yang sedang dipakai di aplikasi warga."
          >
            <ul className="grid grid-cols-3 gap-2">
              {galeri.map((src, i) => (
                <li key={src} className="relative aspect-square overflow-hidden rounded-[14px]">
                  <Image
                    src={src}
                    alt={i === 0 ? "Foto gerobak" : `Foto menu ${daftarMenu[i - 1]?.nama ?? ""}`}
                    fill
                    sizes="110px"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
            <p className="text-[11px] leading-relaxed text-tinta-4">
              Mengunggah foto baru belum tersedia pada purwarupa ini.
            </p>
          </LembarUbah>
        </>
      }
    >
      <header className="gradasi-kumpul relative overflow-hidden rounded-b-[24px] px-4 pb-5 pt-3">
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]" />

        <div className="relative flex items-center justify-between">
          <h1 className="text-[19px] font-extrabold text-white">Toko Saya</h1>
          <button
            type="button"
            aria-label="Pengaturan toko"
            aria-haspopup="dialog"
            onClick={() => bukaLembar("toko")}
            className="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
          >
            <Settings size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="relative mt-4 flex items-start gap-3.5">
          <span className="relative shrink-0">
            <Image
              src={gerobak.foto}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-[18px] object-cover ring-2 ring-white/25"
            />
            <BadgeCheck
              size={20}
              className="absolute -bottom-1 -right-1 fill-hijau-neon text-white"
            />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[21px] font-extrabold leading-tight text-white">
              {namaToko}
            </p>
            {/* Nama pemilik hanya disebut kalau memang berbeda dari nama
                tokonya. Pedagang yang mengosongkan nama usaha saat
                mendaftar akan memakai nama pribadinya sebagai nama toko,
                dan tanpa penjagaan ini nama yang sama tercetak dua kali
                bertumpuk di judul dan subjudulnya. */}
            <p className="mt-0.5 truncate text-[12.5px] text-white/65">
              {gerobak.jenis}
              {pemilik && namaToko !== pemilik ? ` · ${pemilik}` : ""}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-pil bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white">
              <BadgeCheck size={13} strokeWidth={2.2} />
              Terverifikasi
            </span>
          </div>
        </div>

        <dl className="relative mt-4 grid grid-cols-3 rounded-[16px] bg-white/10 py-3">
          <div className="border-r border-white/15 text-center">
            <dd className="text-[20px] font-extrabold text-white">{selesai.length}</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Selesai</dt>
          </div>
          <div className="border-r border-white/15 text-center">
            <dd className="text-[20px] font-extrabold text-white">{wargaTerlayani}</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Warga</dt>
          </div>
          <div className="text-center">
            <dd className="flex items-center justify-center gap-1 text-[20px] font-extrabold text-white">
              {nilai ? (
                <>
                  <Star size={15} strokeWidth={2} className="fill-amber text-amber" aria-hidden />
                  {nilai.rata.toLocaleString("id-ID")}
                </>
              ) : (
                "—"
              )}
            </dd>
            <dt className="mt-0.5 text-[11px] text-white/60">
              {nilai ? `${nilai.jumlah} penilaian` : "Belum dinilai"}
            </dt>
          </div>
        </dl>
      </header>

      <div className="px-4 pb-5 pt-4">
        <div className="bayang-kartu flex items-center gap-3 rounded-[16px] border border-garis bg-white p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-hijau-lembut text-hijau">
            <ShoppingBag size={18} strokeWidth={1.9} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold text-tinta">Edit Profil Toko</p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-tinta-4">
              Nama, deskripsi, dan informasi kontak
            </p>
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => bukaLembar("toko")}
            className="shrink-0 rounded-full bg-hijau px-4 py-2 text-[12px] font-bold text-white transition-transform active:scale-95"
          >
            Edit
          </button>
        </div>

        <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Kelola Toko
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={BookOpen}
            nada="hijau"
            judul="Kelola Menu"
            isi={`${daftarMenu.filter((m) => !menuNonaktif.includes(m.id)).length} dari ${daftarMenu.length} menyala`}
            href="/d/menu"
          />
          <BarisMenu
            Ikon={MapPin}
            nada="biru"
            judul="Area Jangkauan"
            isi={area}
            onClick={() => bukaLembar("area")}
          />
          <BarisMenu
            Ikon={Clock}
            nada="amber"
            judul="Jam Operasional"
            isi={`${buka2} - ${tutup2}`}
            onClick={() => bukaLembar("jam")}
          />
          <BarisMenu
            Ikon={Camera}
            nada="ungu"
            judul="Foto & Galeri"
            isi={`${galeri.length} foto dipakai`}
            onClick={() => bukaLembar("galeri")}
            akhir
          />
        </div>

        <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Akun &amp; Analitik
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={Wallet}
            nada="amber"
            judul="Buku Kas"
            isi="Pendapatan, menu terlaris, jam ramai"
            href="/d/rekap"
          />
          <BarisMenu
            Ikon={ShoppingBag}
            nada="hijau"
            judul="Riwayat Pesanan"
            isi={`${pesananMasuk.length} pesanan tercatat`}
            href="/d/pesanan"
          />
          <BarisMenu
            Ikon={ShoppingBag}
            nada="biru"
            judul="Beralih ke Mode Pembeli"
            isi="Lihat aplikasi dari sisi warga"
            onClick={() => {
              gantiPeran("pembeli");
              router.push("/beranda");
            }}
          />
          <BarisMenu
            Ikon={RotateCcw}
            nada="merah"
            judul="Setel Ulang Data"
            isi="Kembalikan ke keadaan contoh"
            onClick={() => {
              setelUlang();
              router.push("/");
            }}
            akhir
          />
        </div>
      </div>
    </Layar>
  );
}
