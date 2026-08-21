import { rupaPercakapan, rupaPercakapanPedagang } from "@/lib/data/awal";
import type { Peran } from "@/lib/tipe";

/** Bagaimana satu percakapan ditampilkan, tergantung siapa yang membuka. */
export type RupaLawan = {
  /** Foto kalau lawan bicaranya pedagang; warga memakai inisial. */
  foto?: string;
  inisial?: string;
  daring: boolean;
  kapan: string;
  belumDibaca?: number;
};

export function rupaLawan(id: string, peran: Peran): RupaLawan {
  if (peran === "pedagang") {
    return (
      rupaPercakapanPedagang[id] ?? { inisial: "?", daring: false, kapan: "" }
    );
  }
  const r = rupaPercakapan[id];
  return {
    foto: r?.foto ?? "/img/foto-bakso.jpg",
    daring: r?.daring ?? false,
    kapan: r?.kapan ?? "",
    /* Di sisi pembeli hanya percakapan pertama yang punya lencana belum dibaca, sesuai rancangannya. */
    belumDibaca: id === "ch-01" ? 1 : undefined,
  };
}

/** Kata-kata yang berbeda antara kedua kotak masuk. */
export const salinan = {
  pembeli: {
    judul: "Chat",
    subjudul: undefined as string | undefined,
    cari: "Cari pedagang...",
    ketik: "Ketik pesan...",
    daring: "Online",
    luring: "Offline",
  },
  pedagang: {
    judul: "Pesan Masuk",
    subjudul: "Pesan dari calon pembeli Anda",
    cari: "Cari nama pembeli...",
    ketik: "Balas pesan...",
    daring: "Sedang aktif",
    luring: "Tidak aktif",
  },
} as const;
