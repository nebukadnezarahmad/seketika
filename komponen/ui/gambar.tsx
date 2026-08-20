import Image from "next/image";

/**
 * Gambar yang sumbernya bisa berupa berkas di dalam aplikasi maupun foto
 * unggahan pengguna.
 *
 * `next/image` menolak data URL karena pengoptimalnya bekerja dengan
 * mengambil gambar lewat alamat, sedangkan foto unggahan sudah berada di
 * dalam halaman sebagai teks. Melewatkan seluruh gambar ke tag polos
 * bukan jawabannya: foto bawaan aplikasi justru untung besar dari
 * pengoptimal itu, yang mengubahnya jadi WebP seukuran yang benar-benar
 * dipakai. Jadi yang dipilih di sini bukan salah satunya, melainkan yang
 * tepat untuk tiap sumber.
 */
export function Gambar({
  src,
  alt,
  lebar,
  tinggi,
  penuh,
  sizes,
  className = "",
  prioritas,
}: {
  src: string;
  alt: string;
  lebar?: number;
  tinggi?: number;
  /** Memenuhi wadah berposisi di sekelilingnya, seperti `fill`. */
  penuh?: boolean;
  sizes?: string;
  className?: string;
  prioritas?: boolean;
}) {
  const unggahan = src.startsWith("data:");

  if (unggahan) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={penuh ? `absolute inset-0 size-full ${className}` : className}
        style={penuh ? undefined : { width: lebar, height: tinggi }}
      />
    );
  }

  if (penuh) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={prioritas} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={lebar}
      height={tinggi}
      sizes={sizes}
      priority={prioritas}
      className={className}
      style={{ width: lebar, height: tinggi }}
    />
  );
}
