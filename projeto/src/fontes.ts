import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes oficiais do Guia de Publicações (Notion, versão de 02/11/2026):
// títulos em Cormorant Garamond (uma palavra-chave em itálico), textos em Montserrat.
// Arquivos locais (public/fonts, licença OFL): o render não depende de internet.
export const SERIF = "Cormorant Garamond";
export const SANS = "Montserrat";

for (const weight of ["500", "600"]) {
  loadFont({
    family: SERIF,
    url: staticFile(`fonts/cormorant-garamond-latin-${weight}-normal.woff2`),
    weight,
  });
  loadFont({
    family: SERIF,
    url: staticFile(`fonts/cormorant-garamond-latin-${weight}-italic.woff2`),
    weight,
    style: "italic",
  });
  loadFont({
    family: SANS,
    url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`),
    weight,
  });
}
