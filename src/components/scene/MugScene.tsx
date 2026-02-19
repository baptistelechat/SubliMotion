"use client";

import { ANIMATION_CONFIG } from "@/config/animations";
import { CAMERA_CONFIGS } from "@/config/camera";
import { useSceneStore } from "@/store/useSceneStore";
import { CameraControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type ElementRef } from "react";
import * as THREE from "three";
import { MugContent, MugLights } from "./MugContent";

// Preload pour éviter le waterfall
useGLTF.preload("/models/mug/scene.gltf");

function SceneController() {
  const cameraView = useSceneStore((state) => state.cameraView);
  const cameraViewTrigger = useSceneStore((state) => state.cameraViewTrigger);
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const animationTrigger = useSceneStore((state) => state.animationTrigger);
  const setCameraView = useSceneStore((state) => state.setCameraView);
  const setAnimationTemplate = useSceneStore(
    (state) => state.setAnimationTemplate,
  );
  const isVideoPreviewOpen = useSceneStore((state) => state.isVideoPreviewOpen);
  const controlsRef = useRef<ElementRef<typeof CameraControls>>(null);
  const { clock } = useThree();
  const startTimeRef = useRef(0);
  const completedRef = useRef(false);

  // Reset start time when animation template or trigger changes
  useEffect(() => {
    startTimeRef.current = clock.getElapsedTime();
    completedRef.current = false;
  }, [animationTemplate, animationTrigger, clock]);

  // Détecter quand l'utilisateur déplace la caméra manuellement
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    const onStart = () => {
      // Si l'utilisateur commence à interagir, désélectionner la vue actuelle
      setCameraView(null);
    };

    controls.addEventListener("controlstart", onStart);
    return () => controls.removeEventListener("controlstart", onStart);
  }, [setCameraView]);

  // // Gestion des vues prédéfinies (boutons de vue)
  useEffect(() => {
    if (!controlsRef.current || !cameraView) return;

    const config = CAMERA_CONFIGS[cameraView];

    controlsRef.current.setLookAt(
      ...config.pos,
      ...config.target,
      true, // enableTransition
    );
  }, [cameraView, cameraViewTrigger]);

  // Animation Loop for// Gestion de l'animation
  useFrame(({ clock }) => {
    if (isVideoPreviewOpen) return;
    if (!controlsRef.current || !animationTemplate) return;
    const controls = controlsRef.current;

    // Type assertion to bypass TypeScript check if needed, though with the import it should be fine
    // But since we just moved the type definition, we might need to ensure ANIMATION_CONFIG is typed correctly
    const config =
      ANIMATION_CONFIG[animationTemplate as keyof typeof ANIMATION_CONFIG];
    if (!config) return;

    // Use elapsed time from startTime
    const time = clock.getElapsedTime();
    const elapsed = time - startTimeRef.current;
    const duration = config.durationInSeconds;

    let progress = 0;
    // Keep looping for mug and camera rotation
    if (
      animationTemplate === "mug-rotation" ||
      animationTemplate === "camera-rotation"
    ) {
      progress = (elapsed % duration) / duration;
    } else {
      // Play once for others
      progress = Math.min(elapsed / duration, 1);
      if (progress >= 1 && !completedRef.current) {
        completedRef.current = true;
        setAnimationTemplate(null);
      }
    }

    switch (animationTemplate) {
      case "zoom-in":
      case "zoom-out":
        if (config.cameraStart && config.cameraEnd) {
          const currentPos = new THREE.Vector3().lerpVectors(
            config.cameraStart,
            config.cameraEnd,
            progress,
          );
          // Use setLookAt to ensure CameraControls state is updated correctly
          controls.setLookAt(
            currentPos.x,
            currentPos.y,
            currentPos.z,
            config.target.x,
            config.target.y,
            config.target.z,
            false, // disable transition for immediate update
          );
        }
        break;

      case "spiral-up":
        if (config.cameraStart && config.cameraEnd) {
          const startRadius = Math.sqrt(
            Math.pow(config.cameraStart.x - config.target.x, 2) +
              Math.pow(config.cameraStart.z - config.target.z, 2),
          );
          const endRadius = Math.sqrt(
            Math.pow(config.cameraEnd.x - config.target.x, 2) +
              Math.pow(config.cameraEnd.z - config.target.z, 2),
          );

          // Interpolate radius and Y
          const currentRadius = THREE.MathUtils.lerp(
            startRadius,
            endRadius,
            progress,
          );
          const currentY = THREE.MathUtils.lerp(
            config.cameraStart.y,
            config.cameraEnd.y,
            progress,
          );

          // Rotate around Y (e.g., 2 full turns)
          const angle = progress * Math.PI * 4;

          const x = config.target.x + Math.cos(angle) * currentRadius;
          const z = config.target.z + Math.sin(angle) * currentRadius;

          controls.setLookAt(
            x,
            currentY,
            z,
            config.target.x,
            config.target.y,
            config.target.z,
            false,
          );
        }
        break;

      case "dramatic-zoom":
        if (config.cameraStart && config.cameraEnd) {
          // Fast start, slow end (Ease Out Quart)
          const easedProgress = 1 - Math.pow(1 - progress, 4);
          const currentPos = new THREE.Vector3().lerpVectors(
            config.cameraStart,
            config.cameraEnd,
            easedProgress,
          );
          controls.setLookAt(
            currentPos.x,
            currentPos.y,
            currentPos.z,
            config.target.x,
            config.target.y,
            config.target.z,
            false,
          );
        }
        break;

      case "camera-rotation":
        if (config.cameraStart) {
          // Continuous rotation
          const radius = Math.sqrt(
            Math.pow(config.cameraStart.x - config.target.x, 2) +
              Math.pow(config.cameraStart.z - config.target.z, 2),
          );
          const startAngle = Math.atan2(
            config.cameraStart.z - config.target.z,
            config.cameraStart.x - config.target.x,
          );

          const angle = startAngle + progress * Math.PI * 2;

          const x = config.target.x + Math.cos(angle) * radius;
          const z = config.target.z + Math.sin(angle) * radius;

          controls.setLookAt(
            x,
            config.cameraStart.y,
            z,
            config.target.x,
            config.target.y,
            config.target.z,
            false,
          );
        }
        break;

      case "mug-rotation":
        // For mug rotation, camera is static (set once or maintained)
        if (config.cameraStart) {
          controls.setLookAt(
            config.cameraStart.x,
            config.cameraStart.y,
            config.cameraStart.z,
            config.target.x,
            config.target.y,
            config.target.z,
            false,
          );
        }
        break;

      case "vertical-reveal":
      case "horizontal-reveal":
        if (config.cameraStart && config.cameraEnd) {
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentPos = new THREE.Vector3().lerpVectors(
            config.cameraStart,
            config.cameraEnd,
            easedProgress,
          );
          controls.setLookAt(
            currentPos.x,
            currentPos.y,
            currentPos.z,
            config.target.x,
            config.target.y,
            config.target.z,
            false,
          );
        }
        break;
    }
  });

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={5}
      maxDistance={15}
      maxPolarAngle={Math.PI / 1.5}
      smoothTime={0.8}
    />
  );
}

