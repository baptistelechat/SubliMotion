"use client";

import { useSceneStore } from "@/store/useSceneStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ExportOverlay() {
  const isExporting = useSceneStore((state) => state.isExporting);
  const exportProgress = useSceneStore((state) => state.exportProgress);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExporting) {
      // Use setTimeout to avoid synchronous state update warning
      timer = setTimeout(() => setShow(true), 0);
    } else {
      // Small delay to allow exit animation
      timer = setTimeout(() => setShow(false), 300);
    }
    return () => clearTimeout(timer);
  }, [isExporting]);

  if (!show && !isExporting) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        isExporting ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-xl shadow-2xl border max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
        </div>

        <div className="text-center space-y-2 w-full">
          <h3 className="text-xl font-semibold">Génération en cours...</h3>
          <p className="text-sm text-muted-foreground">
            Veuillez patienter pendant la création de votre vidéo.
            <br />
            Ne fermez pas cette fenêtre.
          </p>
        </div>

        <div className="w-full space-y-2">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Exportation</span>
            <span className="font-medium text-foreground">
              {exportProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
