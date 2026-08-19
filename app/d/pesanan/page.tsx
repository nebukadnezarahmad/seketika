import type { Metadata } from "next";
import { PesananMasukLayar } from "./pesanan-masuk";

export const metadata: Metadata = { title: "Pesanan Masuk" };

export default function Halaman() {
  return <PesananMasukLayar />;
}
