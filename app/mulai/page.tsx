import type { Metadata } from "next";
import { PilihPeran } from "./pilih-peran";

export const metadata: Metadata = { title: "Pilih Peran" };

export default function Halaman() {
  return <PilihPeran />;
}
