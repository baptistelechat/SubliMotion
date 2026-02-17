"use client";

import { useSceneStore } from "@/store/useSceneStore";
import { useTextureStore } from "@/store/useTextureStore";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Grid,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type ElementRef } from "react";
import * as THREE from "three";

// Preload pour éviter le waterfall
useGLTF.preload("/models/mug/scene.gltf");

const GAP = 0.27;
const PRINT_LAYER_RADIUS_SCALE = 1.002;
const PRINT_LAYER_HEIGHT_SCALE = 0.96;

function SceneController() {
  const cameraView = useSceneStore((state) => state.cameraView);
  const cameraViewTrigger = useSceneStore((state) => state.cameraViewTrigger);
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const animationTrigger = useSceneStore((state) => state.animationTrigger);
  const setCameraView = useSceneStore((state) => state.setCameraView);
  const controlsRef = useRef<ElementRef<typeof CameraControls>>(null);

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

    const target: [number, number, number] = [0, -0.25, 0];

    const viewConfigs: Record<
      string,
      { pos: [number, number, number]; target: [number, number, number] }
    > = {
      front: { pos: [0, 1.5, 8], target },
      back: { pos: [0, 1.5, -8], target },
      left: { pos: [-8, 1.5, 0], target },
      right: { pos: [8, 1.5, 0], target },
      top: { pos: [0.01, 10, 0], target }, // Epsilon to avoid gimbal lock
      bottom: { pos: [0.01, -10, 0], target },
      iso1: { pos: [6, 4, 7], target },
      iso2: { pos: [-6, 4, 7], target },
      iso3: { pos: [6, 4, -7], target },
      iso4: { pos: [-6, 4, -7], target },
    };

    if (!cameraView) return;

    const config = viewConfigs[cameraView];

    controlsRef.current.setLookAt(
      ...config.pos,
      ...config.target,
      true, // enableTransition
    );
  }, [cameraView, cameraViewTrigger]);

  // Prévisualisation des animations
  useEffect(() => {
    if (!controlsRef.current || !animationTemplate) return;
    const controls = controlsRef.current;
    const target: [number, number, number] = [0, -0.25, 0];

    const playPreview = async () => {
      switch (animationTemplate) {
        case "zoom-in":
          // Start far away
          await controls.setLookAt(0, 2, 20, ...target, false);
          // Zoom in to Iso1
          await controls.setLookAt(6, 4, 7, ...target, true);
          break;

        case "mug-rotation":
        case "camera-rotation":
          // Reset view first to Iso1
          await controls.setLookAt(6, 4, 7, ...target, false);
          // Rotate 360 degrees (azimuth)
          await controls.rotate(Math.PI * 2, 0, true);
          break;

        case "vertical-reveal":
          // Start bottom
          await controls.setLookAt(0, -8, 4, ...target, false);
          // Move up to Front
          await controls.setLookAt(0, 1.5, 8, ...target, true);
          break;

        case "horizontal-reveal":
          // Start side
          await controls.setLookAt(-12, 1.5, 0, ...target, false);
          // Move to Front
          await controls.setLookAt(0, 1.5, 8, ...target, true);
          break;
      }
    };

    playPreview();
  }, [animationTemplate, animationTrigger]);

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
  const mugColor = useSceneStore((state) => state.mugColor);

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
    // Debug: Log model structure for Epic 2 preparation
    console.group("Mug Model Structure");
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Clone material to ensure we can modify it independently
        if (!Array.isArray(mesh.material)) {
          mesh.material = mesh.material.clone();
        }

        console.log("Mesh found:", child.name, "Material:", mesh.material);
      }
    });
    console.groupEnd();
  }, [scene]);

  // Apply colors
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        if (!Array.isArray(mesh.material)) {
          const material = mesh.material as THREE.MeshStandardMaterial;

          // Apply color to Material.001 as requested
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
        camera={{ position: [6, 4, 7], fov: 45 }}
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
