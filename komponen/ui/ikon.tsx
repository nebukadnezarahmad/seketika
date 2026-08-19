import type { SVGProps } from "react";

/**
 * Ikon yang disalin apa adanya dari berkas Figma SEKETIKA.
 *
 * Semua path di sini adalah data ekspor Figma, bukan gambar ulang. Warna
 * asli dari ekspor sudah diganti `currentColor` supaya satu ikon bisa
 * dipakai dalam keadaan aktif maupun tidak aktif tanpa menggandakan
 * berkas. Ukuran dan tebal garisnya tetap sama seperti di desain.
 *
 * Glyph di luar daftar ini diambil dari `lucide-react`. Keluarganya sama:
 * menskalakan path Figma ke viewBox 24 menghasilkan koordinat Lucide yang
 * bulat (2.749 → 3, 8.247 → 9, 10.996 → 12) dengan tebal garis 1.9.
 */

type Props = SVGProps<SVGSVGElement> & { size?: number };

const garis = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function IkonBeranda({ size = 22, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 21.992 21.992" {...p}>
      <g {...garis} strokeWidth={1.74103}>
        <path d="M2.749 8.247L10.996 1.83267L19.243 8.247V18.3267C19.243 18.8127 19.0499 19.2789 18.7062 19.6226C18.3625 19.9662 17.8964 20.1593 17.4103 20.1593H4.58167C4.09561 20.1593 3.62947 19.9662 3.28578 19.6226C2.94208 19.2789 2.749 18.8127 2.749 18.3267V8.247Z" />
        <path d="M8.247 20.1593V10.996H13.745V20.1593" />
      </g>
    </svg>
  );
}

export function IkonPesanan({ size = 22, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 21.992 21.992" {...p}>
      <g {...garis} strokeWidth={1.74103}>
        <path d="M8.247 4.58167H6.41433C5.92828 4.58167 5.46213 4.77475 5.11844 5.11844C4.77475 5.46213 4.58167 5.92828 4.58167 6.41433V17.4103C4.58167 17.8964 4.77475 18.3625 5.11844 18.7062C5.46213 19.0499 5.92828 19.243 6.41433 19.243H15.5777C16.0637 19.243 16.5299 19.0499 16.8736 18.7062C17.2172 18.3625 17.4103 17.8964 17.4103 17.4103V6.41433C17.4103 5.92828 17.2172 5.46213 16.8736 5.11844C16.5299 4.77475 16.0637 4.58167 15.5777 4.58167H13.745" />
        <path d="M11.9123 2.749H10.0797C9.06751 2.749 8.247 3.56951 8.247 4.58167C8.247 5.59382 9.06751 6.41433 10.0797 6.41433H11.9123C12.9245 6.41433 13.745 5.59382 13.745 4.58167C13.745 3.56951 12.9245 2.749 11.9123 2.749Z" />
        <path d="M8.247 10.996H13.745" />
        <path d="M8.247 14.6613H11.9123" />
      </g>
    </svg>
  );
}

export function IkonChat({ size = 22, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 21.992 21.992" {...p}>
      <path
        {...garis}
        strokeWidth={1.74103}
        d="M19.243 13.745C19.243 14.2311 19.0499 14.6972 18.7062 15.0409C18.3625 15.3846 17.8964 15.5777 17.4103 15.5777H6.41433L2.749 19.243V4.58167C2.749 4.09561 2.94208 3.62947 3.28578 3.28578C3.62947 2.94208 4.09561 2.749 4.58167 2.749H17.4103C17.8964 2.749 18.3625 2.94208 18.7062 3.28578C19.0499 3.62947 19.243 4.09561 19.243 4.58167V13.745Z"
      />
    </svg>
  );
}

export function IkonProfil({ size = 22, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 21.992 21.992" {...p}>
      <g {...garis} strokeWidth={1.74103}>
        <path d="M18.3267 19.243V17.4103C18.3267 16.4382 17.9405 15.5059 17.2531 14.8186C16.5657 14.1312 15.6334 13.745 14.6613 13.745H7.33067C6.35856 13.745 5.42627 14.1312 4.73888 14.8186C4.0515 15.5059 3.66533 16.4382 3.66533 17.4103V19.243" />
        <path d="M10.996 10.0797C13.0203 10.0797 14.6613 8.43864 14.6613 6.41433C14.6613 4.39003 13.0203 2.749 10.996 2.749C8.97169 2.749 7.33067 4.39003 7.33067 6.41433C7.33067 8.43864 8.97169 10.0797 10.996 10.0797Z" />
      </g>
    </svg>
  );
}

