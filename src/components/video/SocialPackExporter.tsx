"use client";

import {
  ANIMATION_CONFIG,
  AnimationTemplate,
  IMAGE_CONFIG,
  VIDEO_CONFIG,
} from "@/config/animations";
import { CAMERA_VIEWS, CameraView, useSceneStore } from "@/store/useSceneStore";
import { Canvas, useThree } from "@react-three/fiber";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import * as Muxer from "mp4-muxer";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { interpolate } from "remotion";
import { toast } from "sonner";
import * as THREE from "three";
import { MugContent, MugLights } from "../scene/MugContent";
import { SceneEnvironment } from "../scene/SceneEnvironment";
import { VideoCamera } from "./MugVideo";
import { CAMERA_CONFIGS } from "@/config/camera";

type ExportTask =
  | { type: "image"; name: CameraView }
  | { type: "video"; name: AnimationTemplate; duration?: number };

// Internal component to handle scene updates and capturing
function ExporterScene({
  frame,
  onRender,
}: {
  frame: number;
  onRender: (
    gl: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const timeout = setTimeout(() => {
      onRender(gl, scene, camera);
    }, 0);
    return () => clearTimeout(timeout);
  }, [frame, gl, scene, camera, onRender]);

  return null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SocialPackExporter() {
  const isExportingSocialPack = useSceneStore(
    (state) => state.isExportingSocialPack,
  );
  const setIsExportingSocialPack = useSceneStore(
    (state) => state.setIsExportingSocialPack,
  );
  const setSocialPackProgress = useSceneStore(
    (state) => state.setSocialPackProgress,
  );
  const setSocialPackStatus = useSceneStore(
    (state) => state.setSocialPackStatus,
  );
  const socialPackText = useSceneStore((state) => state.socialPackText);
  const socialPackOptions = useSceneStore((state) => state.socialPackOptions);

  // Store actions to control the scene
  const setCameraView = useSceneStore((state) => state.setCameraView);
  const setAnimationTemplate = useSceneStore(
    (state) => state.setAnimationTemplate,
  );
  // const animationTemplate = useSceneStore((state) => state.animationTemplate);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentTask, setCurrentTask] = useState<ExportTask | null>(null);

  // Export context
  const zipRef = useRef<JSZip | null>(null);
  const taskQueueRef = useRef<ExportTask[]>([]);
  const exportContext = useRef<{
    muxer: Muxer.Muxer<Muxer.ArrayBufferTarget>;
    videoEncoder: VideoEncoder;
    frame: number;
  } | null>(null);

  const fps = VIDEO_CONFIG.FPS;

  // Determine dimensions based on task type
  const width =
    currentTask?.type === "image" ? IMAGE_CONFIG.WIDTH : VIDEO_CONFIG.WIDTH;
  const height =
    currentTask?.type === "image" ? IMAGE_CONFIG.HEIGHT : VIDEO_CONFIG.HEIGHT;

  // Helper to start the next task
  const processNextTask = useCallback(async () => {
    if (taskQueueRef.current.length === 0) {
      // All done!
      if (zipRef.current) {
        setSocialPackStatus("Finalisation du ZIP...");

        // Add text file
        zipRef.current.file("captions.txt", socialPackText);

        const content = await zipRef.current.generateAsync({ type: "blob" });
        saveAs(content, `sublimotion-social-pack-${Date.now()}.zip`);

        toast.success("Pack Social généré avec succès !");
      }

      setIsExportingSocialPack(false);
      setSocialPackStatus("");
      setSocialPackProgress(0);
      setCurrentTask(null);
      zipRef.current = null;

      // Reset scene
      setAnimationTemplate(null);
      setCameraView("iso1");
      return;
    }

    const nextTask = taskQueueRef.current.shift();
    if (!nextTask) return;

    setCurrentTask(nextTask);

    if (nextTask.type === "image") {
      setSocialPackStatus(`Génération de l'image : ${nextTask.name}...`);
      setAnimationTemplate(null);
      setCameraView(nextTask.name);
      // Wait a bit for camera to settle (even though we set it directly)
      // The render loop will trigger capture
      setCurrentFrame(0); // Trigger render
    } else if (nextTask.type === "video") {
      setSocialPackStatus(`Génération de la vidéo : ${nextTask.name}...`);
      setCameraView(null);
      setAnimationTemplate(nextTask.name);

      // Setup Video Encoder
      const muxer = new Muxer.Muxer({
        target: new Muxer.ArrayBufferTarget(),
        video: {
          codec: "avc",
          width: VIDEO_CONFIG.WIDTH,
          height: VIDEO_CONFIG.HEIGHT,
        },
        fastStart: "in-memory",
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error(e),
      });

      videoEncoder.configure({
        codec: "avc1.4d002a",
        width: VIDEO_CONFIG.WIDTH,
        height: VIDEO_CONFIG.HEIGHT,
        bitrate: 5_000_000,
        framerate: fps,
      });

      exportContext.current = { muxer, videoEncoder, frame: 0 };
      setCurrentFrame(0); // Start at frame 0
    }
  }, [
    setIsExportingSocialPack,
    setSocialPackStatus,
    setSocialPackProgress,
    setAnimationTemplate,
    setCameraView,
    socialPackText,
    fps,
  ]);

  // Start export when triggered
  useEffect(() => {
    if (isExportingSocialPack && !currentTask && !zipRef.current) {
      zipRef.current = new JSZip();

      // Build task queue
      const tasks: ExportTask[] = [];

      // Images
      if (socialPackOptions.includeImages) {
        CAMERA_VIEWS.forEach((view) => {
          tasks.push({ type: "image", name: view });
        });
      }

      // Videos
      if (socialPackOptions.includeVideos) {
        Object.keys(ANIMATION_CONFIG).forEach((anim) => {
          tasks.push({
            type: "video",
            name: anim as AnimationTemplate,
            duration:
              ANIMATION_CONFIG[anim as keyof typeof ANIMATION_CONFIG]
                .durationInSeconds * fps,
          });
        });
      }

      taskQueueRef.current = tasks;
      setSocialPackProgress(0);

      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => processNextTask(), 0);
    }
  }, [
    isExportingSocialPack,
    currentTask,
    processNextTask,
    fps,
    setSocialPackProgress,
    socialPackOptions,
  ]);

  const handleRender = useCallback(
    async (
      gl: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.Camera,
    ) => {
      if (!currentTask || !zipRef.current) return;

      try {
        // 1. Render
        gl.render(scene, camera);

        if (currentTask.type === "image") {
          // Capture Image
          const blob = await new Promise<Blob | null>((resolve) =>
            gl.domElement.toBlob(resolve, "image/png"),
          );

          if (blob) {
            zipRef.current.file(`images/${currentTask.name}.png`, blob);
          }

          // Done with this task
          await wait(100); // Small delay
          processNextTask();
        } else if (currentTask.type === "video") {
          const ctx = exportContext.current;
          if (!ctx) return;

          // Check encoder pressure
          if (ctx.videoEncoder.encodeQueueSize > 2) {
            await wait(50);
          }

          const bitmap = await createImageBitmap(gl.domElement);
          const timestamp = (ctx.frame / fps) * 1_000_000;
          const videoFrame = new VideoFrame(bitmap, {
            timestamp,
            duration: (1 / fps) * 1_000_000,
          });

          ctx.videoEncoder.encode(videoFrame, {
            keyFrame: ctx.frame % 30 === 0,
          });
          videoFrame.close();
          bitmap.close();

          // Update frame
          const durationFrames = currentTask.duration || 150;
          const nextFrame = ctx.frame + 1;

          if (nextFrame < durationFrames) {
            ctx.frame = nextFrame;
            setSocialPackProgress(
              Math.round((nextFrame / durationFrames) * 100),
            );
            setCurrentFrame(nextFrame);
          } else {
            // Finish video
            await ctx.videoEncoder.flush();
            ctx.muxer.finalize();

            const { buffer } = ctx.muxer.target;
            zipRef.current.file(`videos/${currentTask.name}.mp4`, buffer);

            exportContext.current = null;
            await wait(100);
            processNextTask();
          }
        }
      } catch (error) {
        console.error("Social Export failed:", error);
        toast.error("Erreur lors de l'export du pack social");
        setIsExportingSocialPack(false);
      }
    },
    [
      currentTask,
      processNextTask,
      setIsExportingSocialPack,
      setSocialPackProgress,
      fps,
    ],
  );

  if (!isExportingSocialPack) return null;

  // Calculate mug rotation for video
  let mugRotation = 0;
  if (currentTask?.type === "video" && currentTask.name === "mug-rotation") {
    const duration = currentTask.duration || 150;
    mugRotation = interpolate(currentFrame, [0, duration], [0, Math.PI * 2], {
      extrapolateRight: "clamp",
    });
  }

  // Calculate duration for Camera
  const durationInFrames =
    currentTask?.type === "video" ? currentTask.duration || 150 : 150;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <Canvas
        frameloop="demand"
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true,
          preserveDrawingBuffer: true,
        }}
        dpr={1}
        shadows
        style={{ width: width, height: height }}
        camera={{ position: [6, 4, 7], fov: 45, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={null}>
          <SceneEnvironment />
          <MugLights />
          <MugContent mugRotation={mugRotation} />
          {currentTask?.type === "video" && (
            <VideoCamera
              frame={currentFrame}
              durationInFrames={durationInFrames}
            />
          )}
          {/* For images, we rely on setCameraView updating the global camera, 
            but we need to make sure THIS canvas's camera is updated.
            Actually, setCameraView updates the global store, but VideoCamera only runs for videos.
            For images, we need a camera controller that respects 'cameraView' from store.
            However, 'VideoCamera' component is tied to animation.
            We need a 'StaticCamera' component for images.
        */}
          {currentTask?.type === "image" && (
            <StaticCamera view={currentTask.name as CameraView} />
          )}
          <ExporterScene frame={currentFrame} onRender={handleRender} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function StaticCamera({ view }: { view: CameraView }) {
  const { camera } = useThree();

  useEffect(() => {
    const config = CAMERA_CONFIGS[view];
    camera.position.set(config.pos[0], config.pos[1], config.pos[2]);
    camera.lookAt(...config.target);
  }, [view, camera]);

  return null;
}
