/**
 * Pembungkus yang dipasang ulang pada setiap perpindahan halaman.
 *
 * Next memasang ulang `template` tiap kali rute berubah, jadi animasi di
 * sini berjalan sekali per perpindahan. Yang digerakkan hanya opasitas
 * dan geseran enam piksel; lebih dari itu perpindahannya terasa lamban
 * alih-alih halus, dan pada aplikasi yang layarnya sering berganti,
 * kelambanan itu menumpuk.
 *
 * Pembungkusnya memakai `flex flex-1` supaya rantai tinggi ke `Layar`
 * yang setinggi layar tidak terputus.
 */
export default function Templat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col animate-[masuk-halaman_var(--gerak-cepat)_var(--pelan-keluar)_both]">
      {children}
    </div>
  );
}
