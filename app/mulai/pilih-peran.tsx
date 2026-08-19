"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, House, ShoppingBag } from "lucide-react";
import { BilahStatus } from "@/komponen/ui/bilah-status";
import { Tombol } from "@/komponen/ui/tombol";
import { JudulLangkah, KakiVersi, Kicker, TitikLangkah } from "@/komponen/ui/langkah";
import type { Peran } from "@/lib/tipe";

const pilihan = [
  {
    peran: "pembeli" as const,
    tag: "PEMBELI",
    judul: "Saya Ingin Membeli",
    isi: "Temukan jajanan keliling di sekitar lokasiku sekarang",
    Ikon: ShoppingBag,
  },
  {
    peran: "pedagang" as const,
    tag: "PEDAGANG",
    judul: "Saya Ingin Berdagang",
    isi: "Kumpulkan warga dan mulai berjualan hari ini",
    Ikon: House,
  },
];

/* Kedua peran sama-sama gratis dan tanpa komisi, jadi janji ini muncul
   pada kartu mana pun yang sedang dipilih, bukan menempel pada salah
   satunya. Begitu pula di rancangan: bingkai varian "Langkah 1 - Membeli"
   menampilkannya pada kartu pembeli. */
const janji = ["Gratis daftar", "Tanpa komisi"];

export function PilihPeran() {
  const router = useRouter();
  const [dipilih, setDipilih] = React.useState<Peran | null>(null);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-krem">
      <BilahStatus />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2">
        <div className="overflow-hidden rounded-[20px]">
          <Image
            src="/img/ilustrasi-gerobak.svg"
            alt="Gerobak jajanan keliling di bawah pohon"
            width={350}
            height={92}
            priority
            className="h-auto w-full"
          />
        </div>

        <div className="mt-4">
          <TitikLangkah ke={1} />
        </div>

        <div className="mt-3">
          <Kicker anak="LANGKAH 1 DARI 3" />
          <JudulLangkah anak="Selamat Datang!" />
          <p className="mt-2 text-[13px] leading-relaxed text-tinta-3">
            Pilih peranmu untuk mulai menjelajahi komunitas jajanan keliling terdekat.
          </p>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
            Pilih peran
          </legend>

          <div className="flex flex-col gap-3">
            {pilihan.map(({ peran, tag, judul, isi, Ikon }) => {
              const aktif = dipilih === peran;
              return (
                <label
                  key={peran}
                  className={`relative flex cursor-pointer gap-3.5 rounded-[16px] border p-4 transition-[border-color,box-shadow,background-color,opacity] duration-300 ease-out ${
                    aktif
                      ? "border-hijau bg-white shadow-[0_0_0_1px_var(--color-hijau),0_6px_18px_rgb(26_77_46/0.10)]"
                      : "border-garis bg-white/55 opacity-80"
                  }`}
                >
                  <input
                    type="radio"
                    name="peran"
                    value={peran}
                    checked={aktif}
                    onChange={() => setDipilih(peran)}
                    className="khusus-pembaca-layar"
                  />

                  <span className="grid size-11 shrink-0 place-items-center self-start rounded-[13px] bg-hijau-lembut text-hijau">
                    <Ikon size={20} strokeWidth={1.9} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="inline-block rounded-[6px] bg-hijau-lembut px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-hijau">
                      {tag}
                    </span>
                    <span className="mt-1.5 block text-[14.5px] font-bold text-tinta">{judul}</span>
                    <span className="mt-1 block text-[12px] leading-[1.45] text-tinta-3">{isi}</span>

                    {/* Baris janji tumbuh dari tinggi nol, bukan muncul
                        seketika, supaya kartunya terasa memuai saat dipilih.
                        `grid-rows` dianimasikan karena `height: auto` tidak
                        bisa ditransisikan. */}
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        aktif ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="mt-2.5 flex flex-wrap gap-1.5 border-t border-garis pt-2.5">
                          {janji.map((j) => (
                            <span
                              key={j}
                              className="rounded-[7px] bg-hijau-lembut px-2 py-1 text-[10px] font-medium text-hijau"
                            >
                              {j}
                            </span>
                          ))}
                        </span>
                      </span>
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className={`grid size-[19px] shrink-0 place-items-center self-start rounded-full border transition-all duration-200 ${
                      aktif
                        ? "scale-110 border-hijau bg-hijau text-white"
                        : "border-tinta-5 bg-white"
                    }`}
                  >
                    <Check
                      size={12}
                      strokeWidth={3.2}
                      className={`transition-opacity duration-200 ${aktif ? "opacity-100" : "opacity-0"}`}
                    />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-auto pt-6">
          <Tombol
            penuh
            disabled={!dipilih}
            onClick={() => router.push(`/mulai/${dipilih}/izin`)}
          >
            Lanjut
            <ArrowRight size={16} strokeWidth={2.4} />
          </Tombol>
          <KakiVersi />
        </div>
      </div>
    </div>
  );
}
