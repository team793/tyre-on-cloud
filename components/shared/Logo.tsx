interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 'dark' (default) is for dark backgrounds (ink-950 navbar/footer); 'light' is for white/light pages. */
  theme?: 'dark' | 'light';
}

const sizes = {
  sm: { tyre: 18, fontSize: 14, gap: 6 },
  md: { tyre: 22, fontSize: 17, gap: 7 },
  lg: { tyre: 30, fontSize: 22, gap: 9 },
};

export function Logo({ size = 'md', className = '', theme = 'dark' }: LogoProps) {
  const s = sizes[size];
  const wordmarkColor = theme === 'dark' ? '#f3ede3' : '#111827';

  return (
    <span
      className={`inline-flex items-center font-display font-semibold tracking-tight text-chalk-100 ${className}`}
      style={{ gap: s.gap, fontSize: s.fontSize }}
    >
      {/* Tyre icon */}
      <svg
        width={s.tyre}
        height={s.tyre}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Outer tyre */}
        <circle cx="16" cy="16" r="14" stroke="#dc2626" strokeWidth="3.5" fill="none" />
        {/* Tread marks */}
        <circle cx="16" cy="16" r="10.5" stroke="#7f1d1d" strokeWidth="1.5" fill="none" strokeDasharray="3 3.2" />
        {/* Sidewall / rim area */}
        <circle cx="16" cy="16" r="7" fill="#1b1512" stroke="#3a322c" strokeWidth="1.5" />
        {/* 5-spoke rim */}
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg - 90) * (Math.PI / 180);
          const x2 = 16 + Math.cos(rad) * 5.5;
          const y2 = 16 + Math.sin(rad) * 5.5;
          return (
            <line
              key={deg}
              x1="16"
              y1="16"
              x2={x2}
              y2={y2}
              stroke="#dc2626"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
        {/* Hub */}
        <circle cx="16" cy="16" r="2.2" fill="#dc2626" />
      </svg>

      {/* Wordmark */}
      <span>
        <span style={{ color: wordmarkColor }}>Tyre</span>
        <span style={{ color: '#dc2626', marginLeft: 2, marginRight: 2 }}>on</span>
        <span style={{ color: wordmarkColor }}>Cloud</span>
      </span>
    </span>
  );
}
