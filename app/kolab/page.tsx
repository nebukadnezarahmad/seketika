import type { Metadata } from "next";
import { Suspense } from "react";
import { PesanKolaborasi } from "./pesan-kolaborasi";

export const metadata: Metadata = { title: "Pesan Kolaborasi" };

export default function Halaman() {
  return (
    <Suspense>
      <PesanKolaborasi />
    </Suspense>
  );
}
