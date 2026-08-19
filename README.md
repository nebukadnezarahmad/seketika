# SEKETIKA

Aplikasi web yang menghubungkan **pedagang keliling** dengan **warga di sekitarnya**.
Warga bisa melihat gerobak yang sedang lewat, memanggilnya ke depan rumah, atau
patungan satu **Titik Kumpul** bersama tetangga supaya pedagang mau datang ke
lingkungan mereka.

Dibuat untuk **App Development Competition IT FEST 2026** yang diselenggarakan HMPS
Informatika UIN K.H. Abdurrahman Wahid Pekalongan.
Subtema: **Digitalisasi UMKM dan Ekonomi Kreatif**.

## Masalah yang dijawab

Pedagang keliling adalah UMKM yang paling tidak tersentuh digitalisasi. Mereka
tidak punya lapak tetap, tidak punya jam buka yang bisa dicari, dan tidak masuk
ke aplikasi pesan-antar mana pun karena ongkos kirimnya lebih mahal daripada
dagangannya. Warga yang ingin membeli hanya bisa menunggu dan berharap gerobaknya
lewat.

SEKETIKA menyelesaikannya dari dua arah sekaligus:

- **Warga tahu siapa yang sedang lewat.** Peta menampilkan gerobak yang sedang
  berstatus buka, lengkap dengan jarak dan perkiraan waktu tempuh.
- **Pedagang punya alasan untuk datang.** Lewat Titik Kumpul, beberapa warga
  mengumpulkan pesanan pada satu titik. Pedagang baru berangkat setelah target
  jumlah warga terpenuhi, jadi satu perjalanan melayani banyak pembeli sekaligus.

Tidak ada ongkos kirim dan tidak ada komisi. Yang dijual bukan pengantaran,
melainkan kepastian: warga tahu kapan gerobaknya datang, pedagang tahu ke mana
harus berjalan.

## Fitur

### Sisi warga

| Fitur | Keterangan |
|---|---|
| Peta pedagang | Gerobak aktif di sekitar, dengan jarak dan estimasi waktu |
| Pencarian | Cari menu atau pedagang, dengan penyaring estimasi harga |
| Daftar menu & keranjang | Keranjang terkunci pada satu pedagang |
| Pelacakan pesanan | Empat tahap, dari menunggu konfirmasi sampai selesai |
| **Titik Kumpul** | Buat atau ikut patungan pesanan bersama tetangga |
| Bagikan undangan | Tautan titik kumpul dibagikan lewat WhatsApp |
| Percakapan | Obrolan langsung dengan pedagang |

### Sisi pedagang

| Fitur | Keterangan |
|---|---|
| Sakelar gerobak | Buka atau tutup. Saat tutup, permintaan yang menunggu ditampilkan |
| Pesanan masuk | Disaring menurut status, dengan rincian dan total |
| Terima & berangkat | Membuka navigasi dengan panduan arah |
| Rekap harian | Ringkasan pesanan yang sudah dilayani |
| Halaman toko | Kelola menu, area jangkauan, dan jam operasional |

## Teknologi

- **Next.js 16** (App Router) dan **React 19**
- **TypeScript** dengan mode ketat
- **Tailwind CSS v4** dengan token warna, jarak, dan radius yang diambil langsung
  dari berkas rancangan
- **Zustand** dengan penyimpanan lokal peramban
- **Playwright** untuk uji ujung-ke-ujung

Aplikasi berjalan sepenuhnya di sisi klien dan tidak memerlukan basis data,
kunci API, maupun sambungan internet setelah halaman termuat. Pilihan ini
disengaja: seluruh alur, termasuk yang melibatkan dua peran yang saling
menunggu, bisa ditelusuri utuh tanpa satu pun langkah yang bisa gagal karena
jaringan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>. Aplikasi dirancang untuk lebar ponsel; di layar
lebar tampilannya menyusut menjadi kolom 390px agar proporsinya tetap sama.

### Perintah lain

```bash
npm run periksa       # periksa tipe, lint, lalu build
npm run uji           # uji ujung-ke-ujung
npm run uji:tampak    # uji dengan antarmuka Playwright
```

## Mencoba kedua peran

Aplikasi ini tidak memakai server autentikasi, jadi peran dipilih saat
pengenalan dan bisa ditukar kapan saja lewat **Profil → Beralih ke Mode
Pedagang** (atau sebaliknya). Alur paling menarik untuk dicoba:

1. Masuk sebagai **pembeli**, buka **Titik Kumpul**, ikut bergabung pada
   "RT 07 Taman Asri" yang tinggal butuh satu warga lagi.
2. Targetnya terpenuhi, tombolnya berubah menjadi arahan ke lokasi.
3. Beralih ke **mode pedagang** lewat halaman profil.
4. Terima pesanan yang masuk, lalu ikuti layar navigasinya.

Tombol **Setel Ulang Data** di halaman profil mengembalikan semuanya ke keadaan
contoh.

## Struktur berkas

```
app/                    rute dan layar
  mulai/                pengenalan tiga langkah
  beranda/ peta/ cari/  penjelajahan
  pedagang/[slug]/      detail pedagang dan menunya
  kolab/                titik kumpul
  pesanan/ chat/ profil/
  d/                    seluruh layar sisi pedagang
komponen/               komponen bersama
  ui/                   tombol, kartu, lembar, ikon
  peta/ kolab/ pesanan/
lib/
  data/                 data contoh
  toko.ts               keadaan aplikasi
  tipe.ts format.ts
uji/                    uji ujung-ke-ujung
```

## Rancangan

Antarmuka dibuat lebih dulu di Figma, lalu diterjemahkan ke kode. Nilai warna,
ukuran huruf, jarak, radius, dan bayangan tidak dikira-kira: semuanya diambil
dari berkas rancangan, dan ikon serta ilustrasinya adalah aset ekspor yang sama.

## Tim

| | |
|---|---|
| Nama tim | _(diisi sebelum pengumpulan)_ |
| Institusi | Institut Teknologi PLN |
| Subtema | Digitalisasi UMKM dan Ekonomi Kreatif |

## Lisensi

Hak cipta atas karya ini tetap berada pada tim pembuat, sesuai ketentuan
guidebook App Development Competition IT FEST 2026.
