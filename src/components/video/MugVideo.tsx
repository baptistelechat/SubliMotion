"use client";

import { ANIMATION_CONFIG, DEFAULT_TARGET } from "@/config/animations";
import { useSceneStore } from "@/store/useSceneStore";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { MugContent, MugLights } from "../scene/MugContent";

interface VideoCameraProps {
  frame: number;
  durationInFrames: number;
}

export function VideoCamera({ frame, durationInFrames }: VideoCameraProps) {
  const { camera } = useThree();
  const animationTemplate = useSceneStore((state) => state.animationTemplate);

  useLayoutEffect(() => {
    if (!animationTemplate) return;

    // Type guard to ensure animationTemplate is a valid key in ANIMATION_CONFIG
    if (!(animationTemplate in ANIMATION_CONFIG)) {
      console.warn(
        `Animation template "${animationTemplate}" not found in config.`,
      );
      return;
    }

    const config =
      ANIMATION_CONFIG[animationTemplate as keyof typeof ANIMATION_CONFIG];
    if (!config) return;

    const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
      extrapolateRight: "clamp",
    });

    switch (animationTemplate) {
      case "zoom-in":
      case "zoom-out": {
        // Start: [0, 2, 20] -> End: [6, 4, 7]
        const startPos = config.cameraStart!;
        const endPos = config.cameraEnd!;
        const currentPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          progress,
        );
        camera.position.copy(currentPos);
        camera.lookAt(config.target);
        break;
      }

      case "spiral-up": {
        const startPos = config.cameraStart!;
        const endPos = config.cameraEnd!;
        const startRadius = Math.sqrt(
          Math.pow(startPos.x - config.target.x, 2) +
            Math.pow(startPos.z - config.target.z, 2),
        );
        const endRadius = Math.sqrt(
          Math.pow(endPos.x - config.target.x, 2) +
            Math.pow(endPos.z - config.target.z, 2),
        );

        // Interpolate radius and Y
        const currentRadius = THREE.MathUtils.lerp(
          startRadius,
          endRadius,
          progress,
        );
        const currentY = THREE.MathUtils.lerp(startPos.y, endPos.y, progress);

        // Rotate around Y (e.g., 2 full turns)
        const angle = progress * Math.PI * 4;

        camera.position.set(
          config.target.x + Math.cos(angle) * currentRadius,
          currentY,
          config.target.z + Math.sin(angle) * currentRadius,
        );
        camera.lookAt(config.target);
        break;
      }

      case "dramatic-zoom": {
        const startPos = config.cameraStart!;
        const endPos = config.cameraEnd!;

        // Fast start, slow end (Ease Out Quart)
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const currentPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          easedProgress,
        );
        camera.position.copy(currentPos);
        camera.lookAt(config.target);
        break;
      }

      case "mug-rotation": {
        // Camera static, Mug rotates (handled in MugContent via prop)
        const startPos = config.cameraStart!;
        camera.position.copy(startPos);
        camera.lookAt(config.target);
        break;
      }

      case "camera-rotation": {
        // Rotate around TARGET starting from [6, 4, 7]
        // Radius and Y are constant, rotate X/Z
        const startPos = config.cameraStart!;
        const radius = Math.sqrt(
          Math.pow(startPos.x - config.target.x, 2) +
            Math.pow(startPos.z - config.target.z, 2),
        );
        const startAngle = Math.atan2(
          startPos.z - config.target.z,
          startPos.x - config.target.x,
        );

        const angle = startAngle + progress * Math.PI * 2;

        camera.position.set(
          config.target.x + Math.cos(angle) * radius,
          startPos.y,
          config.target.z + Math.sin(angle) * radius,
        );

        camera.lookAt(config.target);
        break;
      }

      case "vertical-reveal": {
        // Start: [0, -8, 4] -> End: [0, 1.5, 8]
        const startPos = config.cameraStart!;
        const endPos = config.cameraEnd!;

        // Use an ease-out curve for better feel
        const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out

        const currentPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          easedProgress,
        );
        camera.position.copy(currentPos);
        camera.lookAt(config.target);
        break;
      }

      case "horizontal-reveal": {
        // Start: [-12, 1.5, 0] -> End: [0, 1.5, 8]
        const startPos = config.cameraStart!;
        const endPos = config.cameraEnd!;

        const easedProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out

        const currentPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          easedProgress,
        );
        camera.position.copy(currentPos);
        camera.lookAt(config.target);
        break;
      }

      default:
        // Default static view (iso1)
        camera.position.set(6, 4, 7);
        camera.lookAt(DEFAULT_TARGET);
    }
  }, [frame, animationTemplate, durationInFrames, camera]);

  return null;
}

export const MugVideo = () => {
  const { width, height } = useVideoConfig();
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Calculate mug rotation for "mug-rotation" template
  const mugRotation =
    animationTemplate === "mug-rotation"
      ? interpolate(frame, [0, durationInFrames], [0, Math.PI * 2], {
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <AbsoluteFill>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        camera={{ position: [6, 4, 7], fov: 45, near: 0.1, far: 1000 }}
      >
        <MugLights />
        <MugContent mugRotation={mugRotation} />
        <VideoCamera frame={frame} durationInFrames={durationInFrames} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
