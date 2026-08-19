import type { Metadata } from "next";
import { Daftar } from "./daftar";

export const metadata: Metadata = { title: "Buat Akun" };

export default function Halaman() {
  return <Daftar />;
}
