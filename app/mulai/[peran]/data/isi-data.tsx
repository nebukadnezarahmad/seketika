"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Leaf,
  Mail,
  MapPin,
  MoreHorizontal,
  Package,
  Phone,
  ScissorsLineDashed,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Store,
  Trees,
  User,
  Utensils,
  Wrench,
  House,
} from "lucide-react";
import { BilahStatus } from "@/komponen/ui/bilah-status";
import { Tombol } from "@/komponen/ui/tombol";
import { KolomIsian } from "@/komponen/ui/kolom-isian";
import {
  JudulLangkah,
  KakiVersi,
  Kicker,
  TitikLangkah,
} from "@/komponen/ui/langkah";
import { useToko } from "@/lib/toko";
import type { Peran } from "@/lib/tipe";

/** Sembilan jenis usaha, sama urutannya dengan sistem desain. */
const jenisUsaha = [
  { nama: "Makanan Siap Saji", Ikon: Utensils },
  { nama: "Makanan Bahan Mentah", Ikon: Leaf },
  { nama: "Sembako", Ikon: ShoppingBasket },
  { nama: "Jasa Bersih-bersih", Ikon: Sparkles },
  { nama: "Jasa Perbaiki Elektronik", Ikon: Wrench },
  { nama: "Jasa Sol Sepatu", Ikon: ScissorsLineDashed },
  { nama: "Jasa Pengantaran", Ikon: Package },
  { nama: "Jasa Taman", Ikon: Trees },
  { nama: "Lainnya", Ikon: MoreHorizontal },
];

export function IsiData({ peran }: { peran: Peran }) {
  const router = useRouter();
  const simpanProfil = useToko((s) => s.simpanProfil);
  const draf = useToko((s) => s.draf);

  /* Nilai awal dibaca sekali lewat penginisialisasi malas. */
  const [isi, setIsi] = React.useState(() => ({
    nama: draf?.nama ?? "",
    email: draf?.email ?? "",
    telepon: "",
    alamat: "",
    patokan: "",
    namaUsaha: "",
    deskripsiUsaha: "",
  }));
  const [jenis, setJenis] = React.useState<string | null>(null);
  const ubah =
    (k: keyof typeof isi) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setIsi((s) => ({ ...s, [k]: e.target.value }));

  /* Hanya nama yang benar-benar wajib. */
  const bolehLanjut = isi.nama.trim().length >= 2;

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bolehLanjut) return;
    simpanProfil({
      nama: isi.nama.trim(),
      email: isi.email.trim(),
      telepon: isi.telepon.trim(),
      alamat: isi.alamat.trim() || "Bumi Marina Emas Selatan No.12",
      patokan: isi.patokan.trim(),
      peran,
      ...(peran === "pedagang" && {
        namaUsaha: isi.namaUsaha.trim() || isi.nama.trim(),
        jenisUsaha: jenis ?? "Makanan Siap Saji",
        deskripsiUsaha: isi.deskripsiUsaha.trim(),
      }),
    });
    router.replace(peran === "pedagang" ? "/d" : "/beranda");
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-krem">
      <BilahStatus />

      <form
        onSubmit={kirim}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 pt-2"
      >
        <TitikLangkah ke={3} />

        <div className="mt-3">
          <Kicker anak="LANGKAH 3 DARI 3" />
          <JudulLangkah
            anak={
              peran === "pedagang" ? "Isi Data Pedagang" : "Isi Data Pembeli"
            }
          />
          <p className="mt-2 text-[13px] leading-relaxed text-tinta-3">
            {peran === "pedagang"
              ? "Lengkapi data berikut agar pembeli dapat menemukan dan memesan dari Anda."
              : "Lengkapi data berikut agar pesanan dan komunikasi lebih mudah dan aman."}
          </p>
        </div>

        <div className="bayang-kartu mt-5 flex flex-col gap-3 rounded-[18px] border border-garis bg-white p-4">
          <KolomIsian
            label="Nama Lengkap"
            Ikon={User}
            placeholder="Nama lengkap kamu"
            value={isi.nama}
            onChange={ubah("nama")}
            required
            autoComplete="name"
          />

          {peran === "pembeli" ? (
            <>
              <KolomIsian
                label="Email"
                batas
                Ikon={Mail}
                type="email"
                placeholder="email@kamu.com"
                value={isi.email}
                onChange={ubah("email")}
                autoComplete="email"
              />
              <KolomIsian
                label="Nomor Telepon"
                batas
                Ikon={Phone}
                type="tel"
                inputMode="numeric"
                placeholder="08xxxxxxxxxx"
                value={isi.telepon}
                onChange={ubah("telepon")}
                autoComplete="tel"
              />
              <KolomIsian
                label="Alamat Rumah (Opsional)"
                batas
                Ikon={House}
                panjang
                placeholder="Jl. Contoh No. 12, Kelurahan, Kecamatan..."
                value={isi.alamat}
                onChange={ubah("alamat")}
              />
              <KolomIsian
                label="Patokan Lokasi (Opsional)"
                batas
                Ikon={MapPin}
                panjang
                placeholder="Dekat warung Bu Sari, sebelah masjid hijau..."
                value={isi.patokan}
                onChange={ubah("patokan")}
              />
            </>
          ) : (
            <>
              <KolomIsian
                label="Nama Usaha (Opsional)"
                batas
                Ikon={Store}
                placeholder="Nama usaha atau gerobakmu"
                value={isi.namaUsaha}
                onChange={ubah("namaUsaha")}
              />

              <fieldset className="border-t border-garis pt-3">
                <legend className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
                  Jenis Usaha
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {jenisUsaha.map(({ nama, Ikon }) => {
                    const aktif = jenis === nama;
                    return (
                      <label
                        key={nama}
                        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[12px] border px-1.5 py-2.5 text-center transition-colors ${
                          aktif
                            ? "border-hijau bg-hijau text-white"
                            : "border-garis bg-hijau-lembut/40 text-tinta-3 hover:border-hijau/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="jenis"
                          value={nama}
                          checked={aktif}
                          onChange={() => setJenis(nama)}
                          className="khusus-pembaca-layar"
                        />
                        <Ikon
                          size={17}
                          strokeWidth={1.9}
                          className={aktif ? "text-white" : "text-hijau"}
                        />
                        <span className="text-[9.5px] font-medium leading-[1.25]">
                          {nama}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <KolomIsian
                label="Deskripsi Usaha"
                batas
                Ikon={Store}
                panjang
                placeholder="Jelaskan usahamu, produk, atau layananmu kepada calon pembeli..."
                value={isi.deskripsiUsaha}
                onChange={ubah("deskripsiUsaha")}
              />
            </>
          )}
        </div>

        {peran === "pembeli" && (
          <p className="mt-3 flex gap-2.5 rounded-[14px] bg-hijau-lembut/70 p-3.5 text-[11.5px] leading-relaxed text-tinta-3">
            <ShieldCheck size={15} className="mt-px shrink-0 text-hijau" />
            Data Anda aman bersama kami. Informasi ini hanya digunakan untuk
            keperluan pemesanan dan pengantaran.
          </p>
        )}

        <div className="mt-auto pt-6">
          <Tombol penuh type="submit" disabled={!bolehLanjut}>
            Mulai
            <ArrowRight size={16} strokeWidth={2.4} />
          </Tombol>
          <KakiVersi />
        </div>
      </form>
    </div>
  );
}
