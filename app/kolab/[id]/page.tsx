import type { Metadata } from "next";
import { DetailTitikKumpul } from "./detail-titik-kumpul";

export const metadata: Metadata = { title: "Detail Titik Kumpul" };

export default async function Halaman({ params }: PageProps<"/kolab/[id]">) {
  const { id } = await params;
  return <DetailTitikKumpul id={id} />;
}
