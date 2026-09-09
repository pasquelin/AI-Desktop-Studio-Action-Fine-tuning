# Règles de contribution

## Structure et écriture

- TypeScript strict, modules ESM, imports explicites. `unknown` aux frontières, validation avant usage. Pas de `any` ni de suppression de diagnostic pour masquer une erreur.
- Code et tests nommés en anglais ; documentation en français. Un fichier, une responsabilité. Séparer validation, lecture disque et métier.
- Biome est la référence pour TypeScript et JSON ; `.editorconfig` définit espaces et fins de ligne. Biome ne contrôle pas la rédaction Markdown.
- Pas de module vide, d’exécuteur factice ou de réussite simulée présentée comme réelle. Ajouter un composant lorsqu’un lot le rend fonctionnel.
- Réutiliser les handlers et schémas d’AI Desktop Studio, sans copier le métier. L’adaptateur futur devra vérifier la révision du checkout.

## Tests

- Une correction a un test qui reproduit l’échec ; une frontière teste entrées valides et rejets pertinents.
- Tester les comportements observables, pas le texte de documentation ou une copie de l’implémentation.
- Fondation sans modèle, application ni API distante. Les futurs tests d’intégration seront séparés.
- Exécuter `npm run validate` après la dernière modification. Tests `.only` interdits.
- Le test de lien symbolique est ignoré sur Windows, où sa création peut demander des privilèges particuliers.

## Données et dépendances

- pnpm pour installer et mettre à jour ; versions directes exactes et `pnpm-lock.yaml` versionné. Installation reproductible : `pnpm install --frozen-lockfile --ignore-scripts`. Les scripts acceptent aussi `npm run`. Ne pas générer de second lockfile avec `npm install`.
- Dépendances limitées au lot courant. Python, MLX et PyTorch attendent leur lot.
- Poids, checkpoints, données privées et traces brutes hors Git. Petites fixtures synthétiques et rapports relus seulement.
- Le contrôle de dépôt limite les fichiers candidats à 1 Mio et refuse certains noms sensibles, formats de poids et liens symboliques. Il ne détecte pas les secrets cachés dans du texte : relire le diff.
- Une configuration réseau désactivée n’est pas un pare-feu. L’isolation des évaluations futures devra être démontrée séparément.

## Livraison

- Travail courant directement sur `develop`, dans le dossier principal. `main` est réservée aux versions à déployer. Ne pas créer de branche supplémentaire ou de worktree sans demande explicite. Éviter toute écriture concurrente.
- Rapporter ce qui fonctionne, les contrôles exécutés et les limites.
- Commit, push, fusion, poids et entraînement sont des étapes distinctes à lancer selon l’autorisation de l’utilisateur.