function MugRotationController({
  children,
}: {
  children: (rotation: number) => React.ReactNode;
}) {
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const animationTrigger = useSceneStore((state) => state.animationTrigger);
  const { clock } = useThree();
  const startTimeRef = useRef(0);

  useEffect(() => {
    startTimeRef.current = clock.getElapsedTime();
  }, [animationTemplate, animationTrigger, clock]);

  const [rotation, setRotation] = useState(0);

  useFrame(({ clock }) => {
    if (animationTemplate === "mug-rotation") {
      const config = ANIMATION_CONFIG["mug-rotation"];
      const duration = config.durationInSeconds;
      const time = clock.getElapsedTime();
      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      setRotation(progress * Math.PI * 2);
    } else {
      // Always reset to 0 if not mug-rotation, but avoid infinite loop if already 0
      if (rotation !== 0) setRotation(0);
    }
  });

  return <>{children(rotation)}</>;
}

export default function MugScene() {
  return (
    <div className="w-full h-full min-h-125 bg-gray-100 relative">
      <Canvas
        shadows
        camera={{ position: [6, 4, 7], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <MugLights />
        <MugRotationController>
          {(rotation) => <MugContent mugRotation={rotation} />}
        </MugRotationController>
        <SceneController />
      </Canvas>
    </div>
  );
}
