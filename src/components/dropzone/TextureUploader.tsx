"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTextureStore } from "@/store/useTextureStore";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

export function TextureUploader() {
  const { textureUrl, setTexture, clearTexture } = useTextureStore();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Gestion des erreurs (fichiers rejetés)
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          if (rejection.errors[0]?.code === "file-invalid-type") {
            toast.error("Format non supporté", {
              description: "Veuillez utiliser un fichier JPG ou PNG.",
            });
          } else {
            toast.error("Fichier rejeté", {
              description: rejection.errors.map((e) => e.message).join(", "),
            });
          }
        });
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          toast.success("Texture importée", {
            description: "L'image a été appliquée sur le modèle.",
          });

          const maxDimension = 2048;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const resizedUrl = URL.createObjectURL(blob);
                    setTexture(resizedUrl);
                    URL.revokeObjectURL(objectUrl); // Cleanup original heavy image
                  }
                },
                "image/jpeg",
                0.95,
              );
            }
          } else {
            setTexture(objectUrl);
          }
        };
        img.src = objectUrl;
      }
    },
    [setTexture],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [],
        "image/png": [],
      },
      maxFiles: 1,
      multiple: false,
    });

  return (
    <div className="w-full h-full relative">
      <Card className="p-4 bg-background/90 backdrop-blur-sm border-muted shadow-sm h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Texture
          </h2>
          {textureUrl && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={clearTexture}
              title="Supprimer la texture"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-2 flex-1 min-h-0 overflow-hidden",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            isDragReject && "border-destructive bg-destructive/5",
            textureUrl && "border-solid border-primary/20 p-0",
          )}
        >
          <input {...getInputProps()} />

          {textureUrl ? (
            <div className="relative w-full h-full rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={textureUrl}
                alt="Texture preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">
                  Changer l&apos;image
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-muted text-muted-foreground mb-1 shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1 shrink-0">
                <p className="text-sm font-medium">
                  {isDragActive
                    ? "Déposez l'image ici"
                    : "Glissez ou cliquez pour ajouter"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG ou PNG uniquement
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
