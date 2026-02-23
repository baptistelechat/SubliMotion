# Maquettes d'Interface (Wireframes)

**Date:** 2026-02-16
**Statut:** Proposition V1
**Objectif:** Simplicité radicale (User-Centric).

## Flux Utilisateur (User Flow)

1.  **Accueil** : Upload simple (Drag & Drop).
2.  **Éditeur** : Visualisation 3D + Ajustements rapides (POV, Fond).
3.  **Export** : Sélection des formats et Téléchargement ZIP.

---

## 1. Écran d'Accueil (Landing / Upload)

*Design épuré, focus unique sur l'action d'import.*

```text
+---------------------------------------------------------------+
|  [Logo SubliMotion]                                           |
|                                                               |
|                                                               |
|          +-----------------------------------------+          |
|          |                                         |          |
|          |           ZONE DE DRAG & DROP           |          |
|          |                                         |          |
|          |       [ Icône Upload Géante ]           |          |
|          |                                         |          |
|          |      Glissez votre image ici            |          |
|          |               ou                        |          |
|          |       [ BOUTON CHOISIR FICHIER ]        |          |
|          |                                         |          |
|          |      (JPG, PNG acceptés - Max 5MB)      |          |
|          |                                         |          |
|          +-----------------------------------------+          |
|                                                               |
|                                                               |
+---------------------------------------------------------------+
```

## 2. L'Éditeur (Main Workspace)

*Interface divisée : Visualisation centrale, Contrôles latéraux.*

```text
+---------------------------------------------------------------+
| [Logo]  < Retour                                [ BOUTON EXPORT ] |
+-----------------------+-----------------------+---------------+
|  OUTILS (Gauche)      |    CANVAS 3D (Centre) |  VUES (Droite)|
|                       |                       |               |
|  1. TEXTURE           |                       |  POINTS DE VUE|
|  [Aperçu Image]       |                       |               |
|  [Bouton Remplacer]   |        ___            |    [ FRONT ]  |
|                       |      C|   |           |               |
|  2. FOND              |       |___|           | [LEFT] [RIGHT]|
|  ( ) Blanc            |                       |               |
|  ( ) Couleur [Picker] |                       |    [ BACK ]   |
|  ( ) Cuisine          |                       |               |
|  ( ) Bureau           |    (Le Mug 3D est     |    [ ISO 1 ]  |
|                       |     manipulable       |    [ ISO 2 ]  |
|  3. OPTIONS           |     à la souris)      |               |
|  [ ] Afficher Grille  |                       |               |
|                       |                       |               |
|                       |                       |               |
|                       |                       |               |
+-----------------------+-----------------------+---------------+
```

**Détails des intéractions :**
*   **Drop Update** : On peut glisser une nouvelle image directement sur le mug pour la remplacer.
*   **POV Buttons** : Clic sur "FRONT" -> La caméra s'anime (smooth) pour se placer pile en face.
*   **Fond** : Changement immédiat du background.

## 3. Modale d'Export (Download Pack)

*S'ouvre au clic sur "BOUTON EXPORT".*

```text
+---------------------------------------------------------------+
|  PRÉPARER VOTRE PACK INSTAGRAM                                X |
+---------------------------------------------------------------+
|                                                               |
|  Contenu du ZIP :                                             |
|                                                               |
|  [x] IMAGES STATIQUES (JPG)                                   |
|      - Vue Face                                               |
|      - Vue Gauche/Droite                                      |
|      - Vue Iso                                                |
|                                                               |
|  [x] VIDÉO (MP4)                                              |
|      - Rotation 360° (5 sec)                                  |
|      - Format: [x] Carré (Post)  [ ] Vertical (Story/Reel)    |
|                                                               |
|  [x] METADATA                                                 |
|      - Fichier info.json (pour future automatisation)         |
|                                                               |
|  -----------------------------------------------------------  |
|                                                               |
|                [ TÉLÉCHARGER LE PACK (.zip) ]                 |
|                                                               |
+---------------------------------------------------------------+
```

## Notes d'implémentation UI

*   Utiliser **Shadcn UI** pour la modale (Dialog), les boutons et les switchs.
*   Les boutons POV doivent avoir des icônes claires (flèches ou cube d'orientation).
*   Feedback visuel fort lors du téléchargement (Barre de progression ou Spinner) car la génération vidéo Remotion peut prendre quelques secondes.
