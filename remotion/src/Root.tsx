import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { HeroVideo } from "./HeroVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="hero"
      component={HeroVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
