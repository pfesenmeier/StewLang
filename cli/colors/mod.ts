import { catppuccinFrappe as appTheme } from "./catppuccinFrappe.ts";
import { surfaceColors } from "./base16.ts";

export function appSurfaceColors() {
  return surfaceColors(appTheme);
}

export { appTheme };
