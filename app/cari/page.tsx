import type { Metadata } from "next";
import { Cari } from "./cari";

export const metadata: Metadata = { title: "Cari" };

export default function Halaman() {
  return <Cari />;
}
