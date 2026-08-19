import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cariPedagang, daftarPedagang } from "@/lib/data/pedagang";
import { DetailPedagang } from "./detail-pedagang";

export function generateStaticParams() {
  return daftarPedagang.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pedagang/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: cariPedagang(slug)?.nama ?? "Pedagang" };
}

export default async function Halaman({ params }: PageProps<"/pedagang/[slug]">) {
  const { slug } = await params;
  const pedagang = cariPedagang(slug);
  if (!pedagang) notFound();
  return <DetailPedagang pedagang={pedagang} />;
}
