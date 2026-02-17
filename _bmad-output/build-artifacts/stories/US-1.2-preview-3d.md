# US 1.2 - Prévisualisation 3D (Orbit)

**ID:** STORY-002
**Epic:** 1 - Import & Visualisation (Core)
**Statut:** Actif
**Priorité:** Haute
**Story Points:** 3

## Récit Utilisateur (User Story)

En tant qu'utilisateur
Je veux faire pivoter le mug 3D librement
Afin de vérifier le placement du design sous tous les angles

## Critères d'Acceptation

- [ ] L'utilisateur peut orbiter autour du mug à 360 degrés horizontalement.
- [ ] L'utilisateur peut orbiter verticalement dans des limites raisonnables (ex: empêcher de voir sous la table).
- [ ] Le zoom avant/arrière est possible mais limité (distance min/max).
- [ ] La rotation est fluide et l'amortissement (damping) est activé.

## Notes Techniques

- **Librairie :** `@react-three/drei` -> `OrbitControls`.
- **Configuration :**
  - `enableDamping={true}`
  - `minDistance={5}`
  - `maxDistance={15}`
  - `maxPolarAngle={Math.PI / 1.5}` (pour restreindre la vue par le bas)
- **Contexte :** S'assurer que les contrôles n'entrent pas en conflit avec le drag & drop si des superpositions sont utilisées.

## Dépendances

- `@react-three/drei`
- `@react-three/fiber`

## Définition de Terminé (Definition of Done)

- [ ] OrbitControls configurés et réactifs.
- [ ] Limites de zoom testées.
- [ ] Contraintes d'angle vertical appliquées.
