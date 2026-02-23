# US 2.1 - Choix de Couleur

**Epic:** 2 - Configuration du Rendu (Customization)
**Statut:** Done

## Critères d'Acceptation

- [x] Le store `useSceneStore` gère `mugColor`.
- [x] Une interface utilisateur permet de choisir une couleur parmi des presets (Blanc, Noir, Rouge, Bleu, Jaune, ...).
- [x] Une interface utilisateur permet de choisir une couleur personnalisée (Color Picker).
- [x] La couleur s'applique au matériau `Material.001` du modèle 3D.
- [x] La modification est visible en temps réel sur le modèle 3D.

## Technical Notes

### Architecture 3D

- Le modèle Mug est chargé via `useGLTF`.
- La couleur est appliquée au matériau nommé `Material.001`.

### State Management

Ajouté au `useSceneStore`:

```typescript
interface SceneState {
  mugColor: string;
  setMugColor: (color: string) => void;
}
```

### UI Components

- Composant `ColorControls` créé sans `Card` pour s'aligner avec le style existant.
- Utilisation de `<input type="color">` et de boutons de presets.

## Tasks

- [x] **Store**: Mettre à jour `useSceneStore.ts` avec l'état de couleur unique.
- [x] **Analysis**: Inspecter le GLTF et identifier `Material.001` comme cible.
- [x] **3D Implementation**: Modifier `MugScene.tsx` pour appliquer la couleur à `Material.001`.
- [x] **UI Implementation**: Créer le composant `ColorControls.tsx` (simplifié sans Card).
- [x] **Integration**: Ajouter `ColorControls` dans la sidebar de gauche.
