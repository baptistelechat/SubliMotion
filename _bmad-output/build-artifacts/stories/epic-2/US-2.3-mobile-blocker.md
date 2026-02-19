# US 2.3 - Mobile Blocker (Desktop Only)

**ID:** STORY-2-3-mobile-blocker
**Epic:** epic-2
**Priority:** Must Have
**Story Points:** 2

## User Story

En tant qu'utilisateur sur mobile
Je veux être informé que l'application nécessite un ordinateur
Afin de ne pas être frustré par une interface inutilisable

## Acceptance Criteria

- [ ] Un composant `MobileBlocker` détecte la largeur d'écran.
- [ ] Si la largeur est < 768px (breakpoint md), un écran de blocage s'affiche par-dessus l'interface.
- [ ] Le message indique clairement : "SubliMotion est optimisé pour ordinateur. Veuillez vous connecter depuis un PC/Mac pour créer vos visuels."
- [ ] L'application reste totalement fonctionnelle sur les écrans > 768px.
- [ ] Le blocage s'applique uniquement à la vue Éditeur (`/editor` ou état connecté), pas nécessairement à la Landing Page (si elle est responsive).

## Technical Notes

- Utiliser Tailwind CSS `md:hidden` pour afficher le blocage sur mobile et le masquer sur desktop.
- Pas besoin de logique complexe de User Agent, le responsive CSS suffit pour l'instant.
- Le composant peut être ajouté dans le layout ou directement dans `EditorView`.

## Dependencies

- Aucune

## Definition of Done

- [ ] Code complete
- [ ] Testé en redimensionnant la fenêtre du navigateur
