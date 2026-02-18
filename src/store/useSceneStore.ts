import { AnimationTemplate } from "@/config/animations";
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

export { type AnimationTemplate };

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
  animationTemplate: AnimationTemplate | null;
  setAnimationTemplate: (template: AnimationTemplate | null) => void;
  // Trigger for re-running animation
  animationTrigger: number;
  triggerAnimation: () => void;

  // Options
  showGrid: boolean;
  toggleGrid: () => void;

  // Video Preview
  isVideoPreviewOpen: boolean;
  setIsVideoPreviewOpen: (isOpen: boolean) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (isPlaying: boolean) => void;

  // Export
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
  exportProgress: number;
  setExportProgress: (progress: number) => void;
  startExportTrigger: number;
  triggerExport: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  backgroundColor: SCENE_COLORS["Gris clair"],
  setBackgroundColor: (color) => set({ backgroundColor: color }),

  mugColor: MUG_COLORS.Blanc,
  setMugColor: (color) => set({ mugColor: color }),

  cameraView: null,
  setCameraView: (view) =>
    set((state) => ({
      cameraView: view,
      cameraViewTrigger: state.cameraViewTrigger + 1,
      // Reset animation when changing view
      animationTemplate: null,
    })),
  cameraViewTrigger: 0,
  triggerCameraView: () =>
    set((state) => ({ cameraViewTrigger: state.cameraViewTrigger + 1 })),

  animationTemplate: "zoom-in",
  setAnimationTemplate: (template) =>
    set((state) => ({
      animationTemplate: template,
      animationTrigger: state.animationTrigger + 1,
      // Reset view when changing animation if it's not null
      cameraView: template ? null : state.cameraView,
      // Auto-play when selecting a new template
      isVideoPlaying: template ? true : false,
    })),
  animationTrigger: 0,
  triggerAnimation: () =>
    set((state) => ({ animationTrigger: state.animationTrigger + 1 })),

  showGrid: true,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  isVideoPreviewOpen: false,
  setIsVideoPreviewOpen: (isOpen) => set({ isVideoPreviewOpen: isOpen }),

  isVideoPlaying: false,
  setIsVideoPlaying: (isPlaying) => set({ isVideoPlaying: isPlaying }),

  // Export
  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),
  exportProgress: 0,
  setExportProgress: (progress) => set({ exportProgress: progress }),
  startExportTrigger: 0,
  triggerExport: () => set((state) => ({ startExportTrigger: state.startExportTrigger + 1 })),
}));
