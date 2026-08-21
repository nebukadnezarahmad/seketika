"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  BarisPesanan,
  Menu,
  Percakapan,
  Peran,
  Pesan,
  Pesanan,
  PesananMasuk,
  Profil,
  StatusPesanan,
  TitikKumpul,
} from "@/lib/tipe";
import {
  percakapanAwal,
  percakapanPedagangAwal,
  pesananAwal,
  pesananMasukAwal,
  riwayatPedagangAwal,
  titikKumpulAwal,
} from "@/lib/data/awal";

/** Seluruh keadaan aplikasi disimpan di peramban. */

type Keadaan = {
  /** null berarti pengguna belum melewati proses pengenalan. */
  profil: Profil | null;
  /** Nama dan surel dari layar pembuatan akun, sebelum peran dipilih. */
  draf: { nama: string; email: string } | null;
  izin: { lokasi: boolean; notifikasi: boolean; suara: boolean };
  pesanan: Pesanan[];
  /** Pesanan yang masuk ke gerobak, dilihat dari sisi pedagang. */
  pesananMasuk: PesananMasuk[];
  /** Pesanan yang sudah selesai pada hari-hari sebelumnya, bahan Buku Kas. */
  riwayatPedagang: PesananMasuk[];
  /** Gerobak sedang buka atau tutup. */
  gerobakBuka: boolean;
  titikKumpul: TitikKumpul[];
  percakapan: Percakapan[];
  /** Percakapan dari sisi pedagang; lawan bicaranya warga. */
  percakapanPedagang: Percakapan[];
  /** Keranjang sementara, dikunci pada satu pedagang. */
  keranjang: { pedagangSlug: string | null; baris: BarisPesanan[] };

  /** Menu gerobak sendiri yang sedang dimatikan pedagang. */
  menuNonaktif: string[];

  /** Bintang yang sudah diberikan warga, dikunci pada id pesanan. */
  penilaian: Record<string, number>;

  /** Obrolan di dalam tiap titik kumpul, dikunci pada id titik. */
  obrolanTitik: Record<string, Pesan[]>;

  /** Id pemberitahuan yang sudah dibuka, supaya lencananya berhenti. */
  notifikasiDibaca: string[];

  /** Daftar menu gerobak sendiri setelah disunting pedagang. */
  menuSaya: Menu[] | null;

  /** Catatan sisa stok per menu. Fitur langganan berbayar. */
  stok: Record<string, number>;

  /** Foto menu yang diunggah pedagang, dikunci pada id menu. */
  fotoMenuSaya: Record<string, string>;

  /** Langganan SEKETIKA Pro sedang menyala. */
  pro: boolean;
};

type Tindakan = {
  simpanDraf: (d: { nama: string; email: string }) => void;
  simpanProfil: (p: Profil) => void;
  /** Mengubah sebagian isi profil tanpa menyentuh sisanya. */
  perbaruiProfil: (bagian: Partial<Profil>) => void;
  gantiPeran: (peran: Peran) => void;
  setIzin: (i: Partial<Keadaan["izin"]>) => void;

  ubahJumlah: (
    pedagangSlug: string,
    baris: Omit<BarisPesanan, "jumlah">,
    delta: number,
  ) => void;
  kosongkanKeranjang: () => void;

  /** Menyiapkan keranjang untuk satu panggilan, menimpa isinya. */
  siapkanPanggilan: (pedagangSlug: string, baris: BarisPesanan[]) => void;
  buatPesanan: (alamat: string, titikKumpulId?: string) => string;
  ubahStatusPesanan: (id: string, status: StatusPesanan) => void;

  ubahStatusMasuk: (id: string, status: PesananMasuk["status"]) => void;
  setGerobak: (buka: boolean) => void;

  buatTitikKumpul: (t: Omit<TitikKumpul, "id" | "status">) => string;
  gabungTitikKumpul: (id: string, nama: string) => void;
  ubahStatusTitik: (id: string, status: TitikKumpul["status"]) => void;

  kirimPesan: (percakapanId: string, isi: string, peran?: Peran) => void;

  /** Menyalakan atau mematikan satu menu gerobak sendiri. */
  ubahAktifMenu: (menuId: string, aktif: boolean) => void;

  /** Memberi bintang pada satu pesanan yang sudah selesai. */
  beriNilai: (pesananId: string, nilai: number) => void;

  kirimPesanTitik: (titikId: string, isi: string, nama: string) => void;

  tandaiNotifikasiDibaca: (id: string[]) => void;

  simpanMenu: (menu: Menu, bawaan: Menu[], foto?: string | null) => void;
  hapusMenu: (menuId: string, bawaan: Menu[]) => void;
  aturStok: (menuId: string, sisa: number) => void;
  setPro: (nyala: boolean) => void;

  /** Kembalikan semuanya ke keadaan contoh. Dipakai tombol di profil. */
  setelUlang: () => void;
};

