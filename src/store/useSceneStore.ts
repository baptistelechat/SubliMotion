import { create } from "zustand";

export type CameraView =
  | "front"
  | "back"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "iso1"
  | "iso2"
  | "iso3"
  | "iso4";
export type BackgroundType = "color" | "environment";

export const SCENE_COLORS = {
  "Gris clair": "#f3f4f6",
  "Gris moyen": "#9ca3af",
  "Gris foncé": "#374151",
  Noir: "#000000",
} as const;

export const MUG_COLORS = {
  Blanc: "#ffffff",
  Noir: "#000000",
  Rouge: "#ef4444",
  Bleu: "#3b82f6",
  Jaune: "#eab308",
  Rose: "#ec4899",
  Vert: "#22c55e",
} as const;

export type SceneColor = (typeof SCENE_COLORS)[keyof typeof SCENE_COLORS];

interface SceneState {
  // Background
  backgroundColor: SceneColor;
  setBackgroundColor: (color: SceneColor) => void;

  // Mug Colors
  mugColor: string;
  setMugColor: (color: string) => void;

  // Camera View
  cameraView: CameraView;
  setCameraView: (view: CameraView) => void;

  // Options
  showGrid: boolean;
  toggleGrid: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  // Default white background
  backgroundColor: SCENE_COLORS["Gris clair"],
  setBackgroundColor: (color) => set({ backgroundColor: color }),

  // Default mug colors
  mugColor: "#ffffff",
  setMugColor: (color) => set({ mugColor: color }),

  // Default camera view
  cameraView: "iso1",
  setCameraView: (view) => set({ cameraView: view }),

  // Options
  showGrid: true,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
}));
