import type { Metadata } from "next";
import { RuteTitik } from "./rute-titik";

export const metadata: Metadata = { title: "Rute Titik Kumpul" };

export default async function Halaman({ params }: PageProps<"/kolab/[id]/rute">) {
  const { id } = await params;
  return <RuteTitik id={id} />;
}
