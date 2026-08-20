"use client";

import * as React from "react";
import { Camera, Eye, EyeOff, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { Kepala } from "@/komponen/ui/kepala";
import { Gambar } from "@/komponen/ui/gambar";
import { Tombol } from "@/komponen/ui/tombol";
import { fotoMenu, gerobakSaya } from "@/lib/data/pedagang";
import { rp } from "@/lib/format";
import { fotoJadiTeks } from "@/lib/foto";
import {
  FOTO_CADANGAN,
  angkaHarga,
  fotoDariMenu,
  harganRapi,
  idMenuBaru,
  menuBerlaku,
  periksaMenu,
  type SalahIsi,
} from "@/lib/menu";
import { useToko } from "@/lib/toko";
import type { Menu } from "@/lib/tipe";

/**
 * Kelola menu dari sisi pedagang.
 *
 * Pedagang bisa menambah menu, menyunting nama, keterangan, dan harganya,
 * mematikannya sementara, atau menghapusnya sama sekali.
 *
 * Mematikan dan menghapus sengaja dibedakan. Bahan yang habis hari ini
 * bukan alasan membuang menunya dari daftar; yang dimatikan hilang dari
 * aplikasi warga tapi kembali utuh besok, sedangkan yang dihapus memang
 * tidak dijual lagi. Menyatukan keduanya jadi satu tombol memaksa
 * pedagang mengetik ulang menunya tiap kali bahannya habis.
 *
 * Harga yang sudah tercatat pada pesanan lampau tidak ikut berubah waktu
 * harganya disunting di sini. Riwayat mencatat harga pada saat transaksi
 * terjadi, dan menyeretnya mengikuti harga hari ini akan menulis ulang
 * pembukuan yang sudah dilaporkan.
 */
export function KelolaMenu() {
  const gerobak = gerobakSaya();
  const menuSaya = useToko((s) => s.menuSaya);
  const nonaktif = useToko((s) => s.menuNonaktif);
  const ubahAktifMenu = useToko((s) => s.ubahAktifMenu);
  const simpanMenu = useToko((s) => s.simpanMenu);
  const hapusMenu = useToko((s) => s.hapusMenu);
  const fotoUnggahan = useToko((s) => s.fotoMenuSaya);

  const daftar = menuBerlaku(menuSaya, gerobak.menu);

  const [sunting, setSunting] = React.useState<Menu | null>(null);
  const [lembarBuka, setLembarBuka] = React.useState(false);
  const [nama, setNama] = React.useState("");
  const [deskripsi, setDeskripsi] = React.useState("");
  const [harga, setHarga] = React.useState("");
  const [salah, setSalah] = React.useState<SalahIsi>({});
  const [konfirmasiHapus, setKonfirmasiHapus] = React.useState(false);
  /* `undefined` berarti fotonya tidak disentuh selama lembar terbuka,
     `null` berarti pedagang mengembalikannya ke foto bawaan, teks berarti
     ada foto baru yang menunggu disimpan. Ketiganya harus dibedakan;
     kalau tidak, menyimpan perubahan nama saja akan menghapus foto yang
     sudah diunggah sebelumnya. */
  const [fotoBaru, setFotoBaru] = React.useState<string | null | undefined>(undefined);
  const [salahFoto, setSalahFoto] = React.useState("");
  const berkasRef = React.useRef<HTMLInputElement>(null);

  const jumlahAktif = daftar.filter((m) => !nonaktif.includes(m.id)).length;
  /* `sunting` yang null berarti sedang membuat menu baru; formulirnya
     sama, hanya judul dan tombolnya yang berbeda kata. */
  const menambah = sunting === null;

  const bukaLembar = (m: Menu | null) => {
    setSunting(m);
    setNama(m?.nama ?? "");
    setDeskripsi(m?.deskripsi ?? "");
    setHarga(m ? harganRapi(m.harga) : "");
    setSalah({});
    setKonfirmasiHapus(false);
    setFotoBaru(undefined);
    setSalahFoto("");
    setLembarBuka(true);
  };

  const simpan = () => {
    const periksa = periksaMenu(nama, harga);
    setSalah(periksa);
    if (Object.keys(periksa).length > 0) return;

    simpanMenu(
      {
        id: sunting?.id ?? idMenuBaru(),
        nama: nama.trim(),
        deskripsi: deskripsi.trim(),
        harga: angkaHarga(harga),
      },
      gerobak.menu,
      fotoBaru,
    );
    setLembarBuka(false);
  };

  const ambilBerkas = async (berkas: File | undefined) => {
    if (!berkas) return;
    setSalahFoto("");
    const hasil = await fotoJadiTeks(berkas);
    if ("salah" in hasil) setSalahFoto(hasil.salah);
    else setFotoBaru(hasil.teks);
  };

  /* Foto yang sedang ditampilkan di lembar: unggahan yang belum disimpan
     kalau ada, kalau dikembalikan ke bawaan pakai bawaannya, selebihnya
     foto yang berlaku sekarang. */
  const idSunting = sunting?.id ?? "";
  const fotoBawaan = fotoMenu[idSunting] ?? FOTO_CADANGAN;
  const fotoLembar =
    fotoBaru === undefined
      ? fotoDariMenu(idSunting, fotoUnggahan, fotoMenu)
      : (fotoBaru ?? fotoBawaan);
  /* Tombol "kembalikan foto bawaan" hanya masuk akal kalau memang ada
     foto sendiri yang sedang dipakai atau baru saja dipilih. */
  const adaFotoSendiri =
    fotoBaru !== null && (fotoBaru !== undefined || Boolean(fotoUnggahan[idSunting]));

  const kolom =
    "mt-1.5 w-full rounded-[14px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-tinta-4 focus:outline-none focus:ring-2 focus:ring-hijau/35";
  const label = "block text-[11.5px] font-semibold text-tinta-3";

  return (
    <Layar
      nav
      peran="pedagang"
      lembar={
        <Lembar
          buka={lembarBuka}
          tutup={() => setLembarBuka(false)}
          judul={menambah ? "Tambah menu" : `Ubah ${sunting?.nama}`}
        >
          <div className="px-4 pb-6 pt-1">
            <h2 className="tulisan-judul text-[18px] font-extrabold text-tinta">
              {menambah ? "Tambah Menu" : "Ubah Menu"}
            </h2>

            {/* Slot foto. Petaknya sendiri yang jadi tombol, bukan tombol
                terpisah di sebelahnya: petak fotolah yang paling jelas
                menunjukkan apa yang akan berubah kalau ditekan. */}
            <div className="mt-4">
              <span className={label}>Foto menu</span>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => berkasRef.current?.click()}
                  className="relative size-[84px] shrink-0 overflow-hidden rounded-[16px] border border-garis bg-krem transition-transform active:scale-95"
                >
                  <Gambar src={fotoLembar} alt="" penuh sizes="84px" className="object-cover" />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-tinta/60 py-1 text-[9.5px] font-bold text-white"
                  >
                    <Camera size={11} strokeWidth={2.4} />
                    Ganti
                  </span>
                  <span className="khusus-pembaca-layar">Pilih foto untuk menu ini</span>
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] leading-relaxed text-tinta-4">
                    Ketuk petaknya untuk memilih foto dari galeri. Gambarnya
                    dikecilkan otomatis sebelum disimpan.
                  </p>
                  {adaFotoSendiri && (
                    <button
                      type="button"
                      onClick={() => {
                        setFotoBaru(null);
                        setSalahFoto("");
                      }}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-tinta-3 underline underline-offset-2"
                    >
                      <RotateCcw size={12} strokeWidth={2.3} aria-hidden />
                      Kembalikan foto bawaan
                    </button>
                  )}
                </div>
              </div>
              {salahFoto && <p className="mt-1.5 text-[11px] text-merah">{salahFoto}</p>}

              <input
                ref={berkasRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  void ambilBerkas(e.target.files?.[0]);
                  /* Nilainya dikosongkan supaya memilih berkas yang sama
                     dua kali berturut-turut tetap memicu peristiwanya. */
                  e.target.value = "";
                }}
                className="khusus-pembaca-layar"
                aria-label="Berkas foto menu"
              />
            </div>

            <label className="mt-3 block">
              <span className={label}>Nama menu</span>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Bakso Urat Jumbo"
                aria-invalid={Boolean(salah.nama)}
                className={kolom}
              />
              {salah.nama && <span className="mt-1 block text-[11px] text-merah">{salah.nama}</span>}
            </label>

            <label className="mt-3 block">
              <span className={label}>Keterangan</span>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={2}
                placeholder="Bakso urat ukuran besar dengan kuah kaldu"
                className={`${kolom} resize-none`}
              />
            </label>

            <label className="mt-3 block">
              <span className={label}>Harga per porsi</span>
              {/* Kolomnya angka lewat papan ketik telepon, bukan
                  `type="number"`: pemisah ribuan yang diketik pengguna
                  akan ditolak diam-diam oleh kolom angka, dan harga
                  rupiah nyaris selalu ditulis dengan titik. */}
              <input
                value={harga}
                onChange={(e) => setHarga(harganRapi(angkaHarga(e.target.value)))}
                inputMode="numeric"
                placeholder="15.000"
                aria-invalid={Boolean(salah.harga)}
                className={kolom}
              />
              {salah.harga && (
                <span className="mt-1 block text-[11px] text-merah">{salah.harga}</span>
              )}
            </label>

            <Tombol penuh className="mt-5" onClick={simpan}>
              {menambah ? "Tambah ke Daftar" : "Simpan Perubahan"}
            </Tombol>

            {!menambah && (
              <div className="mt-3">
                {konfirmasiHapus ? (
                  /* Penghapusan minta ketukan kedua. Baris menu berdempetan
                     dan satu ketukan meleset akan membuang menu yang masih
                     dijual, tanpa cara mengembalikannya. */
                  <div className="rounded-[16px] border border-merah/30 bg-merah-lembut p-3.5">
                    <p className="text-[12.5px] leading-snug text-merah">
                      Hapus <strong className="font-bold">{sunting?.nama}</strong> dari daftar
                      menu? Kalau cuma kehabisan bahan, matikan saja sakelarnya.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Tombol
                        rupa="garis"
                        ukur="md"
                        className="flex-1"
                        onClick={() => setKonfirmasiHapus(false)}
                      >
                        Batal
                      </Tombol>
                      <Tombol
                        rupa="bahaya"
                        ukur="md"
                        className="flex-1"
                        onClick={() => {
                          hapusMenu(sunting!.id, gerobak.menu);
                          setLembarBuka(false);
                        }}
                      >
                        Ya, hapus
                      </Tombol>
                    </div>
                  </div>
                ) : (
                  <Tombol rupa="bahaya" ukur="md" penuh onClick={() => setKonfirmasiHapus(true)}>
                    <Trash2 size={15} strokeWidth={2.1} aria-hidden />
                    Hapus Menu
                  </Tombol>
                )}
              </div>
            )}
          </div>
        </Lembar>
      }
    >
      <Kepala
        judul="Kelola Menu"
        subjudul={`${jumlahAktif} dari ${daftar.length} menu menyala`}
      />

      <div className="px-4 pb-6 pt-3">
        <p className="rounded-[16px] border border-garis bg-white px-3.5 py-3 text-[12px] leading-relaxed text-tinta-3">
          Ketuk menu untuk mengubah nama, keterangan, atau harganya. Sakelar
          di kanan menyembunyikannya sementara dari aplikasi warga.
        </p>

        <Tombol penuh className="mt-3" onClick={() => bukaLembar(null)}>
          <Plus size={16} strokeWidth={2.4} aria-hidden />
          Tambah Menu
        </Tombol>

        <ul className="mt-3 flex flex-col gap-2.5">
          {daftar.map((m) => {
            const aktif = !nonaktif.includes(m.id);
            return (
              <li
                key={m.id}
                className={`bayang-kartu flex items-center gap-2.5 rounded-[20px] border border-garis bg-white p-2.5 ${
                  aktif ? "" : "opacity-70"
                }`}
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => bukaLembar(m)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Gambar
                    src={fotoDariMenu(m.id, fotoUnggahan, fotoMenu)}
                    alt=""
                    lebar={60}
                    tinggi={60}
                    className={`shrink-0 rounded-[14px] object-cover ${aktif ? "" : "grayscale"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-bold text-tinta">
                      {m.nama}
                    </span>
                    <span className="mt-0.5 block text-[13px] font-extrabold text-hijau">
                      {rp(m.harga)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-tinta-4">
                      {aktif ? "Tampil di aplikasi warga" : "Disembunyikan"}
                    </span>
                  </span>
                </button>

                {/* Sakelar berupa input sungguhan yang disembunyikan dari
                    mata dan dibungkus label. Sakelar yang dibuat dari div
                    tidak bisa dicapai papan ketik dan tidak menyuarakan
                    keadaannya ke pembaca layar. */}
                <label className="relative shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aktif}
                    onChange={(e) => ubahAktifMenu(m.id, e.target.checked)}
                    className="peer khusus-pembaca-layar"
                  />
                  <span className="khusus-pembaca-layar">Tampilkan {m.nama}</span>
                  <span
                    aria-hidden
                    className="block h-7 w-[46px] rounded-pil bg-tinta-5/45 transition-colors peer-checked:bg-hijau peer-focus-visible:ring-2 peer-focus-visible:ring-hijau/40 peer-focus-visible:ring-offset-2"
                  />
                  <span
                    aria-hidden
                    className="absolute left-1 top-1 grid size-5 place-items-center rounded-full bg-white text-tinta-3 shadow-sm transition-transform peer-checked:translate-x-[18px] peer-checked:text-hijau"
                  >
                    {aktif ? <Eye size={11} strokeWidth={2.4} /> : <EyeOff size={11} strokeWidth={2.4} />}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {daftar.length === 0 && (
          <p className="mt-3 rounded-[20px] border border-dashed border-garis bg-white px-4 py-10 text-center text-[12.5px] leading-relaxed text-tinta-4">
            Belum ada menu sama sekali.
            <br />
            Tambahkan dagangan pertamamu supaya warga tahu apa yang dijual.
          </p>
        )}

        {daftar.length > 0 && jumlahAktif === 0 && (
          <p className="mt-3 rounded-[16px] border border-dashed border-merah/40 bg-merah-lembut px-4 py-4 text-center text-[12px] leading-relaxed text-merah">
            Semua menu dimatikan. Warga tidak akan melihat satu pun dagangan
            saat membuka gerobakmu.
          </p>
        )}
      </div>
    </Layar>
  );
}
