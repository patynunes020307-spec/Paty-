import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes locais (public/fonts, licença OFL): o render não depende de internet.
export const SERIF = "Cormorant Garamond";
export const SANS = "Montserrat";

for (const weight of ["500", "600"]) {
  loadFont({
    family: SERIF,
    url: staticFile(`fonts/cormorant-garamond-latin-${weight}-normal.woff2`),
    weight,
  });
  loadFont({
    family: SANS,
    url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`),
    weight,
  });
}
