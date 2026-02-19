# US 2.2 - Sélection de Template Vidéo

**Epic:** 2 - Configuration du Rendu (Customization)
**Statut:** Ready for Dev
**Priorité:** Haute
**Story Points:** 3

## Description

L'utilisateur choisit parmi une liste de scénarios d'animation prédéfinis (ex: "Zoom In", "Rotation 360", "Slow Reveal").
Cette sélection met à jour l'état de l'application pour préparer le rendu ou la prévisualisation.

## Critères d'Acceptation

- [ ] Une liste déroulante ou une grille de cartes permet de choisir un template.
- [ ] Les templates suivants sont disponibles :
  - **Zoom In**: La caméra commence loin et se rapproche du mug.
  - **Mug Rotation**: Le mug tourne sur lui-même.
  - **Camera Rotation**: La caméra tourne autour du mug.
  - **Vertical Reveal**: Un mouvement lent de bas en haut.
  - **Horizontal Reveal**: Un mouvement lent de côté.
- [ ] La sélection est stockée dans le `useSceneStore`.
- [ ] L'interface affiche le template actuellement sélectionné.

## Tâches Techniques

1.  **Store Update**: Ajouter `animationTemplate` et `setAnimationTemplate` dans `useSceneStore.ts`.
    - Définir un type `AnimationTemplate` avec les valeurs possibles.
2.  **UI Component**: Créer `src/components/TemplateSelector.tsx`.
    - Utiliser un `Select` ou des boutons radio stylisés (cartes).
    - Afficher le nom et une icône/description pour chaque template.
3.  **Intégration**: Ajouter `TemplateSelector` dans `EditorView` (fichier `src/app/page.tsx`).
    - Le placer dans une section appropriée (ex: "Animation" ou "Rendu").

## Dépendances

- `useSceneStore.ts`
- `page.tsx`
- Composants UI existants (Select, Card, etc.)

## Definition of Done

- [ ] Le code compile sans erreur.
- [ ] L'utilisateur peut changer de template via l'UI.
- [ ] Le store est mis à jour (vérifiable via DevTools ou log).
- [ ] Tests unitaires ou vérification manuelle OK.
