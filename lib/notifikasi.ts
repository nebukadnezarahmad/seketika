import { menungguPedagang, statusTitik } from "@/lib/kolab";
import { rp, totalBaris } from "@/lib/format";
import type { Peran, Pesanan, PesananMasuk, TitikKumpul } from "@/lib/tipe";

/** Pemberitahuan dibentuk dari keadaan yang sudah ada, bukan disimpan. */
export type Nada = "hijau" | "biru" | "amber" | "merah" | "ungu";

export type Pemberitahuan = {
  id: string;
  judul: string;
  isi: string;
  nada: Nada;
  /** Ke mana pengguna dibawa saat pemberitahuan diketuk. */
  href: string;
};

export function pemberitahuanPembeli(
  pesanan: Pesanan[],
  titikKumpul: TitikKumpul[],
  sekarang: number | null,
): Pemberitahuan[] {
  const daftar: Pemberitahuan[] = [];

  for (const p of pesanan) {
    if (p.status === "selesai") {
      daftar.push({
        id: `ps-${p.id}-selesai`,
        judul: "Pesanan selesai",
        isi: `Pesananmu senilai ${rp(totalBaris(p.baris))} sudah selesai. Beri penilaian untuk penjualnya.`,
        nada: "hijau",
        href: `/pesanan/${p.id}`,
      });
    } else if (p.status === "diproses") {
      daftar.push({
        id: `ps-${p.id}-diproses`,
        judul: "Pesanan sedang disiapkan",
        isi: "Penjual sudah menerima pesananmu dan sedang menyiapkannya.",
        nada: "amber",
        href: `/pesanan/${p.id}`,
      });
    }
  }

  for (const t of titikKumpul) {
    const keadaan = statusTitik(t, sekarang);
    const ikut = t.peserta.some((x) => x.id === "saya");

    if (keadaan === "tercapai") {
      daftar.push({
        id: `tk-${t.id}-tercapai`,
        judul: "Target titik kumpul tercapai",
        isi: `${t.nama} sudah terkumpul ${t.peserta.length} warga. Pedagang segera menuju lokasi.`,
        nada: "hijau",
        href: `/kolab/${t.id}`,
      });
    } else if (keadaan === "hangus" && ikut) {
      /* Yang hangus hanya dikabarkan kepada yang ikut. */
      daftar.push({
        id: `tk-${t.id}-hangus`,
        judul: "Titik kumpul hangus",
        isi: `${t.nama} tidak memenuhi target sampai batas waktu.`,
        nada: "merah",
        href: `/kolab/${t.id}`,
      });
    }
  }

  return daftar;
}

export function pemberitahuanPedagang(
  pesananMasuk: PesananMasuk[],
  titikKumpul: TitikKumpul[],
  slugGerobak: string,
  sekarang: number | null,
): Pemberitahuan[] {
  const daftar: Pemberitahuan[] = [];

  for (const p of pesananMasuk) {
    if (p.status === "baru") {
      daftar.push({
        id: `pm-${p.id}-baru`,
        judul: "Pesanan baru masuk",
        isi: `${p.warga} memesan ${p.baris.reduce((n, b) => n + b.jumlah, 0)} item di ${p.titik}.`,
        nada: "biru",
        href: "/d/pesanan",
      });
    }
  }

  for (const t of titikKumpul) {
    if (t.pedagangSlug !== slugGerobak) continue;
    /* Hanya yang targetnya sudah tercapai. */
    if (!menungguPedagang(t, sekarang)) continue;
    daftar.push({
      id: `tk-${t.id}-permintaan`,
      judul: "Permintaan titik kumpul",
      isi: `${t.nama} · ${t.peserta.length} warga sudah berkumpul dan menunggu dijemput.`,
      nada: "ungu",
      href: `/kolab/${t.id}`,
    });
  }

  return daftar;
}

export function pemberitahuan(
  peran: Peran,
  sumber: {
    pesanan: Pesanan[];
    pesananMasuk: PesananMasuk[];
    titikKumpul: TitikKumpul[];
    slugGerobak: string;
  },
  sekarang: number | null,
): Pemberitahuan[] {
  return peran === "pedagang"
    ? pemberitahuanPedagang(
        sumber.pesananMasuk,
        sumber.titikKumpul,
        sumber.slugGerobak,
        sekarang,
      )
    : pemberitahuanPembeli(sumber.pesanan, sumber.titikKumpul, sekarang);
}
