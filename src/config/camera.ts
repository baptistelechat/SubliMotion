export const CAMERA_VIEWS = [
  "front",
  "back",
  "left",
  "right",
  "top",
  "bottom",
  "iso1",
  "iso2",
  "iso3",
  "iso4",
] as const;

export type CameraView = (typeof CAMERA_VIEWS)[number];

export const CAMERA_TARGET: [number, number, number] = [0, -0.25, 0];

export const CAMERA_CONFIGS: Record<
  CameraView,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  front: { pos: [0, 1.5, 8], target: CAMERA_TARGET },
  back: { pos: [0, 1.5, -8], target: CAMERA_TARGET },
  left: { pos: [-8, 1.5, 0], target: CAMERA_TARGET },
  right: { pos: [8, 1.5, 0], target: CAMERA_TARGET },
  top: { pos: [0.01, 10, 0], target: CAMERA_TARGET }, // Epsilon to avoid gimbal lock
  bottom: { pos: [0.01, -10, 0], target: CAMERA_TARGET },
  iso1: { pos: [6, 4, 7], target: CAMERA_TARGET },
  iso2: { pos: [-6, 4, 7], target: CAMERA_TARGET },
  iso3: { pos: [6, 4, -7], target: CAMERA_TARGET },
  iso4: { pos: [-6, 4, -7], target: CAMERA_TARGET },
};
