"use client";

import { ENVIRONMENT_PRESETS } from "@/config/presets";
import { useSceneStore } from "@/store/useSceneStore";
import { Environment } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function BackgroundImage({
  imageUrl,
  blur,
}: {
  imageUrl: string;
  blur: boolean;
}) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { scene } = useThree();

  // Use refs to access latest props in useFrame without re-subscribing
  const textureRef = useRef(texture);
  const blurRef = useRef(blur);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    texture.mapping = THREE.EquirectangularReflectionMapping;

    texture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = texture;
  }, [texture]);

  useEffect(() => {
    blurRef.current = blur;
  }, [blur]);

  // Enforce background and blur on every frame to prevent resets
  // from other components (like Environment updates or interactions)
  useFrame(() => {
    const currentTexture = textureRef.current;
    const currentBlur = blurRef.current;

    if (scene.background !== currentTexture) {
      // eslint-disable-next-line react-hooks/immutability
      scene.background = currentTexture;
    }
    const targetBlur = currentBlur ? 0.5 : 0;
    if (scene.backgroundBlurriness !== targetBlur) {
      scene.backgroundBlurriness = targetBlur;
    }
  });

  useEffect(() => {
    // Initial setup
    // eslint-disable-next-line react-hooks/immutability
    scene.background = texture;
    scene.backgroundBlurriness = blur ? 0.5 : 0;

    return () => {
      // Optional: Clean up if needed, but Environment might handle it
      // scene.background = null;
    };
  }, [texture, blur, scene]);

  return null;
}

export function SceneEnvironment() {
  const lightingPreset = useSceneStore((state) => state.lightingPreset);
  const backgroundStyle = useSceneStore((state) => state.backgroundStyle);
  const backgroundPreset = useSceneStore((state) => state.backgroundPreset);
  const blurBackground = useSceneStore((state) => state.blurBackground);
  const backgroundColor = useSceneStore((state) => state.backgroundColor);
  const { scene } = useThree();

  // Find configuration for current preset to check for custom files
  const currentPresetConfig = ENVIRONMENT_PRESETS.find(
    (p) => p.id === backgroundPreset,
  );

  // Handle Color Background
  useEffect(() => {
    if (backgroundStyle === "color") {
      // eslint-disable-next-line react-hooks/immutability
      scene.background = new THREE.Color(backgroundColor);

      scene.backgroundBlurriness = 0;
    }
  }, [backgroundStyle, backgroundColor, scene]);

  return (
    <>
      {/* Eclairage (Reflets) - Toujours actif */}
      <Environment
        preset={lightingPreset}
        background={false}
        environmentIntensity={0.6}
      />

      {/* Arrière-plan Environnement (si activé) */}
      {backgroundStyle === "image" && currentPresetConfig?.image && (
        <BackgroundImage
          key={backgroundPreset}
          imageUrl={currentPresetConfig.image}
          blur={blurBackground}
        />
      )}
    </>
  );
}
