# SEKETIKA

Aplikasi web yang menghubungkan **pedagang keliling** dengan **warga di sekitarnya**.
Warga bisa melihat gerobak yang sedang lewat, memanggilnya ke depan rumah, atau
patungan satu **Titik Kumpul** bersama tetangga supaya pedagang mau datang ke
lingkungan mereka.

Dibuat untuk **App Development Competition IT FEST 2026** yang diselenggarakan HMPS
Informatika UIN K.H. Abdurrahman Wahid Pekalongan.
Subtema: **Digitalisasi UMKM dan Ekonomi Kreatif**.

| | |
|---|---|
| Aplikasi | <https://seketika-puce.vercel.app> |
| Repositori | <https://github.com/nebukadnezarahmad/seketika> |

> Buka dari ponsel, atau perkecil jendela peramban. Tata letaknya dirancang
> untuk lebar 390px.

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
| Pembuka bertahap | Ilustrasi, lambang, lalu tagline muncul berurutan |
| Sambutan & daftar akun | Masuk atau buat akun, termasuk pintasan Google dan Facebook |
| Peta pedagang | Gerobak aktif di sekitar, dengan jarak dan estimasi waktu |
| Pencarian | Cari menu atau pedagang, dengan penyaring estimasi harga |
| Daftar menu | Ketuk menu untuk melihat foto dan keterangan lengkapnya |
| Panggil penjual | Memanggil gerobak ke lokasi, dengan atau tanpa pesanan awal |
| Pelacakan pesanan | Empat tahap, dari menunggu konfirmasi sampai selesai |
| **Titik Kumpul** | Buat atau ikut patungan pesanan bersama tetangga |
| Obrolan titik kumpul | Warga yang ikut patungan berunding jam berkumpul |
| Kedaluwarsa otomatis | Titik kumpul yang lewat tenggat berhenti menerima warga |
| Bagikan undangan | Tautan titik kumpul dibagikan lewat WhatsApp |
| Percakapan | Obrolan langsung dengan pedagang |
| Beri penilaian | Bintang untuk pesanan selesai, sekali kirim, tampil di riwayat |
| Kelola akun | Ubah nama, telepon, alamat, dan patokan lewat lembar di profil |
| Pusat notifikasi | Kabar pesanan dan titik kumpul, dengan lencana belum dibaca |
| Bisa dipasang | Punya manifest, ikon, dan service worker; terpasang seperti aplikasi biasa |

### Sisi pedagang

| Fitur | Keterangan |
|---|---|
| Sakelar gerobak | Buka atau tutup. Saat tutup, permintaan yang menunggu ditampilkan |
| Pesanan masuk | Disaring menurut status, dengan rincian dan total |
| Terima & berangkat | Membuka navigasi dengan panduan arah |
| Rekap harian | Ringkasan pesanan yang sudah dilayani |
| Buku Kas | Pendapatan harian, grafik tujuh hari, menu terlaris, dan jam paling ramai |
| Rincian per hari | Batang grafik bisa diketuk; menu terlaris dan jam ramai ikut menyesuaikan hari itu |
| Kelola menu | Tambah, ubah, hapus, dan matikan menu, lengkap dengan foto yang bisa diganti |
| Pengaturan toko | Nama, jenis, keterangan, area jangkauan, jam operasional, dan galeri |
| Penilaian diterima | Rata-rata bintang dari warga, dihitung dari pesanan yang dinilai |
| Tolak pesanan | Punya statusnya sendiri dan tidak terhitung sebagai pemasukan |
| Pusat notifikasi | Pesanan baru dan permintaan titik kumpul untuk gerobak sendiri |
| **SEKETIKA Pro** | Langganan yang bisa dinyalakan dan dimatikan, membuka tiga fitur di bawah |
| Laporan 30 hari | Total, rata-rata per hari jualan, hari terbaik, dan perbandingan mingguan |
| Prakiraan kawasan | Kawasan dan jam yang paling sering menghasilkan pesanan |
| Catatan stok | Sisa porsi tiap menu, dicatat naik-turun dengan satu ketukan |
| Halaman toko | Kelola menu, area jangkauan, dan jam operasional |

