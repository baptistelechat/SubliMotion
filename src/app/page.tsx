"use client";

import { ColorControls } from "@/components/ColorControls";
import MobileBlocker from "@/components/MobileBlocker";
import { TemplateSelector } from "@/components/TemplateSelector";
import { TextureUploader } from "@/components/dropzone/TextureUploader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExportOverlay } from "@/components/video/ExportOverlay";
import { cn } from "@/lib/utils";
import { CameraView, SCENE_COLORS, useSceneStore } from "@/store/useSceneStore";
import { useTextureStore } from "@/store/useTextureStore";
import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRightToLine,
  Box,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Film,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";

const MugScene = dynamic(() => import("@/components/scene/MugScene"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-50 text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p>Chargement de la 3D...</p>
      </div>
    </div>
  ),
});

const VideoPreview = dynamic(
  () =>
    import("@/components/video/VideoPreview").then((mod) => mod.VideoPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-gray-50 text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>Chargement de la vidéo...</p>
        </div>
      </div>
    ),
  },
);

import { SocialPackDialog } from "@/components/video/SocialPackDialog";

const SocialPackExporter = dynamic(
  () =>
    import("@/components/video/SocialPackExporter").then(
      (mod) => mod.SocialPackExporter,
    ),
  { ssr: false },
);

