import type { Metadata } from "next";
import { Suspense } from "react";
import { HasilCari } from "./hasil-cari";

export const metadata: Metadata = { title: "Hasil Pencarian" };

export default function Halaman() {
  return (
    <Suspense>
      <HasilCari />
    </Suspense>
  );
}
