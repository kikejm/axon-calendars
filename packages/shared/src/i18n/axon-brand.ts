/**
 * Marca de AxonCalendar sobre el catálogo de Dapta (docs/axon/MARCA.md, punto 5).
 *
 * El catálogo (`./index.ts`) se queda como lo escribe Dapta. `getMessages` lo
 * pasa por aquí una vez por idioma y devuelve la copia con nuestra marca, así un
 * texto nuevo de Dapta con su nombre sale ya con el nuestro.
 *
 * Primero las frases enteras, luego los nombres. El orden importa.
 */

type Rule = readonly [from: string, to: string];

/** Valores que se sustituyen enteros (solo si el texto es exactamente este). */
const EXACT: Record<'en' | 'es', Record<string, string>> = {
  en: { Dapta: 'Products' },
  es: { Dapta: 'Productos' },
};

const RULES: Record<'en' | 'es', readonly Rule[]> = {
  en: [
    ['Your Dapta AI subscription ended, the branding is showing again', 'Your plan no longer includes it, the branding is showing again'],
    ['Included with your Dapta AI subscription', 'Included in your plan'],
    ['included with your Dapta AI subscription', 'included in your plan'],
    ['Dapta branding', 'AxonCalendar branding'],
    ['Dapta products', 'Products'],
    ['Continue with Dapta', 'Sign in'],
    ['Dapta Calendars', 'AxonCalendar'],
    ['Dapta Agents', 'Axon Growth'],
    ['Dapta', 'Axon Growth'],
  ],
  es: [
    ['Tu suscripción de Dapta AI terminó, la marca se muestra de nuevo', 'Tu plan ya no lo incluye, la marca se muestra de nuevo'],
    ['Incluido con tu suscripción de Dapta AI', 'Incluido en tu plan'],
    ['incluidos con tu suscripción de Dapta AI', 'incluidos en tu plan'],
    ['Marca de Dapta', 'Marca de AxonCalendar'],
    ['marca de Dapta', 'marca de AxonCalendar'],
    ['Productos Dapta', 'Productos'],
    ['Continuar con Dapta', 'Iniciar sesión'],
    ['Dapta Calendars', 'AxonCalendar'],
    ['Dapta Agents', 'Axon Growth'],
    ['Dapta', 'Axon Growth'],
  ],
};

export function axonText(text: string, locale: 'en' | 'es'): string {
  const exact = EXACT[locale][text];
  if (exact !== undefined) return exact;
  return RULES[locale].reduce((s, [from, to]) => s.split(from).join(to), text);
}

function rebrand<T>(value: T, locale: 'en' | 'es'): T {
  if (typeof value === 'string') return axonText(value, locale) as T;
  if (Array.isArray(value)) return value.map((v) => rebrand(v, locale)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = rebrand(v, locale);
    return out as T;
  }
  return value;
}

const cache = new WeakMap<object, unknown>();

export function withAxonBrand<T extends object>(catalog: T, locale: 'en' | 'es'): T {
  let branded = cache.get(catalog) as T | undefined;
  if (!branded) {
    branded = rebrand(catalog, locale);
    cache.set(catalog, branded);
  }
  return branded;
}
