# US-3.1 : Prévisualisation Vidéo (Remotion)

## 📝 Description

En tant qu'utilisateur, je veux voir une prévisualisation vidéo de mon design sur le mug, afin de valider l'animation avant de passer commande ou d'exporter.

## ✅ Critères d'Acceptation

- [ ] Un bouton "Aperçu Vidéo" est disponible dans l'interface.
- [ ] Lors du clic, le canvas 3D interactif est remplacé (ou superposé) par le **Remotion Player**.
- [ ] La durée de la prévisualisation correspond à la durée de l'animation.
- [ ] Le design (texture) appliqué sur le mug est visible et suit l'animation.
- [ ] L'utilisateur peut mettre en pause et relancer la lecture.

## 🛠 Tâches Techniques

1. **Configuration Remotion**
   - [x] Installer les dépendances `remotion`, `@remotion/player`, `@remotion/three`.
   - [x] Configurer les composants de base pour une composition 3D.

2. **Création de la Composition (`MugVideo`)**
   - [x] Créer `src/components/video/MugVideo.tsx`.
   - [x] Utiliser `<ThreeCanvas>` de `@remotion/three` pour le contexte WebGL.
   - [x] Réutiliser le composant `MugContent` (déjà refactorisé) pour assurer la cohérence visuelle avec l'éditeur.
   - [x] Animer le mug via `useCurrentFrame` et `interpolate`.

3. **Intégration du Player (`VideoPreview`)**
   - [x] Créer `src/components/video/VideoPreview.tsx` intégrant le `<Player>` de Remotion.
   - [x] Connecter le Player aux dimensions du conteneur parent.
   - [x] Gérer l'état d'affichage (Basculer entre Mode Édition / Mode Aperçu).

4. **UI / UX**
   - [x] Ajouter le bouton de bascule dans la barre d'outils ou le header.
   - [x] Ajouter un indicateur de chargement si la compilation Remotion prend du temps.

## 📐 Décisions Techniques & Architecture

- **Moteur de Rendu** : Utilisation directe de **Remotion Player** dans le navigateur.
  - _Pourquoi ?_ Bien que plus lourd qu'une simple animation R3F (`useFrame`), cela garantit que ce que l'utilisateur voit est **exactement** ce qui sera rendu par le serveur (WYSIWYG strict). Cela permet de valider le pipeline vidéo (fps, interpolation, codecs virtuels) dès le frontend.
- **Réutilisation de Code** : Le composant `MugContent.tsx` a été extrait pour être consommé à la fois par `Canvas` (R3F interactif) et `ThreeCanvas` (Remotion).
- **State** : Le store Zustand `useStore` fournira les données (couleur, texture, texte) à la composition vidéo.

## 🔗 Dépendances

- `MugContent.tsx` (Fait)
- `store.ts` (Existant)
