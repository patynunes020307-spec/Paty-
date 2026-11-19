import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TesteEdita } from "./TesteEdita";
import { BastidoresSemana, BASTIDORES_DURACAO } from "./BastidoresSemana";
import { CORTES, CorteFilme, duracaoCorte, FPS } from "./CorteFilme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="TesteEdita"
        component={TesteEdita}
        durationInFrames={5 * 30}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BastidoresSemana"
        component={BastidoresSemana}
        durationInFrames={BASTIDORES_DURACAO}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasamentoTC1MakingOf"
        component={CorteFilme}
        defaultProps={CORTES.CasamentoTC1MakingOf}
        durationInFrames={duracaoCorte(CORTES.CasamentoTC1MakingOf)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasamentoTC2Entrada"
        component={CorteFilme}
        defaultProps={CORTES.CasamentoTC2Entrada}
        durationInFrames={duracaoCorte(CORTES.CasamentoTC2Entrada)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasamentoTC3Aliancas"
        component={CorteFilme}
        defaultProps={CORTES.CasamentoTC3Aliancas}
        durationInFrames={duracaoCorte(CORTES.CasamentoTC3Aliancas)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasamentoTC4Brinde"
        component={CorteFilme}
        defaultProps={CORTES.CasamentoTC4Brinde}
        durationInFrames={duracaoCorte(CORTES.CasamentoTC4Brinde)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
