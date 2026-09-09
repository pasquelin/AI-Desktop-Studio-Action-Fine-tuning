# AI Desktop Studio Action Fine-tuning

Compagnon de préparation et d’évaluation d’un assistant local multilingue pour AI Desktop Studio.

**État : fondation du dépôt.** Linter, typage, tests et contrôles de configuration fonctionnent sans modèle. L’export du catalogue, les parcours dans l’application et l’entraînement ne sont pas encore implémentés.

## Démarrage

Prérequis : Git, Node **24.8 ou supérieur dans la branche 24**, pnpm **12.3.4** (npm **11** reste utilisable pour lancer les scripts). Aucun Python, GPU ou compte cloud nécessaire ici.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run validate
```

L’installation initiale nécessite Internet ; la validation utilise ensuite les fichiers locaux. Aucun poids à installer pour les tests.

| Commande | Fonction |
| --- | --- |
| `npm run validate` | Linter/formatage, typage, tests, configuration et hygiène Git |
| `npm run format` | Formatage et corrections sûres de Biome |
| `npm test` | Tests exécutés une fois |
| `npm run test:watch` | Tests pendant le développement |
| `npm run config:check` | Validation de la configuration |
| `npm run repo:check` | Noms, types et tailles des fichiers candidats Git |

Les scripts se lancent aussi avec `npm run` ; les installations et mises à jour utilisent pnpm et son unique lockfile. Si le lanceur pnpm local est indisponible : `npx --yes pnpm@12.3.4 install --frozen-lockfile --ignore-scripts`.

## Organisation

| Dossier | Responsabilité |
| --- | --- |
| `src/config/` | Validation des configurations |
| `src/repository/` | Contrôles d’hygiène |
| `tools/` | Commandes locales |
| `configs/` | Choix du pilote, sans chemins personnels |
| `schemas/` | Formats versionnés implémentés |
| `tests/` | Comportements et rejets |
| `docs/` | Décisions, étapes et cadrage initial contextualisé |

Modèle principal candidat : **Qwen3.5-2B** ; comparaison : **Qwen3-1.7B**. La configuration ne télécharge rien. Révisions, formats et empreintes seront fixés avant l’inférence. Les dix langues configurées sont un échantillon initial, pas une couverture mondiale démontrée.

Lire [les règles de contribution](CONTRIBUTING.md), [les décisions](docs/decisions.md) et [les étapes](docs/roadmap.md).

La licence du code n’est pas choisie : paquet privé `UNLICENSED`. Apache 2.0 concerne les modèles candidats, pas automatiquement ce code.

## Organisation Git

`develop` accueille le travail courant dans ce dossier. `main` est réservée aux versions à déployer. Aucun worktree supplémentaire.
