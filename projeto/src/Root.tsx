import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TesteEdita } from "./TesteEdita";
import { BastidoresSemana, BASTIDORES_DURACAO } from "./BastidoresSemana";

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
    </>
  );
};
