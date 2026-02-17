# Epics & User Stories - SubliMotion

Based on PRD v1.0

## Épopée 1 : Import & Visualisation (Core)

### US 1.1 - Drag & Drop Design
**Description:** L'utilisateur doit pouvoir glisser-déposer une image (JPG/PNG) sur la zone de travail pour l'appliquer instantanément sur le mug 3D.
**Acceptance Criteria:**
- [ ] L'utilisateur peut glisser un fichier image depuis son bureau vers la zone de canvas.
- [ ] Les formats JPG et PNG sont acceptés.
- [ ] L'image s'applique correctement sur la texture du mug 3D.
- [ ] Un message d'erreur s'affiche si le format n'est pas supporté.

### US 1.2 - Prévisualisation 3D
**Description:** L'utilisateur doit pouvoir manipuler le mug (rotation orbitale) pour vérifier le placement du design.
**Acceptance Criteria:**
- [ ] L'utilisateur peut faire tourner le mug à 360 degrés (orbite).
- [ ] Le zoom (in/out) est possible (optionnel mais recommandé).
- [ ] La rotation est fluide et réactive.

### US 1.3 - Vues Rapides
**Description:** Des boutons doivent permettre de s'aligner rapidement sur les faces clés (Face, Anse, Haut, Bas).
**Acceptance Criteria:**
- [ ] Présence de boutons d'accès rapide (Front, Back, Left, Right, Top, Bottom ou similaires).
- [ ] Au clic, la caméra s'anime pour se positionner sur la vue demandée.

## Épopée 2 : Configuration du Rendu (Customization)

### US 2.1 - Choix de Couleur
**Description:** L'utilisateur peut changer la couleur de l'anse et de l'intérieur du mug (presets ou color picker).
**Acceptance Criteria:**
- [ ] Sélecteur de couleur disponible pour l'anse.
- [ ] Sélecteur de couleur disponible pour l'intérieur du mug.
- [ ] La modification de couleur est visible instantanément sur le modèle 3D.

### US 2.2 - Sélection de Template Vidéo
**Description:** L'utilisateur choisit parmi une liste de scénarios d'animation prédéfinis (ex: "Zoom In", "Rotation 360", "Slow Reveal").
**Acceptance Criteria:**
- [ ] Liste déroulante ou grille de templates vidéo disponibles.
- [ ] Sélectionner un template met à jour la configuration de l'animation.
- [ ] Au moins 3 templates de base sont disponibles (Zoom In, Rotation 360, Reveal).

## Épopée 3 : Génération & Export (Output)

### US 3.1 - Prévisualisation Vidéo
**Description:** L'utilisateur peut jouer l'animation sélectionnée dans le navigateur avant l'export.
**Acceptance Criteria:**
- [ ] Bouton "Play" pour lancer l'animation dans le canvas.
- [ ] L'animation correspond au template sélectionné.
- [ ] Possibilité de mettre en pause ou de relancer.

### US 3.2 - Export MP4
**Description:** L'application génère un fichier vidéo MP4 téléchargeable (1080x1920 pour Reels) via l'enregistrement client-side.
**Acceptance Criteria:**
- [ ] Bouton "Exporter" ou "Générer Reel".
- [ ] La vidéo est générée au format MP4.
- [ ] La résolution est de 1080x1920 (format vertical 9:16).
- [ ] Le fichier est téléchargé automatiquement à la fin du processus.

### US 3.3 - Export Social Pack
**Description:** L'application fournit un texte de légende et des hashtags suggérés à copier-coller.
**Acceptance Criteria:**
- [ ] Une zone de texte affiche une suggestion de légende.
- [ ] Une liste de hashtags pertinents est affichée.
- [ ] Bouton "Copier" pour récupérer le texte facilement.
