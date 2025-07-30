export type Base16 = {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base0A: string;
  base0B: string;
  base0C: string;
  base0D: string;
  base0E: string;
  base0F: string;
};

export function* surfaceColors(base16: Base16) {
  let current = 0;

  const surfaces = [
    base16.base00,
    base16.base01,
    base16.base02,
    base16.base03,
    base16.base04,
    base16.base05,
  ];

  while (true) {
    yield surfaces[current];
    current = (current + 1) % surfaces.length;
  }
}
