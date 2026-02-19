# US 3.2 - Export MP4

**Epic:** 3 - Génération & Export (Output)
**Statut:** Done
**Priorité:** Haute

## Description

L'application génère un fichier vidéo MP4 téléchargeable (1080x1920 pour Reels) via l'enregistrement client-side.
L'objectif est de produire une vidéo fluide de haute qualité directement depuis le navigateur de l'utilisateur.

## Critères d'Acceptation

- [x] Bouton "Exporter" visible dans l'interface (Header).
- [x] La vidéo est générée au format MP4 (H.264 Main Profile Level 4.2).
- [x] La résolution est strictement de 1080x1920 (format vertical 9:16).
- [x] Le framerate est constant (30 FPS).
- [x] Le fichier est téléchargé automatiquement à la fin du processus avec un nom pertinent (ex: `sublimotion-export-{timestamp}.mp4`).
- [x] Une barre de progression ou un indicateur de chargement s'affiche pendant la génération (sur le bouton Header).

## Notes Techniques

### Approche Technique

Nous utiliserons une approche de rendu frame-par-frame pour garantir la fluidité et la qualité, indépendamment de la puissance de la machine cliente.

1.  **Bibliothèque d'encodage** : Utilisation de `mp4-muxer` (léger, pure JS, supporte WebCodecs) pour l'encodage MP4 client-side.
2.  **Rendu Offscreen** : Création d'un `<Canvas>` dédié à l'export, invisible pour l'utilisateur, configuré en 1080x1920.
3.  **Boucle de Rendu** :
    - On itère sur chaque frame de l'animation (de 0 à `durationInFrames`).
    - À chaque frame, on met à jour la scène Three.js.
    - On attend que le rendu soit prêt.
    - On capture le contenu du canvas (`createImageBitmap`).
    - On encode la frame avec `VideoEncoder` (Codec `avc1.4d002a` pour supporter 1080p).
    - On ajoute la frame au muxer MP4.
4.  **Gestion d'État Globale** : Utilisation de `useSceneStore` (`isExporting`, `exportProgress`, `triggerExport`) pour permettre le déclenchement de l'export depuis n'importe quel composant (Header, Preview, etc.).

### Dépendances à ajouter

- `mp4-muxer`

### Composants à créer/modifier

- `src/components/video/VideoExporter.tsx` : Composant gérant la logique d'export (maintenant monté globalement dans `page.tsx`).
- `src/store/useSceneStore.ts` : Ajout des états d'export (`isExporting`, `triggerExport`).
- `src/app/page.tsx` : Intégration du bouton d'export dans le Header et montage du composant `VideoExporter`.

## Tâches

- [x] Installer `mp4-muxer`.
- [x] Créer le store ou l'état local pour gérer le statut d'export (idle, exporting, done, error) et la progression (0-100%).
- [x] Implémenter le composant `VideoExporter` qui orchestre le rendu frame-par-frame.
- [x] Intégrer `mp4-muxer` pour assembler les frames vidéo.
- [x] Ajouter le bouton d'export dans l'interface (Header).
- [x] Tester l'export sur différents navigateurs (Chrome, Firefox, Safari - attention au support WebCodecs).

## Code Review (Automated)

**Date:** 2026-02-18
**Reviewer:** BMAD Orchestrator (Trae)

### Findings

1.  **Correct Implementation:** Logic for frame-by-frame rendering and MP4 muxing is correctly implemented using `mp4-muxer` and `VideoEncoder`.
2.  **Resolution & Framerate:** Correctly hardcoded to 1080x1920 and 30fps as per requirements.
3.  **State Management:** `useSceneStore` is used effectively to decouple UI from export logic.
4.  **Issue Identified:** Potential unhandled error in async `handleRender` loop if `VideoEncoder` fails.
    - **Status:** Fixed. Added `try/catch` block inside `handleRender` to properly reset `isExporting` state and notify user on failure.
5.  **Linting:** Code passes `pnpm lint`.

**Verdict:** Approved with fixes.