function LandingView() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 relative">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            SubliMotion
          </h1>
          <p className="text-xl text-muted-foreground">
            Visualisez vos designs sur mug en 3D instantanément.
          </p>
        </div>

        <div className="w-full max-w-xl mx-auto h-80 bg-card rounded-xl shadow-lg border p-2 relative">
          <div className="hidden md:block h-full">
            <TextureUploader />
          </div>
          <div className="md:hidden h-full flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Box className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Version Mobile</h3>
            <p className="text-sm text-muted-foreground mb-4">
              L&apos;éditeur 3D nécessite un écran plus large pour une
              expérience optimale.
            </p>
            <p className="text-sm font-medium text-primary">
              Connectez-vous sur ordinateur pour créer !
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-semibold mb-1">1. Importez</div>
            <p className="text-sm text-muted-foreground">
              Glissez votre image (JPG/PNG)
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-semibold mb-1">2. Visualisez</div>
            <p className="text-sm text-muted-foreground">
              Aperçu 3D interactif immédiat
            </p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="font-semibold mb-1">3. Exportez</div>
            <p className="text-sm text-muted-foreground">
              Téléchargez votre pack visuel
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function EditorView() {
  const { clearTexture } = useTextureStore();
  const {
    backgroundColor,
    setBackgroundColor,
    cameraView,
    setCameraView,
    triggerCameraView,
    showGrid,
    toggleGrid,
    isVideoPreviewOpen,
    setIsVideoPreviewOpen,
    isExporting,
    setIsSocialPackOpen,
    isExportingSocialPack,
  } = useSceneStore();

  const handleViewSelect = (view: CameraView) => {
    if (cameraView === view) {
      triggerCameraView();
    } else {
      setCameraView(view);
    }
  };

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

  const views: { id: CameraView; label: string; icon: React.ReactNode }[] = [
    { id: "front", label: "Face", icon: <ChevronUp className="size-4" /> },
    { id: "back", label: "Dos", icon: <ChevronDown className="size-4" /> },
    {
      id: "left",
      label: "Gauche",
      icon: <ArrowRightToLine className="size-4" />,
    },
    {
      id: "right",
      label: "Droite",
      icon: <ArrowLeftToLine className="size-4" />,
    },
    {
      id: "top",
      label: "Haut",
      icon: <ArrowRightToLine className="size-4 rotate-90" />,
    },
    {
      id: "bottom",
      label: "Bas",
      icon: <ArrowLeftToLine className="size-4 rotate-90" />,
    },
  ];

  return (
    <main className="flex h-screen overflow-hidden flex-col bg-background text-foreground relative">
      <MobileBlocker />
      <div
        className={cn(
          "flex flex-col h-full transition-all duration-500",
          isExportingSocialPack && "filter blur-md pointer-events-none",
        )}
      >
        {/* Header */}
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearTexture}
              title="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SubliMotion{" "}
              <span className="text-xs font-normal text-muted-foreground ml-2">
                Éditeur
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsVideoPreviewOpen(!isVideoPreviewOpen)}
              className="gap-2"
            >
              {isVideoPreviewOpen ? (
                <Film className="size-4" />
              ) : (
                <Box className="size-4" />
              )}
              {isVideoPreviewOpen ? "Vidéo" : "Scène 3D"}
            </Button>
            <Button
              variant="default"
              className="gap-2"
              onClick={() => setIsSocialPackOpen(true)}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              {isExporting ? "Export..." : "Exporter"}
            </Button>
          </div>
        </header>

        {/* Editor Layout: Left (Tools) - Center (3D) - Right (Views) */}
        <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
          {/* Left Panel: Tools */}
          <ScrollArea className="w-full md:w-80 border-r bg-card/50 h-full">
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
                <div className="grid grid-cols-4 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => setBackgroundColor(bg.value)}
                      className={cn(
                        "w-full aspect-square rounded-md border transition-all cursor-pointer flex items-center justify-center",
                        bg.class,
                        backgroundColor === bg.value
                          ? "ring-2 ring-primary ring-offset-2"
                          : "hover:ring-2 ring-primary/50",
                      )}
                      title={bg.name}
                    >
                      <Check
                        className={cn(
                          "size-6",
                          backgroundColor === bg.value
                            ? bg.name === "Gris clair" ||
                              bg.name === "Gris moyen"
                              ? "text-primary"
                              : "text-secondary"
                            : "hidden",
                        )}
                      />
                    </button>
                  ))}
                </div>
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

          {/* Center Panel: 3D Canvas */}
          <div className="flex-1 bg-gray-100/50 relative touch-none overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                !isVideoPreviewOpen
                  ? "opacity-100 visible scale-100 translate-x-0"
                  : "opacity-0 invisible scale-95 -translate-x-12 pointer-events-none",
              )}
            >
              <MugScene />
            </div>

            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
                isVideoPreviewOpen
                  ? "opacity-100 visible scale-100 translate-x-0"
                  : "opacity-0 invisible scale-105 translate-x-12 pointer-events-none",
              )}
            >
              <VideoPreview />
            </div>

            {/* Overlay Controls (Mobile/Quick) */}
            <div
              className={cn(
                "absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur rounded-full px-4 py-2 shadow-lg border flex gap-4 md:hidden transition-all duration-500",
                !isVideoPreviewOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none",
              )}
            >
              <span className="text-xs font-medium">Toucher pour tourner</span>
            </div>
          </div>

          {/* Right Panel: Views */}
          <div
            className={cn(
              "border-l bg-card/50 hidden md:block h-full transition-all duration-700 ease-in-out overflow-hidden",
              !isVideoPreviewOpen
                ? "w-64 opacity-100"
                : "w-0 opacity-0 border-l-0",
            )}
          >
            <div className="w-64 h-full">
              <ScrollArea className="w-full h-full">
                <div className="p-4 flex flex-col gap-6">
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      Points de vue
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      {views.map((view) => (
                        <Button
                          key={view.id}
                          variant={
                            cameraView === view.id ? "default" : "outline"
                          }
                          className="w-full justify-start gap-2"
                          onClick={() => handleViewSelect(view.id)}
                        >
                          {view.icon} {view.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      Isométrique
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                      <Button
                        variant={cameraView === "iso1" ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                        onClick={() => handleViewSelect("iso1")}
                      >
                        <Box className="size-4" /> ISO 1
                      </Button>
                      <Button
                        variant={cameraView === "iso2" ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                        onClick={() => handleViewSelect("iso2")}
                      >
                        <Box className="size-4" /> ISO 2
                      </Button>
                      <Button
                        variant={cameraView === "iso3" ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                        onClick={() => handleViewSelect("iso3")}
                      >
                        <Box className="size-4" /> ISO 3
                      </Button>
                      <Button
                        variant={cameraView === "iso4" ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                        onClick={() => handleViewSelect("iso4")}
                      >
                        <Box className="size-4" /> ISO 4
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
        {/* End of Editor Layout */}
      </div>

      <ExportOverlay />
      <SocialPackDialog />
      <SocialPackExporter />
    </main>
  );
}

export default function Home() {
  const { textureUrl } = useTextureStore();

  return textureUrl ? <EditorView /> : <LandingView />;
}
