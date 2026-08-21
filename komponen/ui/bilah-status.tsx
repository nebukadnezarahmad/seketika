"use client";

import * as React from "react";
import { IkonSinyal, IkonWifi, IkonBaterai } from "./ikon";

/** Bilah status ala ponsel dari desain. */
export function BilahStatus({ gelap = false }: { gelap?: boolean }) {
  const [jam, setJam] = React.useState<string | null>(null);
  const [daya, setDaya] = React.useState(1);

  React.useEffect(() => {
    const perbarui = () =>
      setJam(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    perbarui();
    const pewaktu = setInterval(perbarui, 20_000);
    return () => clearInterval(pewaktu);
  }, []);

  React.useEffect(() => {
    /* API baterai hanya ada di sebagian peramban. */
    type Baterai = {
      level: number;
      addEventListener: (e: string, f: () => void) => void;
      removeEventListener: (e: string, f: () => void) => void;
    };
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<Baterai>;
    };
    if (!nav.getBattery) return;

    let batal = false;
    /* Peramban mengembalikan objek BatteryManager yang sama sepanjang umur tab. */
    let lepas: (() => void) | undefined;
    nav
      .getBattery()
      .then((b) => {
        if (batal) return;
        setDaya(b.level);
        const saatBerubah = () => setDaya(b.level);
        b.addEventListener("levelchange", saatBerubah);
        lepas = () => b.removeEventListener("levelchange", saatBerubah);
      })
      .catch(() => {});

    return () => {
      batal = true;
      lepas?.();
    };
  }, []);

  const warna = gelap ? "text-white" : "text-hijau";

  return (
    <div
      className={`bilah-tiruan flex shrink-0 items-center justify-between px-6 pb-1 pt-4 ${warna}`}
    >
      <p className="text-[12px] font-semibold leading-[18px] tracking-[0.2px] tabular-nums">
        {/* Sebelum efek berjalan tidak ada teks apa pun, jadi tata letaknya tidak melompat begitu jam muncul. */}
        <span className="inline-block min-w-[35px]">{jam ?? ""}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <IkonSinyal size={16} />
        <IkonWifi size={16} />
        <IkonBaterai size={24} isi={daya} />
      </div>
    </div>
  );
}
