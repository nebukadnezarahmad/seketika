import type { Metadata } from "next";
import { Antar } from "./antar";

export const metadata: Metadata = { title: "Navigasi Pengantaran" };

export default async function Halaman({ params }: PageProps<"/d/antar/[id]">) {
  const { id } = await params;
  return <Antar id={id} />;
}
