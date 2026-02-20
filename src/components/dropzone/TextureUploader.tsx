"use client";

import { cn } from "@/lib/utils";
import { useTextureStore } from "@/store/useTextureStore";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

export function TextureUploader() {
  const setTexture = useTextureStore((state) => state.setTexture);
  const textureUrl = useTextureStore((state) => state.textureUrl);

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
    <div className="w-full h-full relative border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div
        {...getRootProps()}
        className={cn(
          "w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragActive && "bg-primary/5",
          isDragReject && "bg-destructive/5",
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
    </div>
  );
}
