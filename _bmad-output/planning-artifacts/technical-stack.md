# Validation de la Stack Technique

**Date:** 2026-02-16
**Statut:** Validé
**Contexte:** Application Web "SubliMotion" - Générateur de contenu Instagram (Images/Vidéos 3D).

## 1. Cœur de l'Application (Frontend)

*   **Framework:** **Next.js 15 (App Router)**
    *   *Pourquoi ?* Standard actuel, performant, routing simplifié, optimisation des assets (images/fonts) native. Prêt pour l'intégration API future (V2/V3).
*   **Langage:** **TypeScript**
    *   *Pourquoi ?* Sécurité du typage indispensable pour la manipulation 3D et la configuration JSON future.
*   **Package Manager:** **pnpm**
    *   *Pourquoi ?* Rapidité et gestion efficace de l'espace disque (préférence utilisateur).

## 2. Moteur 3D & Rendu

*   **Librairies:** **Three.js** + **React Three Fiber (R3F)** + **Drei**
    *   *Pourquoi ?* Écosystème React standard pour la 3D. R3F permet une approche déclarative (composants) plus simple à maintenir que Three.js impératif. `Drei` offre des helpers indispensables (OrbitControls, Stage, Environment).
*   **Stratégie de Rendu:** Client-Side Rendering (CSR) pour l'éditeur.
    *   L'éditeur 3D sera un composant `'use client'` pour la réactivité immédiate.

## 3. Génération Vidéo (Instagram Reels)

*   **Librairie:** **Remotion** + **@remotion/three**
    *   *Pourquoi ?* Permet de générer des vidéos MP4 programmatiques directement depuis le code React. Indispensable pour l'automatisation et la cohérence des "Packs Instagram".
*   **Contrainte Technique Majeure:**
    *   ❌ Pas de `useFrame` (R3F) pour les animations.
    *   ✅ Utilisation exclusive de `useCurrentFrame()` (Remotion) pour piloter les animations (rotation, zoom) de manière déterministe frame-par-frame.

## 4. Interface Utilisateur (UI) & Styling

*   **Styling:** **Tailwind CSS 4**
    *   *Pourquoi ?* Développement rapide, bundle size réduit, configuration simple.
*   **Composants:** **Shadcn UI** (Radix Primitives)
    *   *Pourquoi ?* Composants accessibles, beaux par défaut, et copiables (pas de dépendance lourde npm). Idéal pour les modales, sliders, et boutons.
*   **Icônes:** **Lucide React**
    *   *Pourquoi ?* Standard avec Shadcn UI.

## 5. Gestion d'État (State Management)

*   **Librairie:** **Zustand**
    *   *Pourquoi ?* Plus léger et simple que Redux. Parfait pour gérer l'état global de l'éditeur (texture actuelle, couleur de fond, angle de caméra, options d'export sélectionnées) sans "prop drilling".

## 6. Validation & Données

*   **Librairie:** **Zod**
    *   *Pourquoi ?* Validation des configurations JSON (pour le futur système "Plug & Play" des modèles 3D) et des inputs utilisateur.

## 7. Performance & Optimisation

*   **Lazy Loading:** Chargement dynamique des modèles 3D lourds (`glb`/`gltf`).
*   **Texture Compression:** Conversion/redimensionnement des images uploadées côté client (Canvas API) avant application sur le modèle pour éviter les lags.

## 8. Architecture "Future-Proof" (V2/V3)

*   **Instagrapi (Note):** Bien que le backend soit pour plus tard, nous structurerons les données d'export (JSON metadata) pour être compatibles avec des scripts Python utilisant `instagrapi`.

---

## Résumé de la Stack

| Couche | Technologie |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Langage** | TypeScript |
| **3D** | React Three Fiber / Drei |
| **Vidéo** | Remotion |
| **UI** | Tailwind CSS 4 / Shadcn UI |
| **State** | Zustand |
| **Package Mgr** | pnpm |
