import Image from 'next/image';

const ACCENT_COLORS = ['#dc2626', '#ea580c', '#0891b2', '#7c3aed', '#16a34a', '#db2777', '#2563eb', '#ca8a04'];

function brandAccent(brand: string): string {
  let hash = 0;
  for (let i = 0; i < brand.length; i++) hash = (hash * 31 + brand.charCodeAt(i)) >>> 0;
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

interface TyreThumbnailProps {
  imageUrl: string | null;
  brand: string;
  alt: string;
  /** Controls the box's size/shape/background — e.g. "h-44 w-full" or "h-9 w-9 rounded-lg bg-slate-800". */
  className?: string;
}

/** Renders the product photo when one exists, otherwise a brand-tinted tyre icon placeholder. */
export function TyreThumbnail({ imageUrl, brand, alt, className = '' }: TyreThumbnailProps) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={imageUrl} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  const accent = brandAccent(brand);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-[70%] w-[70%]">
        <circle cx="16" cy="16" r="14" stroke={accent} strokeWidth="3.5" fill="none" />
        <circle cx="16" cy="16" r="10.5" stroke={accent} strokeOpacity="0.45" strokeWidth="1.5" fill="none" strokeDasharray="3 3.2" />
        <circle cx="16" cy="16" r="7" fill="#1b1512" stroke="#3a322c" strokeWidth="1.5" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x2 = 16 + Math.cos(rad) * 5.5;
          const y2 = 16 + Math.sin(rad) * 5.5;
          return (
            <line key={deg} x1="16" y1="16" x2={x2} y2={y2} stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          );
        })}
        <circle cx="16" cy="16" r="2.2" fill={accent} />
      </svg>
    </div>
  );
}
