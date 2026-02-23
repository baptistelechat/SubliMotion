# Étude de Marché : Générateur de Contenu Instagram pour Mugs Personnalisés

**Date :** 16/02/2026
**Auteur :** Business Analyst (Trae AI)
**Projet :** SubliMotion

## 1. Résumé Exécutif

Le projet "SubliMotion" vise à construire un outil spécialisé pour les petits créateurs (comme la mère de l'utilisateur) afin de générer du contenu Instagram de haute qualité (images, vidéos/Reels) pour des mugs personnalisés par sublimation. Bien qu'il existe plusieurs générateurs de mockups 3D génériques, il y a un manque important d'outils "social-first" qui automatisent l'ensemble du flux de création de contenu — de la visualisation 3D à l'export prêt pour Instagram (légende, hashtags, format).

**Opportunité Clé :**
Les outils existants se concentrent sur la "génération de mockups" (rotation statique/simple). L'opportunité réside dans l'"automatisation du contenu" (scènes lifestyle, montage vidéo dynamique, métadonnées sociales).

## 2. Paysage Concurrentiel

### Concurrents Directs (Générateurs de Mockups 3D)

| Concurrent | Fonctionnalités Clés | Prix | Points Forts | Points Faibles |
|------------|----------------------|------|--------------|----------------|
| **Placeit** | Bibliothèque massive, mockups vidéo | Payant (Abonnement) | Standard de l'industrie, haute qualité | Générique, filigrané, cher pour un usage occasionnel |
| **Mockey.ai** | Gratuit, 10+ animations, UI simple | Gratuit/Payant | Bon pour des mockups rapides, compatible mobile | Personnalisation limitée, modèles génériques |
| **Pacdora** | Focus packaging 3D, export 4K | Freemium | Haute fidélité, bon rendu des matériaux | UI complexe, ciblé pour les professionnels du packaging |
| **Mug3D.com** | Dédié aux mugs, rotation | Gratuit | Spécialisé, simple | Visuels basiques, UI datée, options d'export limitées |
| **Canva** | Intégration Smart Mockups | Freemium | Écosystème massif, édition facile | Capacités 3D limitées comparées aux outils dédiés |

### Concurrents Indirects (Outils Réseaux Sociaux)

- **Onlypult/Later** : Outils de planification, mais manquent de *création* de contenu spécifique pour les produits 3D.
- **Instagram Native** : Bon pour l'édition, mais nécessite des photos de produits physiques ou du contenu externe.

## 3. Analyse des Écarts Fonctionnels

| Fonctionnalité | Concurrents (Moy.) | Proposition "SubliMotion" | Avantage |
|----------------|--------------------|---------------------------|----------|
| **Visualisation 3D** | Rotation Standard | **Navigation POV** (Angles Spécifiques) | WYSIWYG pour des besoins d'export spécifiques |
| **Export Vidéo** | Rotation Simple (MP4) | **Reels Dynamiques** (Zoom, rebond, transitions) | Meilleur engagement sur Instagram |
| **Contexte** | Fonds Statiques | **Presets Lifestyle/Contextuels** | Look "professionnel" instantané sans compétences en design |
| **Flux de Travail** | Télécharger -> Éditer -> Poster | **"Instagrapi-Ready"** (Légende + Tags) | Supprime la friction, délai de publication plus rapide |
| **Expérience Utilisateur** | UI orientée Design | **Zéro-Clic / Drag & Drop** | Accessible pour les utilisateurs non-tech (Mamans/Créateurs) |

## 4. Faisabilité Technique & Recommandations

### Stack Technique
- **Moteur 3D :** Three.js / React Three Fiber (R3F) pour la 3D web.
- **Génération Vidéo :** Remotion pour la création programmatique de vidéos (Reels).
- **Export :** Enregistrement côté client (MediaRecorder API) ou rendu côté serveur pour une haute qualité.

### Recommandations Stratégiques
1. **Focus sur le "Reel-First"** : Le plus grand différenciateur est la vidéo. Utilisez Remotion pour créer des exports vidéo dynamiques basés sur des modèles qui ressemblent à des Reels montés professionnellement.
2. **Spécialisation sur les "Mugs"** : N'essayez pas d'être un outil de mockup généraliste. Optimisez l'éclairage, les matériaux (brillance céramique) et la physique de l'anse spécifiquement pour les mugs afin de battre les outils génériques sur la qualité.
3. **Automatiser le "Travail Fastidieux"** : Incluez un générateur de légendes (basé sur l'IA ou des modèles) et des ensembles de hashtags pour que l'utilisateur exporte un package "prêt à poster".

## 5. Prochaines Étapes
- **Phase de Planification** : Définir les "Modèles de Reels" spécifiques et les "Fonds Lifestyle" pour la V1.
- **Spécification Technique** : Choisir entre le rendu côté client (moins cher) ou côté serveur (meilleure qualité) pour la vidéo.
- **Prototype** : Construire un POC utilisant R3F pour tester l'application de texture "Zéro-Clic".
