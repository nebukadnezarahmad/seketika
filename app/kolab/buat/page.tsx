import type { Metadata } from "next";
import { Suspense } from "react";
import { BuatTitikKumpul } from "./buat-titik-kumpul";

export const metadata: Metadata = { title: "Buat Titik Kumpul" };

export default function Halaman() {
  return (
    <Suspense>
      <BuatTitikKumpul />
    </Suspense>
  );
}
