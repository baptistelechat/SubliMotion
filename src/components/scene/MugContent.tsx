"use client";

import { ASSETS } from "@/config/assets";
import { useSceneStore } from "@/store/useSceneStore";
import { useTextureStore } from "@/store/useTextureStore";
import { ContactShadows, Environment, Grid, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

// Preload pour éviter le waterfall
useGLTF.preload(ASSETS.MODELS.MUG);

const GAP = 0.27;
const PRINT_LAYER_RADIUS_SCALE = 1.002;
const PRINT_LAYER_HEIGHT_SCALE = 0.96;

function PrintLayer({
  url,
  radius,
  height,
}: {
  url: string;
  radius: number;
  height: number;
}) {
  const texture = useLoader(THREE.TextureLoader, url);

  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [texture]);

  useEffect(() => {
    return () => {
      clonedTexture.dispose();
      // On ne clear pas le cache de la texture pour éviter le clignotement dans la preview vidéo
      // useLoader.clear(THREE.TextureLoader, url);
    };
  }, [clonedTexture, url]);

  return (
    <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI, 0]}>
      <cylinderGeometry
        args={[
          radius * PRINT_LAYER_RADIUS_SCALE,
          radius * PRINT_LAYER_RADIUS_SCALE,
          height * PRINT_LAYER_HEIGHT_SCALE,
          64,
          1,
          true,
          Math.PI * (GAP / 2),
          Math.PI * (2 - GAP),
        ]}
      />
      <meshStandardMaterial
        map={clonedTexture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.1}
        depthWrite={true}
        polygonOffset={true}
        polygonOffsetFactor={-4}
        depthTest={true}
      />
    </mesh>
  );
}

function MugWithPrint() {
  const { scene: originalScene } = useGLTF(ASSETS.MODELS.MUG);
  const scene = useMemo(() => {
    // Clone the scene to ensure each instance (Editor vs Preview) has its own scene graph
    const cloned = originalScene.clone();

    // Traverse the cloned scene to clone materials as well, ensuring independent colors
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!Array.isArray(mesh.material)) {
          mesh.material = mesh.material.clone();
        }
      }
    });

    return cloned;
  }, [originalScene]);

  const textureUrl = useTextureStore((state) => state.textureUrl);
  const mugColor = useSceneStore((state) => state.mugColor);

  const { height, radius, scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const TARGET_HEIGHT = 3.5;
    const scaleFactor = TARGET_HEIGHT / size.y;
    const estimatedBodyRadius = (Math.min(size.x, size.z) / 2) * scaleFactor;
    const bottomOffset = -box.min.y * scaleFactor;

    return {
      height: size.y * scaleFactor,
      radius: estimatedBodyRadius,
      scale: scaleFactor,
      yOffset: bottomOffset,
    };
  }, [scene]);

  useEffect(() => {
    // Only update colors on the already cloned scene
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!Array.isArray(mesh.material)) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material.name === "Material.001") {
            material.color.set(mugColor);
          }
        }
      }
    });
  }, [scene, mugColor]);

  return (
    <group>
      <primitive
        object={scene}
        scale={[scale, scale, scale]}
        position={[0, yOffset, 0]}
      />
      {textureUrl && (
        <Suspense fallback={null}>
          <PrintLayer url={textureUrl} radius={radius} height={height} />
        </Suspense>
      )}
    </group>
  );
}

export function MugLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}

export function MugContent({ mugRotation = 0 }: { mugRotation?: number }) {
  const showGrid = useSceneStore((state) => state.showGrid);
  const backgroundColor = useSceneStore((state) => state.backgroundColor);

  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      <group position={[0, -2, 0]} rotation={[0, mugRotation, 0]}>
        <Suspense fallback={null}>
          <MugWithPrint />
          <Environment preset="studio" />
        </Suspense>
      </group>

      {showGrid && (
        <group position={[0, -2, 0]}>
          <Grid
            infiniteGrid
            fadeDistance={50}
            fadeStrength={5}
            cellThickness={1}
            sectionThickness={1.5}
            cellSize={1}
            sectionSize={5}
            position={[0, 0, 0]}
            cellColor="#9ca3af"
            sectionColor="#4b5563"
          />
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            color="#000000"
          />
        </group>
      )}
    </>
  );
}
