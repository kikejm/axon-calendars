import { PRODUCT_NAME } from '@/lib/product-name';

/**
 * Logo de AxonCalendar (docs/axon/MARCA.md), al estilo de AxonSynapse: el nombre en
 * Alan Sans 800 con un punto del color de acento detrás, y un icono propio
 * sobre una baldosa oscura para el favicon y la barra lateral plegada. El
 * icono es el mismo dibujo que `app/icon.svg`.
 */
export function AxonWordmark() {
  return (
    <span className="flex min-w-0 items-center select-none">
      <span
        className="truncate text-foreground"
        style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}
      >
        {PRODUCT_NAME}
      </span>
      <span
        aria-hidden
        className="shrink-0 rounded-full"
        style={{ width: 6, height: 6, marginLeft: 3, marginTop: 3, background: 'var(--signal)' }}
      />
    </span>
  );
}

/** El dibujo del icono, en el color que se le pase. */
export function AxonGlyph({ size, color = 'currentColor' }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x="12.5" y="13" width="4" height="4" rx="1" fill={color} />
    </svg>
  );
}

/** El icono sobre su baldosa oscura, como el favicon. */
export function AxonIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#1a1a1c" />
      <g transform="translate(3 3) scale(0.75)">
        <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="#F75C03" strokeWidth="2" fill="none" />
        <path d="M3.5 10h17M8 3v4M16 3v4" stroke="#F75C03" strokeWidth="2" strokeLinecap="round" />
        <rect x="12.5" y="13" width="4" height="4" rx="1" fill="#F75C03" />
      </g>
    </svg>
  );
}
