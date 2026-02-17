"use client";

import { useSceneStore } from "@/store/useSceneStore";
import { useTextureStore } from "@/store/useTextureStore";
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type ElementRef } from "react";
import * as THREE from "three";

// Preload pour éviter le waterfall
useGLTF.preload("/models/mug/scene.gltf");

const GAP = 0.27;
const PRINT_LAYER_RADIUS_SCALE = 1.002;
const PRINT_LAYER_HEIGHT_SCALE = 0.96;

function SceneController() {
  const cameraView = useSceneStore((state) => state.cameraView);
  const { camera } = useThree();
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    const positions: Record<string, [number, number, number]> = {
      front: [0, 1, 6],
      back: [0, 1, -6],
      left: [-6, 1, 0],
      right: [6, 1, 0],
      iso1: [4, 3, 5],
      iso2: [-4, 3, 5],
    };

    const targetPos = positions[cameraView] || positions.iso1;

    // Animation simple via interpolation (ou direct set pour l'instant)
    camera.position.set(...targetPos);
    controlsRef.current.update();
  }, [cameraView, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      minDistance={5}
      maxDistance={15}
      maxPolarAngle={Math.PI / 1.5}
    />
  );
}

function PrintLayer({
  url,
  radius,
  height,
}: {
  url: string;
  radius: number;
  height: number;
}) {
  // Augmenter la résolution pour éviter le z-fighting sur la texture
  const texture = useLoader(THREE.TextureLoader, url);

  const clonedTexture = useMemo(() => {
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true; // Remis à true (default) pour corriger l'orientation "tête en bas"
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [texture]);

  useEffect(() => {
    return () => {
      clonedTexture.dispose();
      useLoader.clear(THREE.TextureLoader, url);
    };
  }, [clonedTexture, url]);

  return (
    <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI, 0]}>
      {/* Cylindre avec un rayon ajusté pour être parfaitement plaqué (radius * 1.002) */}
      {/* On définit une zone imprimable partielle (thetaLength) pour ne pas couvrir l'anse */}
      {/* On centre la zone imprimable à l'opposé de l'anse (qui est souvent en Z+ ou X+) */}
      <cylinderGeometry
        args={[
          radius * PRINT_LAYER_RADIUS_SCALE, // Rayon extérieur (plaque)
          radius * PRINT_LAYER_RADIUS_SCALE, // Rayon intérieur (vide)
          height * PRINT_LAYER_HEIGHT_SCALE, // Hauteur totale (95% de la tasse)
          64, // Nombre de segments horizontaux (64 pour une bonne qualité)
          1, // Nombre de segments verticaux (1 car on ne découpe pas verticalement)
          true,
          Math.PI * (GAP / 2), // thetaStart : Décalage de ~18° (moitié du vide)
          Math.PI * (2 - GAP), // thetaLength : ~324° de zone imprimable (laisse ~36° pour l'anse)
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
        polygonOffsetFactor={-1} // Aide à éviter le z-fighting même si on est très proche
      />
    </mesh>
  );
}

function MugWithPrint() {
  const { scene } = useGLTF("/models/mug/scene.gltf");
  const textureUrl = useTextureStore((state) => state.textureUrl);

  // Calculs géométriques
  const { height, radius, scale, yOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    // AUGMENTATION DE LA TAILLE (TARGET_HEIGHT passe de 2.0 à 3.5)
    const TARGET_HEIGHT = 3.5;
    const scaleFactor = TARGET_HEIGHT / size.y;

    // Rayon estimé (le plus petit côté pour exclure l'anse)
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
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

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

function SceneContent() {
  const showGrid = useSceneStore((state) => state.showGrid);
  const backgroundColor = useSceneStore((state) => state.backgroundColor);

  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      <group position={[0, -2, 0]}>
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
          {/* ContactShadows : Ombre dynamique générée par la forme de l'objet (plus réaliste qu'un simple cercle) */}
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

export default function MugScene() {
  return (
    <div className="w-full h-full min-h-125 bg-gray-100 relative">
      <Canvas
        shadows
        camera={{ position: [4, 3, 5], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <SceneContent />
        <SceneController />
      </Canvas>
    </div>
  );
}
