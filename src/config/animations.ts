import * as THREE from "three";

export type AnimationTemplate =
  | "zoom-in"
  | "zoom-out"
  | "mug-rotation"
  | "camera-rotation"
  | "vertical-reveal"
  | "horizontal-reveal"
  | "spiral-up"
  | "dramatic-zoom"
  | "complete-showcase"
  | "apple-style";

export const ANIMATION_TEMPLATES: Record<
  AnimationTemplate,
  { label: string; description: string }
> = {
  "zoom-in": {
    label: "Zoom In",
    description: "La caméra commence loin et se rapproche du mug",
  },
  "zoom-out": {
    label: "Zoom Out",
    description: "La caméra s'éloigne du mug",
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
  "spiral-up": {
    label: "Spirale",
    description: "Une montée en spirale autour du mug",
  },
  "dramatic-zoom": {
    label: "Zoom Dramatique",
    description: "Un zoom rapide suivi d'un ralenti",
  },
  "complete-showcase": {
    label: "Présentation Complète",
    description: "Entrée zoom, spirale de présentation, et sortie zoom out",
  },
  "apple-style": {
    label: "Présentation Tech (Apple Style)",
    description: "Séquence dynamique avec cuts, zooms et travelings rapides",
  },
} as const;

export const VIDEO_CONFIG = {
  FPS: 30,
  WIDTH: 1080,
  HEIGHT: 1920,
  DURATION_IN_SECONDS_DEFAULT: 5,
};

export const IMAGE_CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1080,
};

export const DEFAULT_TARGET = new THREE.Vector3(0, -0.25, 0);

export const ANIMATION_CONFIG: Record<
  AnimationTemplate,
  {
    durationInSeconds: number; // Duration of the animation
    cameraStart?: THREE.Vector3;
    cameraEnd?: THREE.Vector3;
    target: THREE.Vector3;
  }
> = {
  "zoom-in": {
    durationInSeconds: 3,
    cameraStart: new THREE.Vector3(0, 2, 20),
    cameraEnd: new THREE.Vector3(6, 4, 7),
    target: DEFAULT_TARGET,
  },
  "mug-rotation": {
    durationInSeconds: 10,
    cameraStart: new THREE.Vector3(6, 4, 7),
    target: DEFAULT_TARGET,
  },
  "camera-rotation": {
    durationInSeconds: 10,
    cameraStart: new THREE.Vector3(6, 4, 7),
    target: DEFAULT_TARGET,
  },
  "vertical-reveal": {
    durationInSeconds: 3,
    cameraStart: new THREE.Vector3(0, -8, 4),
    cameraEnd: new THREE.Vector3(0, 1.5, 8),
    target: DEFAULT_TARGET,
  },
  "horizontal-reveal": {
    durationInSeconds: 3,
    cameraStart: new THREE.Vector3(-12, 1.5, 0),
    cameraEnd: new THREE.Vector3(0, 1.5, 8),
    target: DEFAULT_TARGET,
  },
  "complete-showcase": {
    durationInSeconds: 15,
    cameraStart: new THREE.Vector3(0, 2, 20), // Matches zoom-in start
    cameraEnd: new THREE.Vector3(0, 2, 20), // Matches zoom-in start (for loop/reset)
    target: DEFAULT_TARGET,
  },
  "zoom-out": {
    durationInSeconds: 3,
    cameraStart: new THREE.Vector3(6, 4, 7), // Inverse of zoom-in end
    cameraEnd: new THREE.Vector3(0, 2, 20), // Inverse of zoom-in start
    target: DEFAULT_TARGET,
  },
  "spiral-up": {
    durationInSeconds: 10,
    cameraStart: new THREE.Vector3(5, 0, 5),
    cameraEnd: new THREE.Vector3(8, 8, 8),
    target: new THREE.Vector3(0, 0, 0),
  },
  "dramatic-zoom": {
    durationInSeconds: 4,
    cameraStart: new THREE.Vector3(0, 10, 30),
    cameraEnd: new THREE.Vector3(5, 2, 5),
    target: new THREE.Vector3(0, -0.5, 0),
  },
  "apple-style": {
    durationInSeconds: 15,
    cameraStart: new THREE.Vector3(0, -8, 4), // Start of Vertical Reveal
    target: DEFAULT_TARGET,
  },
};
