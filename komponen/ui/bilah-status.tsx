"use client";

import * as React from "react";
import { IkonSinyal, IkonWifi, IkonBaterai } from "./ikon";

/**
 * Bilah status ala ponsel dari desain.
 *
 * Di Figma jamnya tertulis mati 9:41. Di sini jam dan daya baterainya
 * dibaca dari perangkat sungguhan: bilah yang menampilkan waktu palsu
 * di sebelah jam asli peramban akan langsung terbaca sebagai maket,
 * dan itu justru merusak kesan yang ingin dibangun desainnya.
 *
 * Nilai awalnya sengaja dikosongkan, bukan diisi jam server. Jam server
 * hampir pasti beda zona waktu dengan penggunanya, dan perbedaan itu
 * memicu galat hidrasi React.
 *
 * Bilah ini masuk akal di peramban, tempat ia membuat halaman terasa
 * seperti layar ponsel. Di aplikasi yang sudah dipasang ia justru salah:
 * Android dan iOS sudah menggambar bilah status sungguhan di atas
 * jendela, jadi yang terlihat pengguna adalah dua bilah status
 * bertumpuk, lengkap dengan dua jam yang menunjukkan waktu sama.
 *
 * Penyembunyiannya lewat CSS `display-mode: standalone`, bukan lewat
 * pemeriksaan di JavaScript. Pemeriksaan JavaScript baru tahu jawabannya
 * setelah komponen hidup, jadi bilah tiruannya sempat terlukis satu
 * bingkai lalu hilang, dan kedipan itu terjadi di setiap perpindahan
 * layar. Penggantinya berupa ruang kosong setipis area aman perangkat
 * supaya isi layar tidak menempel ke tepi atas.
 */
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
    /* API baterai hanya ada di sebagian peramban. Kalau tidak ada,
       ikonnya tetap tampil penuh alih-alih hilang atau menampilkan
       angka karangan. */
    type Baterai = {
      level: number;
      addEventListener: (e: string, f: () => void) => void;
      removeEventListener: (e: string, f: () => void) => void;
    };
    const nav = navigator as Navigator & { getBattery?: () => Promise<Baterai> };
    if (!nav.getBattery) return;

    let batal = false;
    /* Peramban mengembalikan objek BatteryManager yang sama sepanjang umur
       tab. Karena bilah ini dipasang ulang pada setiap perpindahan
       halaman, pendengar yang tidak dilepas akan menumpuk tanpa batas
       pada objek yang sama, lengkap dengan closure dari komponen yang
       sudah lama dilepas. Karena itu rujukannya disimpan dan dilepas. */
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
    <>
      <div aria-hidden className="ruang-status" />
      <div
        className={`bilah-tiruan flex shrink-0 items-center justify-between px-6 pb-1 pt-4 ${warna}`}
      >
        <p className="text-[12px] font-semibold leading-[18px] tracking-[0.2px] tabular-nums">
          {/* Sebelum efek berjalan tidak ada teks apa pun, jadi tata
              letaknya tidak melompat begitu jam muncul. */}
          <span className="inline-block min-w-[35px]">{jam ?? ""}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <IkonSinyal size={16} />
          <IkonWifi size={16} />
          <IkonBaterai size={24} isi={daya} />
        </div>
      </div>
    </>
  );
}
