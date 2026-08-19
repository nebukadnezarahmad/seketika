import type { Metadata } from "next";
import { DetailPesanan } from "./detail-pesanan";

export async function generateMetadata({
  params,
}: PageProps<"/pesanan/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Pesanan #${id}` };
}

export default async function Halaman({ params }: PageProps<"/pesanan/[id]">) {
  const { id } = await params;
  return <DetailPesanan id={id} />;
}
