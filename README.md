# SubliMotion

Application de personnalisation de mugs en 3D avec React Three Fiber.

## 🎨 Configuration des Environnements (Fonds et Éclairages)

Les environnements 3D (HDRIs) sont utilisés à la fois pour l'éclairage de la scène et pour l'image d'arrière-plan.

### Ajouter un nouveau preset

Pour ajouter un nouvel environnement, vous devez suivre ces deux étapes :

1.  **Déclarer l'identifiant du preset**
    Ouvrez `src/store/useSceneStore.ts` et ajoutez un nouvel ID dans le type `EnvironmentPreset` :

    ```typescript
    export type EnvironmentPreset =
      | "studio"
      | "apartment"
      // ...
      | "mon-nouveau-preset"; // <-- Ajoutez votre ID ici
    ```

2.  **Configurer le preset**
    Ouvrez `src/config/presets.ts` et ajoutez la configuration dans le tableau `ENVIRONMENT_PRESETS` :

    ```typescript
    {
      id: "mon-nouveau-preset",
      label: "Mon Super Studio",
      image: "/path/to/preview-image.jpg", // Image de prévisualisation (miniature)
      // Optionnel : Lien vers un fichier HDR/EXR personnalisé (pour la haute résolution)
      files: "/assets/hdr/mon-studio-4k.hdr" 
    }
    ```

### 📷 Augmenter la résolution (Haute Qualité)

Les presets par défaut (comme "studio", "city", etc.) sont fournis par la librairie `@react-three/drei` et sont souvent optimisés pour le web (1k ou 2k), ce qui peut paraître flou en arrière-plan sur les grands écrans.

Pour utiliser une **haute résolution** :

1.  Téléchargez un fichier HDRI (format `.hdr` ou `.exr`) en 4k ou plus (ex: sur [Poly Haven](https://polyhaven.com/hdris)).
2.  Placez le fichier dans le dossier `public/` de votre projet (ex: `public/hdr/mon-fichier-4k.hdr`).
3.  Dans `src/config/presets.ts`, utilisez la propriété `files` pour pointer vers ce fichier :

    ```typescript
    {
      id: "studio-high-res",
      label: "Studio (Haute Résolution)",
      image: "...",
      files: "/hdr/mon-fichier-4k.hdr" // Chemin relatif au dossier public
    }
    ```

Cela forcera l'application à charger votre fichier haute qualité au lieu du preset par défaut.

## 🛠️ Stack Technique

- **Framework** : Next.js 15
- **3D** : React Three Fiber (Three.js)
- **Styling** : Tailwind CSS
- **State** : Zustand
