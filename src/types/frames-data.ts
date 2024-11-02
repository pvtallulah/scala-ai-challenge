import { Cuboid } from "./cuboid";
import { Point } from "./point";

export type FramesData = {
  frame_id: number;
  points: Point[];
  cuboids: Cuboid[];
};
