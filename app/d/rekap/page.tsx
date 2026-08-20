import type { Metadata } from "next";
import { BukuKas } from "./buku-kas";

export const metadata: Metadata = { title: "Buku Kas" };

export default function Halaman() {
  return <BukuKas />;
}
