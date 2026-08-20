"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, ChevronUp, MapPin, Navigation, Users, Zap } from "lucide-react";
import { Layar } from "@/komponen/ui/layar";
import { Lembar } from "@/komponen/ui/lembar";
import { TombolTaut } from "@/komponen/ui/tombol";
import { Lonceng } from "@/komponen/ui/lonceng";
import { PilMelayang } from "@/komponen/nav/pil-melayang";
import { SLUG_GEROBAK_SAYA, gerobakSaya } from "@/lib/data/pedagang";
import { rp } from "@/lib/format";
import { labelStatusTitik, menitTempuh, menungguPedagang, statusTitik } from "@/lib/kolab";
import { pendapatanHari } from "@/lib/rekap";
import { useToko } from "@/lib/toko";
import { useSekarang } from "@/lib/waktu";

/** Perkiraan sisa waktu tempuh dari lama pesanan sudah berjalan. */
function sisaMenit(menitLalu: number): number {
  return Math.max(1, 10 - Math.floor(menitLalu / 4));
}


export function BerandaPedagang() {
  const router = useRouter();
  const gerobak = gerobakSaya();

  const buka = useToko((s) => s.gerobakBuka);
  const setGerobak = useToko((s) => s.setGerobak);
  const pesananMasuk = useToko((s) => s.pesananMasuk);
  const ubahStatusMasuk = useToko((s) => s.ubahStatusMasuk);
  const ubahStatusTitik = useToko((s) => s.ubahStatusTitik);
  const titikKumpul = useToko((s) => s.titikKumpul);
  const profil = useToko((s) => s.profil);

  const [lembarBuka, setLembarBuka] = React.useState(false);
  const [ringkasTerbuka, setRingkasTerbuka] = React.useState(false);

  const baru = pesananMasuk.filter((p) => p.status === "baru");
  /* Kartu navigasi melayang hanya muncul untuk pesanan yang benar-benar
     sedang diantar, yaitu setelah pedagang menekan "Terima & Berangkat".
     Pesanan yang baru diterima tapi masih disiapkan tidak menampilkannya:
     tidak ada yang perlu dinavigasikan kalau gerobaknya belum jalan. */
  const sedangDiantar = pesananMasuk.find((p) => p.status === "diantar");
  const selesai = pesananMasuk.filter((p) => p.status === "selesai");
  const milikSaya = titikKumpul.filter((t) => t.pedagangSlug === SLUG_GEROBAK_SAYA);

  /* Pemasukan hari ini, dihitung dari pesanan yang sudah ditandai selesai
     hari ini saja. Riwayat hari sebelumnya sengaja tidak ikut: lembar ini
     judulnya "Pesanan Hari Ini", dan angka yang mengaku hari ini tapi
     memuat kemarin adalah angka yang berbohong. */
  const sekarang = useSekarang();
  const masukHariIni = sekarang === null ? 0 : pendapatanHari(pesananMasuk, sekarang, 0);

  /* Yang dihitung cuma permintaan yang masih menunggu pedagang. Titik
     kumpul yang sudah dijemput, sudah selesai, atau hangus karena tidak
     memenuhi target bukan lagi pekerjaan yang tersisa, dan menghitungnya
     membuat ajakan "ada N permintaan" mengaku ada kerjaan yang sebenarnya
     sudah beres. Kesalahan yang sama pernah ada pada label jumlah
     pedagang aktif di peta. */
  const permintaan = milikSaya.filter((t) => menungguPedagang(t, sekarang)).length;

  /* Daftarnya cuma memuat yang sudah tercapai, jadi setiap kotak yang
     terlihat adalah permintaan yang benar-benar bisa diketuk dan
     diterima. Begitu diterima, kotaknya keluar dari daftar dan pindah ke
     kartu melayang di bawah, tempat yang sama dengan pesanan yang sedang
     diantar. Tanpa kartu itu, menerima berarti kehilangan jejaknya:
     "Selesaikan" tidak akan bisa dijangkau lagi. */
  const tampil = milikSaya.filter((t) => menungguPedagang(t, sekarang));
  const sedangDijemput = milikSaya.find((t) => statusTitik(t, sekarang) === "dijemput");

  return (
    <Layar
      nav
      peran="pedagang"
      /* Pesanan perorangan didahulukan kalau keduanya berjalan: ia punya
         satu warga yang menunggu di alamatnya sendiri, sedangkan titik
         kumpul sudah berkumpul dan bisa menunggu sebentar. */
      melayang={
        sedangDiantar ? (
          <PilMelayang
            judul={`Menuju Lokasi ${sedangDiantar.warga}`}
            keterangan={`Sedang menuju · ${sisaMenit(sedangDiantar.menitLalu)} mnt lagi`}
            menit={sisaMenit(sedangDiantar.menitLalu)}
            href={`/d/antar/${sedangDiantar.id}`}
            aksi={() => ubahStatusMasuk(sedangDiantar.id, "selesai")}
          />
        ) : sedangDijemput ? (
          <PilMelayang
            judul={`Menuju ${sedangDijemput.nama}`}
            keterangan={`${sedangDijemput.peserta.length} warga menunggu · ${sedangDijemput.patokan}`}
            menit={menitTempuh(sedangDijemput.jarak)}
            href={`/kolab/${sedangDijemput.id}/rute`}
            aksi={() => ubahStatusTitik(sedangDijemput.id, "selesai")}
          />
        ) : null
      }
      /* Rekap pesanan hari ini. */
      lembar={
        <Lembar buka={lembarBuka} tutup={() => setLembarBuka(false)} judul="Pesanan Hari Ini">
          <div className="px-4 pb-6">
            <h2 className="tulisan-judul text-[16px] font-extrabold text-tinta">Pesanan Hari Ini</h2>
            <p className="mt-0.5 text-[11.5px] text-tinta-4">
              {selesai.length} pesanan berhasil ·{" "}
              <strong className="font-bold text-hijau">{rp(masukHariIni)}</strong>
            </p>

            <ul className="mt-3 flex flex-col gap-2">
              {pesananMasuk.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start gap-2.5 rounded-[13px] border border-garis bg-white p-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[13px] font-bold text-hijau">
                    {p.inisial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[13px] font-bold text-tinta">
                      {p.warga}
                      <span
                        className={`rounded-pil px-1.5 py-0.5 text-[9.5px] font-bold ${
                          p.status === "selesai"
                            ? "bg-hijau-lembut text-hijau"
                            : p.status === "diproses"
                              ? "bg-amber/15 text-amber-tua"
                              : "bg-biru-lembut text-biru"
                        }`}
                      >
                        {p.status === "selesai" ? "Selesai" : p.status === "diproses" ? "Diproses" : "Baru"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-tinta-3">
                      {p.baris.map((b) => `${b.nama} ×${b.jumlah}`).join(" · ")}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-tinta-4">
                      {p.titik} · {p.menitLalu} mnt lalu
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <TombolTaut href="/d/rekap" penuh className="mt-4">
              Lihat Buku Kas
            </TombolTaut>
          </div>
        </Lembar>
      }
    >
      {/* Kepala toko */}
      <header className="flex items-center gap-3 px-4 pb-3 pt-2">
        <Image
          src={gerobak.foto}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h1 className="tulisan-judul truncate text-[15px] font-extrabold leading-tight text-hijau">
            {profil?.namaUsaha || gerobak.nama}
          </h1>
          <p className="text-[11px] text-tinta-4">{gerobak.jenis}</p>
        </div>
        <Lonceng />
      </header>

      {/* Bantalan bawah dipasang untuk KEDUA jenis pil melayang. Pil itu
          menumpang di atas isi halaman, jadi tanpa bantalan ini kartu
          terakhir berhenti di bawahnya dan tidak bisa digulung lepas.
          Tinggi pilnya 111px ditambah jarak 12px dari navigasi; pb-32
          (128px) menyisakan ruang lebih. */}
      <div
        className="px-4 pb-4 data-[melayang]:pb-32"
        data-melayang={sedangDiantar || sedangDijemput ? "" : undefined}
      >
        {/* Status gerobak */}
        <section
          className={`relative overflow-hidden rounded-[18px] p-4 ${
            buka ? "gradasi-gerobak" : "bg-hijau-gelap"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
            Status Gerobak
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[22px] font-extrabold text-white">
              Sedang {buka ? "BUKA" : "TUTUP"}
              <span
                aria-hidden
                className={`size-3 rounded-full ${buka ? "bg-hijau-neon" : "bg-merah"}`}
              />
            </p>

            <label className="relative shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={buka}
                onChange={(e) => setGerobak(e.target.checked)}
                className="peer khusus-pembaca-layar"
              />
              <span className="sr-only">Buka gerobak</span>
              <span
                aria-hidden
                className="block h-8 w-[54px] rounded-pil bg-white/25 transition-colors peer-checked:bg-hijau-neon peer-focus-visible:ring-2 peer-focus-visible:ring-white/60"
              />
              <span
                aria-hidden
                className="absolute left-1 top-1 size-6 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[22px]"
              />
            </label>
          </div>

          <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-snug text-white/65">
            <MapPin size={13} strokeWidth={2.1} className="mt-px shrink-0" />
            Bumi Marina Emas Selatan · 150m dari titik kumpul terdekat
          </p>

          {/* Ketika tutup, ajakan berisi alasan konkret untuk membuka. */}
          {!buka && permintaan > 0 && (
            <p className="mt-3 flex items-start gap-2 rounded-[12px] bg-white/10 px-3 py-2.5 text-[11.5px] leading-snug text-white/80">
              <Zap size={14} strokeWidth={2.2} className="mt-px shrink-0 text-amber" />
              <span>
                Ada <strong className="font-bold text-white">{permintaan} permintaan titik kumpul</strong>.
                Aktifkan gerobak untuk mulai menerima pesanan!
              </span>
            </p>
          )}
        </section>

        {/* Ringkasan pesanan hari ini.

            Sebelumnya kartu ini hanya memuat satu angka besar berisi total
            pesanan, dan sisanya ruang kosong. Angka itu sendiri tidak
            memberi tahu apa pun yang bisa ditindaklanjuti: yang ingin
            diketahui pedagang saat membuka aplikasi adalah berapa yang
            menunggu dijawab, berapa yang sedang di jalan, dan berapa yang
            sudah kelar. Ketiganya sudah ada di data yang sama, jadi ruang
            itu diisi tiga angka itu — bukan komponen baru, hanya isi yang
            sebelumnya terbuang. Perilakunya tidak berubah: tetap satu
            tombol yang membuka lembar rekap. */}
        <button
          type="button"
          onClick={() => {
            setRingkasTerbuka((v) => !v);
            setLembarBuka(true);
          }}
          aria-expanded={ringkasTerbuka}
          className="bayang-kartu mt-3 flex w-full items-center gap-1 rounded-[20px] border border-garis bg-white px-2 py-3.5"
        >
          {[
            { nilai: baru.length, label: "Baru", warna: "text-biru" },
            { nilai: pesananMasuk.filter((p) => p.status === "diantar").length, label: "Diantar", warna: "text-amber-tua" },
            { nilai: selesai.length, label: "Selesai", warna: "text-hijau" },
            {
              nilai: pesananMasuk.filter((p) => p.status === "ditolak").length,
              label: "Ditolak",
              warna: "text-merah",
            },
          ].map(({ nilai, label, warna }, i) => (
            <span key={label} className="flex flex-1 items-center">
              {i > 0 && <span aria-hidden className="h-8 w-px shrink-0 bg-garis" />}
              <span className="flex flex-1 flex-col items-center">
                <span className={`text-[21px] font-extrabold leading-none ${warna}`}>{nilai}</span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-tinta-4">
                  {label}
                </span>
              </span>
            </span>
          ))}
          <span aria-hidden className="shrink-0 pr-1 text-tinta-5">
            {ringkasTerbuka ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Pesanan baru */}
        <div className="mt-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
            Pesanan Baru
            {baru.length > 0 && (
              <span className="grid min-w-[18px] place-items-center rounded-full bg-merah px-1.5 py-0.5 text-[10px] font-bold text-white">
                {baru.length}
              </span>
            )}
          </h2>
          <Link href="/d/pesanan" className="text-[12px] font-semibold text-hijau-terang">
            Lihat semua →
          </Link>
        </div>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {baru.map((p) => (
            <li
              key={p.id}
              className="bayang-kartu overflow-hidden rounded-[14px] border border-garis border-t-[3px] border-t-biru bg-white p-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hijau-lembut text-[13px] font-bold text-hijau">
                  {p.inisial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-tinta">
                    {p.warga}
                    <span className="ml-1.5 text-[11px] font-normal text-tinta-4">
                      · {p.menitLalu} mnt lalu
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-tinta-4">
                    <MapPin size={11} strokeWidth={2.2} className="shrink-0" />
                    {p.titik}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {/* Menolak menyetel `ditolak`, bukan `selesai`. Dulu tombol
                    ini menyetel `selesai`, dan sejak Buku Kas ada, pesanan
                    yang ditolak ikut distempel waktu selesai lalu terhitung
                    sebagai pemasukan hari itu: menolak pesanan justru
                    menaikkan omzet. */}
                <button
                  type="button"
                  onClick={() => ubahStatusMasuk(p.id, "ditolak")}
                  className="h-10 shrink-0 rounded-full border border-garis px-5 text-[12.5px] font-bold text-tinta-3 transition-transform active:scale-95"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ubahStatusMasuk(p.id, "diantar");
                    router.push(`/d/antar/${p.id}`);
                  }}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-hijau text-[12.5px] font-bold text-white transition-transform active:scale-[0.98]"
                >
                  <Navigation size={14} strokeWidth={2.3} />
                  Terima &amp; Berangkat
                </button>
              </div>
            </li>
          ))}

          {baru.length === 0 && (
            <li className="rounded-[14px] border border-dashed border-garis bg-white px-4 py-7 text-center text-[12px] leading-relaxed text-tinta-4">
              Tidak ada pesanan baru saat ini.
            </li>
          )}
        </ul>


        {/* Permintaan titik kumpul */}
        <div className="mt-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[14px] font-bold text-tinta">
            Permintaan Titik Kumpul
            {permintaan > 0 && (
              <span className="grid min-w-[18px] place-items-center rounded-full bg-hijau px-1.5 py-0.5 text-[10px] font-bold text-white">
                {permintaan}
              </span>
            )}
          </h2>
        </div>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {tampil.map((t) => (
              /* Kartunya tautan, bukan kotak diam. Sebelumnya ia
                 memperlihatkan permintaan yang sedang menunggu tapi tidak
                 bisa ditekan, sehingga pedagang tidak punya cara melihat
                 siapa saja yang sudah bergabung atau ikut berunding di
                 obrolannya. */
              <li key={t.id}>
                <Link
                  href={`/kolab/${t.id}`}
                  className="bayang-kartu flex items-center gap-2.5 rounded-[14px] border border-garis bg-white p-3 transition-transform active:scale-[0.99]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-tinta">
                      <Users size={14} strokeWidth={2.1} className="shrink-0 text-hijau" />
                      {t.nama}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-tinta-4">
                      {t.peserta.length}/{t.target} warga · {t.patokan}
                    </span>
                  </span>
                  {/* Statusnya ikut ditulis supaya yang sudah dijemput atau
                      selesai tidak terlihat sama dengan yang masih menunggu
                      keputusan. */}
                  <span className="shrink-0 rounded-pil bg-hijau-lembut px-2 py-0.5 text-[10px] font-bold text-hijau">
                    {labelStatusTitik[statusTitik(t, sekarang)]}
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-tinta-5" aria-hidden />
                </Link>
              </li>
            ))}
          {tampil.length === 0 && (
            <li className="rounded-[14px] border border-dashed border-garis bg-white px-4 py-6 text-center text-[12px] text-tinta-4">
              Tidak ada permintaan titik kumpul yang menunggu keputusanmu.
            </li>
          )}
        </ul>
      </div>

    </Layar>
  );
}
