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
  /**
   * Pesanan yang sudah selesai pada hari-hari sebelumnya, bahan Buku Kas.
   *
   * Terpisah dari `pesananMasuk` karena keduanya menjawab pertanyaan
   * berbeda: yang satu "apa yang harus saya kerjakan sekarang", yang ini
   * "bagaimana dagangan saya seminggu terakhir". Menyatukannya membuat
   * kotak masuk hari ini terkubur riwayat.
   */
  riwayatPedagang: PesananMasuk[];
  /** Gerobak sedang buka atau tutup. */
  gerobakBuka: boolean;
  titikKumpul: TitikKumpul[];
  percakapan: Percakapan[];
  /** Percakapan dari sisi pedagang; lawan bicaranya warga. */
  percakapanPedagang: Percakapan[];
  /** Keranjang sementara, dikunci pada satu pedagang. */
  keranjang: { pedagangSlug: string | null; baris: BarisPesanan[] };

  /**
   * Menu gerobak sendiri yang sedang dimatikan pedagang.
   *
   * Disimpan sebagai daftar yang dimatikan, bukan daftar yang menyala.
   * Menu datang dari data statis dan bisa bertambah; kalau yang disimpan
   * daftar menyala, setiap menu baru akan lahir dalam keadaan mati sampai
   * seseorang menyalakannya satu per satu.
   */
  menuNonaktif: string[];

  /** Bintang yang sudah diberikan warga, dikunci pada id pesanan. */
  penilaian: Record<string, number>;

  /** Obrolan di dalam tiap titik kumpul, dikunci pada id titik. */
  obrolanTitik: Record<string, Pesan[]>;

  /** Id pemberitahuan yang sudah dibuka, supaya lencananya berhenti. */
  notifikasiDibaca: string[];

  /**
   * Daftar menu gerobak sendiri setelah disunting pedagang.
   *
   * `null` berarti belum pernah disentuh dan yang berlaku adalah menu
   * bawaan dari data contoh. Begitu pedagang menambah, mengubah, atau
   * menghapus satu menu, seluruh daftarnya disalin ke sini dan sejak itu
   * inilah sumbernya. Menyimpan hanya selisihnya terhadap data bawaan
   * terdengar lebih hemat, tapi selisih atas penghapusan dan penambahan
   * sekaligus jauh lebih mudah salah daripada menyimpan daftar utuh.
   */
  menuSaya: Menu[] | null;

  /** Catatan sisa stok per menu. Fitur langganan berbayar. */
  stok: Record<string, number>;

  /**
   * Foto menu yang diunggah pedagang, dikunci pada id menu.
   *
   * Isinya data URL yang sudah dikecilkan lewat `lib/foto.ts`. Terpisah
   * dari `menuSaya` karena foto jauh lebih besar dari kolom lainnya, dan
   * memisahnya membuat menu yang dihapus bisa membuang fotonya tanpa
   * menyentuh apa pun yang lain.
   */
  fotoMenuSaya: Record<string, string>;

  /** Langganan SEKETIKA Pro sedang menyala. */
  pro: boolean;
};

