# Cycle essais et entraînement — plan d’implémentation

**Objectif :** relier sélection des parcours, exécution VM, preuves, export approuvé et entraînement LoRA versionné.

**Architecture :** conserver le moteur VM et les contrats d’export existants. Un contrôleur d’exécution unique orchestre les commandes autorisées, publie son état, refuse les lancements concurrents et ne retente jamais silencieusement une action métier. L’interface consomme ce contrôleur après sa revue.

**Contraintes :** ne pas modifier React pendant sa revue ; ne pas modifier les données pour masquer un bug Studio ; aucun entraînement sur un échec ; pas de commit/push implicite ; français et quinze langues conservés.

## 1. Exécution depuis l’interface
- [ ] Créer src/execution/controller.ts et tests/execution-controller.test.ts : une exécution à la fois, état des parcours, arrêt, échec bloquant, historique.
- [ ] Ajouter un adaptateur de processus utilisant le lanceur VM existant sans shell ni arguments libres.
- [ ] Exposer lancement/état/arrêt sur des routes JSON locales avec contrôles d’origine.
- [ ] Unifier la signification de l’activation : aucun choix enregistré vaut désactivé pour une campagne ; le lancement explicite reste une opération distincte, affichée comme telle.
- [ ] Brancher les contrôles React après libération des fichiers par la revue.

## 2. Réouverture Studio
- [ ] Examiner le fichier GLTF réellement produit et la validation document:read ; identifier si le rejet porte sur la requête ou le contenu.
- [ ] Corriger dans le dépôt propriétaire ou remettre un diagnostic précis à son agent, puis vérifier la révision publiée exécutée.
- [ ] Rejouer le parcours entier, sans attente artificielle ni faux succès.

## 3. Couverture des scénarios
- [ ] Inventorier les blocages effectifs des 63 parcours et les classes de 5165 fiches ; conserver la distinction entre fiche et test exécutable.
- [ ] Ajouter les préparations et vérifications manquantes par famille, avec contre-exemple qui échoue volontairement.
- [ ] Exécuter les parcours disponibles et publier réussites, échecs et non exécutés séparément.

## 4. Données multilingues
- [ ] Relire les demandes et paramètres dans les quinze langues ; ne pas approuver automatiquement une traduction.
- [ ] Relier chaque conversation au rapport réel et à son contenu figé.
- [ ] Vérifier les partitions par famille avant export, y compris toutes les traductions et paraphrases d’un même cas.

## 5. LoRA et comparaison
- [ ] Ajouter un lanceur qui exige un export approuvé frais et un modèle MLX disponible ; refuser les poids Ollama comme substitut implicite.
- [ ] Enregistrer une configuration et un dossier d’adaptateur propres à chaque entraînement.
- [ ] Évaluer avant/après sur les mêmes demandes réservées ; ne pas promouvoir une version automatiquement.
- [ ] Exécuter la validation finale du dépôt et les essais réels ; documenter tout blocage sans le convertir en succès.
