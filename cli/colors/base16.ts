export type Base16 = {
  /** background */
  base00: string;
  /** lighter background (status bars, line number and folding marks) */
  base01: string;
  /** selection background */
  base02: string;
  /** comments, invisibles, line highlighting */
  base03: string;
  /** dark foreground (status bars) */
  base04: string;
  /** default foreground, caret, delimiters, operators */
  base05: string;
  /** light foreground (not often used) */
  base06: string;
  /** light background (not often used) */
  base07: string;
  /** variables, XML tags, markup link text, markup lists, diff deleted */
  base08: string;
  /** integers, boolean, constants, XML attributes, markup link url */
  base09: string;
  /** classes, markup bold, search text background */
  base0A: string;
  /** strings, inherited class, markup code, diff inserted */
  base0B: string;
  /** support, regular expressions, escape characters, markup quotes */
  base0C: string;
  /** functions, methods, attribute IDs, headings */
  base0D: string;
  /** keywords, storage, selector, markup italic, diff changed */
  base0E: string;
  /** deprecated, opening/closing embedded language tags, e.g. <?php ?> */
  base0F: string;
};

export type Base16Context = Base16 & {
  surfaceColors: ReturnType<typeof surfaceColors>;
  colorsArray: ReturnType<typeof colorsArray>;
};

export function colorsArray(base16: Base16) {
  return Object.values(base16);
}

export function* surfaceColors(base16: Base16) {
  let current = 0;

  const surfaces = [
    base16.base00,
    base16.base03,
    base16.base04,
    base16.base02,
  ];

  while (true) {
    yield surfaces[current];
    current = (current + 1) % surfaces.length;
  }
}