type Tindakan = {
  simpanDraf: (d: { nama: string; email: string }) => void;
  simpanProfil: (p: Profil) => void;
  /**
   * Mengubah sebagian isi profil tanpa menyentuh sisanya.
   *
   * Terpisah dari `simpanProfil` yang menimpa seluruh profil sekaligus.
   * Layar pengaturan mengubah satu dua kolom saja, dan menimpa seluruh
   * profil dari sana berarti tiap layar harus ingat menyalin ulang kolom
   * yang tidak disentuhnya; satu yang lupa, isinya hilang.
   */
  perbaruiProfil: (bagian: Partial<Profil>) => void;
  gantiPeran: (peran: Peran) => void;
  setIzin: (i: Partial<Keadaan["izin"]>) => void;

  ubahJumlah: (pedagangSlug: string, baris: Omit<BarisPesanan, "jumlah">, delta: number) => void;
  kosongkanKeranjang: () => void;

  /**
   * Menyiapkan keranjang untuk satu panggilan, menimpa isinya.
   *
   * Dipakai layar menu yang tidak lagi menumpuk pesanan butir demi butir:
   * di sana pengguna memanggil penjual, bukan mengisi troli. Daftar boleh
   * kosong, artinya penjual dipanggil tanpa pesanan awal dan warga
   * memilih dagangannya setelah gerobak sampai.
   */
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

      perbaruiProfil: (bagian) =>
        set((s) => (s.profil ? { profil: { ...s.profil, ...bagian } } : {})),

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

      siapkanPanggilan: (pedagangSlug, baris) => set({ keranjang: { pedagangSlug, baris } }),

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

      /* Menstempel waktu begitu pesanan ditandai selesai. Tanpa stempel
         ini pesanan yang baru diselesaikan tidak punya tanggal, sehingga
         Buku Kas tidak tahu ia milik hari yang mana dan pendapatan hari
         ini tidak pernah bertambah. Stempelnya hanya dipasang untuk
         status `selesai`; status lain tidak menandai apa pun. */
      ubahStatusMasuk: (id, status) =>
        set((s) => ({
          pesananMasuk: s.pesananMasuk.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  ...(status === "selesai" ? { selesaiPada: new Date().toISOString() } : {}),
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

      /* Kedua peran punya kotak masuknya sendiri. Menyatukannya berarti
         pedagang melihat percakapannya dengan sesama pedagang, yang tidak
         masuk akal untuk aplikasi ini. */
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

      /* Sekali dinilai tidak bisa diubah. Bintang yang bisa diputar-putar
         setelah dikirim membuat angkanya kehilangan arti, dan pedagang
         yang sudah melihat nilainya akan bingung kenapa berubah. */
      beriNilai: (pesananId, nilai) =>
        set((s) =>
          s.penilaian[pesananId] ? {} : { penilaian: { ...s.penilaian, [pesananId]: nilai } },
        ),

      kirimPesanTitik: (titikId, isi, nama) =>
        set((s) => ({
          obrolanTitik: {
            ...s.obrolanTitik,
            [titikId]: [
              ...(s.obrolanTitik[titikId] ?? []),
              { id: `pt-${Date.now()}`, saya: true, isi: `${nama}: ${isi}`, waktu: jam() },
            ],
          },
        })),

      /* Mengembalikan objek kosong kalau tidak ada yang benar-benar baru.
         Tanpa penjagaan ini, tiap pemanggilan melahirkan larik baru,
         larik baru mengubah rujukan keadaan, dan setiap komponen yang
         menyimaknya ikut digambar ulang tanpa ada yang berubah. */
      tandaiNotifikasiDibaca: (id) =>
        set((s) => {
          const baru = id.filter((x) => !s.notifikasiDibaca.includes(x));
          return baru.length === 0 ? {} : { notifikasiDibaca: [...s.notifikasiDibaca, ...baru] };
        }),

      /* Menyunting menu yang sudah ada sekaligus menambah yang baru.
         Keduanya satu tindakan karena bedanya cuma apakah idnya sudah ada
         di daftar; memisahnya jadi dua tindakan berarti dua jalur yang
         harus sama-sama benar dalam menyalin daftar bawaan. */
      simpanMenu: (menu, bawaan, foto) =>
        set((s) => {
          const dasar = s.menuSaya ?? bawaan;
          const ada = dasar.some((m) => m.id === menu.id);
          /* `foto` yang undefined berarti tidak disentuh, null berarti
             dikembalikan ke foto bawaan. Membedakan keduanya perlu karena
             menyimpan menu tanpa mengganti fotonya adalah hal yang paling
             sering terjadi, dan itu tidak boleh menghapus foto yang sudah
             ada. */
          const fotoMenuSaya =
            foto === undefined
              ? s.fotoMenuSaya
              : foto === null
                ? Object.fromEntries(
                    Object.entries(s.fotoMenuSaya).filter(([id]) => id !== menu.id),
                  )
                : { ...s.fotoMenuSaya, [menu.id]: foto };

          return {
            fotoMenuSaya,
            menuSaya: ada ? dasar.map((m) => (m.id === menu.id ? menu : m)) : [...dasar, menu],
          };
        }),

      hapusMenu: (menuId, bawaan) =>
        set((s) => {
          const dasar = s.menuSaya ?? bawaan;
          return {
            menuSaya: dasar.filter((m) => m.id !== menuId),
            /* Menu yang dihapus tidak boleh meninggalkan jejak di daftar
               yang dimatikan maupun di catatan stok; kalau menu dengan id
               sama dibuat lagi nanti, ia akan lahir dalam keadaan mati
               dengan stok orang lain. */
            menuNonaktif: s.menuNonaktif.filter((id) => id !== menuId),
            stok: Object.fromEntries(Object.entries(s.stok).filter(([id]) => id !== menuId)),
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
      /* Hidrasi ditunda supaya penyajian di server dan lukisan pertama di
         peramban sama persis. Tanpa ini React memprotes ketidakcocokan. */
      skipHydration: true,
    },
  ),
);
