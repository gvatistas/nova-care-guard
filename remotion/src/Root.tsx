import { Composition } from "remotion";
import { HeroVideo } from "./HeroVideo";
import { JourneyVideo } from "./JourneyVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="hero"
      component={HeroVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="journey"
      component={JourneyVideo}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
