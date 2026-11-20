import { Composition } from "remotion";
import { duracaoShortVotos, ShortVotos, SHORTS_VOTOS } from "./ShortsVotos";
import { MyComposition } from "./Composition";
import { TesteEdita } from "./TesteEdita";
import { BastidoresSemana, BASTIDORES_DURACAO } from "./BastidoresSemana";
import { CORTES, CorteFilme, duracaoCorte, FPS } from "./CorteFilme";
import { DIARIO, Diario, duracaoDiario } from "./Diario";
import {
  ANTES_CONVIDADOS,
  ASSESSORA,
  duracaoMotion,
  MONTAGEM,
  MotionReel,
  VOTOS_DICAS,
  VESPERA,
  PADRINHOS,
  CONJUNTO,
  QUINZE_FESTA,
  ALIANCA,
  ULTIMA_VOLTA,
  ROTEIRO,
  CAUDA,
} from "./MotionReel";
import {
  Capa,
  CAPA_ALIANCA,
  CAPA_ANTES_CONVIDADOS,
  CAPA_ASSESSORA,
  CAPA_CAUDA,
  CAPA_DIARIO,
  CAPA_PADRINHOS,
  CAPA_ROTEIRO,
  CAPA_ULTIMA_VOLTA,
  CAPA_DAMARYS,
  CAPA_MONTAGEM,
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
      <Composition
        id="CapaAssessora"
        component={Capa}
        defaultProps={CAPA_ASSESSORA}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaMontagem"
        component={Capa}
        defaultProps={CAPA_MONTAGEM}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelAntesConvidados"
        component={MotionReel}
        defaultProps={ANTES_CONVIDADOS}
        durationInFrames={duracaoMotion(ANTES_CONVIDADOS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaAntesConvidados"
        component={Capa}
        defaultProps={CAPA_ANTES_CONVIDADOS}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelDiario"
        component={Diario}
        defaultProps={DIARIO}
        durationInFrames={duracaoDiario(DIARIO)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelPadrinhos"
        component={MotionReel}
        defaultProps={PADRINHOS}
        durationInFrames={duracaoMotion(PADRINHOS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelCauda"
        component={MotionReel}
        defaultProps={CAUDA}
        durationInFrames={duracaoMotion(CAUDA)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaPadrinhos"
        component={Capa}
        defaultProps={CAPA_PADRINHOS}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaCauda"
        component={Capa}
        defaultProps={CAPA_CAUDA}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaDiario"
        component={Capa}
        defaultProps={CAPA_DIARIO}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelRoteiro"
        component={MotionReel}
        defaultProps={ROTEIRO}
        durationInFrames={duracaoMotion(ROTEIRO)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryFotos1"
        component={Story}
        defaultProps={STORIES.StoryFotos1}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryFotos2"
        component={Story}
        defaultProps={STORIES.StoryFotos2}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryFotos3"
        component={Story}
        defaultProps={STORIES.StoryFotos3}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="StoryPirulito"
        component={Story}
        defaultProps={STORIES.StoryPirulito}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaRoteiro"
        component={Capa}
        defaultProps={CAPA_ROTEIRO}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelAlianca"
        component={MotionReel}
        defaultProps={ALIANCA}
        durationInFrames={duracaoMotion(ALIANCA)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelUltimaVolta"
        component={MotionReel}
        defaultProps={ULTIMA_VOLTA}
        durationInFrames={duracaoMotion(ULTIMA_VOLTA)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaAlianca"
        component={Capa}
        defaultProps={CAPA_ALIANCA}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaUltimaVolta"
        component={Capa}
        defaultProps={CAPA_ULTIMA_VOLTA}
        durationInFrames={1}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="Reel15Festa"
        component={MotionReel}
        defaultProps={QUINZE_FESTA}
        durationInFrames={duracaoMotion(QUINZE_FESTA)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelConjunto"
        component={MotionReel}
        defaultProps={CONJUNTO}
        durationInFrames={duracaoMotion(CONJUNTO)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortVotos1"
        component={ShortVotos}
        defaultProps={SHORTS_VOTOS[0]}
        durationInFrames={duracaoShortVotos(SHORTS_VOTOS[0])}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortVotos2"
        component={ShortVotos}
        defaultProps={SHORTS_VOTOS[1]}
        durationInFrames={duracaoShortVotos(SHORTS_VOTOS[1])}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortVotos3"
        component={ShortVotos}
        defaultProps={SHORTS_VOTOS[2]}
        durationInFrames={duracaoShortVotos(SHORTS_VOTOS[2])}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelVotosDicas"
        component={MotionReel}
        defaultProps={VOTOS_DICAS}
        durationInFrames={duracaoMotion(VOTOS_DICAS)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ReelVespera"
        component={MotionReel}
        defaultProps={VESPERA}
        durationInFrames={duracaoMotion(VESPERA)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaVotosDicas"
        component={Capa}
        defaultProps={{
          arquivo: "brutos/votos-filme/filme.mp4",
          inicio: 138.0,
          enquadramento: "50% 50%",
          frase: {
            kicker: "Para quem vai casar",
            linha: "Vai escrever",
            italico: "os seus votos?",
          },
          logo: { top: 50, left: 400, width: 300 },
          bottom: 340,
        }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaVespera"
        component={Capa}
        defaultProps={{
          arquivo: "brutos/votos-filme/filme.mp4",
          inicio: 2.0,
          enquadramento: "50% 50%",
          frase: {
            kicker: "Para quem vai casar",
            linha: "O que separar",
            italico: "na véspera?",
          },
          logo: { top: 120, left: 720, width: 300 },
          bottom: 340,
        }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaVotosPai"
        component={Capa}
        defaultProps={{
          arquivo: "brutos/shorts-votos/corte1.mp4",
          inicio: 26.0,
          enquadramento: "50% 50%",
          frase: {
            kicker: "Votos da noiva",
            linha: "Pai, eu escolhi",
            italico: "o homem certo.",
          },
          logo: { top: 70, left: 400, width: 300 },
          bottom: 340,
        }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaVotosVitrine"
        component={Capa}
        defaultProps={{
          arquivo: "brutos/shorts-votos/corte2.mp4",
          inicio: 3.0,
          enquadramento: "50% 50%",
          frase: {
            kicker: "Votos da noiva",
            linha: "O vestido",
            italico: "na vitrine.",
          },
          logo: { top: 20, left: 90, width: 300 },
          bottom: 340,
        }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapaVotosPrometo"
        component={Capa}
        defaultProps={{
          arquivo: "brutos/shorts-votos/corte3.mp4",
          inicio: 27.0,
          enquadramento: "50% 50%",
          frase: {
            kicker: "Votos da noiva",
            linha: "Eu prometo escolher",
            italico: "você todos os dias.",
          },
          logo: { top: 30, left: 230, width: 290 },
          bottom: 340,
        }}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
