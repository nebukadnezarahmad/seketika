/**
 * Lambang SEKETIKA sebagai SVG sebaris, supaya bagian-bagiannya bisa
 * digerakkan sendiri-sendiri.
 *
 * Hijaunya kini hijau terang merek, bukan hijau hutan seperti versi
 * pertama. Selama palet aplikasinya masih krem dan hijau tua, lambang
 * gelap itu memang cocok; setelah seluruh aplikasi beralih ke hijau
 * terang, ia jadi satu-satunya unsur yang tertinggal di palet lama dan
 * terbaca seperti lambang aplikasi lain yang kebetulan ditempel di
 * sini.
 *
 * Berbeda dari `Logo` yang memuat berkas lewat `next/image`. Gambar yang
 * dimuat sebagai berkas adalah satu kotak buram bagi CSS: pin, roda, dan
 * sinarnya tidak bisa disentuh terpisah, jadi yang bisa dianimasikan
 * hanya seluruh lambangnya sekaligus. Untuk layar pembuka yang justru
 * ingin merakit lambangnya di depan mata, tiap bagian harus punya
 * simpulnya sendiri.
 *
 * Geometrinya sama persis dengan `public/img/logo.svg`; yang ditambahkan
 * cuma nama kelas pada tiap kelompok. Warnanya juga dipertahankan apa
 * adanya, bukan ditarik ke token tema: ini lambang merek, dan lambang
 * merek tidak ikut berganti rupa setiap palet aplikasinya disetel ulang.
 */
export function LogoGerak({
  size = 132,
  bergerak = true,
  hijau = "#00AA13",
  className = "",
}: {
  size?: number;
  /** Matikan untuk memakainya sebagai lambang diam. */
  bergerak?: boolean;
  /**
   * Warna badan lambang. Bisa disetel untuk latar yang menuntut
   * perlakuan lain, misalnya putih di atas hijau pekat. Intinya yang
   * oranye tidak ikut berubah; itu satu-satunya aksen merek yang
   * membedakannya dari pin lokasi mana pun.
   */
  hijau?: string;
  className?: string;
}) {
  const g = (nama: string) => (bergerak ? nama : "");

  return (
    <svg
      viewBox="0 0 142 137"
      fill="none"
      role="img"
      aria-label="Logo SEKETIKA"
      className={className}
      style={{ width: size, height: (size * 137) / 142, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="lg-sinar" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="lg-inti" x1="63.75" y1="30" x2="63.75" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Gerobak: batang, dua roda, dan gandarnya. Bagian ini yang datang
          lebih dulu, karena pin lokasinya nanti mendarat di atasnya.

          Roda dan gandarnya diluruskan ke sumbu batang (128,498 / 2 =
          64,249). Pada ekspor Figma aslinya pasangan roda berpusat di
          72,7 sementara batang dan pinnya di 64,2, dan selisih 8,5 unit
          itu membuat seluruh gerobak terbaca miring ke kanan — paling
          kentara pada lambang berukuran besar di layar pembuka. Jarak
          antar rodanya sendiri tidak diubah. */}
      <g className={g("lg-gerobak")}>
        <rect y="95" width="128.498" height="6" rx="3" fill={hijau} />
        <rect x="40.3418" y="124.5" width="47.8145" height="5" fill={hijau} />
        <g className={g("lg-roda")} style={{ transformOrigin: "40.34px 127px" }}>
          <ellipse cx="40.3418" cy="127" rx="9.96106" ry="10" fill={hijau} />
          <ellipse cx="40.3418" cy="127" rx="4.98053" ry="5" fill="#FFFFFF" />
        </g>
        <g className={g("lg-roda")} style={{ transformOrigin: "88.16px 127px" }}>
          <ellipse cx="88.1563" cy="127" rx="9.96106" ry="10" fill={hijau} />
          <ellipse cx="88.1563" cy="127" rx="4.98053" ry="5" fill="#FFFFFF" />
        </g>
      </g>

      {/* Pin lokasi, jatuh dari atas lalu mendarat memantul sedikit. */}
      <g className={g("lg-pin")} style={{ transformOrigin: "63.75px 100px" }}>
        <ellipse cx="63.7503" cy="45.4099" rx="44.3773" ry="45.4099" fill={hijau} />
        <path
          d="M76.2492 106.455C70.3156 115.396 57.1868 115.396 51.2532 106.455L29.1773 73.1919C22.5603 63.2215 29.709 49.8973 41.6753 49.8973L85.8272 49.8973C97.7935 49.8973 104.942 63.2215 98.3251 73.1919L76.2492 106.455Z"
          fill={hijau}
        />
      </g>

      {/* Lingkaran krem lalu inti oranye, masing-masing membesar sendiri. */}
      <ellipse
        className={g("lg-cincin")}
        style={{ transformOrigin: "64.25px 44.5px" }}
        cx="64.2484"
        cy="44.5"
        rx="27.3929"
        ry="27.5"
        fill="#FFFFFF"
      />
      <ellipse
        className={g("lg-inti")}
        style={{ transformOrigin: "63.75px 45px" }}
        cx="63.7502"
        cy="45"
        rx="14.9416"
        ry="15"
        fill="url(#lg-inti)"
      />

      {/* Tiga sinar oranye, memancar bergiliran paling akhir.

          Tiap sinar dibungkus kelompoknya sendiri, dan kelompok itulah
          yang dianimasikan. Kalau animasinya dipasang langsung pada
          persegi panjangnya, `transform` dari CSS menimpa `transform`
          bawaan SVG yang justru memuat matriks pemutar dan penempatnya —
          sinarnya lompat ke sudut kiri atas dan kehilangan kemiringannya.
          Membungkusnya membuat dua transform itu bertingkat, bukan saling
          menggantikan. */}
      <g className={g("lg-sinar lg-sinar-1")} style={{ transformOrigin: "63.75px 45px" }}>
        <rect
          width="21.7661"
          height="7.81247"
          rx="3.90624"
          transform="matrix(0.663953 -0.747774 0.745771 0.666202 107.92 16.8931)"
          fill="url(#lg-sinar)"
        />
      </g>
      <g className={g("lg-sinar lg-sinar-2")} style={{ transformOrigin: "63.75px 45px" }}>
        <rect
          width="21.7139"
          height="7.83126"
          rx="3.91563"
          transform="matrix(0.983566 -0.180548 0.177464 0.984127 113.898 27.5701)"
          fill="url(#lg-sinar)"
        />
      </g>
      <g className={g("lg-sinar lg-sinar-3")} style={{ transformOrigin: "63.75px 45px" }}>
        <rect
          width="21.6979"
          height="7.837"
          rx="3.9185"
          transform="matrix(0.918963 0.394344 -0.393503 0.919323 116.523 40.2947)"
          fill="url(#lg-sinar)"
        />
      </g>
    </svg>
  );
}
