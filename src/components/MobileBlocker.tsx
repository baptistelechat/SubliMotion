import { Box } from "lucide-react";

const MobileBlocker = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-6 text-center lg:hidden animate-in fade-in duration-300">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl shadow-lg border">
        {/* Header similar to Landing Page */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            SubliMotion
          </h1>
          <p className="text-muted-foreground">Éditeur 3D</p>
        </div>

        {/* Mobile Warning Content */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Box className="w-8 h-8 text-primary" />
          </div>

          <h3 className="font-semibold text-xl mb-3">
            Version Desktop Requise
          </h3>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            L&apos;expérience est optimisée pour les grands
            écrans.
            <br />
            Veuillez utiliser un ordinateur ou un ecran plus large pour accéder à tous les outils de
            création.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileBlocker;
