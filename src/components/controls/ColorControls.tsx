"use client";

import { cn } from "@/lib/utils";
import { MUG_COLORS, useSceneStore } from "@/store/useSceneStore";
import { Label } from "@/components/ui/label";

export function ColorControls() {
  const mugColor = useSceneStore((state) => state.mugColor);
  const setMugColor = useSceneStore((state) => state.setMugColor);

  return (
    <div>
      {/* Mug Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Couleur du mug
          </Label>
          <span className="text-xs text-gray-500 uppercase font-mono">
            {mugColor}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MUG_COLORS).map(([name, color]) => (
            <button
              key={name}
              onClick={() => setMugColor(color)}
              className={cn(
                "h-8 w-8 rounded-full border border-gray-200 ring-offset-background transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
                mugColor === color &&
                  "ring-2 ring-black ring-offset-2 scale-110",
              )}
              style={{ backgroundColor: color }}
              title={name}
              aria-label={`Choisir la couleur ${name} pour le mug`}
            />
          ))}
          <div
            className={cn(
              "relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 ring-offset-background transition-all hover:scale-110 focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 shadow-sm group",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              !Object.values(MUG_COLORS).includes(mugColor as any) &&
                "ring-2 ring-black ring-offset-2 scale-110",
            )}
          >
            <div
              className="absolute inset-0 bg-linear-to-br from-red-500 via-green-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"
              style={
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                !Object.values(MUG_COLORS).includes(mugColor as any)
                  ? { background: mugColor, opacity: 1 }
                  : {}
              }
            />
            <input
              type="color"
              value={mugColor}
              onChange={(e) => setMugColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Couleur personnalisée"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
