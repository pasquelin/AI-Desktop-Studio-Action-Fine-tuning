# État Debug / QA et entraînement

Point du 10 septembre 2026. Les tests du code ne constituent pas une validation de tous les scénarios dans Studio.

## Debug / QA livré

- Sélection explicite d'un modèle installé dans Ollama local ; aucun téléchargement implicite ni fournisseur distant.
- Contrôles de disponibilité du modèle et de la VM avant lancement.
- Campagnes séquentielles : tous les scénarios, parcours activés, recette courte ou parcours précis. Les prérequis manquants restent visibles comme blocages.
- Arrêt après le scénario courant et option d'arrêt au premier échec.
- Aperçu VM partagé, étapes, journaux, captures et diagnostic lisible ; les détails techniques restent dans le rapport.
- Rapports locaux séparés : `rapports/debug/`, avec synthèses de campagne dans `rapports/debug/campagnes/`.

Le mode actuel est une **QA guidée** : le modèle reçoit l'outil et les paramètres de référence de l'étape. Le banc contrôle sa proposition, exécute l'action et vérifie le résultat métier. Ce mode teste la conformité des propositions et le comportement de Studio ; il ne démontre pas une planification autonome du parcours complet. Un échec peut provenir du modèle, de Studio, du scénario ou de l'environnement : la cause doit être étayée par les preuves.

## Scénarios

L'inventaire contient **5 165 cas de conception et 63 parcours**. Ce ne sont pas 5 228 tests opérationnels. Les cas sans plan exécutable et les parcours dont les prérequis manquent sont bloqués. Le nombre de parcours jouables dépend des fichiers et capacités actuels ; seul un rapport d'exécution prouve le résultat d'un essai précis.

Les fiches sont recherchables par famille, tags et actions via un index léger. Les sources de scénario sont séparées des rapports. Les brouillons multilingues ne deviennent pas des données d'entraînement par leur seule présence.

## Entraînement LoRA : préparation, pas entraînement réalisé

Le modèle cible de l'entraînement est indépendant du modèle choisi pour la QA. MLX-LM et MLX sont installés. Un lanceur local existe avec contrôles des preuves, de la relecture et des partitions ; les rapports associés vont dans `rapports/entrainement/`.

Blocages constatés :

1. Aucun corpus approuvé `train.jsonl`, `valid.jsonl`, `test.jsonl` dans les dossiers vérifiés. Les manifestes d'exemples indiquent zéro exemple approuvé et doivent être actualisés après les évolutions de Studio.
2. Aucun chemin de poids MLX compatible configuré. Aucun poids trouvé dans les emplacements vérifiés ; les modèles Ollama ne remplacent pas directement ces fichiers.
3. Le lancement LoRA est raccordé à la page Entraînement : préparation des exemples admissibles, contrôle des chemins locaux, lancement explicite et rapports séparés. Le raccordement est testé avec des processus simulés ; aucun entraînement réel n'a été lancé.
4. Le calcul de comparaison avant/après et la promotion d'un adaptateur restent à raccorder. Un calcul terminé n'est pas une amélioration démontrée.

La suite exige des conversations exactes, relues et liées à des preuves admissibles, des partitions disjointes et un modèle compatible. Les réussites de QA guidée ne sont pas automatiquement exportées pour entraîner. Aucun entraînement ni téléchargement de poids n'a été lancé pour ce lot.

## Vérification réelle du 10 septembre

Le parcours P003 a réussi ses 13 étapes avec Qwen 3.8 local, après remise à zéro de Studio dans la VM. Création, sauvegarde, fermeture, réouverture et relecture du contenu ont passé leurs contrôles. Le rapport et ses 17 captures sont dans `rapports/debug/77644922-a0ed-45a8-bf44-5d167ec40aac/`. Cette réussite porte sur ce parcours, pas sur tout l’inventaire.

La validation compagnon passe avec 258 tests. Le contrôle de fraîcheur signale encore la revue métier nécessaire des scénarios depuis les évolutions de Studio ; le catalogue technique est à jour.
