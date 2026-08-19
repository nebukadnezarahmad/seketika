/**
 * Pin peta, disusun ulang dari bentuk-bentuk ekspor Figma.
 *
 * Ekspor gugusnya ikut membawa latar kanvas Figma, jadi tiap bentuk
 * diambil satuan lalu ditata kembali memakai koordinat yang dihitung
 * dari nilai inset pada berkas desain. Angka di bawah bukan kira-kira:
 * 30x44 untuk pin, dengan bayangan 20x8 di (5, 36), badan 30x40 di
 * (0, 0), lingkaran putih 20x20 di (5, 7), dan seterusnya.
 */

export function PinPedagang({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 44) / 30} viewBox="0 0 30 44" fill="none" aria-hidden>
      <ellipse cx="15" cy="40" rx="10" ry="4" fill="black" fillOpacity="0.18" />
      <path d="M15 40C7 31 0 24 0 18C0 8 7 0 15 0C23 0 30 8 30 18C30 24 23 31 15 40Z" fill="#1A4D2E" />
      <circle cx="15" cy="17" r="10" fill="white" />
      <circle cx="15" cy="17" r="5" fill="#1A4D2E" opacity="0.85" />
      <circle cx="15" cy="17" r="2" fill="white" />
    </svg>
  );
}

/** Pin permintaan titik kumpul. Bentuknya sama, warnanya amber. */
export function PinKumpul({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 44) / 30} viewBox="0 0 30 44" fill="none" aria-hidden>
      <ellipse cx="15" cy="40" rx="10" ry="4" fill="black" fillOpacity="0.18" />
      <path d="M15 40C7 31 0 24 0 18C0 8 7 0 15 0C23 0 30 8 30 18C30 24 23 31 15 40Z" fill="#D97706" />
      <circle cx="15" cy="17" r="10" fill="white" />
      <circle cx="15" cy="17" r="5" fill="#D97706" opacity="0.85" />
      <circle cx="15" cy="17" r="2" fill="white" />
    </svg>
  );
}

/** Titik biru penanda posisi pengguna, dengan lingkaran denyut. */
export function PinSaya({ size = 28.64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28.64 28.64" fill="none" aria-hidden>
      <circle cx="14.32" cy="14.32" r="14.32" fill="#4285F4" fillOpacity="0.22" opacity="0.58" />
      <circle cx="14.32" cy="14.32" r="9" fill="#4285F4" fillOpacity="0.35" />
      <circle cx="14.32" cy="14.32" r="6" fill="#4285F4" />
      <circle cx="14.32" cy="14.32" r="3" fill="white" opacity="0.7" />
    </svg>
  );
}
