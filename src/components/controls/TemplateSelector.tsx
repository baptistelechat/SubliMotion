"use client";

import { ANIMATION_TEMPLATES } from "@/config/animations";
import { cn } from "@/lib/utils";
import { useSceneStore, type AnimationTemplate } from "@/store/useSceneStore";
import {
  ArrowRightFromLine,
  ArrowUpFromLine,
  Camera,
  Clapperboard,
  Pause,
  Play,
  RotateCw,
  Sparkles,
  Tornado,
  Zap,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";

const TEMPLATE_ICONS: Record<AnimationTemplate, LucideIcon> = {
  "zoom-in": ZoomIn,
  "zoom-out": ZoomOut,
  "mug-rotation": RotateCw,
  "camera-rotation": Camera,
  "vertical-reveal": ArrowUpFromLine,
  "horizontal-reveal": ArrowRightFromLine,
  "spiral-up": Tornado,
  "dramatic-zoom": Zap,
  "complete-showcase": Sparkles,
  "apple-style": Clapperboard,
};

export function TemplateSelector() {
  const animationTemplate = useSceneStore((state) => state.animationTemplate);
  const setAnimationTemplate = useSceneStore(
    (state) => state.setAnimationTemplate,
  );
  const triggerAnimation = useSceneStore((state) => state.triggerAnimation);
  const isVideoPreviewOpen = useSceneStore((state) => state.isVideoPreviewOpen);
  const isVideoPlaying = useSceneStore((state) => state.isVideoPlaying);
  const setIsVideoPlaying = useSceneStore((state) => state.setIsVideoPlaying);

  const handleSelect = (key: AnimationTemplate) => {
    // If in Video Preview mode and clicking the selected animation, toggle Play/Pause
    if (isVideoPreviewOpen && animationTemplate === key) {
      setIsVideoPlaying(!isVideoPlaying);
      return;
    }

    if (key === "mug-rotation" || key === "camera-rotation") {
      // Toggle logic for looping animations
      if (animationTemplate === key) {
        // Disable toggle off in video preview mode to prevent empty state
        if (!isVideoPreviewOpen) {
          setAnimationTemplate(null);
        }
      } else {
        setAnimationTemplate(key);
      }
    } else {
      // One-shot logic for others
      setAnimationTemplate(key);
      triggerAnimation();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {(Object.keys(ANIMATION_TEMPLATES) as AnimationTemplate[]).map((key) => {
        const template = ANIMATION_TEMPLATES[key];
        const Icon = TEMPLATE_ICONS[key];
        const isSelected = animationTemplate === key;

        return (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all hover:bg-accent text-accent-foreground border-input bg-background relative",
              isSelected && "border-primary bg-accent ring-1 ring-primary",
            )}
            title={template.description}
          >
            {isSelected &&
              (isVideoPreviewOpen && isVideoPlaying ? (
                <Pause className="absolute top-1.5 right-1.5 w-3 h-3 text-primary fill-current" />
              ) : (
                <Play className="absolute top-1.5 right-1.5 w-3 h-3 text-primary fill-current" />
              ))}
            <Icon className="w-5 h-5 mb-2" />
            <span className="font-medium text-xs text-center leading-tight">
              {template.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
