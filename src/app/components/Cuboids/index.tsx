import { Cuboid as CuboidType } from "@/types";
import { StaticCuboids } from "./components/StaticCuboids";
import { MovingCuboids } from "./components//MovingCuboids";

type CuboidsProps = {
  currentFrameCuboids: CuboidType[];
  nextFrameCuboids: CuboidType[] | null;
  isPlaying: boolean;
};

export const Cuboids = ({
  currentFrameCuboids,
  nextFrameCuboids,
  isPlaying,
}: CuboidsProps) => {
  const staticCuboids = currentFrameCuboids.filter(
    (cuboid) => cuboid.stationary
  );
  const movingCuboids = currentFrameCuboids.filter(
    (cuboid) => !cuboid.stationary
  );

  return (
    <>
      <StaticCuboids staticCuboids={staticCuboids} />
      <MovingCuboids
        currentFrameCuboids={movingCuboids}
        nextFrameCuboids={nextFrameCuboids}
        isPlaying={isPlaying}
      />
    </>
  );
};
