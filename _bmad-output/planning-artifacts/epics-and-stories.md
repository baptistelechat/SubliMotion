# Epics & User Stories - SubliMotion

Based on PRD v1.0

## Épopée 1 : Import & Visualisation (Core)

### US 1.1 - Drag & Drop Design

**Description:** L'utilisateur doit pouvoir glisser-déposer une image (JPG/PNG) sur la zone de travail pour l'appliquer instantanément sur le mug 3D.
**Acceptance Criteria:**

- [x] L'utilisateur peut glisser un fichier image depuis son bureau vers la zone de canvas.
- [x] Les formats JPG et PNG sont acceptés.
- [x] L'image s'applique correctement sur la texture du mug 3D.
- [x] Un message d'erreur s'affiche si le format n'est pas supporté.

### US 1.2 - Prévisualisation 3D

**Description:** L'utilisateur doit pouvoir manipuler le mug (rotation orbitale) pour vérifier le placement du design.
**Acceptance Criteria:**

- [x] L'utilisateur peut faire tourner le mug à 360 degrés (orbite).
- [x] Le zoom (in/out) est possible (optionnel mais recommandé).
- [x] La rotation est fluide et réactive.

### US 1.3 - Vues Rapides

**Description:** Des boutons doivent permettre de s'aligner rapidement sur les faces clés (Face, Anse, Haut, Bas).
**Acceptance Criteria:**

- [x] Présence de boutons d'accès rapide (Front, Back, Left, Right, Top, Bottom ou similaires).
- [x] Au clic, la caméra s'anime pour se positionner sur la vue demandée.

## Épopée 2 : Configuration du Rendu (Customization)

### US 2.1 - Choix de Couleur

**Description:** L'utilisateur peut changer la couleur de l'anse et de l'intérieur du mug (presets ou color picker).
**Acceptance Criteria:**

- [x] Sélecteur de couleur disponible pour l'anse.
- [x] Sélecteur de couleur disponible pour l'intérieur du mug.
- [x] La modification de couleur est visible instantanément sur le modèle 3D.

### US 2.2 - Sélection de Template Vidéo

**Description:** L'utilisateur choisit parmi une liste de scénarios d'animation prédéfinis (ex: "Zoom In", "Rotation 360", "Slow Reveal").
**Acceptance Criteria:**

- [x] Liste déroulante ou grille de templates vidéo disponibles.
- [x] Sélectionner un template met à jour la configuration de l'animation.
- [x] Au moins 3 templates de base sont disponibles (Zoom In, Rotation 360, Reveal).

### US 2.3 - Mobile Blocker (Desktop Only)

**Description:** Empêcher l'accès à l'application d'édition sur mobile pour garantir une bonne UX en attendant une version responsive.
**Acceptance Criteria:**

- [x] Détection des appareils mobiles (largeur d'écran < 768px).
- [x] Affichage d'un écran de blocage explicite ("Veuillez utiliser un ordinateur").
- [x] L'application reste accessible sur Desktop.

## Épopée 3 : Génération & Export (Output)

### US 3.1 - Prévisualisation Vidéo

**Description:** L'utilisateur peut jouer l'animation sélectionnée dans le navigateur avant l'export.
**Acceptance Criteria:**

- [x] Bouton "Play" pour lancer l'animation dans le canvas.
- [x] L'animation correspond au template sélectionné.
- [x] Possibilité de mettre en pause ou de relancer.

### US 3.2 - Export MP4

**Description:** L'application génère un fichier vidéo MP4 téléchargeable (1080x1920 pour Reels) via l'enregistrement client-side.
**Acceptance Criteria:**

- [x] Bouton "Exporter" ou "Générer Reel".
- [x] La vidéo est générée au format MP4.
- [x] La résolution est de 1080x1920 (format vertical 9:16).
- [x] Le fichier est téléchargé automatiquement à la fin du processus.

### US 3.3 - Export Social Pack

**Description:** L'application fournit un texte de légende et des hashtags suggérés à copier-coller.
**Acceptance Criteria:**

- [x] Une zone de texte affiche une suggestion de légende.
- [x] Une liste de hashtags pertinents est affichée.
- [x] Bouton "Copier" pour récupérer le texte facilement.

## Épopée 4 : Mobile Experience (Future)

### US 4.1 - Responsive Editor UI

**Description:** Adapter l'interface d'édition pour les écrans mobiles (Bottom Sheet, contrôles tactiles).
**Acceptance Criteria:**

- [ ] Les panneaux d'outils sont accessibles sans masquer la vue 3D.
- [ ] Les contrôles tactiles sont fluides.
