import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// `lib/product-name.ts` reads the env once at module load, so every case
// re-imports the brand module after stubbing the name.
async function renderMark(productName: string | undefined) {
  vi.resetModules();
  if (productName === undefined) vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', '');
  else vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', productName);
  const { BrandMark } = await import('./brand');
  return renderToStaticMarkup(<BrandMark className="h-6 w-auto" labelled />);
}

afterEach(() => vi.unstubAllEnvs());

describe('BrandMark', () => {
  it('renders the dC artwork on a Dapta build', async () => {
    for (const name of ['Dapta Calendars', 'dCalendars']) {
      const html = await renderMark(name);
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox="0 0 1141.464 715.8"');
      expect(html).toContain('fill="#3ddc84"');
      expect(html).toContain('fill="currentColor"');
      expect(html).toContain(`<title>${name}</title>`);
      expect(html).not.toContain('bg-primary');
    }
  });

  // Fork de Axon (docs/axon/MARCA.md): el icono de AxonCalendar sustituye al cuadradito con la inicial.
  it('falls back to the Axon icon on a fork', async () => {
    const html = await renderMark('Acme Booking');
    expect(html).toContain('<svg');
    expect(html).toContain('#1a1a1c');
    expect(html).not.toContain('>A<');
  });

  it('never carries Dapta artwork on the default name', async () => {
    const html = await renderMark(undefined);
    expect(html).not.toContain('mask');
    expect(html).toContain('#1a1a1c');
  });

  it('gives each instance its own mask id so two marks can coexist', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', 'Dapta Calendars');
    const { CalendarsMark } = await import('./calendars-logo');
    const html = renderToStaticMarkup(
      <>
        <CalendarsMark />
        <CalendarsMark />
      </>,
    );
    const ids = [...html.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
    for (const id of ids) expect(html).toContain(`mask="url(#${id})"`);
  });
});

async function renderWordmark(productName: string | undefined) {
  vi.resetModules();
  if (productName === undefined) vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', '');
  else vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', productName);
  const { BrandWordmark } = await import('./brand');
  return renderToStaticMarkup(<BrandWordmark className="h-6 w-auto" labelled />);
}

describe('BrandWordmark', () => {
  it('renders the dCal. wordmark on a Dapta build: ink follows the theme, the green is literal', async () => {
    for (const name of ['Dapta Calendars', 'dCalendars']) {
      const html = await renderWordmark(name);
      expect(html).toContain('viewBox="0 0 2074.804 715.8"');
      expect(html).toContain('fill="currentColor"');
      expect(html).toContain('fill="#3ddc84"');
      expect(html).toContain(`<title>${name}</title>`);
      // No hard-coded ink: it would vanish on the dark rail.
      expect(html.toLowerCase()).not.toContain('#1a1a1c');
    }
  });

  it('gives each instance its own mask and clip ids, so a hidden copy never blanks the visible one', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_PRODUCT_NAME', 'Dapta Calendars');
    const { BrandWordmark } = await import('./brand');
    const html = renderToStaticMarkup(
      <>
        <BrandWordmark className="hidden" />
        <BrandWordmark />
      </>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
    for (const id of ids) expect(html).toContain(`url(#${id})`);
  });

  // Fork de Axon: el nombre en Alan Sans 800 con el punto del color de acento, sin icono.
  it('falls back to the name and the accent dot, on one line, on a fork', async () => {
    const html = await renderWordmark('Acme Booking');
    expect(html).not.toContain('<svg');
    expect(html).toContain('>Acme Booking<');
    expect(html).toContain('var(--signal)');
    expect(html).toContain('truncate');
  });
});
