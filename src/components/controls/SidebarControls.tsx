"use client";

import { BackgroundControls } from "@/components/controls/BackgroundControls";
import { ColorControls } from "@/components/controls/ColorControls";
import { LightingControls } from "@/components/controls/LightingControls";
import { TemplateSelector } from "@/components/controls/TemplateSelector";
import { TextureUploader } from "@/components/dropzone/TextureUploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSceneStore } from "@/store/useSceneStore";
import { memo } from "react";

function SidebarControlsComponent() {
  const showGrid = useSceneStore((state) => state.showGrid);
  const toggleGrid = useSceneStore((state) => state.toggleGrid);

  return (
    <ScrollArea className="w-full md:w-80 border-r bg-card h-full transform-gpu">
      <div className="p-4 flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Texture
          </h2>
          <div className="h-48">
            <TextureUploader />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Personnalisation
          </h2>
          <ColorControls />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Fond
          </h2>
          <BackgroundControls />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Éclairage
          </h2>
          <LightingControls />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Animation
          </h2>
          <TemplateSelector />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Options
          </h2>
          <div className="space-y-2">
            <div
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={toggleGrid}
            >
              <span className="text-sm">Afficher la grille</span>
              <div
                className={cn(
                  "w-9 h-5 rounded-full relative transition-colors",
                  showGrid ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 size-4 bg-white rounded-full transition-all shadow-sm",
                    showGrid ? "right-0.5" : "left-0.5",
                  )}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export const SidebarControls = memo(SidebarControlsComponent);
