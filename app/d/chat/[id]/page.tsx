import type { Metadata } from "next";
import { RuangChat } from "@/app/chat/[id]/ruang-chat";

export const metadata: Metadata = { title: "Percakapan" };

export default async function Halaman({ params }: PageProps<"/d/chat/[id]">) {
  const { id } = await params;
  return <RuangChat id={id} peran="pedagang" />;
}
