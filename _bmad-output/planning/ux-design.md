# Document de Design UX : SubliMotion

**Date :** 16/02/2026
**Statut :** V1.0
**Auteur :** UX Designer (Trae AI)
**Source :** [PRD](./prd-sublimotion.md), [Maquettes UI](./ui-mockups.md)

## 1. Vue d'ensemble et Objectifs

**Produit :** SubliMotion - Une application web "Social-First" pour créer des vidéos 3D de mugs engageantes (Reels).
**Utilisateur Cible :** Créateurs amateurs, propriétaires de petits e-commerce.
**Objectif Principal :** Permettre aux utilisateurs de créer une vidéo prête pour les réseaux sociaux à partir d'une image plate en moins de 2 minutes, sans compétences techniques.
**Contraintes Clés :** Uniquement côté client (performance critique), Responsive mobile mais optimisé Desktop pour la création.

## 2. Parcours Utilisateurs (User Flows)

### Flux 1 : Le "Chemin Idéal" (De la Création à l'Export)

C'est le parcours principal pour un nouvel utilisateur.

1.  **Accueil / Import :**
    - L'utilisateur arrive sur la page d'accueil.
    - L'utilisateur glisse et dépose une image (JPG/PNG) sur la zone de dépôt OU clique sur "Télécharger".
    - Le système valide le fichier (taille/type).
    - _Action Système :_ Applique automatiquement l'image sur le modèle 3D de mug.
    - _Transition :_ Redirection vers l'Espace Éditeur.

2.  **Éditeur (Personnalisation) :**
    - L'utilisateur voit son design sur le mug 3D.
    - L'utilisateur fait tourner le mug pour vérifier le placement.
    - L'utilisateur ajuste la vue (Face/Côté/Haut) via des boutons rapides.
    - L'utilisateur change la couleur de l'anse/intérieur pour correspondre au design.
    - L'utilisateur sélectionne un modèle vidéo (ex: "Rotation 360").
    - _Action Système :_ Met à jour la prévisualisation en temps réel.

3.  **Prévisualisation et Export :**
    - L'utilisateur clique sur "Prévisualiser la vidéo".
    - Le système joue l'animation sélectionnée.
    - L'utilisateur clique sur "Générer le Reel".
    - Le système effectue le rendu vidéo côté client (barre de progression affichée).
    - Le système propose le téléchargement du fichier MP4 + Pack Réseaux Sociaux.

### Flux 2 : Consultation Mobile (Responsive)

Comme la création est optimisée pour le bureau, les utilisateurs mobiles ont une expérience spécifique.

1.  **Accueil (Mobile) :**
    - L'utilisateur arrive sur mobile.
    - Interface simplifiée : "Créez sur ordinateur pour une meilleure expérience".
    - Mode "Voir la Galerie" ou "Démo" disponible.
    - L'import est possible mais avec un avertissement sur la performance/taille d'écran.

## 3. Wireframes et Spécifications UI

### 3.1 Page d'Accueil (La "Zone d'Import")

**Objectif :** Engagement immédiat. Pas de distractions.

**Mise en page :**

- **En-tête :** Logo (Haut Gauche), "Galerie" (Haut Droite).
- **Contenu Principal (Centré) :**
  - Texte Héros : "Transformez vos designs en Reels viraux instantanément."
  - **Grande Zone de Dépôt :**
    - Bordure pointillée, animation subtile.
    - Icône : Nuage de téléchargement.
    - Texte : "Glissez et déposez votre design ici".
    - Bouton : "Choisir un fichier".
    - Sous-texte : "Supporte JPG, PNG (Max 5Mo)".
- **Pied de page :** "Propulsé par Remotion & R3F".

**Interactions :**

- **Survol :** La zone de dépôt s'assombrit/s'illumine au survol du fichier.
- **Erreur :** Animation de secousse rouge si le fichier est invalide.
- **Succès :** Roue de chargement -> Fondu -> Transition vers l'Éditeur.

### 3.2 Espace Éditeur (Le "Studio")

**Objectif :** Manipulation 3D intuitive et personnalisation rapide.

**Mise en page (Desktop) :**

- **Barre Latérale (Gauche - 300px) :** Contrôles
  - **Panneau 1 : Design :**
    - Miniature de l'image téléchargée.
    - Bouton "Remplacer l'image".
    - Curseurs Échelle/Position (optionnel V2).
  - **Panneau 2 : Couleurs :**
    - "Couleur du Mug" (Anse/Intérieur) : Sélecteur de couleur + Préréglages (Blanc, Noir, Rouge, Bleu).
  - **Panneau 3 : Animation :**
    - Liste des modèles (cartes avec icônes) : "Rotation Simple", "Zoom Avant", "Cinématique".
