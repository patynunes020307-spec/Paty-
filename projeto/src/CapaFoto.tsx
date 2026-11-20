import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS, SERIF } from "./fontes";
import { COR } from "./marca";

// Capa "Foto protagonista" (Guia, 03/11/2026): foto real em tela cheia,
// degradê petróleo só na base, título Cormorant com itálico nude, logo original
// pequena (PNG transparente oficial, sem redesenho).
export type CapaFotoProps = {
  foto: string;
  enquadramento: string;
  kicker: string;
  linha: string;
  italico: string;
  logo: { arquivo: string; top: number; left: number; width: number };
};

const DEGRADE =
  "linear-gradient(to top, rgba(7,33,38,0.97) 0%, rgba(7,33,38,0.85) 18%, rgba(32,63,81,0) 40%)";

export const CAPA_VIVER: CapaFotoProps = {
  foto: "viver/06-fogos.jpg",
  enquadramento: "50% 50%",
  kicker: "Assessoria e cerimonial",
  linha: "Para viver",
  italico: "cada momento.",
  logo: { arquivo: "marca/oficial/selo-nude.png", top: 600, left: 830, width: 190 },
};

export const CapaFoto: React.FC<CapaFotoProps> = ({
  foto,
  enquadramento,
  kicker,
  linha,
  italico,
  logo,
}) => (
  <AbsoluteFill style={{ backgroundColor: COR.petroleoEscuro }}>
    <Img
      src={staticFile(foto)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: enquadramento,
      }}
    />
    <AbsoluteFill style={{ background: DEGRADE }} />
    <Img
      src={staticFile(logo.arquivo)}
      style={{
        position: "absolute",
        top: logo.top,
        left: logo.left,
        width: logo.width,
      }}
    />
    <div style={{ position: "absolute", left: 96, right: 60, bottom: 250 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginBottom: 30,
        }}
      >
        <div style={{ width: 64, height: 3, backgroundColor: COR.nude }} />
        <div
          style={{
            color: COR.nude,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          {kicker}
        </div>
      </div>
      <div
        style={{
          color: COR.fundoClaro,
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: 104,
          lineHeight: 1.04,
        }}
      >
        {linha}
        <br />
        <span style={{ fontStyle: "italic", color: COR.nude }}>{italico}</span>
      </div>
    </div>
  </AbsoluteFill>
);
