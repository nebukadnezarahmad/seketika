"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Phone } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { Kepala } from "@/komponen/ui/kepala";
import { Tombol } from "@/komponen/ui/tombol";
import { SLUG_GEROBAK_SAYA, fotoMenu } from "@/lib/data/pedagang";
import { jarakSingkat, rp } from "@/lib/format";
import { menuTampil } from "@/lib/menu";
import { useToko } from "@/lib/toko";
import type { Menu, Pedagang } from "@/lib/tipe";

/**
 * Daftar menu satu gerobak.
 *
 * Layar ini tidak lagi menumpuk pesanan butir demi butir lewat tombol
 * tambah dan kurang. Yang dijual di sini pedagang keliling, bukan restoran:
 * warga memanggil gerobaknya lalu memilih setelah gerobak sampai di depan
 * rumah. Karena itu daftarnya bersifat menerangkan — apa saja yang dijual
 * dan berapa harganya — dan satu-satunya tindakan yang tersedia adalah
 * memanggil penjualnya.
 *
 * Mengetuk satu menu menaikkan lembar berisi fotonya utuh dan keterangan
 * lengkapnya. Pada daftar, keterangan itu terpotong dua baris; lembar ini
 * tempat membacanya sampai habis sebelum memutuskan.
 */
export function DaftarMenu({ pedagang }: { pedagang: Pedagang }) {
  const router = useRouter();
  const siapkanPanggilan = useToko((s) => s.siapkanPanggilan);
  const buatPesanan = useToko((s) => s.buatPesanan);
  const alamat = useToko((s) => s.profil?.alamat) ?? "Bumi Marina Emas Selatan No.12";

  /* Suntingan pedagang hanya berlaku untuk gerobak sendiri; gerobak lain
     datang dari data contoh dan tidak punya pemiliknya di aplikasi ini.
     Untuk gerobak sendiri, yang ditampilkan adalah daftar yang sudah
     disuntingnya dikurangi menu yang sedang dimatikan. */
  const menuNonaktif = useToko((s) => s.menuNonaktif);
  const menuSaya = useToko((s) => s.menuSaya);
  const menu =
    pedagang.slug === SLUG_GEROBAK_SAYA
      ? menuTampil(menuSaya, pedagang.menu, menuNonaktif)
      : pedagang.menu;

  const [dipilih, setDipilih] = React.useState<Menu | null>(null);
  const [lembarBuka, setLembarBuka] = React.useState(false);

  /**
   * Memanggil penjual ke lokasi warga.
   *
   * `menu` yang kosong berarti dipanggil tanpa pesanan awal, yaitu ketika
   * tombolnya ditekan dari atas daftar. Dari dalam lembar, menu yang
   * sedang dibaca ikut disertakan satu porsi sebagai ancar-ancar, dan
   * sisanya tetap bisa ditambah waktu gerobaknya sampai.
   */
  const panggil = (menu?: Menu) => {
    siapkanPanggilan(
      pedagang.slug,
      menu ? [{ menuId: menu.id, nama: menu.nama, harga: menu.harga, jumlah: 1 }] : [],
    );
    router.push(`/pesanan/${buatPesanan(alamat)}`);
  };

  return (
    <Layar
      nav
      lembar={
        <Lembar buka={lembarBuka} tutup={() => setLembarBuka(false)} judul={dipilih?.nama}>
          {dipilih && (
            <div className="pb-6">
              {/* Foto memenuhi lebar lembar. Pada daftar ia cuma petak
                  84 piksel yang sulit dinilai; di sini gunanya memang
                  supaya orang bisa melihat isi mangkuknya.

                  Jarak atasnya menghindari tombol tutup milik lembar, yang
                  menggantung sedikit lebih rendah dari pegangannya. Tanpa
                  jarak ini tombol itu jatuh menindih pojok foto dan jadi
                  sulit dibedakan dari isi gambarnya. */}
              <div className="relative mx-4 mt-6 h-[190px] overflow-hidden rounded-[18px]">
                <Image
                  src={fotoMenu[dipilih.id] ?? "/img/menu/bakso-polos.jpg"}
                  alt={dipilih.nama}
                  fill
                  sizes="358px"
                  className="object-cover"
                />
              </div>

              <div className="px-4 pt-4">
                <h2 className="tulisan-judul text-[19px] font-extrabold leading-tight text-tinta">
                  {dipilih.nama}
                </h2>
                <p className="mt-1 text-[17px] font-extrabold text-hijau">{rp(dipilih.harga)}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-tinta-3">
                  {dipilih.deskripsi}
                </p>

                <Tombol penuh className="mt-5" onClick={() => panggil(dipilih)}>
                  <Phone size={16} strokeWidth={2.3} aria-hidden />
                  Panggil Penjual
                </Tombol>
                <p className="mt-2 text-center text-[11px] leading-snug text-tinta-4">
                  {pedagang.nama} akan menuju {alamat}
                </p>
              </div>
            </div>
          )}
        </Lembar>
      }
    >
      <Kepala
        judul={pedagang.nama}
        subjudul={`${jarakSingkat(pedagang.jarak)} · ${pedagang.jenis}`}
      />

      <div className="px-4 pb-4 pt-3">
        {/* Tombol utama berada di atas daftar, bukan di bawahnya. Yang
            dicari warga di layar ini adalah memanggil gerobaknya; daftar
            menu di bawahnya keterangan pendukung. Menaruhnya di bawah
            berarti menyembunyikan tindakan utama di balik gulir. */}
        <Tombol penuh onClick={() => panggil()}>
          <Phone size={16} strokeWidth={2.3} aria-hidden />
          Panggil Penjual
        </Tombol>
        <p className="mt-2 text-center text-[11px] leading-snug text-tinta-4">
          Panggil sekarang, pilih menunya setelah gerobak sampai
        </p>

        <p className="mb-2.5 mt-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-tinta-4">
          Menu
        </p>

        <ul className="rentet flex flex-col gap-2.5">
          {menu.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => {
                  setDipilih(m);
                  setLembarBuka(true);
                }}
                className="bayang-kartu flex w-full items-center gap-3 rounded-[20px] border border-garis bg-white p-2.5 text-left transition-transform active:scale-[0.99]"
              >
                {/* Fotonya dibulatkan sendiri dan diberi jarak dari tepi
                    kartu, bukan dijejalkan menempel ke sudutnya. Waktu
                    menempel, sudut foto yang siku bertabrakan dengan sudut
                    kartu yang membulat dan tepinya terlihat tercuil. */}
                <Image
                  src={fotoMenu[m.id] ?? "/img/menu/bakso-polos.jpg"}
                  alt={m.nama}
                  width={84}
                  height={84}
                  className="size-[84px] shrink-0 rounded-[15px] object-cover"
                />

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[14px] font-bold leading-tight text-tinta">
                    {m.nama}
                  </span>
                  <span className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-tinta-4">
                    {m.deskripsi}
                  </span>
                  <span className="mt-1.5 text-[14px] font-extrabold text-hijau">
                    {rp(m.harga)}
                  </span>
                </span>

                <ChevronRight size={17} className="shrink-0 text-tinta-5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>

        {menu.length === 0 && (
          <p className="rounded-[20px] border border-dashed border-garis bg-white px-4 py-8 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Gerobak ini sedang tidak menampilkan menu apa pun.
            <br />
            Kamu tetap bisa memanggilnya dan bertanya langsung.
          </p>
        )}
      </div>
    </Layar>
  );
}
