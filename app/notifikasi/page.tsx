import type { Metadata } from "next";
import { PusatNotifikasi } from "./pusat-notifikasi";

export const metadata: Metadata = { title: "Notifikasi" };

export default function Halaman() {
  return <PusatNotifikasi />;
}
