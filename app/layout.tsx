import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* Inter, huruf yang dipakai di seluruh berkas desain. Bobot 400 sampai
   800 semuanya terpakai: 400 untuk isi, 800 untuk judul kartu. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
  themeColor: "#1a4d2e",
  width: "device-width",
  initialScale: 1,
  /* Aplikasi ini punya banyak sasaran sentuh kecil di peta. Cubit-zoom
     tetap dibiarkan hidup supaya pengguna yang butuh memperbesar tidak
     terkunci; yang dimatikan hanya zoom ganda-ketuk lewat CSS. */
  maximumScale: 5,
};

export default function TataLetakAkar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-[#e9e5dd] antialiased">
        {/* Di ponsel bingkai ini memenuhi layar. Di layar lebar ia
            menyusut jadi kolom selebar 390px persis seperti papan Figma,
            supaya juri yang membuka dari laptop melihat proporsi yang
            sama dengan rancangannya, bukan versi yang melar. */}
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-krem shadow-[0_0_60px_rgb(0_0_0/0.12)] sm:min-h-[100dvh]">
          {children}
        </div>
      </body>
    </html>
  );
}
