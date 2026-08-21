"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IkonBeranda,
  IkonPesanan,
  IkonChat,
  IkonProfil,
} from "@/komponen/ui/ikon";

type Tab = {
  label: string;
  href: string;
  Ikon: typeof IkonBeranda;
  /** Ruas awal yang menandai tab ini sedang aktif. */
  cocok: string;
};

const tabPembeli: Tab[] = [
  { label: "Beranda", href: "/beranda", Ikon: IkonBeranda, cocok: "/beranda" },
  { label: "Pesanan", href: "/pesanan", Ikon: IkonPesanan, cocok: "/pesanan" },
  { label: "Chat", href: "/chat", Ikon: IkonChat, cocok: "/chat" },
  { label: "Profil", href: "/profil", Ikon: IkonProfil, cocok: "/profil" },
];

const tabPedagang: Tab[] = [
  { label: "Beranda", href: "/d", Ikon: IkonBeranda, cocok: "/d" },
  {
    label: "Pesanan",
    href: "/d/pesanan",
    Ikon: IkonPesanan,
    cocok: "/d/pesanan",
  },
  { label: "Chat", href: "/d/chat", Ikon: IkonChat, cocok: "/d/chat" },
  { label: "Profil", href: "/d/profil", Ikon: IkonProfil, cocok: "/d/profil" },
];

/** Navigasi bawah, empat tab, sama untuk kedua peran tapi tujuannya beda. */
export function NavBawah({
  peran = "pembeli",
}: {
  peran?: "pembeli" | "pedagang";
}) {
  const jalur = usePathname();
  const tab = peran === "pedagang" ? tabPedagang : tabPembeli;

  return (
    <nav
      aria-label={peran === "pedagang" ? "Navigasi pedagang" : "Navigasi utama"}
      /* Lapisannya di atas lembar (z-40), bukan di bawahnya. */
      className="bayang-nav sticky bottom-0 z-50 grid shrink-0 grid-cols-4 border-t border-garis bg-white pb-[env(safe-area-inset-bottom)]"
    >
      {tab.map(({ label, href, Ikon, cocok }) => {
        /* Tab beranda pedagang beralamat "/d" saja, jadi pencocokan awalan akan membuatnya aktif di semua halaman pedagang. */
        const aktif = cocok === "/d" ? jalur === "/d" : jalur.startsWith(cocok);

        return (
          <Link
            key={href}
            href={href}
            aria-current={aktif ? "page" : undefined}
            className="relative flex h-[62px] flex-col items-center gap-[3px] pt-2.5 transition-colors"
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 mx-auto h-[3px] rounded-b-pil bg-hijau transition-all ${
                aktif ? "w-9" : "w-0"
              }`}
            />
            <span
              className={`grid h-7 w-14 place-items-center rounded-pil transition-colors ${
                aktif ? "bg-hijau-lembut" : "bg-transparent"
              }`}
            >
              <Ikon
                size={21}
                className={aktif ? "text-hijau" : "text-tinta-3"}
              />
            </span>
            <span
              className={`text-[10px] leading-[14px] tracking-[0.1px] ${
                aktif ? "font-bold text-hijau" : "font-medium text-tinta-3"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
