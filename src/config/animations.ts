import * as THREE from "three";

export type AnimationTemplate =
  | "zoom-in"
  | "zoom-out"
  | "mug-rotation"
  | "camera-rotation"
  | "vertical-reveal"
  | "horizontal-reveal"
  | "spiral-up"
  | "dramatic-zoom";

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
} as const;

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
    durationInSeconds: 3, // Faster than 5s
    cameraStart: new THREE.Vector3(0, 2, 20),
    cameraEnd: new THREE.Vector3(6, 4, 7),
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "mug-rotation": {
    durationInSeconds: 5, // Keep at 5s
    cameraStart: new THREE.Vector3(6, 4, 7),
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "camera-rotation": {
    durationInSeconds: 5, // Keep at 5s
    cameraStart: new THREE.Vector3(6, 4, 7),
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "vertical-reveal": {
    durationInSeconds: 3, // Faster than 5s
    cameraStart: new THREE.Vector3(0, -8, 4),
    cameraEnd: new THREE.Vector3(0, 1.5, 8),
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "horizontal-reveal": {
    durationInSeconds: 3, // Faster than 5s
    cameraStart: new THREE.Vector3(-12, 1.5, 0),
    cameraEnd: new THREE.Vector3(0, 1.5, 8),
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "zoom-out": {
    durationInSeconds: 3,
    cameraStart: new THREE.Vector3(6, 4, 7), // Inverse of zoom-in end
    cameraEnd: new THREE.Vector3(0, 2, 20), // Inverse of zoom-in start
    target: new THREE.Vector3(0, -0.25, 0),
  },
  "spiral-up": {
    durationInSeconds: 6,
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
};
