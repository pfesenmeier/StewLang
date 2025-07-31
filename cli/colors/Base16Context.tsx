import { createContext, useContext } from "react";
import { type Base16Context, surfaceColors } from "./base16.ts";
import { catppuccinFrappe } from "./catppuccinFrappe.ts";

const Base16Context = createContext<Base16Context>(null!);

export function Base16Provider(
  { children }: { children: React.ReactNode },
) {
  const theme = {
    ...catppuccinFrappe,
    surfaceColors: surfaceColors(catppuccinFrappe),
  };
  return (
    <Base16Context value={theme}>
      {children}
    </Base16Context>
  );
}

export function useBase16() {
  return useContext(Base16Context);
}
