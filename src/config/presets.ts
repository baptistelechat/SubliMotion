import { EnvironmentPreset } from "@/store/useSceneStore";

export interface PresetConfig {
  id: EnvironmentPreset;
  label: string;
  image: string;
  gradient: string; // CSS gradient class or style
  files?: string | string[]; // URL ou chemin vers le fichier HDR/EXR haute résolution
}

export const ENVIRONMENT_PRESETS: PresetConfig[] = [
  {
    id: "studio",
    label: "Studio",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/studio_small_03.jpg",
    gradient: "linear-gradient(to bottom right, #e2e8f0, #cbd5e1)", // Gray-200 to Gray-300
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_03_2k.hdr",
  },
  {
    id: "apartment",
    label: "Appartement",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/lebombo.jpg",
    gradient: "linear-gradient(to bottom right, #ffedd5, #fbbf24)", // Orange-100 to Amber-400
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/lebombo_2k.hdr",
  },
  {
    id: "city",
    label: "Ville",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/potsdamer_platz.jpg",
    gradient: "linear-gradient(to bottom right, #bae6fd, #64748b)", // Sky-200 to Slate-500
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/potsdamer_platz_2k.hdr",
  },
  {
    id: "dawn",
    label: "Aube",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/kiara_1_dawn.jpg",
    gradient: "linear-gradient(to bottom right, #fed7aa, #f9a8d4)", // Orange-200 to Pink-300
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/kiara_1_dawn_2k.hdr",
  },
  {
    id: "forest",
    label: "Forêt",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/forest_slope.jpg",
    gradient: "linear-gradient(to bottom right, #dcfce7, #16a34a)", // Green-100 to Green-600
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr",
  },
  {
    id: "lobby",
    label: "Bureau / Hall",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/st_fagans_interior.jpg",
    gradient: "linear-gradient(to bottom right, #f5f5f4, #a8a29e)", // Stone-100 to Stone-400
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/st_fagans_interior_2k.hdr",
  },
  {
    id: "night",
    label: "Nuit",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/dikhololo_night.jpg",
    gradient: "linear-gradient(to bottom right, #1e1b4b, #312e81)", // Indigo-950 to Indigo-900
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dikhololo_night_2k.hdr",
  },
  {
    id: "park",
    label: "Parc",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/rooitou_park.jpg",
    gradient: "linear-gradient(to bottom right, #bef264, #84cc16)", // Lime-200 to Lime-500
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rooitou_park_2k.hdr",
  },
  {
    id: "sunset",
    label: "Coucher de soleil",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/venice_sunset.jpg",
    gradient: "linear-gradient(to bottom right, #fdba74, #ef4444)", // Orange-300 to Red-500
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/venice_sunset_2k.hdr",
  },
  {
    id: "warehouse",
    label: "Entrepôt",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/empty_warehouse_01.jpg",
    gradient: "linear-gradient(to bottom right, #e2e8f0, #94a3b8)", // Slate-200 to Slate-400
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/empty_warehouse_01_2k.hdr",
  },
];
