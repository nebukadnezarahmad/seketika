import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BeriAkses } from "./beri-akses";

export const metadata: Metadata = { title: "Beri Akses" };

export default async function Halaman({
  params,
}: PageProps<"/mulai/[peran]/izin">) {
  const { peran } = await params;
  if (peran !== "pembeli" && peran !== "pedagang") notFound();
  return <BeriAkses peran={peran} />;
}
