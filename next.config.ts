import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lencana pengembangan Next menutupi sudut kiri bawah layar, tepat di
     atas navigasi bawah, sehingga mengganggu saat membandingkan hasil
     render dengan rancangannya. */
  devIndicators: false,

  images: {
    /* Bingkai aplikasi ini dikunci selebar 390px, jadi ambang bawaan Next
       yang dimulai dari 640px selalu terlalu besar: layar ber-DPR 1
       terpaksa mengunduh gambar 640px untuk ruang 390px. Menambahkan 420
       menutup celah itu, dan 828 tetap ada untuk layar ber-DPR 2. Ambang
       di atas 1080 dibuang karena tidak akan pernah terpakai. */
    deviceSizes: [420, 640, 828, 1080],
  },
};

export default nextConfig;
