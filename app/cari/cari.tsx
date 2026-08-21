"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Search, Tag } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Tombol } from "@/komponen/ui/tombol";
import { IkonCari } from "@/komponen/ui/ikon";

const anggaran = [
  { nilai: "", label: "Pilih Estimasi Budget" },
  { nilai: "0-10000", label: "Di bawah Rp 10.000" },
  { nilai: "10000-20000", label: "Rp 10.000 - Rp 20.000" },
  { nilai: "20000-", label: "Di atas Rp 20.000" },
];

export function Cari() {
  const router = useRouter();
  const [kata, setKata] = React.useState("");
  const [budget, setBudget] = React.useState("");

  const cari = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (kata.trim()) q.set("q", kata.trim());
    if (budget) q.set("budget", budget);
    router.push(`/hasil?${q}`);
  };

  return (
    <Layar nav>
      <div className="px-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="grid size-9 place-items-center rounded-full bg-hijau-lembut text-hijau transition-transform active:scale-90"
        >
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>
      </div>

      <form onSubmit={cari} className="flex flex-1 flex-col px-6 pb-4">
        <div className="mt-6 flex flex-col items-center text-center">
          <span className="grid size-[88px] place-items-center rounded-[26px] bg-hijau-lembut text-hijau">
            <IkonCari size={34} />
          </span>
          <h1 className="tulisan-judul mt-6 text-[24px] font-extrabold tracking-[-0.02em] text-hijau">
            Apa yang Anda cari?
          </h1>
          <p className="mt-1.5 text-[13px] text-tinta-4">
            Temukan makanan, minuman, dan lainnya
          </p>
        </div>

        <div className="bayang-kartu mt-8 rounded-2xl border border-garis bg-white p-4">
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Pencarian
            </span>
            <span className="flex items-center gap-2.5 rounded-[12px] border border-garis bg-krem px-3 py-2.5">
              <Search size={15} className="shrink-0 text-tinta-5" />
              <input
                value={kata}
                onChange={(e) => setKata(e.target.value)}
                placeholder="Ketik yang Anda cari..."
                className="w-full bg-transparent text-[13px] text-tinta placeholder:text-tinta-3 focus:outline-none"
              />
            </span>
          </label>

          <label className="mt-4 block border-t border-garis pt-4">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
              Estimasi Harga
            </span>
            <span className="relative flex items-center gap-2.5 rounded-[12px] border border-garis bg-krem px-3 py-2.5">
              <Tag size={15} className="shrink-0 text-tinta-5" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={`w-full appearance-none bg-transparent text-[13px] focus:outline-none ${
                  budget ? "text-tinta" : "text-tinta-5"
                }`}
              >
                {anggaran.map((a) => (
                  <option key={a.nilai} value={a.nilai}>
                    {a.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none shrink-0 text-tinta-5"
              />
            </span>
          </label>
        </div>

        <div className="mt-6">
          <Tombol penuh type="submit">
            Cari
          </Tombol>
          <p className="mt-4 text-center">
            <Link
              href="/beranda"
              className="text-[12.5px] text-tinta-4 underline underline-offset-4"
            >
              Atau lihat lihat dulu
            </Link>
          </p>
        </div>
      </form>
    </Layar>
  );
}
