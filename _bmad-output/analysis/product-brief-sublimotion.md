# Product Brief : SubliMotion

**Date :** 16/02/2026
**Auteur :** Business Analyst (Trae AI)
**Projet :** SubliMotion
**Statut :** Validé

## 1. Le Problème (The Why)

- **Observation :** Créer du contenu Instagram engageant (Reels) pour des mugs personnalisés est complexe et nécessite plusieurs outils fragmentés (générateur de mockup + éditeur vidéo + rédaction).
- **Pain Point :** Les outils actuels sont soit trop génériques (manque de réalisme céramique), soit statiques (pas de vidéo), soit trop complexes techniquement.
- **Impact :** Une perte de temps considérable et une friction élevée pour publier régulièrement des nouveautés.

## 2. La Solution (The What)

- **Concept :** Une application web "Social-First" dédiée qui transforme un simple fichier image (design de mug) en un pack Instagram complet et prêt à publier.
- **Différenciateur Clé :** L'automatisation complète des **Reels Instagram** (vidéo dynamique) combinée à un rendu 3D ultra-réaliste spécifique aux mugs.

## 3. Cible (The Who)

- **Cœur de cible :** Créatrice amatrice de mugs sublimés (ex: la mère de l'utilisateur).
- **Profil :** Peu technique, cherche l'efficacité et l'effet "Waouh" immédiat.
- **Critère de Succès :** "Publier un Reel de qualité professionnelle en moins de 2 minutes".

## 4. Fonctionnalités Clés (The How)

### A. Expérience Utilisateur (Zero-Friction)

- **Zero-Click Apply :** Drag & drop du design -> application immédiate sur le modèle 3D.
- **Interface Simplifiée :** Pas de réglages complexes (lumière, caméra), juste des choix de "Presets".

### B. Visualisation 3D (Spécialisation Mug)

- **Moteur :** React Three Fiber (R3F).
- **Rendu :** Matériaux céramique optimisés (brillance, reflets).
- **Navigation POV :** Boutons d'accès rapide aux vues clés (Face, Anse, Haut, Bas).

### C. Génération de Contenu (Reel-First)

- **Reel Templates :** Modèles d'animation vidéo pré-configurés (Zoom dynamique, Rotation 360°, Transitions).
- **Social Ready :** Export incluant le fichier vidéo (MP4) + une proposition de légende et de hashtags pertinents.

## 5. Contraintes & Stratégie Technique

### Modèle Économique

- **Phase 1 :** Outil interne gratuit (Usage personnel/famille).
- **Phase 2 :** Potentiel SaaS public (Freemium).

### Architecture & Hébergement

- **Hébergement :** Vercel (Free Tier).
- **Stratégie de Rendu Vidéo (Remotion) :**
  - **Problème :** Le rendu côté serveur (Lambda) coûte cher et les Serverless Functions Vercel ont un timeout de 10s (trop court pour la vidéo).
  - **Solution Retenue :** **Enregistrement Côté Client (Client-Side Recording)**.
  - L'application utilisera le `<Player>` Remotion dans le navigateur et capturera le flux canvas (via MediaRecorder API) pour générer le MP4. Cela permet un hébergement 100% gratuit et évite les limites de temps serveur.

## 6. Prochaines Étapes (Phase Planification)

1.  **Tech Spec :** Valider la stack R3F + Remotion Player + MediaRecorder.
2.  **Design :** Maquetter les "Reel Templates" (Scénarios d'animation).
3.  **Prototype :** POC de l'import d'image sur le mug 3D.
