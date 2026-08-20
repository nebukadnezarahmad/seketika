import type { Metadata } from "next";
import { CatatanStok } from "./catatan-stok";

export const metadata: Metadata = { title: "Catatan Stok" };

export default function Halaman() {
  return <CatatanStok />;
}
