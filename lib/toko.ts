"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  BarisPesanan,
  Percakapan,
  Peran,
  Pesanan,
  PesananMasuk,
  Profil,
  StatusPesanan,
  TitikKumpul,
} from "@/lib/tipe";
import {
  percakapanAwal,
  pesananAwal,
  pesananMasukAwal,
  titikKumpulAwal,
} from "@/lib/data/awal";

/**
 * Seluruh keadaan aplikasi disimpan di peramban.
 *
 * Pilihan ini disengaja. Alur paling penting di SEKETIKA melibatkan dua
 * peran yang saling menunggu: warga memesan, pedagang menerima, warga
 * melihat statusnya berubah. Dengan data lokal, keseluruhan alur itu
 * bisa ditelusuri satu orang dalam satu peramban hanya dengan berpindah
 * peran, dan tidak ada satu pun langkah yang bisa gagal karena jaringan.
 */

type Keadaan = {
  /** null berarti pengguna belum melewati proses pengenalan. */
  profil: Profil | null;
  /** Nama dan surel dari layar pembuatan akun, sebelum peran dipilih. */
  draf: { nama: string; email: string } | null;
  izin: { lokasi: boolean; notifikasi: boolean; suara: boolean };
  pesanan: Pesanan[];
  /** Pesanan yang masuk ke gerobak, dilihat dari sisi pedagang. */
  pesananMasuk: PesananMasuk[];
  /** Gerobak sedang buka atau tutup. */
  gerobakBuka: boolean;
  titikKumpul: TitikKumpul[];
  percakapan: Percakapan[];
  /** Keranjang sementara, dikunci pada satu pedagang. */
  keranjang: { pedagangSlug: string | null; baris: BarisPesanan[] };
};

type Tindakan = {
  simpanDraf: (d: { nama: string; email: string }) => void;
  simpanProfil: (p: Profil) => void;
  gantiPeran: (peran: Peran) => void;
  setIzin: (i: Partial<Keadaan["izin"]>) => void;

  ubahJumlah: (pedagangSlug: string, baris: Omit<BarisPesanan, "jumlah">, delta: number) => void;
  kosongkanKeranjang: () => void;

  buatPesanan: (alamat: string, titikKumpulId?: string) => string;
  ubahStatusPesanan: (id: string, status: StatusPesanan) => void;

  ubahStatusMasuk: (id: string, status: PesananMasuk["status"]) => void;
  setGerobak: (buka: boolean) => void;

  buatTitikKumpul: (t: Omit<TitikKumpul, "id" | "status">) => string;
  gabungTitikKumpul: (id: string, nama: string) => void;
  ubahStatusTitik: (id: string, status: TitikKumpul["status"]) => void;

  kirimPesan: (percakapanId: string, isi: string) => void;

  /** Kembalikan semuanya ke keadaan contoh. Dipakai tombol di profil. */
  setelUlang: () => void;
};

const awal: Keadaan = {
  profil: null,
  draf: null,
  izin: { lokasi: false, notifikasi: false, suara: false },
  pesanan: pesananAwal,
  pesananMasuk: pesananMasukAwal,
  gerobakBuka: true,
  titikKumpul: titikKumpulAwal,
  percakapan: percakapanAwal,
  keranjang: { pedagangSlug: null, baris: [] },
};

const jam = () =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(),
  );

export const useToko = create<Keadaan & Tindakan>()(
  persist(
    (set, get) => ({
      ...awal,

      simpanDraf: (draf) => set({ draf }),

      /* Draf dibuang begitu profil jadi; menyimpan dua sumber untuk nama
         yang sama hanya mengundang keduanya menyimpang. */
      simpanProfil: (profil) => set({ profil, draf: null }),

      gantiPeran: (peran) =>
        set((s) => (s.profil ? { profil: { ...s.profil, peran } } : {})),

      setIzin: (i) => set((s) => ({ izin: { ...s.izin, ...i } })),

      ubahJumlah: (pedagangSlug, baris, delta) =>
        set((s) => {
          /* Keranjang hanya boleh berisi satu pedagang. Memilih menu dari
             pedagang lain mengganti isinya, bukan menumpuknya, karena satu
             gerobak tidak bisa mengantar dagangan gerobak lain. */
          const dasar =
            s.keranjang.pedagangSlug === pedagangSlug ? s.keranjang.baris : [];
          const ada = dasar.find((b) => b.menuId === baris.menuId);
          const berikut = ada
            ? dasar
                .map((b) =>
                  b.menuId === baris.menuId ? { ...b, jumlah: b.jumlah + delta } : b,
                )
                .filter((b) => b.jumlah > 0)
            : delta > 0
              ? [...dasar, { ...baris, jumlah: delta }]
              : dasar;
          return { keranjang: { pedagangSlug, baris: berikut } };
        }),

      kosongkanKeranjang: () => set({ keranjang: { pedagangSlug: null, baris: [] } }),

      buatPesanan: (alamat, titikKumpulId) => {
        const { keranjang, pesanan } = get();
        const id = `ord-${String(pesanan.length + 1).padStart(3, "0")}`;
        const baru: Pesanan = {
          id,
          pedagangSlug: keranjang.pedagangSlug!,
          baris: keranjang.baris,
          status: "menunggu",
          dibuatPada: new Date().toISOString(),
          titikKumpulId,
          alamat,
        };
        set({ pesanan: [baru, ...pesanan], keranjang: { pedagangSlug: null, baris: [] } });
        return id;
      },

      ubahStatusPesanan: (id, status) =>
        set((s) => ({
          pesanan: s.pesanan.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      ubahStatusMasuk: (id, status) =>
        set((s) => ({
          pesananMasuk: s.pesananMasuk.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      setGerobak: (gerobakBuka) => set({ gerobakBuka }),

      buatTitikKumpul: (t) => {
        const id = `tk-${Date.now().toString(36)}`;
        set((s) => ({
          titikKumpul: [{ ...t, id, status: "mengumpulkan" }, ...s.titikKumpul],
        }));
        return id;
      },

      gabungTitikKumpul: (id, nama) =>
        set((s) => ({
          titikKumpul: s.titikKumpul.map((t) => {
            if (t.id !== id) return t;
            /* Sekali bergabung tidak dihitung dua kali walau tombolnya
               ditekan berulang. */
            if (t.peserta.some((p) => p.id === "saya")) return t;
            const peserta = [
              ...t.peserta,
              { id: "saya", nama, inisial: nama.slice(0, 1).toUpperCase() },
            ];
            return {
              ...t,
              peserta,
              status: peserta.length >= t.target ? ("tercapai" as const) : t.status,
            };
          }),
        })),

      ubahStatusTitik: (id, status) =>
        set((s) => ({
          titikKumpul: s.titikKumpul.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      kirimPesan: (percakapanId, isi) =>
        set((s) => ({
          percakapan: s.percakapan.map((p) =>
            p.id === percakapanId
              ? {
                  ...p,
                  pesan: [
                    ...p.pesan,
                    { id: `ps-${Date.now()}`, saya: true, isi, waktu: jam() },
                  ],
                }
              : p,
          ),
        })),

      setelUlang: () => set(awal),
    }),
    {
      name: "seketika",
      storage: createJSONStorage(() => localStorage),
      /* Hidrasi ditunda supaya penyajian di server dan lukisan pertama di
         peramban sama persis. Tanpa ini React memprotes ketidakcocokan. */
      skipHydration: true,
    },
  ),
);
