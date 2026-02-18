"use client";

import { Button } from "@/components/ui/button";
import { ANIMATION_CONFIG, VIDEO_CONFIG } from "@/config/animations";
import { useSceneStore } from "@/store/useSceneStore";
import { Player, type PlayerRef } from "@remotion/player";
import { Film } from "lucide-react";
import { useEffect, useRef } from "react";
import { MugVideo } from "./MugVideo";

export const VideoPreview = () => {
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const isVideoPreviewOpen = useSceneStore((state) => state.isVideoPreviewOpen);
  const setIsVideoPreviewOpen = useSceneStore(
    (state) => state.setIsVideoPreviewOpen,
  );
  const isVideoPlaying = useSceneStore((state) => state.isVideoPlaying);
  const setIsVideoPlaying = useSceneStore((state) => state.setIsVideoPlaying);
  const playerRef = useRef<PlayerRef>(null);

  // Sync state with player
  useEffect(() => {
    if (!playerRef.current) return;

    if (isVideoPlaying && isVideoPreviewOpen) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [isVideoPlaying, isVideoPreviewOpen]);

  if (!animationTemplate) {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-4">
        <div className="bg-white p-4 rounded-full shadow-sm">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">
            Aucune animation sélectionnée
          </h3>
          <p className="text-sm max-w-62.5">
            Veuillez choisir un modèle d&apos;animation dans le panneau de
            gauche pour voir l&apos;aperçu.
          </p>
        </div>
        <Button variant="default" onClick={() => setIsVideoPreviewOpen(false)}>
          Retour à l&apos;éditeur
        </Button>
      </div>
    );
  }

  const config = ANIMATION_CONFIG[animationTemplate];

  // Use config duration or fallback to default
  const DURATION_IN_FRAMES = config
    ? config.durationInSeconds * VIDEO_CONFIG.FPS
    : VIDEO_CONFIG.DURATION_IN_SECONDS_DEFAULT * VIDEO_CONFIG.FPS;

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center p-10">
      <Player
        ref={playerRef}
        component={MugVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_CONFIG.FPS}
        compositionWidth={VIDEO_CONFIG.WIDTH}
        compositionHeight={VIDEO_CONFIG.HEIGHT}
        style={{
          height: "100%",
          aspectRatio: "9/16",
          maxWidth: "100%",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRadius: "0.5rem",
        }}
        controls
        loop
        autoPlay={false}
      />
    </div>
  );
};
