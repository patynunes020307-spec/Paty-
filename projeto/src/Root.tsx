import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TesteEdita } from "./TesteEdita";
import { BastidoresSemana, BASTIDORES_DURACAO } from "./BastidoresSemana";
import { CORTES, CorteFilme, duracaoCorte, FPS } from "./CorteFilme";
import { ASSESSORA, duracaoMotion, MONTAGEM, MotionReel } from "./MotionReel";
import {
  Capa,
  CAPA_DAMARYS,
  CAPA_ENSAIO,
  STORIES,
  Story,
} from "./EnsaioExtras";

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
      <Composition
        id="Ensaio1AntesDoGrandeDia"
        component={CorteFilme}
        defaultProps={CORTES.Ensaio1AntesDoGrandeDia}
        durationInFrames={duracaoCorte(CORTES.Ensaio1AntesDoGrandeDia)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryEnsaio1"
        component={Story}
        defaultProps={STORIES.StoryEnsaio1}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryEnsaio2"
        component={Story}
        defaultProps={STORIES.StoryEnsaio2}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryEnsaio3"
        component={Story}
        defaultProps={STORIES.StoryEnsaio3}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryEnsaio4"
        component={Story}
        defaultProps={STORIES.StoryEnsaio4}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaEnsaio"
        component={Capa}
        defaultProps={CAPA_ENSAIO}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CasamentoDamarys"
        component={CorteFilme}
        defaultProps={CORTES.CasamentoDamarys}
        durationInFrames={duracaoCorte(CORTES.CasamentoDamarys)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryDamarys1"
        component={Story}
        defaultProps={STORIES.StoryDamarys1}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryDamarys2"
        component={Story}
        defaultProps={STORIES.StoryDamarys2}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryDamarys3"
        component={Story}
        defaultProps={STORIES.StoryDamarys3}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaDamarys"
        component={Capa}
        defaultProps={CAPA_DAMARYS}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelAssessora"
        component={MotionReel}
        defaultProps={ASSESSORA}
        durationInFrames={duracaoMotion(ASSESSORA)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelMontagem"
        component={MotionReel}
        defaultProps={MONTAGEM}
        durationInFrames={duracaoMotion(MONTAGEM)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
