"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENVIRONMENT_PRESETS } from "@/config/presets";
import { useSceneStore, type EnvironmentPreset } from "@/store/useSceneStore";

export function LightingControls() {
  const lightingPreset = useSceneStore((state) => state.lightingPreset);
  const setLightingPreset = useSceneStore((state) => state.setLightingPreset);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select
          value={lightingPreset}
          onValueChange={(value) =>
            setLightingPreset(value as EnvironmentPreset)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir une ambiance" />
          </SelectTrigger>
          <SelectContent>
            {ENVIRONMENT_PRESETS.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
