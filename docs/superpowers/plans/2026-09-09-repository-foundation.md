# Base du dépôt — plan d'exécution

Périmètre autorisé le 9 septembre : préparer le compagnon, ses règles, son linter et ses tests. Travail dans le dossier visible sur une branche dédiée, un seul intervenant. Aucun entraînement ni téléchargement de poids.

Architecture : TypeScript pour préparer les contrats et réutiliser ensuite le banc de l'application. Configuration JSON validée par schéma. Python sera ajouté avec son environnement verrouillé au lot d'entraînement ; aucun script factice n'est créé.

Spécification de référence : [spécification du pilote](../../specification.md). Ce lot de fondation précède le lot 1A ; il ne prétend pas exporter le catalogue ou exécuter l'application.

- [x] Rapatrier les documents et consigner le choix multilingue Qwen3.5-2B / Qwen3-1.7B.
- [x] Installer avec pnpm (scripts également accessibles avec npm) et verrouiller TypeScript, Biome, Vitest et Ajv ; configurer le typage strict et la validation unique.
- [x] Écrire les tests de configuration : version inconnue, propriétés inattendues, langues/actions dupliquées, modèle candidat incohérent, limite invalide.
- [x] Constater leur échec puis implémenter le validateur du schéma et sa commande locale.
- [x] Tester puis implémenter le contrôle des fichiers Git : poids, secrets usuels, liens symboliques et fichiers trop volumineux.
- [x] Documenter conventions, frontières, commandes, étapes et statut réel ; ajouter la CI Linux/Windows/macOS.
- [x] Vérifier installation verrouillée, linter, typage, tests, configuration, hygiène et diff final. Aucun commit, push ou merge dans ce lot.

Critère de sortie : `npm run validate` réussit sans modèle, réseau ou application lancée. Les tests de cette fondation vérifient les contrôles locaux ; les parcours métier et performances restent à développer.
