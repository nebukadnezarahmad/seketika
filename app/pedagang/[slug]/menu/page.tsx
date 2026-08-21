import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cariPedagang, daftarPedagang } from "@/lib/data/pedagang";
import { DaftarMenu } from "./daftar-menu";

export function generateStaticParams() {
  return daftarPedagang.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/pedagang/[slug]/menu">): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Menu ${cariPedagang(slug)?.nama ?? ""}`.trim() };
}

export default async function Halaman({
  params,
}: PageProps<"/pedagang/[slug]/menu">) {
  const { slug } = await params;
  const pedagang = cariPedagang(slug);
  if (!pedagang) notFound();
  return <DaftarMenu pedagang={pedagang} />;
}
