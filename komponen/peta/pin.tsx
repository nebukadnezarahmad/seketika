/** Pin peta, disusun ulang dari bentuk-bentuk ekspor Figma. */

/** Pin peta. */
export function Pin({
  size = 30,
  warna = "var(--color-hijau)",
  mata = "berlapis",
}: {
  size?: number;
  warna?: string;
  mata?: "berlapis" | "polos";
}) {
  return (
    <svg
      width={size}
      height={(size * 44) / 30}
      viewBox="0 0 30 44"
      fill="none"
      aria-hidden
    >
      <ellipse cx="15" cy="40" rx="10" ry="4" fill="black" fillOpacity="0.18" />
      <path
        d="M15 40C7 31 0 24 0 18C0 8 7 0 15 0C23 0 30 8 30 18C30 24 23 31 15 40Z"
        fill={warna}
      />
      {mata === "polos" ? (
        <circle cx="15" cy="17" r="6" fill="white" />
      ) : (
        <>
          <circle cx="15" cy="17" r="10" fill="white" />
          <circle cx="15" cy="17" r="5" fill={warna} opacity="0.85" />
          <circle cx="15" cy="17" r="2" fill="white" />
        </>
      )}
    </svg>
  );
}

export function PinPedagang({ size = 30 }: { size?: number }) {
  return <Pin size={size} warna="var(--color-hijau)" />;
}

/** Pin permintaan titik kumpul. Bentuknya sama, warnanya amber tua. */
export function PinKumpul({ size = 30 }: { size?: number }) {
  return <Pin size={size} warna="var(--color-amber-tua)" />;
}

/** Titik biru penanda posisi pengguna, dengan lingkaran denyut. */
export function PinSaya({ size = 28.64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28.64 28.64"
      fill="none"
      aria-hidden
    >
      <circle
        cx="14.32"
        cy="14.32"
        r="14.32"
        fill="#4285F4"
        fillOpacity="0.22"
        opacity="0.58"
      />
      <circle cx="14.32" cy="14.32" r="9" fill="#4285F4" fillOpacity="0.35" />
      <circle cx="14.32" cy="14.32" r="6" fill="#4285F4" />
      <circle cx="14.32" cy="14.32" r="3" fill="white" opacity="0.7" />
    </svg>
  );
}
