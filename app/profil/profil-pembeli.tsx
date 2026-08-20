"use client";

import { useRouter } from "next/navigation";
import {
  Bell, CircleHelp, Info, MapPin, RotateCcw, ShieldCheck, Store, History,
} from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { BarisMenu } from "@/komponen/ui/baris-menu";
import { useToko } from "@/lib/toko";

export function ProfilPembeli() {
  const router = useRouter();
  const profil = useToko((s) => s.profil);
  const pesanan = useToko((s) => s.pesanan);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const gantiPeran = useToko((s) => s.gantiPeran);
  const setelUlang = useToko((s) => s.setelUlang);

  const kolaborasi = titikKumpul.filter((t) => t.peserta.some((p) => p.id === "saya")).length;

  return (
    <Layar nav latar="bg-krem">
      {/* Kepala hijau */}
      <header className="gradasi-kumpul relative overflow-hidden px-4 pb-3 pt-3">
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]" />

        <div className="relative flex items-center justify-between">
          <h1 className="text-[19px] font-extrabold text-white">Profil Saya</h1>
          <button
            type="button"
            aria-label="Notifikasi"
            className="grid size-9 place-items-center rounded-full bg-white/15 text-white transition-transform active:scale-90"
          >
            <Bell size={17} strokeWidth={2} />
          </button>
        </div>

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
            className="shrink-0 rounded-[11px] bg-white/15 px-3.5 py-2 text-[12px] font-bold text-white transition-transform active:scale-95"
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

        <p className="relative mb-1 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80">
          Akun &amp; Transaksi
        </p>
      </header>

      <div className="px-4 pb-5">
        <div className="bayang-kartu overflow-hidden rounded-[16px] border border-garis bg-white">
          <BarisMenu
            Ikon={MapPin}
            nada="hijau"
            judul="Alamat Tersimpan"
            isi={profil?.alamat || "Belum diisi"}
            href="/profil"
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
            isi="Pedagang favorit, titik kumpul"
            href="/profil"
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
            isi="FAQ & hubungi kami"
            href="/profil"
          />
          <BarisMenu
            Ikon={Info}
            nada="amber"
            judul="Tentang SEKETIKA"
            isi="Versi 1.0 · Kebijakan Privasi"
            href="/profil"
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
