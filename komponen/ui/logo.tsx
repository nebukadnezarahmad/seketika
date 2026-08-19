import Image from "next/image";

/**
 * Lambang SEKETIKA: pin lokasi di atas roda gerobak.
 *
 * Berkasnya vektor hasil ekspor Figma yang sudah dibersihkan; ekspor
 * mentahnya ikut membawa persegi latar kanvas Figma, jadi hanya grup
 * logonya yang dipertahankan.
 */
export function Logo({ size = 112, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/img/logo.svg"
      alt=""
      width={142}
      height={137}
      priority
      className={className}
      style={{ width: size, height: (size * 137) / 142 }}
    />
  );
}

/** Coretan oranye di bawah kalimat sapaan. */
export function GarisTanya({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 49.3369 14.7214" fill="none" aria-hidden className={className}>
      <path
        d="M49.3157 14.7214L45.8058 14.6609C45.8234 14.582 45.8199 14.5032 45.8199 14.4238C45.8199 7.04951 25.7133 1.04955 0.99731 1.04955C0.732341 1.04739 0.467179 1.04879 0.202634 1.05376L0 0.0059235C0.399002 -0.00197449 0.797313 0 1.19631 0C26.2646 0 46.8199 6.47059 46.8199 14.4238C46.8199 14.5238 46.8164 14.6231 46.8095 14.7214H49.3157Z"
        fill="#F59E0B"
      />
    </svg>
  );
}
