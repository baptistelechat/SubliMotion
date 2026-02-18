"use client";

import { ANIMATION_CONFIG, VIDEO_CONFIG } from "@/config/animations";
import { useSceneStore } from "@/store/useSceneStore";
import { Canvas, useThree } from "@react-three/fiber";
import * as Muxer from "mp4-muxer";
import { useCallback, useEffect, useRef, useState } from "react";
import { interpolate } from "remotion";
import { toast } from "sonner";
import * as THREE from "three";
import { MugContent, MugLights } from "../scene/MugContent";
import { VideoCamera } from "./MugVideo";

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
    // Trigger render notification after frame update
    // We use a small timeout to ensure props have propagated and scene is updated
    const timeout = setTimeout(() => {
      onRender(gl, scene, camera);
    }, 0);
    return () => clearTimeout(timeout);
  }, [frame, gl, scene, camera, onRender]);

  return null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function VideoExporter() {
  const isExporting = useSceneStore((state) => state.isExporting);
  const setIsExporting = useSceneStore((state) => state.setIsExporting);
  const setExportProgress = useSceneStore((state) => state.setExportProgress);
  const startExportTrigger = useSceneStore((state) => state.startExportTrigger);
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const setIsVideoPlaying = useSceneStore((state) => state.setIsVideoPlaying);

  const [currentFrame, setCurrentFrame] = useState(0);

  // Configuration
  const config = animationTemplate ? ANIMATION_CONFIG[animationTemplate] : null;
  const fps = VIDEO_CONFIG.FPS;
  const durationInFrames = config
    ? config.durationInSeconds * fps
    : VIDEO_CONFIG.DURATION_IN_SECONDS_DEFAULT * fps;
  const width = 1080;
  const height = 1920;

  const exportContext = useRef<{
    muxer: Muxer.Muxer<Muxer.ArrayBufferTarget>;
    videoEncoder: VideoEncoder;
    frame: number;
  } | null>(null);

  // Defined before handleRender to avoid hoisting issues
  const finishExport = useCallback(async () => {
    if (!exportContext.current) return;
    const { muxer, videoEncoder } = exportContext.current;

    await videoEncoder.flush();
    muxer.finalize();

    const { buffer } = muxer.target;
    const blob = new Blob([buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sublimotion-export-${Date.now()}.mp4`;
    a.click();

    URL.revokeObjectURL(url);
    setIsExporting(false);
    toast.success("Export terminé !");

    // Cleanup ref
    exportContext.current = null;
  }, [setIsExporting]);

  const handleRender = useCallback(
    async (
      gl: THREE.WebGLRenderer,
      scene: THREE.Scene,
      camera: THREE.Camera,
    ) => {
      if (!isExporting || !exportContext.current) return;

      try {
        const ctx = exportContext.current;

        // 1. Render explicitly to ensure we have the latest frame
        gl.render(scene, camera);

        // Check if encoder is overwhelmed
        if (ctx.videoEncoder.encodeQueueSize > 2) {
          await wait(50);
        }

        // 2. Capture frame
        const bitmap = await createImageBitmap(gl.domElement);

        // 3. Encode
        // Calculate timestamp in microseconds
        const timestamp = (ctx.frame / fps) * 1_000_000;

        const videoFrame = new VideoFrame(bitmap, {
          timestamp,
          duration: (1 / fps) * 1_000_000,
        });

        ctx.videoEncoder.encode(videoFrame, { keyFrame: ctx.frame % 30 === 0 });
        videoFrame.close();
        bitmap.close(); // Important to release memory

        // 4. Update progress
        const newProgress = Math.round(
          ((ctx.frame + 1) / durationInFrames) * 100,
        );
        setExportProgress(newProgress);

        // Small delay to let UI breathe and GC run
        await wait(20);

        // 5. Next frame or Finish
        if (ctx.frame < durationInFrames - 1) {
          ctx.frame++;
          setCurrentFrame(ctx.frame); // Trigger next update
        } else {
          // Finish
          finishExport();
        }
      } catch (error) {
        console.error("Frame render/encode failed:", error);
        toast.error("Erreur pendant l'export de la frame");
        setIsExporting(false);
        exportContext.current = null;
      }
    },
    [isExporting, durationInFrames, fps, finishExport, setExportProgress, setIsExporting],
  );

  const handleExport = useCallback(async () => {
    if (!config || !animationTemplate) {
      toast.error("Aucune animation sélectionnée");
      return;
    }

    setIsExporting(true);
    // Pause video playback to save resources
    setIsVideoPlaying(false);
    setExportProgress(0);
    setCurrentFrame(0);

    try {
      const muxer = new Muxer.Muxer({
        target: new Muxer.ArrayBufferTarget(),
        video: {
          codec: "avc",
          width,
          height,
        },
        fastStart: "in-memory",
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error(e),
      });

      videoEncoder.configure({
        // codec: "avc1.42001f", // H.264 Baseline Profile Level 3.1
        codec: "avc1.4d002a", // H.264 Main Profile Level 4.2 (Supports 1080p)
        width,
        height,
        bitrate: 10_000_000, // 10 Mbps
      });

      // Initialize context
      exportContext.current = { muxer, videoEncoder, frame: 0 };
      setCurrentFrame(0); // This triggers the render chain
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Erreur lors de l'export vidéo");
      setIsExporting(false);
    }
  }, [
    config,
    animationTemplate,
    width,
    height,
    setIsExporting,
    setExportProgress,
    setIsVideoPlaying,
  ]);

  const lastTriggerProcessed = useRef(startExportTrigger);

  // Trigger export when startExportTrigger changes
  useEffect(() => {
    if (startExportTrigger > lastTriggerProcessed.current && !isExporting) {
      lastTriggerProcessed.current = startExportTrigger;
      // Use setTimeout to avoid synchronous state update warning
      const timeout = setTimeout(() => {
        handleExport();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [startExportTrigger, isExporting, handleExport]);

  // Calculate mug rotation manually as in MugVideo
  const mugRotation =
    animationTemplate === "mug-rotation"
      ? interpolate(currentFrame, [0, durationInFrames], [0, Math.PI * 2], {
          extrapolateRight: "clamp",
        })
      : 0;

  if (!isExporting) return null;

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
        frameloop="demand" // Important: we control rendering
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true,
          preserveDrawingBuffer: true, // Needed for capturing
        }}
        dpr={1} // Fix dpr to 1 for consistent export resolution
        shadows
        style={{ width: `${width}px`, height: `${height}px` }}
        camera={{ position: [6, 4, 7], fov: 45, near: 0.1, far: 1000 }}
      >
        <MugLights />
        <MugContent mugRotation={mugRotation} />
        <VideoCamera frame={currentFrame} durationInFrames={durationInFrames} />
        <ExporterScene frame={currentFrame} onRender={handleRender} />
      </Canvas>
    </div>
  );
}
