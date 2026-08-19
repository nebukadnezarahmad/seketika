import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lencana pengembangan Next menutupi sudut kiri bawah layar, tepat di
     atas navigasi bawah, sehingga mengganggu saat membandingkan hasil
     render dengan rancangannya. */
  devIndicators: false,
};

export default nextConfig;
