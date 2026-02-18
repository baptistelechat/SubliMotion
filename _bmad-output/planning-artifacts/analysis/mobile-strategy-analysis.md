# Pré-analyse : Stratégie Mobile pour SubliMotion

**Date:** 2026-02-18
**Contexte:** Suite à la rétrospective de l'Épopée 2, il a été identifié que l'expérience mobile n'a pas été traitée. L'application actuelle (Editor View) est inutilisable sur petit écran car le panneau d'outils occupe toute la hauteur, repoussant la scène 3D hors du champ de vision. De plus, les contrôles de caméra sont masqués (`hidden md:block`).

## État des Lieux Technique

### Problèmes Actuels

1.  **Layout EditorView :** Utilise `flex-col` sur mobile avec le panneau d'outils en premier (`h-full`). Résultat : L'utilisateur ne voit que les outils, pas le mug 3D.
2.  **Contrôles Manquants :** Le panneau de droite (Vues prédéfinies) est totalement masqué en CSS sur mobile.
3.  **Interaction 3D :** Bien que `touch-none` soit présent, l'expérience tactile (rotation/zoom) n'a pas été calibrée spécifiquement.
4.  **Landing Page :** Relativement fonctionnelle mais l'uploader de texture prend beaucoup de place (`h-80`).

## Options Stratégiques

### Option A : Blocage Temporaire (Desktop Only)

Afficher un écran de garde pour les utilisateurs sur mobile/tablette les invitant à utiliser un ordinateur.

- **Implémentation :**
  - Composant `MobileBlocker` qui détecte la largeur d'écran (CSS media query) ou le User Agent.
  - Message sympa : "Pour une expérience optimale de personnalisation 3D, veuillez utiliser un ordinateur."
- **Coût :** Très faible (1 Story / 1-2 points).
- **Avantages :** Évite une mauvaise première impression (buggy UI). Permet de se concentrer sur l'Épopée 3 (Export Vidéo).
- **Inconvénients :** Frustrant pour les utilisateurs venant des réseaux sociaux (mobile first).

### Option B : Adaptation Mobile (Responsive Design)

Refondre l'interface pour s'adapter aux petits écrans.

- **Implémentation :**
  - **Layout :** Inverser l'ordre : Scène 3D en haut (hauteur fixe, ex: 50vh) ou en arrière-plan complet.
  - **Outils :** Déplacer les panneaux (Texture, Couleur, Vues) dans un "Bottom Sheet" (tiroir bas) ou des onglets coulissants.
  - **Composants :** Utiliser des composants UI mobiles (Drawer de Shadcn/ui ?).
- **Coût :** Élevé (3-5 Stories / 8-13 points). Nécessite du refactoring UI conséquent.
- **Avantages :** Indispensable à long terme pour un outil générant du contenu "Social Media" (Reels).
- **Inconvénients :** Risque de décaler l'Épopée 3.

## Recommandation

**Court Terme (Immédiat) : Option A (Blocage)**
Étant donné que nous entamons l'Épopée 3 (Export Vidéo) qui est techniquement complexe, il est risqué d'ajouter une refonte UI majeure maintenant.
Nous recommandons de mettre en place le blocage mobile immédiatement pour sécuriser l'UX actuelle.

**Moyen Terme (Post-Épopée 3) : Option B**
Une fois l'export vidéo fonctionnel, l'adaptation mobile deviendra prioritaire car les utilisateurs voudront télécharger leurs vidéos directement sur leur téléphone pour les poster.

## Plan d'Action Suggéré

1.  Créer une Story dans le Backlog : "Mise en place écran 'Desktop Only' pour mobile".
2.  Ajouter une Epic future "Mobile Experience" pour traiter l'Option B plus tard.
