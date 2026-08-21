import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Poppins } from "next/font/google";
import { PemulihData } from "@/komponen/pemulih-data";
import { PendaftarSW } from "@/komponen/pendaftar-sw";
import "./globals.css";

/* Inter, huruf yang dipakai di seluruh berkas desain. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* Poppins dipakai untuk lambang kata "SEKETIKA", taglinenya di layar sambutan, dan judul-judul besar lewat utilitas `.tulisan-judul`. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* Caveat, tulisan tangan, khusus untuk satu kalimat sapaan di layar sambutan. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SEKETIKA - Panggil jajanan keliling ke depan rumah",
    template: "%s · SEKETIKA",
  },
  description:
    "SEKETIKA menghubungkan pedagang keliling dengan warga sekitar. Lihat gerobak yang sedang lewat, panggil ke lokasimu, atau patungan satu titik kumpul bersama tetangga.",
  applicationName: "SEKETIKA",
  appleWebApp: { capable: true, title: "SEKETIKA", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#00860f",
  width: "device-width",
  initialScale: 1,
  /* Aplikasi ini punya banyak sasaran sentuh kecil di peta. */
  maximumScale: 5,
};

export default function TataLetakAkar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} ${caveat.variable}`}
    >
      <body className="bg-[#ececea] antialiased">
        {/* Di ponsel bingkai ini memenuhi layar. */}
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-krem sm:min-h-[100dvh] sm:border-x sm:border-garis">
          <PemulihData>{children}</PemulihData>
        </div>
        <PendaftarSW />
      </body>
    </html>
  );
}