## Teknologi

- **Next.js 16** (App Router) dan **React 19**
- **TypeScript** dengan mode ketat
- **Tailwind CSS v4** dengan token warna, jarak, dan radius yang diambil langsung
  dari berkas rancangan
- **Inter, Poppins, dan Caveat** lewat `next/font`, sesuai penggunaannya di
  rancangan: Inter untuk seluruh isi, Poppins khusus lambang kata, Caveat untuk
  satu kalimat sapaan
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
contoh. Data tersimpan di peramban perangkat itu sendiri, jadi ponsel yang sudah
pernah membuka versi lama akan tetap memegang data lamanya sampai tombol ini
ditekan. Tekan sekali sebelum memperagakan aplikasinya.

## Memasang sebagai aplikasi

SEKETIKA adalah PWA. Dari Chrome di Android, menu tiga titik memuat **Instal
aplikasi**; setelah dipasang ia punya ikon sendiri di layar utama dan terbuka
tanpa bilah alamat. Di iOS lewat Safari, **Bagikan → Tambahkan ke Layar Utama**.

Isinya tetap dimuat dari server, jadi setiap kali kode ini di-deploy, aplikasi
yang sudah terpasang ikut memakai versi baru saat dibuka berikutnya. Yang tidak
ikut berubah hanya ikon, nama, dan splash screen, karena ketiganya dibaca dari
manifest saat pemasangan.

### Membungkusnya jadi APK

Untuk berkas `.apk`, bungkus alamat produksinya sebagai Trusted Web Activity:

1. Buka <https://www.pwabuilder.com>, masukkan <https://seketika-puce.vercel.app>.
2. Unduh paket Android yang dihasilkan.
3. PWABuilder ikut memberi berkas `assetlinks.json`. Taruh isinya di
   `public/.well-known/assetlinks.json`, lalu deploy ulang.

Langkah ketiga tidak boleh dilewat: berkas itu yang membuktikan APK dan domainnya
milik pihak yang sama. Tanpa itu Android tetap menampilkan bilah alamat tipis di
atas aplikasi. Isinya memuat sidik jari kunci penanda tangan APK, jadi ia baru
bisa dibuat setelah paketnya jadi.

### Service worker

`public/sw.js` sengaja memakai aturan **jaringan dulu**, bukan salinan dulu.
Aplikasi terpasang tidak punya bilah alamat dan tidak punya tombol muat ulang,
jadi salinan yang salah simpan akan mengurung penggunanya di versi lama tanpa
jalan keluar. Yang dilayani dari salinan lebih dulu hanya berkas di
`/_next/static/`, yang namanya memuat sidik jari isinya sehingga tidak pernah
berubah isi untuk nama yang sama.

## Struktur berkas

```
app/                    rute dan layar
  sambutan/ daftar/     pintu masuk dan pembuatan akun
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
public/
  sw.js                 service worker
  icon/                 ikon aplikasi
app/manifest.ts         manifest PWA
uji/                    uji ujung-ke-ujung
```

## Rancangan

Antarmuka dibuat lebih dulu di Figma, lalu diterjemahkan ke kode. Nilai warna,
ukuran huruf, jarak, radius, dan bayangan tidak dikira-kira: semuanya diambil
dari berkas rancangan, dan ikon serta ilustrasinya adalah aset ekspor yang sama.

Urutan layarnya mengikuti prototipe: pembuka bertahap, sambutan, pembuatan akun,
lalu tiga langkah pengenalan sebelum masuk ke beranda sesuai peran.

## Tim

| | |
|---|---|
| Nama tim | INGKER |
| Institusi | Institut Teknologi PLN |
| Subtema | Digitalisasi UMKM dan Ekonomi Kreatif |

## Lisensi

Hak cipta atas karya ini tetap berada pada tim pembuat, sesuai ketentuan
guidebook App Development Competition IT FEST 2026.