const awal: Keadaan = {
  profil: null,
  draf: null,
  izin: { lokasi: false, notifikasi: false, suara: false },
  pesanan: pesananAwal,
  pesananMasuk: pesananMasukAwal,
  riwayatPedagang: riwayatPedagangAwal,
  gerobakBuka: true,
  titikKumpul: titikKumpulAwal,
  percakapan: percakapanAwal,
  percakapanPedagang: percakapanPedagangAwal,
  keranjang: { pedagangSlug: null, baris: [] },
  menuNonaktif: [],
  penilaian: {},
  obrolanTitik: {},
  notifikasiDibaca: [],
  menuSaya: null,
  stok: {},
  fotoMenuSaya: {},
  pro: false,
};

const jam = () =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

export const useToko = create<Keadaan & Tindakan>()(
  persist(
    (set, get) => ({
      ...awal,

      simpanDraf: (draf) => set({ draf }),

      /* Draf dibuang begitu profil jadi; menyimpan dua sumber untuk nama yang sama hanya mengundang keduanya menyimpang. */
      simpanProfil: (profil) => set({ profil, draf: null }),

      perbaruiProfil: (bagian) =>
        set((s) => (s.profil ? { profil: { ...s.profil, ...bagian } } : {})),

      gantiPeran: (peran) =>
        set((s) => (s.profil ? { profil: { ...s.profil, peran } } : {})),

      setIzin: (i) => set((s) => ({ izin: { ...s.izin, ...i } })),

      ubahJumlah: (pedagangSlug, baris, delta) =>
        set((s) => {
          /* Keranjang hanya boleh berisi satu pedagang. */
          const dasar =
            s.keranjang.pedagangSlug === pedagangSlug ? s.keranjang.baris : [];
          const ada = dasar.find((b) => b.menuId === baris.menuId);
          const berikut = ada
            ? dasar
                .map((b) =>
                  b.menuId === baris.menuId
                    ? { ...b, jumlah: b.jumlah + delta }
                    : b,
                )
                .filter((b) => b.jumlah > 0)
            : delta > 0
              ? [...dasar, { ...baris, jumlah: delta }]
              : dasar;
          return { keranjang: { pedagangSlug, baris: berikut } };
        }),

      kosongkanKeranjang: () =>
        set({ keranjang: { pedagangSlug: null, baris: [] } }),

      siapkanPanggilan: (pedagangSlug, baris) =>
        set({ keranjang: { pedagangSlug, baris } }),

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
        set({
          pesanan: [baru, ...pesanan],
          keranjang: { pedagangSlug: null, baris: [] },
        });
        return id;
      },

      ubahStatusPesanan: (id, status) =>
        set((s) => ({
          pesanan: s.pesanan.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      /* Menstempel waktu begitu pesanan ditandai selesai. */
      ubahStatusMasuk: (id, status) =>
        set((s) => ({
          pesananMasuk: s.pesananMasuk.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  ...(status === "selesai"
                    ? { selesaiPada: new Date().toISOString() }
                    : {}),
                }
              : p,
          ),
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
            /* Sekali bergabung tidak dihitung dua kali walau tombolnya ditekan berulang. */
            if (t.peserta.some((p) => p.id === "saya")) return t;
            const peserta = [
              ...t.peserta,
              { id: "saya", nama, inisial: nama.slice(0, 1).toUpperCase() },
            ];
            return {
              ...t,
              peserta,
              status:
                peserta.length >= t.target ? ("tercapai" as const) : t.status,
            };
          }),
        })),

      ubahStatusTitik: (id, status) =>
        set((s) => ({
          titikKumpul: s.titikKumpul.map((t) =>
            t.id === id ? { ...t, status } : t,
          ),
        })),

      /* Kedua peran punya kotak masuknya sendiri. */
      kirimPesan: (percakapanId, isi, peran = "pembeli") =>
        set((s) => {
          const tambah = (daftar: Percakapan[]) =>
            daftar.map((p) =>
              p.id === percakapanId
                ? {
                    ...p,
                    pesan: [
                      ...p.pesan,
                      { id: `ps-${Date.now()}`, saya: true, isi, waktu: jam() },
                    ],
                  }
                : p,
            );
          return peran === "pedagang"
            ? { percakapanPedagang: tambah(s.percakapanPedagang) }
            : { percakapan: tambah(s.percakapan) };
        }),

      ubahAktifMenu: (menuId, aktif) =>
        set((s) => ({
          menuNonaktif: aktif
            ? s.menuNonaktif.filter((id) => id !== menuId)
            : s.menuNonaktif.includes(menuId)
              ? s.menuNonaktif
              : [...s.menuNonaktif, menuId],
        })),

      /* Sekali dinilai tidak bisa diubah. */
      beriNilai: (pesananId, nilai) =>
        set((s) =>
          s.penilaian[pesananId]
            ? {}
            : { penilaian: { ...s.penilaian, [pesananId]: nilai } },
        ),

      kirimPesanTitik: (titikId, isi, nama) =>
        set((s) => ({
          obrolanTitik: {
            ...s.obrolanTitik,
            [titikId]: [
              ...(s.obrolanTitik[titikId] ?? []),
              {
                id: `pt-${Date.now()}`,
                saya: true,
                isi: `${nama}: ${isi}`,
                waktu: jam(),
              },
            ],
          },
        })),

      /* Mengembalikan objek kosong kalau tidak ada yang benar-benar baru. */
      tandaiNotifikasiDibaca: (id) =>
        set((s) => {
          const baru = id.filter((x) => !s.notifikasiDibaca.includes(x));
          return baru.length === 0
            ? {}
            : { notifikasiDibaca: [...s.notifikasiDibaca, ...baru] };
        }),

      /* Menyunting menu yang sudah ada sekaligus menambah yang baru. */
      simpanMenu: (menu, bawaan, foto) =>
        set((s) => {
          const dasar = s.menuSaya ?? bawaan;
          const ada = dasar.some((m) => m.id === menu.id);
          /* `foto` yang undefined berarti tidak disentuh, null berarti dikembalikan ke foto bawaan. */
          const fotoMenuSaya =
            foto === undefined
              ? s.fotoMenuSaya
              : foto === null
                ? Object.fromEntries(
                    Object.entries(s.fotoMenuSaya).filter(
                      ([id]) => id !== menu.id,
                    ),
                  )
                : { ...s.fotoMenuSaya, [menu.id]: foto };

          return {
            fotoMenuSaya,
            menuSaya: ada
              ? dasar.map((m) => (m.id === menu.id ? menu : m))
              : [...dasar, menu],
          };
        }),

      hapusMenu: (menuId, bawaan) =>
        set((s) => {
          const dasar = s.menuSaya ?? bawaan;
          return {
            menuSaya: dasar.filter((m) => m.id !== menuId),
            /* Menu yang dihapus tidak boleh meninggalkan jejak di daftar yang dimatikan maupun di catatan stok; kalau menu dengan id sama dibuat lagi nanti, ia akan lahir dalam keadaan mati dengan stok orang lain. */
            menuNonaktif: s.menuNonaktif.filter((id) => id !== menuId),
            stok: Object.fromEntries(
              Object.entries(s.stok).filter(([id]) => id !== menuId),
            ),
            fotoMenuSaya: Object.fromEntries(
              Object.entries(s.fotoMenuSaya).filter(([id]) => id !== menuId),
            ),
          };
        }),

      aturStok: (menuId, sisa) =>
        set((s) => ({ stok: { ...s.stok, [menuId]: Math.max(0, sisa) } })),

      setPro: (pro) => set({ pro }),

      setelUlang: () => set(awal),
    }),
    {
      name: "seketika",
      storage: createJSONStorage(() => localStorage),
      /* Hidrasi ditunda supaya penyajian di server dan lukisan pertama di peramban sama persis. */
      skipHydration: true,
    },
  ),
);
