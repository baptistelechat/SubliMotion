# US 3.3 - Export Pack Réseaux Sociaux

**ID:** STORY-3.3
**Epic:** 3 - Génération & Export (Output)
**Priorité:** Basse
**Points d'effort:** 2

## Récit Utilisateur (User Story)

En tant que créateur de contenu
Je veux obtenir des suggestions de légendes et de hashtags pour ma vidéo
Afin de pouvoir publier rapidement mon contenu sur les réseaux sociaux (Instagram/TikTok) sans avoir à rédiger le texte.

## Critères d'Acceptation

- [x] **Modale/Panneau Pack Social** :
  - [x] Affiche une suggestion de légende (ex: "Découvrez mon nouveau design de mug ! #SubliMotion").
  - [x] Affiche une liste de hashtags pertinents (ex: #MugDesign, #CustomMug, #3DPreview).
- [x] **Fonctionnalité de Copie** :
  - [x] Un bouton "Copier" copie la légende et les hashtags dans le presse-papiers.
  - [x] Un retour visuel (toast ou changement d'icône) confirme l'action de copie.
- [x] **Déclencheur** :
  - [x] Le pack social est accessible après un export réussi (vidéo avec chaque animation + images de chaque position de caméra + légendes / hashtags).
- [x] **Génération de Contenu** :
  - [x] Le texte est statique ou semi-dynamique (ex: basé sur le nom du template) pour l'instant (MVP).

## Notes Techniques

### Composants

- Créer un nouveau composant `SocialPackDialog` (utilisant shadcn/ui `Dialog`).
- Ou intégrer dans l'état de succès de `ExportOverlay` (si `ExportOverlay` reste ouvert).
- Actuellement `ExportOverlay` se ferme automatiquement à la fin. Nous devrions peut-être changer cela ou afficher un toast "Succès" avec une action "Voir le Pack Social".
- Approche recommandée : Afficher une `Dialog` ou une action dans un `Toast` après l'export.

### Gestion d'État

- Pas d'état global complexe nécessaire, juste un état local pour la visibilité de la modale.
- On pourrait stocker le statut "dernier exporté" dans `useSceneStore` si on veut persister la suggestion.

### Détails d'Implémentation

- Utiliser `navigator.clipboard.writeText()` pour la copie.
- Utiliser `sonner` pour le toast "Copié !".
- Définir une liste de templates pour les légendes dans un fichier de config (ex: `src/config/social-pack.ts`).

## Dépendances

- `src/components/ui/dialog.tsx` (shadcn/ui)
- `src/components/ui/button.tsx`
- `src/components/ui/textarea.tsx` (optionnel, si éditable)
- `sonner` (déjà installé)

## Définition de Terminé (DoD)

- [x] Composant `SocialPack` implémenté.
- [x] Intégration avec le flux d'Export (déclenché après export ou bouton manuel).
- [x] La copie dans le presse-papiers fonctionne.
- [x] Tests/Vérification : Vérification manuelle de la fonction de copie et de l'apparence de la modale.
