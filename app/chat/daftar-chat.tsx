"use client";

import * as React from "react";
import Link from "next/link";
import { Layar } from "@/komponen/ui/layar";
import { AvatarLawan } from "@/komponen/chat/avatar-lawan";
import { rupaLawan, salinan } from "@/komponen/chat/rupa";
import { useToko } from "@/lib/toko";
import type { Peran } from "@/lib/tipe";

/**
 * Kotak masuk. Kedua peran memakai layar ini, tapi isinya berbeda: warga
 * berbicara dengan pedagang, pedagang berbicara dengan warga. Sebelumnya
 * keduanya membaca daftar yang sama, sehingga pedagang melihat
 * percakapannya dengan sesama pedagang.
 */
export function DaftarChat({ peran = "pembeli" }: { peran?: Peran }) {
  const [kata, setKata] = React.useState("");
  const percakapan = useToko((s) =>
    peran === "pedagang" ? s.percakapanPedagang : s.percakapan,
  );

  const kata_ = salinan[peran];
  const awalan = peran === "pedagang" ? "/d" : "";
  const terlihat = percakapan.filter((c) =>
    c.nama.toLowerCase().includes(kata.trim().toLowerCase()),
  );
  const belumDibaca = percakapan.reduce(
    (n, c) => n + (rupaLawan(c.id, peran).belumDibaca ?? 0),
    0,
  );

  return (
    <Layar nav peran={peran}>
      <div className="px-4 pb-3 pt-3 text-center">
        <h1 className="inline-flex items-center gap-2 text-[19px] font-extrabold text-hijau">
          {kata_.judul}
          {peran === "pedagang" && belumDibaca > 0 && (
            <span className="grid size-[22px] place-items-center rounded-full bg-hijau text-[11px] font-bold text-white">
              {belumDibaca}
            </span>
          )}
        </h1>
        {kata_.subjudul && (
          <p className="mt-0.5 text-[12px] text-tinta-4">{kata_.subjudul}</p>
        )}
      </div>

      <div className="px-4 pb-2">
        <input
          value={kata}
          onChange={(e) => setKata(e.target.value)}
          placeholder={kata_.cari}
          aria-label="Cari percakapan"
          className="w-full rounded-[14px] border border-garis bg-white px-4 py-3 text-center text-[13px] text-tinta placeholder:text-tinta-3 focus:border-hijau/40 focus:outline-none"
        />
      </div>

      <ul className="rentet px-4">
        {terlihat.map((c) => {
          const rupa = rupaLawan(c.id, peran);
          const akhir = c.pesan.at(-1);

          return (
            <li key={c.id} className="border-b border-garis last:border-b-0">
              <Link href={`${awalan}/chat/${c.id}`} className="flex items-center gap-3 py-3">
                <AvatarLawan rupa={rupa} nama={c.nama} size={44} />

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[14px] font-bold text-tinta">{c.nama}</span>
                    <span className="shrink-0 text-[11px] text-tinta-4">{rupa.kapan}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[12px] text-tinta-4">{akhir?.isi}</span>
                    {rupa.belumDibaca && (
                      <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-hijau text-[10px] font-bold text-white">
                        {rupa.belumDibaca}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}

        {terlihat.length === 0 && (
          <li className="py-14 text-center text-[12.5px] text-tinta-4">
            Tidak ada percakapan yang cocok.
          </li>
        )}
      </ul>
    </Layar>
  );
}
