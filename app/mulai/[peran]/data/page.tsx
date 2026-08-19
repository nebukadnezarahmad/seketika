import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IsiData } from "./isi-data";

export const metadata: Metadata = { title: "Isi Data" };

export default async function Halaman({ params }: PageProps<"/mulai/[peran]/data">) {
  const { peran } = await params;
  if (peran !== "pembeli" && peran !== "pedagang") notFound();
  return <IsiData peran={peran} />;
}
