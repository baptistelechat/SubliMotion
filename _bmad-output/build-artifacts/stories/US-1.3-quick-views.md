# US 1.3 - Vues Rapides

**ID:** STORY-003
**Epic:** 1 - Import & Visualisation (Core)
**Statut:** Actif
**Priorité:** Moyenne
**Story Points:** 3

## Récit Utilisateur (User Story)

En tant qu'utilisateur
Je veux des boutons d'accès rapide pour aligner la caméra sur les faces clés (Avant, Arrière, Anse, Haut)
Afin d'inspecter rapidement des zones spécifiques de mon design

## Critères d'Acceptation

- [ ] Boutons UI pour : Face, Dos, Gauche (Anse), Droite, Haut, Bas.
- [ ] Cliquer sur un bouton anime la caméra vers la position correspondante.
- [ ] L'animation est fluide (environ 0.5s - 1s).
- [ ] Le mug reste centré.

## Notes Techniques

- **Librairie :** `CameraControls` de `@react-three/drei` (préféré à OrbitControls pour le mouvement programmatique) OU animation GSAP personnalisée sur la position de la caméra.
- **Implémentation :**
  - Stocker les positions/quaternions de la caméra pour chaque vue.
  - Utiliser `controls.setLookAt(x, y, z, targetX, targetY, targetZ, true)` pour une transition fluide.
- **UI :** Boutons Shadcn UI dans une barre d'outils superposée.

## Dépendances

- `@react-three/drei` (CameraControls)
- `shadcn/ui` (Composant Button)

## Définition de Terminé (Definition of Done)

- [ ] Boutons implémentés dans l'UI.
- [ ] La caméra s'anime correctement vers toutes les vues définies.
- [ ] La transition est fluide et sans glitch.
