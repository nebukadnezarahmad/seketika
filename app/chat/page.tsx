import type { Metadata } from "next";
import { DaftarChat } from "./daftar-chat";

export const metadata: Metadata = { title: "Chat" };

export default function Halaman() {
  return <DaftarChat />;
}
