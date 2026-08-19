import type { Metadata } from "next";
import { Pembuka } from "./pembuka";

export const metadata: Metadata = {
  title: "SEKETIKA",
};

/**
 * Layar pembuka.
 *
 * Bingkai splash di berkas Figma masih kosong, jadi layar ini disusun
 * dari unsur yang sudah ada di sistem desainnya: logo, hijau merek, dan
 * tipografi yang sama, supaya tidak terasa datang dari aplikasi lain.
 */
export default function Halaman() {
  return <Pembuka />;
}
