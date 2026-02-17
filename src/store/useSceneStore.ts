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

export type AnimationTemplate =
  | "zoom-in"
  | "mug-rotation"
  | "camera-rotation"
  | "vertical-reveal"
  | "horizontal-reveal";

export const ANIMATION_TEMPLATES: Record<
  AnimationTemplate,
  { label: string; description: string }
> = {
  "zoom-in": {
    label: "Zoom In",
    description: "La caméra commence loin et se rapproche du mug",
  },
  "mug-rotation": {
    label: "Mug Rotation",
    description: "Le mug tourne sur lui-même",
  },
  "camera-rotation": {
    label: "Camera Rotation",
    description: "La caméra tourne autour du mug",
  },
  "vertical-reveal": {
    label: "Vertical Reveal",
    description: "Un mouvement lent de bas en haut",
  },
  "horizontal-reveal": {
    label: "Horizontal Reveal",
    description: "Un mouvement lent de côté",
  },
} as const;

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
  cameraView: CameraView | null;
  setCameraView: (view: CameraView | null) => void;
  // Trigger for re-running camera view
  cameraViewTrigger: number;
  triggerCameraView: () => void;

  // Animation Template
  animationTemplate: AnimationTemplate;
  setAnimationTemplate: (template: AnimationTemplate) => void;
  // Trigger for re-running animation
  animationTrigger: number;
  triggerAnimation: () => void;

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
  cameraViewTrigger: 0,
  triggerCameraView: () =>
    set((state) => ({ cameraViewTrigger: state.cameraViewTrigger + 1 })),

  // Default animation
  animationTemplate: "zoom-in",
  setAnimationTemplate: (template) => set({ animationTemplate: template }),
  animationTrigger: 0,
  triggerAnimation: () =>
    set((state) => ({ animationTrigger: state.animationTrigger + 1 })),

  // Default options
  showGrid: true,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
}));
