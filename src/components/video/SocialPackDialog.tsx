"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMAGE_CONFIG, VIDEO_CONFIG } from "@/config/animations";
import { SOCIAL_PACK_CONFIG } from "@/config/social-pack";
import { useSceneStore } from "@/store/useSceneStore";
import {
  Check,
  Copy,
  Download,
  Loader2,
  RefreshCw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SocialPackDialog() {
  const isSocialPackOpen = useSceneStore((state) => state.isSocialPackOpen);
  const setIsSocialPackOpen = useSceneStore(
    (state) => state.setIsSocialPackOpen,
  );

  // Social Pack Export State
  const isExportingSocialPack = useSceneStore(
    (state) => state.isExportingSocialPack,
  );
  const setIsExportingSocialPack = useSceneStore(
    (state) => state.setIsExportingSocialPack,
  );
  const socialPackProgress = useSceneStore((state) => state.socialPackProgress);
  const socialPackStatus = useSceneStore((state) => state.socialPackStatus);
  const setSocialPackText = useSceneStore((state) => state.setSocialPackText);

  const [selectedTemplate, setSelectedTemplate] = useState(
    SOCIAL_PACK_CONFIG.templates[0],
  );
  const [hashtags] = useState(SOCIAL_PACK_CONFIG.hashtags.join(" "));
  const [copied, setCopied] = useState(false);

  // Randomly select a template when dialog opens
  useEffect(() => {
    if (isSocialPackOpen) {
      const randomIndex = Math.floor(
        Math.random() * SOCIAL_PACK_CONFIG.templates.length,
      );
      // eslint-disable-next-line
      setSelectedTemplate(SOCIAL_PACK_CONFIG.templates[randomIndex]);
      setCopied(false);
    }
  }, [isSocialPackOpen]);

  const fullText = `${selectedTemplate}\n\n${hashtags}`;

  // Sync text with store for exporter
  useEffect(() => {
    setSocialPackText(fullText);
  }, [fullText, setSocialPackText]);

  const handleShuffle = () => {
    const randomIndex = Math.floor(
      Math.random() * SOCIAL_PACK_CONFIG.templates.length,
    );
    setSelectedTemplate(SOCIAL_PACK_CONFIG.templates[randomIndex]);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Copié dans le presse-papiers !");

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Erreur lors de la copie");
    }
  };

  const handleDownloadZip = () => {
    setIsExportingSocialPack(true);
  };

  return (
    <Dialog open={isSocialPackOpen} onOpenChange={setIsSocialPackOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Pack Réseaux Sociaux
          </DialogTitle>
          <DialogDescription>
            Préparez votre publication. Générez vos visuels et textes
            automatiquement.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="relative rounded-md border p-4 bg-muted/50 font-mono text-sm whitespace-pre-wrap">
            {fullText}
            <div className="absolute bottom-0.5 right-0.5 flex gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleShuffle}
                title="Générer un autre texte"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Mélanger</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleCopy}
                title="Copier le texte"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copier</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Contenu du Pack (ZIP)</h4>
            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
              <li>{`Toutes les animations vidéo (Format Carré ${VIDEO_CONFIG.WIDTH}x${VIDEO_CONFIG.HEIGHT} - ${VIDEO_CONFIG.FPS}fps)`}</li>
              <li>{`Images de toutes les vues caméra (Format Carré ${IMAGE_CONFIG.WIDTH}x${IMAGE_CONFIG.HEIGHT})`}</li>
              <li>Fichier texte avec légendes et hashtags</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsSocialPackOpen(false)}
            disabled={isExportingSocialPack}
          >
            Fermer
          </Button>
          <Button
            onClick={handleDownloadZip}
            disabled={isExportingSocialPack}
            className="w-full sm:w-auto"
          >
            {isExportingSocialPack ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {socialPackStatus || `${socialPackProgress}%`}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Télécharger le Pack ZIP
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
