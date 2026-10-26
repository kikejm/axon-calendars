import { Alan_Sans } from 'next/font/google';

/**
 * Letra de la marca Axon (docs/axon/MARCA.md): Alan Sans, la misma que
 * AxonSynapse. Fichero nuestro para no tocar la carga de letras de Dapta;
 * `globals.css` la usa como `--font-sans` a través de esta variable.
 */
export const alanSans = Alan_Sans({
  subsets: ['latin'],
  variable: '--font-alan-sans',
  display: 'swap',
});