export function IkonPin({ size = 18, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 17.996 17.996" {...p}>
      <path
        {...garis}
        strokeWidth={1.49967}
        d="M8.998 1.49967C6.09615 1.49967 3.74917 3.84665 3.74917 6.7485C3.74917 10.6851 8.998 16.4963 8.998 16.4963C8.998 16.4963 14.2468 10.6851 14.2468 6.7485C14.2468 3.84665 11.8999 1.49967 8.998 1.49967Z"
      />
      <path
        fill="currentColor"
        d="M8.998 8.62308C10.0333 8.62308 10.8726 7.7838 10.8726 6.7485C10.8726 5.7132 10.0333 4.87392 8.998 4.87392C7.9627 4.87392 7.12342 5.7132 7.12342 6.7485C7.12342 7.7838 7.9627 8.62308 8.998 8.62308Z"
      />
    </svg>
  );
}

export function IkonCari({ size = 16, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 15.9934 15.9934" {...p}>
      <g {...garis} strokeWidth={1.46606}>
        <path d="M7.33031 12.6614C10.2746 12.6614 12.6614 10.2746 12.6614 7.33031C12.6614 4.386 10.2746 1.99917 7.33031 1.99917C4.386 1.99917 1.99917 4.386 1.99917 7.33031C1.99917 10.2746 4.386 12.6614 7.33031 12.6614Z" />
        <path d="M13.9942 13.9942L11.0954 11.0954" />
      </g>
    </svg>
  );
}

/** Bintang penilaian. Warnanya amber dan tidak pernah berubah. */
export function IkonBintang({ size = 11, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 10.996 10.996" {...p}>
      <path
        fill="#f59e0b"
        d="M5.498 0.916333L6.91374 3.78446L10.0797 4.24721L7.78883 6.47848L8.32947 9.63066L5.498 8.14162L2.66653 9.63066L3.20717 6.47848L0.916333 4.24721L4.08226 3.78446L5.498 0.916333Z"
      />
    </svg>
  );
}

export function IkonKompas({ size = 18, ...p }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 17.996 17.996" {...p}>
      <path
        {...garis}
        strokeWidth={1.19973}
        d="M8.998 16.4963C13.1392 16.4963 16.4963 13.1392 16.4963 8.998C16.4963 4.85678 13.1392 1.49967 8.998 1.49967C4.85678 1.49967 1.49967 4.85678 1.49967 8.998C1.49967 13.1392 4.85678 16.4963 8.998 16.4963Z"
      />
      <path
        {...garis}
        strokeWidth={1.19973}
        fill="currentColor"
        opacity={0.5}
        d="M12.1773 5.81871L10.5876 10.5876L5.81871 12.1773L7.40835 7.40835L12.1773 5.81871Z"
      />
    </svg>
  );
}

/* --- Ikon bilah status. Opasitas bertingkatnya ikut desain. --- */

export function IkonSinyal({ size = 16, ...p }: Props) {
  return (
    <svg width={size} height={(size * 11.9973) / 15.9934} viewBox="0 0 15.9934 11.9973" fill="currentColor" {...p}>
      <rect x="0" y="6.998" width="2.999" height="4.998" rx="1" />
      <rect x="4.498" y="4.499" width="2.999" height="7.497" rx="1" />
      <rect x="8.996" y="2.0" width="2.999" height="9.996" rx="1" />
      <rect x="13.494" y="0.001" width="2.499" height="11.995" rx="1" opacity={0.3} />
    </svg>
  );
}

export function IkonWifi({ size = 16, ...p }: Props) {
  return (
    <svg width={size} height={(size * 11.9973) / 15.9934} viewBox="0 0 15.9934 11.9973" fill="none" {...p}>
      <g stroke="currentColor" strokeWidth={1.33278} strokeLinecap="round">
        <path opacity={0.3} d="M0.666392 3.99947C3.66515 1.00071 12.3282 1.00071 15.327 3.99947" />
        <path opacity={0.6} d="M2.99876 6.33185C4.99794 4.33267 10.9955 4.33267 12.9946 6.33185" />
        <path d="M5.33113 8.66422C6.53064 7.46471 9.46276 7.46471 10.6623 8.66422" />
      </g>
      <path
        fill="currentColor"
        d="M7.9967 12.3294C8.54876 12.3294 8.99629 11.8818 8.99629 11.3298C8.99629 10.7777 8.54876 10.3302 7.9967 10.3302C7.44464 10.3302 6.99711 10.7777 6.99711 11.3298C6.99711 11.8818 7.44464 12.3294 7.9967 12.3294Z"
      />
    </svg>
  );
}

/** Baterai. `isi` 0–1 mengatur lebar batang dalamnya. */
export function IkonBaterai({ size = 24, isi = 1, ...p }: Props & { isi?: number }) {
  const penuh = Math.max(0, Math.min(1, isi));
  return (
    <svg width={size} height={(size * 11.9973) / 23.9946} viewBox="0 0 23.9946 11.9973" fill="none" {...p}>
      <rect x="0.5" y="0.5" width="19.9955" height="10.9975" rx="2.999" stroke="currentColor" strokeWidth={1.19973} />
      <rect x="1.99955" y="1.99955" width={15.9963 * penuh} height="7.9982" rx="1.5" fill="currentColor" />
      <path d="M21.4952 3.9991V7.9991" stroke="currentColor" strokeWidth={1.49966} strokeLinecap="round" />
    </svg>
  );
}
