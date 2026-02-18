"use client";

import { cn } from "@/lib/utils";
import {
  ANIMATION_TEMPLATES,
  useSceneStore,
  type AnimationTemplate,
} from "@/store/useSceneStore";
import {
  ArrowRightFromLine,
  ArrowUpFromLine,
  Camera,
  RotateCw,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";

const TEMPLATE_ICONS: Record<AnimationTemplate, LucideIcon> = {
  "zoom-in": ZoomIn,
  "mug-rotation": RotateCw,
  "camera-rotation": Camera,
  "vertical-reveal": ArrowUpFromLine,
  "horizontal-reveal": ArrowRightFromLine,
};

export function TemplateSelector() {
  const { animationTemplate, setAnimationTemplate, triggerAnimation } =
    useSceneStore();

  const handleSelect = (key: AnimationTemplate) => {
    if (animationTemplate === key) {
      triggerAnimation();
    } else {
      setAnimationTemplate(key);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {(Object.keys(ANIMATION_TEMPLATES) as AnimationTemplate[]).map((key) => {
        const template = ANIMATION_TEMPLATES[key];
        const Icon = TEMPLATE_ICONS[key];

        return (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all hover:bg-accent text-accent-foreground border-input bg-background",
            )}
            title={template.description}
          >
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
