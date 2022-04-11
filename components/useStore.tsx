import { Vector3 } from "three";
import create from "zustand";

interface useStoreInterface {
  twinklePosition: number[];
  increaseTwinklePositionX: () => void;
  decreaseTwinklePositionX: () => void;

  vector3Position: Vector3;
  setVector3Position: (param: Vector3) => void;
  increseVector3PositionX: (param: number) => void;

  surfacePositions: Vector3[];
  setSurfacePositions: (param: Vector3[]) => void;
}

export const useStore = create<useStoreInterface>((set) => ({
  twinklePosition: [0, 0, 0],
  increaseTwinklePositionX: () =>
    set((state) => ({
      twinklePosition: [state.twinklePosition[0] + 2, 0, 0],
    })),
  decreaseTwinklePositionX: () =>
    set((state) => ({
      twinklePosition: [state.twinklePosition[0] - 2, 0, 0],
    })),

  vector3Position: new Vector3(0, 0, 0),
  setVector3Position: (param) =>
    set((state) => ({
      vector3Position: param,
    })),
  increseVector3PositionX: (param) =>
    set((state) => {
      state.vector3Position.setX(param);
    }),

  surfacePositions: [],
  setSurfacePositions: (param) => set((state) => ({ surfacePositions: param })),
}));
