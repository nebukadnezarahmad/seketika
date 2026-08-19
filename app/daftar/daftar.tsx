"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/komponen/ui/logo";
import { IkonFacebook, IkonGoogle } from "@/komponen/ui/ikon-sosial";
import { useToko } from "@/lib/toko";

/**
 * Pembuatan akun.
 *
 * Layar ini hanya mengumpulkan identitas dasar. Peran, izin, dan detail
 * lain ditanyakan setelahnya lewat tiga langkah pengenalan, supaya
 * gerbang pertama tetap pendek dan tidak menakuti orang yang baru
 * membuka aplikasi.
 */
export function Daftar() {
  const router = useRouter();
  const simpanDraf = useToko((s) => s.simpanDraf);
  const [isi, setIsi] = React.useState({ nama: "", email: "", sandi: "" });
  const [lihatSandi, setLihatSandi] = React.useState(false);

  const ubah = (k: keyof typeof isi) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsi((s) => ({ ...s, [k]: e.target.value }));

  const boleh = isi.nama.trim().length >= 2 && isi.email.includes("@") && isi.sandi.length >= 6;

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boleh) return;
    /* Nama dan surel dititipkan sebagai draf, jadi pengguna tidak perlu
       mengetiknya lagi di langkah isi data. */
    simpanDraf({ nama: isi.nama.trim(), email: isi.email.trim() });
    router.push("/mulai");
  };

  const label = "block text-[16px] font-medium text-tinta";
  const kotak =
    "mt-[6px] h-[40px] w-full rounded-full border border-garis bg-krem px-[18px] text-[14px] text-tinta placeholder:text-tinta-4 focus:outline-none focus:ring-2 focus:ring-hijau/35";
  const sosial =
    "flex h-[42px] w-full items-center justify-center gap-2.5 rounded-full border border-garis bg-krem text-[14px] font-medium text-tinta transition-transform active:scale-[0.98]";

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-krem">
      {/* Lewat next/image, bukan latar CSS. Sebagai latar CSS berkasnya
          dikirim mentah 79 KB; lewat pengoptimal Next ia jadi WebP 16 KB
          pada lebar yang benar-benar dipakai. Ini gambar terbesar di layar
          pertama, jadi selisihnya terasa pada pemuatan dingin. */}
      <Image
        src="/img/ilustrasi-sambutan.jpg"
        alt=""
        aria-hidden
        fill
        sizes="390px"
        priority
        className="object-cover object-top"
      />

      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Kembali"
        className="absolute left-4 top-[62px] z-10 grid size-9 place-items-center rounded-full text-tinta transition-transform active:scale-90"
      >
        <ArrowLeft size={22} strokeWidth={2.2} />
      </button>

      <div className="relative flex shrink-0 flex-col items-center pt-[6.2%]">
        <Logo size={112} />
        <p className="tulisan-gradasi mt-[8px] font-[family-name:var(--font-lambang)] text-[44px] font-bold leading-none tracking-[0.01em]">
          SEKETIKA
        </p>
      </div>

      {/* Lembar formulir. Ia bergulir sendiri supaya isinya tetap dapat
          dijangkau di ponsel pendek ketika papan ketik terbuka. */}
      <form
        onSubmit={kirim}
        className="relative mt-auto max-h-[76%] overflow-y-auto rounded-t-[39px] bg-white px-6 pb-[env(safe-area-inset-bottom)] pt-[29px] shadow-[0_-3px_7px_rgb(0_0_0/0.15)]"
      >
        <h1 className="tulisan-judul text-[20px] font-bold text-tinta">Perjalanan Anda dimulai di sini.</h1>
        <p className="mt-[9px] text-[16px] font-normal text-tinta">Masukkan Detail Anda di bawah</p>

        <div className="mt-[15px]">
          <label className={label}>
            Nama Lengkap
            <input
              value={isi.nama}
              onChange={ubah("nama")}
              placeholder="Budi Budiman"
              autoComplete="name"
              required
              className={kotak}
            />
          </label>
        </div>

        <div className="mt-[15px]">
          <label className={label}>
            Email
            <input
              type="email"
              value={isi.email}
              onChange={ubah("email")}
              placeholder="davinci@contoh.com"
              autoComplete="email"
              required
              className={kotak}
            />
          </label>
        </div>

        <div className="mt-[11px]">
          <label className={label}>
            Password
            <span className="relative block">
              <input
                type={lihatSandi ? "text" : "password"}
                value={isi.sandi}
                onChange={ubah("sandi")}
                autoComplete="new-password"
                minLength={6}
                required
                className={`${kotak} pr-12`}
              />
              <button
                type="button"
                onClick={() => setLihatSandi((v) => !v)}
                aria-label={lihatSandi ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute bottom-0 right-[14px] top-[6px] grid w-6 place-items-center text-tinta-4"
              >
                {lihatSandi ? <Eye size={17} /> : <EyeOff size={17} />}
              </button>
            </span>
          </label>
          <p className="mt-1.5 text-[11px] text-tinta-4">Minimal 6 karakter.</p>
        </div>

        <button
          type="submit"
          disabled={!boleh}
          className="mt-[18px] h-[45px] w-full rounded-full bg-hijau text-[16px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-45"
        >
          Buat Akun
        </button>

        <div className="my-[18px] flex items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-garis" />
          <span className="text-[16px] font-medium text-tinta-4">Atau</span>
          <span aria-hidden className="h-px flex-1 bg-garis" />
        </div>

        <button type="button" className={sosial}>
          <IkonGoogle size={15} />
          Masuk dengan Google
        </button>

        <button type="button" className={`${sosial} mt-[11px]`}>
          <IkonFacebook size={15} />
          Masuk dengan Facebook
        </button>

        <div className="h-[26px]" />
      </form>
    </main>
  );
}
