import { EnvironmentPreset } from "@/store/useSceneStore";

export interface PresetConfig {
  id: EnvironmentPreset;
  label: string;
  image: string;
  files?: string | string[]; // URL ou chemin vers le fichier HDR/EXR haute résolution
}

export const ENVIRONMENT_PRESETS: PresetConfig[] = [
  {
    id: "studio",
    label: "Studio",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/studio_small_03.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/studio_small_03_4k.hdr",
  },
  {
    id: "apartment",
    label: "Appartement",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/lebombo.jpg",
    files: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/lebombo_4k.hdr",
  },
  {
    id: "city",
    label: "Ville",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/potsdamer_platz.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/potsdamer_platz_4k.hdr",
  },
  {
    id: "dawn",
    label: "Aube",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/kiara_1_dawn.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/kiara_1_dawn_4k.hdr",
  },
  {
    id: "forest",
    label: "Forêt",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/forest_slope.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/forest_slope_4k.hdr",
  },
  {
    id: "lobby",
    label: "Bureau / Hall",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/st_fagans_interior.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/st_fagans_interior_4k.hdr",
  },
  {
    id: "night",
    label: "Nuit",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/dikhololo_night.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/dikhololo_night_4k.hdr",
  },
  {
    id: "park",
    label: "Parc",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/rooitou_park.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/rooitou_park_4k.hdr",
  },
  {
    id: "sunset",
    label: "Coucher de soleil",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/venice_sunset.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/venice_sunset_4k.hdr",
  },
  {
    id: "warehouse",
    label: "Entrepôt",
    image:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/empty_warehouse_01.jpg",
    files:
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/empty_warehouse_01_4k.hdr",
  },
];
