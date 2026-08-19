"use client";

import { useSyncExternalStore } from "react";

/**
 * Waktu sekarang yang aman dibaca saat render.
 *
 * Memanggil `Date.now()` langsung di badan komponen membuat render tidak
 * murni: dua render berturut-turut bisa menghasilkan tampilan berbeda
 * tanpa ada state yang berubah, dan hasil di server tidak akan cocok
 * dengan hasil di peramban.
 *
 * Nilainya dibulatkan ke kelipatan `selang` supaya `getSnapshot`
 * mengembalikan angka yang sama selama satu jendela waktu. Tanpa
 * pembulatan itu React akan menganggap datanya berubah pada setiap
 * pemeriksaan dan me-render tanpa henti.
 *
 * Di server nilainya `null`; komponen yang memakainya harus siap dengan
 * keadaan "belum tahu waktunya".
 */
export function useSekarang(selang = 60_000): number | null {
  return useSyncExternalStore(
    (ubah) => {
      const pewaktu = setInterval(ubah, selang);
      return () => clearInterval(pewaktu);
    },
    () => Math.floor(Date.now() / selang) * selang,
    () => null,
  );
}
