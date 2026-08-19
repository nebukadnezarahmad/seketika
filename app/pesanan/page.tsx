import type { Metadata } from "next";
import { Suspense } from "react";
import { DaftarPesanan } from "./daftar-pesanan";

export const metadata: Metadata = { title: "Pesanan" };

export default function Halaman() {
  return (
    <Suspense>
      <DaftarPesanan />
    </Suspense>
  );
}
