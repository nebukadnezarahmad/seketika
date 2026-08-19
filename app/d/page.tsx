import type { Metadata } from "next";
import { BerandaPedagang } from "./beranda-pedagang";

export const metadata: Metadata = { title: "Beranda Pedagang" };

export default function Halaman() {
  return <BerandaPedagang />;
}
