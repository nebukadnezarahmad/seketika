"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { House, Info, MapPin, Minus, Plus, Upload } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { cariPedagang } from "@/lib/data/pedagang";
import { useToko } from "@/lib/toko";

/** Titik kumpul hangus setelah sehari kalau targetnya tak juga terpenuhi. */
const UMUR_JAM = 24;
const TARGET_MIN = 2;
const TARGET_MAKS = 20;

export function BuatTitikKumpul() {
  const router = useRouter();
  const cari = useSearchParams();
  const slug = cari.get("pedagang") ?? "siomay-pak-agus";
  const pedagang = cariPedagang(slug);

  const buat = useToko((s) => s.buatTitikKumpul);
  const profil = useToko((s) => s.profil);

  const [lokasi, setLokasi] = React.useState("");
  const [target, setTarget] = React.useState(0);
  const [catatan, setCatatan] = React.useState("");

  const boleh = lokasi.trim().length >= 3 && target >= TARGET_MIN;

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boleh) return;
    const nama = profil?.nama ?? "Anda";
    const id = buat({
      nama: lokasi.trim(),
      patokan: profil?.patokan?.trim() || "Titik kumpul warga",
      pedagangSlug: slug,
      target,
      peserta: [{ id: "saya", nama, inisial: nama.slice(0, 1).toUpperCase() }],
      kedaluwarsa: new Date(Date.now() + UMUR_JAM * 3_600_000).toISOString(),
      jarak: 0,
      catatan: catatan.trim() || undefined,
    });
    router.replace(`/kolab/${id}/berhasil`);
  };

  return (
    <Layar nav>
      <Kepala judul="Buat Titik Kumpul" />

      <form onSubmit={kirim} className="px-4 pb-4 pt-3">
        <div className="bayang-kartu rounded-[20px] border border-garis bg-white p-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Jenis Dagangan
            </p>
            {/* Pedagangnya sudah ditentukan dari layar sebelumnya, jadi ditampilkan saja alih-alih dibuka untuk diubah. */}
            <p className="flex items-center gap-2.5 rounded-[12px] bg-krem px-3 py-2.5 text-[13.5px] font-semibold text-tinta">
              <House size={15} className="shrink-0 text-hijau" />
              {pedagang?.nama ?? "Pedagang"}
            </p>
          </div>

          <label className="mt-4 block border-t border-garis pt-4">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Lokasi Titik Kumpul
            </span>
            <span className="flex items-center gap-2.5 rounded-[12px] border border-garis bg-krem px-3 py-2.5">
              <MapPin size={15} className="shrink-0 text-tinta-5" />
              <input
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Misal: RT 03 Perumahan Indah"
                required
                className="w-full bg-transparent text-[13.5px] text-tinta placeholder:text-tinta-3 focus:outline-none"
              />
            </span>
          </label>

          <div className="mt-4 border-t border-garis pt-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Target Minimal Warga
            </p>
            <div className="flex items-center justify-between rounded-[12px] border border-garis bg-krem px-2 py-1.5">
              <button
                type="button"
                aria-label="Kurangi target"
                onClick={() => setTarget((n) => Math.max(0, n - 1))}
                className="grid size-9 place-items-center rounded-full text-hijau transition-transform active:scale-90 disabled:opacity-35"
                disabled={target === 0}
              >
                <Minus size={16} strokeWidth={2.6} />
              </button>
              <p className="text-[15px] font-extrabold tabular-nums text-hijau">
                {target}
                <span className="ml-1 text-[12px] font-medium text-tinta-4">
                  warga
                </span>
              </p>
              <button
                type="button"
                aria-label="Tambah target"
                onClick={() => setTarget((n) => Math.min(TARGET_MAKS, n + 1))}
                className="grid size-9 place-items-center rounded-full text-hijau transition-transform active:scale-90 disabled:opacity-35"
                disabled={target === TARGET_MAKS}
              >
                <Plus size={16} strokeWidth={2.6} />
              </button>
            </div>
            <p className="mt-2 text-[11px] text-tinta-4">
              {target > 0 && target < TARGET_MIN
                ? `Target minimal ${TARGET_MIN} warga agar layak dijemput.`
                : "Pedagang akan datang setelah target terpenuhi."}
            </p>
          </div>

          <label className="mt-4 block border-t border-garis pt-4">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Catatan (Opsional)
            </span>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Misal: Datang jam 9 pagi ya biar bareng..."
              className="w-full resize-none rounded-[12px] border border-garis bg-krem px-3 py-2.5 text-[13.5px] leading-snug text-tinta placeholder:text-tinta-3 focus:outline-none"
            />
          </label>
        </div>

        <p className="mt-3.5 flex gap-2.5 rounded-[14px] bg-hijau-lembut/70 p-3.5 text-[11.5px] leading-relaxed text-tinta-3">
          <Info size={15} className="mt-px shrink-0 text-hijau" />
          Titik kumpul akan otomatis berakhir dalam {UMUR_JAM} jam jika target
          tidak terpenuhi.
        </p>

        <div className="mt-4">
          <Tombol penuh type="submit" disabled={!boleh}>
            <Upload size={16} strokeWidth={2.3} />
            Publish Titik Kumpul
          </Tombol>
        </div>
      </form>
    </Layar>
  );
}
