/** Pembungkus yang dipasang ulang pada setiap perpindahan halaman. */
export default function Templat({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col animate-[masuk-halaman_var(--gerak-cepat)_var(--pelan-keluar)_both]">
      {children}
    </div>
  );
}
