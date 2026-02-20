"use client";

import { ANIMATION_CONFIG } from "@/config/animations";
import { ASSETS } from "@/config/assets";
import { useSceneStore } from "@/store/useSceneStore";
import { useTextureStore } from "@/store/useTextureStore";
import { ContactShadows, Grid, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let isMounted = true;

    loader.load(url, (t) => {
      if (isMounted) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.flipY = true;
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.needsUpdate = true;
        setTexture(t);
      } else {
        t.dispose();
      }
    });

    return () => {
      isMounted = false;
      if (texture) {
        texture.dispose();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Intentionally remove 'texture' from deps to avoid loop

  // Cleanup texture when component unmounts or texture changes
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  if (!texture) return null;

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
        map={texture}
        transparent
        side={THREE.DoubleSide}
        roughness={0.15}
        metalness={0.0}
        envMapIntensity={1}
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
          // Adjust material properties for better ceramic look
          (mesh.material as THREE.MeshStandardMaterial).roughness = 0.15;
          (mesh.material as THREE.MeshStandardMaterial).metalness = 0.0;
          (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1;
        }
      }
    });

    return cloned;
  }, [originalScene]);

  useEffect(() => {
    // Cleanup materials on unmount
    return () => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (!Array.isArray(mesh.material)) {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  const textureUrl = useTextureStore((state) => state.textureUrl);
  const mugColor = useSceneStore((state) => state.mugColor);

  const { height, radius, scale, yOffset } = useMemo(() => {
    if (!scene) {
      return { height: 0, radius: 0, scale: 1, yOffset: 0 };
    }
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
    if (!scene) return;
    // Only update colors on the already cloned scene
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!Array.isArray(mesh.material)) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material.name === "Material.001") {
            material.color.set(mugColor);
            material.roughness = 0.15;
            material.metalness = 0.0;
            material.envMapIntensity = 1;
          }
        }
      }
    });
  }, [scene, mugColor]);

  if (!scene) return null;

  return (
    <group dispose={null}>
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

export function MugLights({
  intensity = 0.8,
  ambientIntensity = 0.3,
}: {
  intensity?: number;
  ambientIntensity?: number;
}) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[8, 10, 8]}
        intensity={intensity}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-8, 10, -8]} intensity={intensity * 0.4} />
    </>
  );
}

export function MugContent({
  mugRotation = 0,
  enableInternalRotation = true,
}: {
  mugRotation?: number;
  enableInternalRotation?: boolean;
}) {
  const showGrid = useSceneStore((state) => state.showGrid);
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const animationTrigger = useSceneStore((state) => state.animationTrigger);
  const { clock } = useThree();
  const startTimeRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (enableInternalRotation) {
      startTimeRef.current = clock.getElapsedTime();
    }
  }, [animationTemplate, animationTrigger, clock, enableInternalRotation]);

  useFrame(({ clock }) => {
    if (!enableInternalRotation || !groupRef.current) return;

    if (animationTemplate === "mug-rotation") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config = (ANIMATION_CONFIG as any)["mug-rotation"];
      if (!config) return;

      const duration = config.durationInSeconds;
      const time = clock.getElapsedTime();
      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      groupRef.current.rotation.y = progress * Math.PI * 2;
    } else {
      if (groupRef.current.rotation.y !== 0) {
        groupRef.current.rotation.y = 0;
      }
    }
  });

  const rotationY = enableInternalRotation ? 0 : mugRotation;

  return (
    <>
      <group ref={groupRef} position={[0, -2, 0]} rotation={[0, rotationY, 0]}>
        <Suspense fallback={null}>
          <MugWithPrint />
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
            position={[0, 0, 0]}
            opacity={0.3}
            scale={10}
            blur={1.5}
            far={2}
            resolution={512}
            color="#000000"
          />
        </group>
      )}
    </>
  );
}
