import type { Metadata } from "next";
import { DaftarChat } from "@/app/chat/daftar-chat";

export const metadata: Metadata = { title: "Chat Pedagang" };

export default function Halaman() {
  return <DaftarChat peran="pedagang" />;
}