- **Canevas Principal (Centre - Flex) :**
  - Vue 3D.
  - Contrôles Flottants (Bas Centre) : Rotation, Réinitialiser la vue.
  - Boutons de Vue Rapide (Haut Droite du Canevas) : Face, Dos, Gauche, Droite, Haut.
- **Barre d'Action (Bas ou Haut Droite) :**
  - "Prévisualiser" (Icône Lecture).
  - **Bouton Principal :** "Générer le Reel" (Grand, Dégradé).

**Interactions :**

- **Canevas 3D :**
  - Clic Gauche + Glisser : Orbite Caméra.
  - Molette : Zoom Avant/Arrière.
  - Clic Droit + Glisser : Panoramique.
- **Sélecteur de Couleur :** Mise à jour en temps réel sur le modèle.
- **Sélection de Modèle :** Déclenche une animation de prévisualisation rapide du mouvement de caméra.

### 3.3 Modale d'Export

**Objectif :** Gérer l'attente pendant le rendu.

**Mise en page :**

- **Superposition :** Fond assombri.
- **Modale :**
  - En-tête : "Préparation de votre Reel... 🍳"
  - **Barre de Progression :** Indicateur visuel du statut de rendu (progression Remotion).
  - **Zone de Prévisualisation :** Affiche l'image vidéo en cours de rendu (si possible) ou un espace réservé statique.
  - **État de Succès :**
    - "Vidéo Prête !"
    - **Action Principale :** "Télécharger MP4".
    - **Action Secondaire :** "Copier les Hashtags".
    - Bouton "Créer un autre".

## 4. Système de Design et Guide de Style

**Thème :** Épuré, Moderne, Orienté Créateur.
**Couleurs :**

- **Primaire :** #6366f1 (Indigo 500) - Actions principales.
- **Secondaire :** #ec4899 (Pink 500) - Accents/Dégradés (Ambiance Instagram).
- **Arrière-plan :** #f8fafc (Slate 50) - Mode clair par défaut.
- **Surface :** #ffffff (Blanc) - Cartes/Panneaux.
- **Texte :** #0f172a (Slate 900) - Titres, #475569 (Slate 600) - Corps.

**Typographie :**

- **Police :** Inter (ou sans-serif système).
- **Échelle :**
  - H1 : 32px/40px (Gras)
  - H2 : 24px/32px (Demi-Gras)
  - Corps : 16px/24px (Régulier)
  - Petit : 14px/20px (Moyen)

**Composants (Shadcn UI) :**

- **Boutons :** Arrondis, légère ombre.
- **Champs :** Bordures minimales, anneau de focus.
- **Dialogues :** Propres, centrés, flou d'arrière-plan.
- **Toasts :** Pour les messages de succès/erreur (ex: "Export démarré").

## 5. Accessibilité (WCAG 2.1 AA)

- **Navigation Clavier :**
  - S'assurer que le canevas 3D a des états de focus.
  - Permettre la navigation par "Tab" dans les contrôles de la barre latérale.
  - Raccourcis : Espace (Lecture/Pause), Flèches (Rotation Vue).
- **Lecteurs d'Écran :**
  - Texte alternatif pour toutes les icônes UI.
  - Labels ARIA pour le canevas 3D ("Aperçu 3D du Mug").
  - Annoncer les changements de statut ("Rendu terminé", "Fichier téléchargé").
- **Contraste des Couleurs :**
  - S'assurer que le texte sur les boutons respecte le ratio 4.5:1.
  - Les indicateurs de focus doivent être visibles (ring-2 ring-offset-2).
- **Mouvement :**
  - Respecter `prefers-reduced-motion`. Désactiver les animations automatiques si défini.

## 6. Comportement Responsive

- **Desktop (>1024px) :** Mise en page 3 colonnes (Latéral, Canevas, Actions) ou Vue Divisée.
- **Tablette (768px - 1024px) :** La barre latérale devient un tiroir ou une feuille inférieure.
- **Mobile (<768px) :**
  - Mise en page empilée : Canevas en haut (ratio fixe), Contrôles en dessous dans une liste défilable.
  - Modale d'avertissement : "Meilleure expérience sur Ordinateur" (mais permettre l'utilisation).
  - Contrôles tactiles du canevas : Un doigt pour l'orbite, deux doigts pour le zoom.

## 7. Notes pour les Développeurs

- **Actifs 3D :** Utiliser le format GLTF/GLB pour le mug. S'assurer que le dépliage UV est propre pour l'application de texture.
- **Gestion d'État :** Utiliser Zustand pour synchroniser les contrôles UI (Couleur, Modèle) avec la scène R3F.
- **Performance :**
  - Chargement différé (Lazy load) du modèle 3D.
  - Utiliser `useTransition` pour les mises à jour UI lourdes.
  - Debounce des entrées du sélecteur de couleur pour éviter la surcharge de re-rendu.
- **Remotion :** S'assurer que les dimensions de la composition correspondent à l'export cible (1080x1920).
