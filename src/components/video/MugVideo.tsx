"use client";

import { ANIMATION_CONFIG, DEFAULT_TARGET } from "@/config/animations";
import { useSceneStore } from "@/store/useSceneStore";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { Suspense, useLayoutEffect } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { MugContent, MugLights } from "../scene/MugContent";
import { SceneEnvironment } from "../scene/SceneEnvironment";

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

      case "complete-showcase": {
        // Continuous flow animation:
        // - Global rotation (2 turns for slower pace)
        // - Variable radius (Slower Zoom In -> Stay -> Slower Zoom Out)
        // - Variable height (Start Low -> Go High -> Return Low)

        // Timing constants (Smoother transitions)
        const ZOOM_IN_DURATION = 0.25; // 25% (3.75s)
        const ZOOM_OUT_START = 0.75; // 75% (Start zoom out at 11.25s)

        // Key metrics
        const startRadius = 20;
        const closeRadius = 10;
        const startHeight = 2; // Initial zoom-in height
        const lowHeight = 1; // Bottom of the mug (start of spiral)
        const highHeight = 6; // Top/Above the mug (end of spiral)
        const totalRotations = 2; // 2 full turns

        // Start from Zoom-in start position
        const startPos = new THREE.Vector3(0, 2, 20);

        // Calculate current angle (Continuous rotation)
        // Start from -PI/2 (front view relative to Z)
        const initialAngle = Math.atan2(
          startPos.z - config.target.z,
          startPos.x - config.target.x,
        );
        const currentAngle =
          initialAngle - progress * totalRotations * Math.PI * 2;

        // Calculate current radius (Distance from center)
        let currentRadius = closeRadius;
        if (progress < ZOOM_IN_DURATION) {
          // Zoom In Phase
          const p = progress / ZOOM_IN_DURATION;
          const easedP = 1 - Math.pow(1 - p, 3); // Ease out cubic
          currentRadius = THREE.MathUtils.lerp(
            startRadius,
            closeRadius,
            easedP,
          );
        } else if (progress > ZOOM_OUT_START) {
          // Zoom Out Phase
          const p = (progress - ZOOM_OUT_START) / (1 - ZOOM_OUT_START);
          const easedP = Math.pow(p, 3); // Ease in cubic
          currentRadius = THREE.MathUtils.lerp(
            closeRadius,
            startRadius,
            easedP,
          );
        } else {
          // Presentation Phase (Stable radius with slight breathing)
          const p =
            (progress - ZOOM_IN_DURATION) / (ZOOM_OUT_START - ZOOM_IN_DURATION);
          // Very subtle breathing effect
          currentRadius = closeRadius + Math.sin(p * Math.PI * 2) * 0.5;
        }

        // Calculate current height (Y)
        // Trajectory: Start(2) -> Low(1) -> Spiral Up -> High(6) -> End(2)
        let currentHeight = startHeight;

        if (progress < ZOOM_IN_DURATION) {
          // Zoom In: Drop down to low angle
          const p = progress / ZOOM_IN_DURATION;
          const easedP = 1 - Math.pow(1 - p, 2.5);
          currentHeight = THREE.MathUtils.lerp(startHeight, lowHeight, easedP);
        } else if (progress > ZOOM_OUT_START) {
          // Zoom Out: Return from high angle to start height
          const p = (progress - ZOOM_OUT_START) / (1 - ZOOM_OUT_START);
          const easedP = Math.pow(p, 2.5);
          currentHeight = THREE.MathUtils.lerp(highHeight, startHeight, easedP);
        } else {
          // Presentation: Spiral Upwards (Low -> High)
          const p =
            (progress - ZOOM_IN_DURATION) / (ZOOM_OUT_START - ZOOM_IN_DURATION);
          // Linear ascent during rotation creates a true spiral
          // Add slight sine wave for organic feel
          const organicWave = Math.sin(p * Math.PI * 4) * 0.5;
          currentHeight =
            THREE.MathUtils.lerp(lowHeight, highHeight, p) + organicWave;
        }

        // Apply spherical coordinates
        camera.position.set(
          config.target.x + Math.cos(currentAngle) * currentRadius,
          currentHeight,
          config.target.z + Math.sin(currentAngle) * currentRadius,
        );

        camera.lookAt(config.target);
        break;
      }

      case "apple-style": {
        // 4 Phases (Total 15s)
        const PHASE_1 = 0.2; // 0-3s: Vertical Reveal
        const PHASE_2 = 0.6; // 3-9s: Inverted Spiral (Top -> Bottom) - Longer for slower effect
        const PHASE_3 = 0.8; // 9-12s: Horizontal Reveal
        const PHASE_4 = 1.0; // 12-15s: Hero Shot

        const currentPos = new THREE.Vector3();
        const currentTarget = config.target;

        if (progress < PHASE_1) {
          // Phase 1: Vertical Reveal (0-3s)
          const p = progress / PHASE_1;
          const easedP = 1 - Math.pow(1 - p, 3); // Ease out cubic
          const start = new THREE.Vector3(0, -8, 4);
          const end = new THREE.Vector3(0, 1.5, 8);
          currentPos.lerpVectors(start, end, easedP);
        } else if (progress < PHASE_2) {
          // Phase 2: Inverted Spiral (Top -> Bottom) (3-9s)
          const p = (progress - PHASE_1) / (PHASE_2 - PHASE_1);
          // Start High (8, 8, 8) -> End Low (5, 0, 5)
          const startHigh = new THREE.Vector3(8, 8, 8);
          const endLow = new THREE.Vector3(5, 0, 5);

          const startRadius = Math.sqrt(
            Math.pow(startHigh.x - config.target.x, 2) +
              Math.pow(startHigh.z - config.target.z, 2),
          );
          const endRadius = Math.sqrt(
            Math.pow(endLow.x - config.target.x, 2) +
              Math.pow(endLow.z - config.target.z, 2),
          );

          const currentRadius = THREE.MathUtils.lerp(startRadius, endRadius, p);
          const currentY = THREE.MathUtils.lerp(startHigh.y, endLow.y, p);

          // Rotate 1 full turn (very slow over 6s)
          const angle = p * Math.PI * 2;
          currentPos.set(
            config.target.x + Math.cos(angle) * currentRadius,
            currentY,
            config.target.z + Math.sin(angle) * currentRadius,
          );
        } else if (progress < PHASE_3) {
          // Phase 3: Horizontal Reveal (9-12s)
          const p = (progress - PHASE_2) / (PHASE_3 - PHASE_2);
          const easedP = 1 - Math.pow(1 - p, 3);
          const start = new THREE.Vector3(-12, 1.5, 0);
          const end = new THREE.Vector3(0, 1.5, 8);
          currentPos.lerpVectors(start, end, easedP);
        } else {
          // Phase 4: Hero Shot (12-15s)
          const p = (progress - PHASE_3) / (PHASE_4 - PHASE_3);
          const start = new THREE.Vector3(6, 4, 7);
          const end = new THREE.Vector3(5, 3, 6);
          currentPos.lerpVectors(start, end, p);
        }

        camera.position.copy(currentPos);
        camera.lookAt(currentTarget);
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
  const backgroundColor = useSceneStore((state) => state.backgroundColor);
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
    <AbsoluteFill style={{ backgroundColor }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        camera={{ position: [6, 4, 7], fov: 45, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
        </Suspense>
        <MugLights />
        <MugContent
          mugRotation={mugRotation}
          enableInternalRotation={false}
        />
        <VideoCamera frame={frame} durationInFrames={durationInFrames} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
