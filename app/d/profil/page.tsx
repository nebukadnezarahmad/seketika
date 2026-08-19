import type { Metadata } from "next";
import { TokoSaya } from "./toko-saya";

export const metadata: Metadata = { title: "Toko Saya" };

export default function Halaman() {
  return <TokoSaya />;
}
