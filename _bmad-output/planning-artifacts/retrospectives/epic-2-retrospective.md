# Rétrospective Épopée 2 - Configuration du Rendu (Customization)

**Date:** 2026-02-18
**Participants:** Developer, Product Manager, Scrum Master
**Statut:** En cours de rédaction

## Résumé Exécutif
L'Épopée 2 a permis d'ajouter les fonctionnalités de personnalisation essentielles : le choix des couleurs (anse/intérieur) et la sélection de templates vidéo. L'intégration avec le store Zustand et la scène 3D s'est déroulée sans problème majeur.

## Ce qui s'est bien passé (Successes)
- **Gestion d'État (Zustand) :** L'extension du store `useSceneStore` pour inclure les états de couleur et de template a été simple et efficace.
- **Modularité :** La création de composants dédiés (`ColorControls`, `TemplateSelector`) a permis de garder le code propre et maintenable.
- **Réactivité :** Les changements de couleur sont instantanés sur le modèle 3D, offrant une excellente expérience utilisateur.
- **Architecture R3F :** La structure mise en place lors de l'Épopée 1 a facilité l'ajout de nouvelles propriétés aux matériaux du modèle.

## Ce qui pourrait être amélioré (Challenges)
- **Préparation du Modèle 3D :** Il a fallu s'assurer que le modèle GLTF permettait bien de cibler spécifiquement les matériaux de l'anse et de l'intérieur.
- **Interface Utilisateur :** L'intégration des nouveaux contrôles dans l'interface existante a nécessité quelques ajustements pour ne pas surcharger la vue.

## Leçons Apprises (Lessons Learned)
- **Props vs State :** Passer les couleurs via les props aux composants 3D (ou via le store) est très performant avec R3F tant qu'on évite les re-renders inutiles du canvas entier.
- **Typage :** Le typage strict des templates et des options de couleur aide à prévenir les erreurs à l'utilisation.

## Actions à Entreprendre (Action Items)
- [ ] **Préparation Épopée 3 :** Étudier les solutions d'export vidéo (Remotion ?) pour l'US 3.2. C'est le gros morceau technique à venir.
- [x] **Stratégie Mobile :** Analyse effectuée (voir `analysis/mobile-strategy-analysis.md`). Décision prise de bloquer temporairement l'accès mobile (Desktop Only) pour se concentrer sur l'Épopée 3. Une Story "Écran de blocage mobile" sera ajoutée au backlog.
- [x] **Refactoring éventuel :** Si le nombre d'options grandit, envisager une configuration plus générique pour les matériaux.

## Conclusion
L'Épopée 2 est validée. Nous avons maintenant une application capable de visualiser et personnaliser le produit. La prochaine étape (Épopée 3) sera critique car elle apporte la valeur finale : l'export vidéo.
