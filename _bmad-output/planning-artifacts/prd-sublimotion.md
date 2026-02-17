# Product Requirements Document (PRD) : SubliMotion

**Date :** 16/02/2026
**Statut :** Draft
**Version :** 1.0
**Auteur :** Product Manager (Trae AI)
**Sources :**

- [Product Brief](../analysis/product-brief-sublimotion.md)
- [Technical Stack](./technical-stack.md)

## 1. Résumé Exécutif (Executive Summary)

"SubliMotion" est une application web "Social-First" conçue pour transformer des designs de mugs (images plates) en contenu marketing engageant pour Instagram (Reels vidéo). Elle résout le problème de la fragmentation des outils et de la complexité technique pour les créateurs amateurs.

**Proposition de Valeur Unique :** Génération automatisée de vidéos 3D réalistes (Reels) directement dans le navigateur, sans compétences techniques ni frais de serveur élevés.

## 2. Objectifs Business & Succès

### Objectifs Principaux

1.  **Réduire la friction :** Permettre la création d'un Reel prêt à poster en < 2 minutes.
2.  **Qualité Visuelle :** Rendu céramique photoréaliste pour augmenter l'attractivité des produits.
3.  **Coût Zéro (Opérationnel) :** Architecture 100% client-side pour l'hébergement gratuit (Vercel).

### Métriques de Succès (KPIs)

- Temps de génération d'une vidéo < 30 secondes (sur machine moyenne).
- Taux de succès de l'export vidéo (pas de crash navigateur).
- Adoption par l'utilisateur cible (Créatrice amatrice).

## 3. Périmètre Fonctionnel (Functional Requirements)

### Épopée 1 : Import & Visualisation (Core)

- **US 1.1 - Drag & Drop Design :** L'utilisateur doit pouvoir glisser-déposer une image (JPG/PNG) sur la zone de travail pour l'appliquer instantanément sur le mug 3D.
- **US 1.2 - Prévisualisation 3D :** L'utilisateur doit pouvoir manipuler le mug (rotation orbitale) pour vérifier le placement du design.
- **US 1.3 - Vues Rapides :** Des boutons doivent permettre de s'aligner rapidement sur les faces clés (Face, Anse, Haut, Bas).

### Épopée 2 : Configuration du Rendu (Customization)

- **US 2.1 - Choix de Couleur :** L'utilisateur peut changer la couleur de l'anse et de l'intérieur du mug (presets ou color picker).
- **US 2.2 - Sélection de Template Vidéo :** L'utilisateur choisit parmi une liste de scénarios d'animation prédéfinis (ex: "Zoom In", "Rotation 360", "Slow Reveal").

### Épopée 3 : Génération & Export (Output)

- **US 3.1 - Prévisualisation Vidéo :** L'utilisateur peut jouer l'animation sélectionnée dans le navigateur avant l'export.
- **US 3.2 - Export MP4 :** L'application génère un fichier vidéo MP4 téléchargeable (1080x1920 pour Reels) via l'enregistrement client-side.
- **US 3.3 - Export Social Pack :** L'application fournit un texte de légende et des hashtags suggérés à copier-coller.

## 4. Contraintes Techniques & Non-Fonctionnelles

### Performance & Architecture

- **Client-Side Recording :** L'encodage vidéo doit se faire dans le navigateur (via Remotion + MediaRecorder API) pour éviter les coûts serveur.
- **Optimisation 3D :** Les modèles et textures doivent être optimisés pour ne pas faire laguer le navigateur (compression texture, low-poly si possible).

### Compatibilité

- **Navigateur :** Chrome/Edge/Firefox (Desktop recommandé pour la puissance de calcul, mais responsive mobile requis pour la consultation).
- **Stack Technique Imposée :** Next.js 15, React Three Fiber, Remotion, Tailwind CSS 4, Zustand.

## 5. Expérience Utilisateur (UX/UI Guidelines)

- **Philosophie :** "Zero-Config". Pas de réglages de caméra complexes, pas de timeline de montage vidéo traditionnelle. Tout fonctionne par "Presets".
- **Layout :**
  - **Gauche :** Contrôles (Upload, Couleurs, Templates).
  - **Centre :** Canvas 3D (Visuel Mug).
  - **Droite (ou Bas) :** Bouton d'action principal "Générer Reel".

## 6. Roadmap & Phasing

### Phase 1 : MVP (Interne)

- Fonctionnalités : Import image, 1 modèle de mug, 3 templates vidéo basiques, Export MP4.
- Cible : Usage personnel uniquement.

### Phase 2 : V1 Publique (SaaS)

- Fonctionnalités : Authentification, Sauvegarde des projets, Bibliothèque de modèles de mugs (Mug magique, Mug couleur), Abonnement Freemium.
- Cible : Petits e-commerçants.

### Phase 3 : Scale

- Fonctionnalités : Intégration API Instagram (post auto), Génération par lot (Bulk creation).

## 7. Risques & Mitigations

| Risque                     | Impact                                                                   | Mitigation                                                                       |
| :------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **Performance Navigateur** | Crash lors de l'export vidéo sur vieux PC.                               | Limiter la résolution ou la durée par défaut. Afficher un warning si WebGL lent. |
| **Qualité Vidéo**          | Artefacts de compression via MediaRecorder.                              | Tester différents bitrates et codecs (H.264 vs VP9).                             |
| **Compatibilité Mobile**   | Encodage vidéo impossible sur certains mobiles (iOS Safari limitations). | Cibler l'usage Desktop pour la création en Phase 1.                              |
