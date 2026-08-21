import type { Metadata } from "next";
import { Pembuka } from "./pembuka";

export const metadata: Metadata = {
  title: "SEKETIKA",
};

/** Layar pembuka. */
export default function Halaman() {
  return <Pembuka />;
}
