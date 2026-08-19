import type { Metadata } from "next";
import { Sambutan } from "./sambutan";

export const metadata: Metadata = { title: "Selamat Datang" };

export default function Halaman() {
  return <Sambutan />;
}
