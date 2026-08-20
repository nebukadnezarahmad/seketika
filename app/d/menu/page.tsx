import type { Metadata } from "next";
import { KelolaMenu } from "./kelola-menu";

export const metadata: Metadata = { title: "Kelola Menu" };

export default function Halaman() {
  return <KelolaMenu />;
}
