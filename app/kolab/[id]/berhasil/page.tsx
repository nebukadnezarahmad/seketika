import type { Metadata } from "next";
import { BerhasilDibuat } from "./berhasil-dibuat";

export const metadata: Metadata = { title: "Titik Kumpul Dibuat" };

export default async function Halaman({ params }: PageProps<"/kolab/[id]/berhasil">) {
  const { id } = await params;
  return <BerhasilDibuat id={id} />;
}
