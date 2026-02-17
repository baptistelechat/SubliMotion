# US 1.1 - Drag & Drop Design

**ID:** STORY-001
**Epic:** 1 - Import & Visualisation (Core)
**Statut:** Terminé
**Priorité:** Haute
**Story Points:** 5

## Récit Utilisateur (User Story)

En tant qu'utilisateur
Je veux glisser-déposer une image (JPG/PNG) sur l'espace de travail
Afin de l'appliquer instantanément sur la texture du mug 3D

## Critères d'Acceptation

- [ ] L'utilisateur peut glisser un fichier image depuis son bureau vers la zone du canvas.
- [ ] Formats supportés : JPG et PNG.
- [ ] L'image s'applique correctement sur le mapping de texture du mug (UV).
- [ ] Un message d'erreur apparaît si le format n'est pas supporté.
- [ ] La texture se met à jour immédiatement sans rechargement de page.

## Notes Techniques

- **Librairie :** `react-dropzone` pour gérer l'entrée de fichier et les événements de glisser-déposer.
- **3D :** Utiliser le hook `useTexture` de `@react-three/drei` ou le `TextureLoader` standard.
- **État :** Mettre à jour le store Zustand avec la nouvelle URL de texture (créer une object URL).
- **Validation :** Vérifier le type et la taille du fichier avant traitement.
- **Optimisation :** Redimensionner les grandes images via une API Canvas cachée si > 2048px pour éviter la perte de contexte WebGL.

## Dépendances

- `react-dropzone`
- `zustand` (pour l'état global)
- Modèle 3D de base du Mug (`.glb` avec UVs corrects)

## Définition de Terminé (Definition of Done)

- [ ] Code terminé et linté.
- [ ] Le glisser-déposer fonctionne de manière fluide.
- [ ] Gestion des erreurs pour les fichiers invalides implémentée.
- [ ] Testé avec différents ratios d'aspect.
