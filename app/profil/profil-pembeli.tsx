"use client";

import * as React from "react";

import { useRouter } from "next/navigation";
import {
  Bell, CircleHelp, Info, MapPin, RotateCcw, ShieldCheck, Store, History,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kolom, LembarUbah } from "@/komponen/ui/lembar-ubah";
import { BarisMenu } from "@/komponen/ui/baris-menu";
import { bersihkanSalinan, muatUlangKeAwal } from "@/lib/setel-ulang";
import { useToko } from "@/lib/toko";

export function ProfilPembeli() {
  const router = useRouter();
  const profil = useToko((s) => s.profil);
  const pesanan = useToko((s) => s.pesanan);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const gantiPeran = useToko((s) => s.gantiPeran);
  const setelUlang = useToko((s) => s.setelUlang);

  const kolaborasi = titikKumpul.filter((t) => t.peserta.some((p) => p.id === "saya")).length;

  /* Satu keadaan untuk seluruh lembar, bukan satu penanda buka-tutup per
     baris menu. Dengan satu keadaan, hanya satu lembar yang mungkin
     terbuka pada satu waktu, dan itu memang satu-satunya keadaan yang
     masuk akal. */
  const [lembar, setLembar] = React.useState<
    "diri" | "alamat" | "bantuan" | "tentang" | null
  >(null);
  const perbaruiProfil = useToko((s) => s.perbaruiProfil);

  const [nama, setNama] = React.useState("");
  const [telepon, setTelepon] = React.useState("");
  const [alamat, setAlamat] = React.useState("");
  const [patokan, setPatokan] = React.useState("");

  const buka = (mana: typeof lembar) => {
    setNama(profil?.nama ?? "");
    setTelepon(profil?.telepon ?? "");
    setAlamat(profil?.alamat ?? "");
    setPatokan(profil?.patokan ?? "");
    setLembar(mana);
  };

  return (
    <Layar
      nav
      latar="bg-krem"
      lembar={
        <>
          <LembarUbah
            buka={lembar === "diri"}
            tutup={() => setLembar(null)}
            judul="Ubah Data Diri"
            keterangan="Nama dipakai saat kamu bergabung ke titik kumpul, jadi tetangga tahu siapa yang ikut."
            simpan={() => {
              if (!nama.trim()) return false;
              perbaruiProfil({ nama: nama.trim(), telepon: telepon.trim() });
            }}
          >
            <Kolom label="Nama lengkap" nilai={nama} ubah={setNama} contoh="Dewi Anggraini" />
            <Kolom
              label="Nomor telepon"
              nilai={telepon}
              ubah={setTelepon}
              contoh="0812-3456-7890"
              mode="tel"
            />
          </LembarUbah>

          <LembarUbah
            buka={lembar === "alamat"}
            tutup={() => setLembar(null)}
            judul="Alamat Tersimpan"
            keterangan="Ke sinilah pedagang menuju saat kamu memanggilnya. Patokan membantu gerobak menemukan rumahmu."
            simpan={() => perbaruiProfil({ alamat: alamat.trim(), patokan: patokan.trim() })}
          >
            <Kolom
              label="Alamat"
              nilai={alamat}
              ubah={setAlamat}
              contoh="Bumi Marina Emas Selatan No.12"
            />
            <Kolom
              label="Patokan"
              nilai={patokan}
              ubah={setPatokan}
              contoh="Depan pos ronda, pagar hijau"
            />
          </LembarUbah>

          <LembarUbah
            buka={lembar === "bantuan"}
            tutup={() => setLembar(null)}
            judul="Pusat Bantuan Tetangga"
          >
            <ul className="flex flex-col gap-2.5">
              {[
                {
                  t: "Pedagang tidak kunjung datang",
                  i: "Buka rincian pesanan lalu ketuk Chat Penjual. Gerobak keliling kadang tertahan di gang lain.",
                },
                {
                  t: "Titik kumpul saya hangus",
                  i: "Titik kumpul berhenti menerima warga setelah lewat tenggatnya. Buat yang baru, ajak tetangga lewat tautan undangan.",
                },
                {
                  t: "Kenapa tidak ada pembayaran di aplikasi?",
                  i: "Semua transaksi dibayar tunai di tempat saat gerobak sampai. SEKETIKA hanya mempertemukan, tidak memegang uang.",
                },
                {
                  t: "Data saya tersimpan di mana?",
                  i: "Seluruhnya di peramban perangkat ini. Menekan Setel Ulang Data menghapusnya sampai bersih.",
                },
              ].map((f) => (
                <li key={f.t} className="rounded-[14px] border border-garis bg-white p-3.5">
                  <p className="text-[12.5px] font-bold text-tinta">{f.t}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-tinta-4">{f.i}</p>
                </li>
              ))}
            </ul>
          </LembarUbah>

          <LembarUbah
            buka={lembar === "tentang"}
            tutup={() => setLembar(null)}
            judul="Tentang SEKETIKA"
          >
            <div className="rounded-[14px] border border-garis bg-white p-3.5">
              <p className="text-[12.5px] leading-relaxed text-tinta-3">
                SEKETIKA mempertemukan pedagang keliling dengan warga di
                sekitarnya. Warga bisa memanggil gerobak ke depan rumah, atau
                patungan lewat Titik Kumpul supaya pedagang datang sekali
                untuk beberapa tetangga sekaligus.
              </p>
            </div>
            <dl className="rounded-[14px] border border-garis bg-white p-3.5 text-[12px]">
              {[
                ["Versi", "1.0"],
                ["Penyimpanan", "Peramban perangkat ini"],
                ["Pembayaran", "Tunai di tempat"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 py-1">
                  <dt className="text-tinta-4">{k}</dt>
                  <dd className="font-semibold text-tinta-2">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[11px] leading-relaxed text-tinta-4">
              Purwarupa untuk App Development Competition IT FEST 2026. Data
              pedagang dan warga di dalamnya adalah contoh, bukan orang
              sungguhan.
            </p>
          </LembarUbah>
        </>
      }
    >
      {/* Kepala hijau */}
      <header className="gradasi-kumpul relative overflow-hidden rounded-b-[24px] px-4 pb-5 pt-3">
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]" />

        <h1 className="relative text-[19px] font-extrabold text-white">Profil Saya</h1>

        <div className="relative mt-4 flex items-start gap-3.5">
          <span className="relative shrink-0">
            <span className="grid size-16 place-items-center rounded-full bg-white/20 text-[24px] font-extrabold text-white ring-2 ring-white/30">
              {(profil?.nama ?? "W").slice(0, 1).toUpperCase()}
            </span>
            <span
              aria-label="Sedang aktif"
              className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-hijau bg-hijau-neon"
            />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[22px] font-extrabold leading-tight text-white">
              {profil?.nama ?? "Warga"}
            </p>
            <p className="mt-0.5 text-[13px] text-white/65">
              {profil?.telepon || "Nomor belum diisi"}
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-pil bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white">
              <ShieldCheck size={13} strokeWidth={2.2} />
              Warga Aktif
            </span>
          </div>

          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => buka("diri")}
            className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-[12px] font-bold text-white transition-transform active:scale-95"
          >
            Edit
          </button>
        </div>

        <dl className="relative mt-4 grid grid-cols-2 rounded-[16px] bg-white/10 py-3">
          <div className="border-r border-white/15 text-center">
            <dd className="text-[20px] font-extrabold text-white">{pesanan.length}</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Pesanan</dt>
          </div>
          <div className="text-center">
            <dd className="text-[20px] font-extrabold text-white">{kolaborasi}</dd>
            <dt className="mt-0.5 text-[11px] text-white/60">Kolaborasi</dt>
          </div>
        </dl>

      </header>

      <div className="px-4 pb-5">
        {/* Judul bagian berada di luar kepala hijau, sejajar dengan judul
            "Lainnya" di bawahnya. Sebelumnya ia terjepit di tepi bawah
            kepala: ia menerangkan kartu-kartu putih di bawahnya, tapi
            tergambar di atas latar hijau milik bagian yang lain, sehingga
            terbaca seperti ekor kepala yang terpotong. */}
        <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Akun &amp; Transaksi
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={MapPin}
            nada="hijau"
            judul="Alamat Tersimpan"
            isi={profil?.alamat || "Belum diisi"}
            onClick={() => buka("alamat")}
          />
          <BarisMenu
            Ikon={History}
            nada="biru"
            judul="Riwayat Kolaborasi"
            isi={`${titikKumpul.length} titik kumpul`}
            href="/kolab"
          />
          <BarisMenu
            Ikon={Bell}
            nada="ungu"
            judul="Notifikasi"
            isi="Kabar pesanan dan titik kumpul"
            href="/notifikasi"
            akhir
          />
        </div>

        <p className="mb-2 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Lainnya
        </p>
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={CircleHelp}
            nada="biru"
            judul="Pusat Bantuan Tetangga"
            isi="Pertanyaan yang sering muncul"
            onClick={() => buka("bantuan")}
          />
          <BarisMenu
            Ikon={Info}
            nada="amber"
            judul="Tentang SEKETIKA"
            isi="Versi 1.0 · cara kerja aplikasi"
            onClick={() => buka("tentang")}
          />
          {/* Tanpa server autentikasi, berpindah peran adalah satu-satunya
              cara melihat sisi pedagang. Barisnya diletakkan di sini
              supaya tidak mengubah susunan bagian lain. */}
          <BarisMenu
            Ikon={Store}
            nada="hijau"
            judul="Beralih ke Mode Pedagang"
            isi="Lihat aplikasi dari sisi penjual"
            onClick={() => {
              gantiPeran("pedagang");
              router.push("/d");
            }}
          />
          <BarisMenu
            Ikon={RotateCcw}
            nada="merah"
            judul="Setel Ulang Data"
            isi="Kembalikan ke keadaan contoh"
            onClick={async () => {
              /* Muat ulang penuh, bukan pindah lewat router: di aplikasi
                 terpasang tidak ada tombol muat ulang, dan tanpa itu
                 tombol ini mengembalikan data contoh dari berkas yang
                 sudah terlanjur berjalan, bukan dari yang sedang tayang. */
              setelUlang();
              await bersihkanSalinan();
              muatUlangKeAwal();
            }}
            akhir
          />
        </div>
      </div>
    </Layar>
  );
}
