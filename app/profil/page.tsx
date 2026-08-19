import type { Metadata } from "next";
import { ProfilPembeli } from "./profil-pembeli";

export const metadata: Metadata = { title: "Profil" };

export default function Halaman() {
  return <ProfilPembeli />;
}
