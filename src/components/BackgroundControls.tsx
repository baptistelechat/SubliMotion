"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ENVIRONMENT_PRESETS } from "@/config/presets";
import { cn } from "@/lib/utils";
import {
  EnvironmentPreset,
  SCENE_COLORS,
  useSceneStore,
} from "@/store/useSceneStore";
import { Check } from "lucide-react";

export function BackgroundControls() {
  const {
    backgroundStyle,
    setBackgroundStyle,
    backgroundColor,
    setBackgroundColor,
    backgroundPreset,
    setBackgroundPreset,
    blurBackground,
    setBlurBackground,
  } = useSceneStore();

  const backgrounds = [
    {
      name: "Gris clair",
      value: SCENE_COLORS["Gris clair"],
      class: "bg-gray-100",
    },
    {
      name: "Gris moyen",
      value: SCENE_COLORS["Gris moyen"],
      class: "bg-gray-400",
    },
    {
      name: "Gris foncé",
      value: SCENE_COLORS["Gris foncé"],
      class: "bg-gray-700",
    },
    { name: "Noir", value: SCENE_COLORS["Noir"], class: "bg-black" },
  ];

  return (
    <div className="space-y-6">
      {/* Couleurs unies */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          Couleurs unies
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {backgrounds.map((bg) => (
            <button
              key={bg.value}
              onClick={() => {
                setBackgroundStyle("color");
                setBackgroundColor(bg.value);
              }}
              className={cn(
                "w-full aspect-square rounded-md border transition-all cursor-pointer flex items-center justify-center relative overflow-hidden",
                bg.class,
                backgroundStyle === "color" && backgroundColor === bg.value
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-2 ring-primary/50",
              )}
              title={bg.name}
            >
              {backgroundStyle === "color" && backgroundColor === bg.value && (
                <Check
                  className={cn(
                    "size-5",
                    bg.name === "Gris clair" || bg.name === "Gris moyen"
                      ? "text-primary"
                      : "text-white",
                  )}
                />
              )}
            </button>
          ))}

          <div
            className={cn(
              "relative w-full aspect-square rounded-md border overflow-hidden transition-all group cursor-pointer",
              backgroundStyle === "color" &&
                !(Object.values(SCENE_COLORS) as string[]).includes(
                  backgroundColor,
                ) &&
                "ring-2 ring-primary ring-offset-2",
            )}
            title="Couleur personnalisée"
          >
            <div
              className="absolute inset-0 bg-linear-to-br from-red-500 via-green-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"
              style={
                backgroundStyle === "color" &&
                !(Object.values(SCENE_COLORS) as string[]).includes(
                  backgroundColor,
                )
                  ? { background: backgroundColor, opacity: 1 }
                  : {}
              }
            />
            <input
              type="color"
              value={
                !(Object.values(SCENE_COLORS) as string[]).includes(
                  backgroundColor,
                )
                  ? backgroundColor
                  : "#ffffff"
              }
              onChange={(e) => {
                setBackgroundStyle("color");
                setBackgroundColor(e.target.value);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {backgroundStyle === "color" &&
              !(Object.values(SCENE_COLORS) as string[]).includes(
                backgroundColor,
              ) && (
                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5 text-white drop-shadow-md" />
              )}
          </div>
        </div>
      </div>

      {/* Environnements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Environnements 
          </Label>
          {backgroundStyle === "image" && (
            <div className="flex items-center space-x-2 animate-in fade-in zoom-in duration-200">
              <Label
                htmlFor="blur-bg"
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Flou
              </Label>
              <Switch
                id="blur-bg"
                checked={blurBackground}
                onCheckedChange={setBlurBackground}
                className="scale-75 origin-right"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setBackgroundStyle("image");
                setBackgroundPreset(preset.id as EnvironmentPreset);
              }}
              className={cn(
                "relative w-full aspect-video rounded-md border transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group shadow-sm bg-muted",
                backgroundStyle === "image" && backgroundPreset === preset.id
                  ? "ring-2 ring-primary ring-offset-2 opacity-100"
                  : "hover:ring-2 ring-primary/50 opacity-80 hover:opacity-100",
              )}
              title={preset.label}
            >
              {/* Image de fond */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${preset.image})`,
                }}
              />

              {/* Overlay sombre pour la lisibilité du texte */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

              <span className="text-xs font-semibold text-white drop-shadow-md z-10 px-2 text-center truncate w-full">
                {preset.label}
              </span>

              {backgroundStyle === "image" &&
                backgroundPreset === preset.id && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                    <Check className="size-3" />
                  </div>
                )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
