import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Poppins } from "next/font/google";
import { PemulihData } from "@/komponen/pemulih-data";
import "./globals.css";

/* Inter, huruf yang dipakai di seluruh berkas desain. Bobot 400 sampai
   800 semuanya terpakai: 400 untuk isi, 800 untuk judul kartu. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/* Poppins dipakai untuk lambang kata "SEKETIKA", taglinenya di layar
   sambutan, dan judul-judul besar lewat utilitas `.tulisan-judul`.
   Bentuk geometrisnya yang bulat membedakannya dari Inter yang menangani
   isi teks biasa. Bobot 600-800 dimuat supaya judul yang memakainya bisa
   memilih ketebalan tanpa memicu unduhan bobot baru di tengah sesi. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* Caveat, tulisan tangan, khusus untuk satu kalimat sapaan di layar
   sambutan. Dipakai sekali saja; itu yang membuatnya terasa seperti
   coretan, bukan gaya tulisan aplikasi. */
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
    <html lang="id" className={`${inter.variable} ${poppins.variable} ${caveat.variable}`}>
      <body className="bg-[#ececea] antialiased">
        {/* Di ponsel bingkai ini memenuhi layar. Di layar lebar ia
            menyusut jadi kolom selebar 390px persis seperti papan Figma,
            supaya juri yang membuka dari laptop melihat proporsi yang
            sama dengan rancangannya, bukan versi yang melar. Tepinya
            ditandai garis rambut, bukan cahaya kabur: yang dibutuhkan
            cuma batas kolomnya, dan bayangan selebar 60px pada layar
            yang isinya sendiri sudah datar justru jadi satu-satunya
            unsur yang mengambang. */}
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-krem sm:min-h-[100dvh] sm:border-x sm:border-garis">
          <PemulihData>{children}</PemulihData>
        </div>
      </body>
    </html>
  );
}
