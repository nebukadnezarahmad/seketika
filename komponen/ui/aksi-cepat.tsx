import Link from "next/link";
import type { LucideIcon } from "lucide-react";

/** Deret pintasan layanan di beranda. */
export type Pintasan = {
  label: string;
  href: string;
  Ikon: LucideIcon;
  /** Kelas latar dan warna ikon, dipasangkan dari token tema. */
  warna: string;
  /** Angka atau kata pendek pada keping pojok. Kosong berarti tanpa keping. */
  keping?: string;
};

export function AksiCepat({ pintasan }: { pintasan: readonly Pintasan[] }) {
  return (
    <nav aria-label="Pintasan layanan" className="px-4 pt-3.5">
      <ul className="grid grid-cols-4 items-start gap-y-3">
        {pintasan.map(({ label, href, Ikon, warna, keping }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-[14px] transition-transform active:scale-95"
            >
              <span className="relative">
                <span
                  aria-hidden
                  className={`grid size-[58px] place-items-center rounded-[19px] ${warna}`}
                >
                  <Ikon size={26} strokeWidth={1.9} />
                </span>
                {keping && (
                  /* Keping menumpang di tepi ubin, bukan di dalamnya, persis seperti label promo pada aplikasi rujukan. */
                  <span
                    aria-hidden
                    className="absolute -left-1.5 -top-1.5 rounded-[8px] bg-tinta px-1.5 py-[3px] text-[8.5px] font-bold leading-[10px] text-white"
                  >
                    {keping}
                  </span>
                )}
              </span>
              <span className="max-w-[76px] text-center text-[11px] font-bold leading-[14px] text-tinta">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
