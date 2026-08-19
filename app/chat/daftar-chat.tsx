"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Layar } from "@/komponen/ui/layar";
import { rupaPercakapan } from "@/lib/data/awal";
import { useToko } from "@/lib/toko";

export function DaftarChat({ peran = "pembeli" }: { peran?: "pembeli" | "pedagang" }) {
  const [kata, setKata] = React.useState("");
  const percakapan = useToko((s) => s.percakapan);

  const terlihat = percakapan.filter((c) =>
    c.nama.toLowerCase().includes(kata.trim().toLowerCase()),
  );

  return (
    <Layar nav peran={peran}>
      <h1 className="px-4 pb-3 pt-3 text-center text-[19px] font-extrabold text-hijau">Chat</h1>

      <div className="px-4 pb-2">
        <input
          value={kata}
          onChange={(e) => setKata(e.target.value)}
          placeholder="Cari pedagang..."
          aria-label="Cari percakapan"
          className="w-full rounded-[14px] border border-garis bg-white px-4 py-3 text-center text-[13px] text-tinta placeholder:text-tinta-3 focus:border-hijau/40 focus:outline-none"
        />
      </div>

      <ul className="rentet px-4">
        {terlihat.map((c) => {
          const rupa = rupaPercakapan[c.id];
          const akhir = c.pesan.at(-1);
          /* Lencana belum dibaca hanya untuk pesan terakhir dari lawan
             bicara; pesan sendiri jelas sudah terbaca. */
          const belumDibaca = akhir && !akhir.saya && c.id === "ch-01";

          return (
            <li key={c.id} className="border-b border-garis last:border-b-0">
              <Link href={`${peran === "pedagang" ? "/d" : ""}/chat/${c.id}`} className="flex items-center gap-3 py-3">
                <span className="relative shrink-0">
                  <Image
                    src={rupa?.foto ?? "/img/foto-bakso.jpg"}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-[14px] object-cover"
                  />
                  {rupa?.daring && (
                    <span
                      aria-label="Sedang daring"
                      className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-krem bg-[#22c55e]"
                    />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[14px] font-bold text-tinta">{c.nama}</span>
                    <span className="shrink-0 text-[11px] text-tinta-4">{rupa?.kapan}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[12px] text-tinta-4">{akhir?.isi}</span>
                    {belumDibaca && (
                      <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-hijau text-[10px] font-bold text-white">
                        1
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
