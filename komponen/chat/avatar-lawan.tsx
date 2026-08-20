import Image from "next/image";
import type { RupaLawan } from "./rupa";

/**
 * Avatar lawan bicara.
 *
 * Pedagang punya foto gerobak; warga tidak punya foto di aplikasi ini,
 * jadi memakai lingkaran berinisial seperti di layar pesanan masuk dan
 * titik kumpul. Bentuknya pun beda mengikuti rancangan: kotak membulat
 * untuk pedagang, lingkaran penuh untuk warga.
 */
export function AvatarLawan({
  rupa,
  nama,
  size = 44,
  titikDaring = true,
}: {
  rupa: RupaLawan;
  nama: string;
  size?: number;
  titikDaring?: boolean;
}) {
  return (
    <span className="relative shrink-0" style={{ width: size, height: size }}>
      {rupa.foto ? (
        <Image
          src={rupa.foto}
          alt=""
          width={size}
          height={size}
          className="rounded-[14px] object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          aria-hidden
          className="grid size-full place-items-center rounded-full bg-hijau-lembut font-bold text-hijau"
          style={{ fontSize: size * 0.36 }}
        >
          {rupa.inisial ?? nama.slice(0, 1).toUpperCase()}
        </span>
      )}

      {titikDaring && rupa.daring && (
        <span
          aria-label="Sedang aktif"
          className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-krem bg-hijau-terang"
        />
      )}
    </span>
  );
}
