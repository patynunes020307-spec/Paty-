import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TesteEdita } from "./TesteEdita";

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
    </>
  );
};
