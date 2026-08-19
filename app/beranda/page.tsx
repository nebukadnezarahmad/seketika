import type { Metadata } from "next";
import { BerandaPembeli } from "./beranda-pembeli";

export const metadata: Metadata = { title: "Beranda" };

export default function Halaman() {
  return <BerandaPembeli />;
}
