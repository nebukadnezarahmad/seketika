import type { Metadata } from "next";
import { RuangChat } from "./ruang-chat";

export const metadata: Metadata = { title: "Percakapan" };

export default async function Halaman({ params }: PageProps<"/chat/[id]">) {
  const { id } = await params;
  return <RuangChat id={id} />;
}
