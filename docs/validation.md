# Validation de la fondation

9 septembre 2026 — macOS arm64, Node 24.8.0, pnpm 12.3.4, npm 11.16.0.

- Installation propre finale : `pnpm install --frozen-lockfile --ignore-scripts` réussie via npm exec avec pnpm 12.3.4. Un seul lockfile conservé : `pnpm-lock.yaml`.
- Validation complète : `pnpm run validate` et `npm run validate` réussies.
- Biome : règles recommandées actives, avertissements bloquants, `any` interdit. Test négatif sur un fichier temporaire incorrect : rejet confirmé, fichier retiré.
- TypeScript strict : réussi.
- Vitest : 25 tests réussis (15 configuration, 10 hygiène).
- Commande de configuration : JSON malformé refusé avec code de sortie 1.
- Régression : les validateurs inactifs faisaient échouer 22 cas avant leur implémentation.
- Contrôle Git des candidats et `git diff --check` : réussis.

CI Linux/Windows/macOS configurée mais non exécutée à distance. Aucun modèle, entraînement ou lancement de l’application. Les contrôles d’hygiène portent sur les noms, types et tailles des fichiers présents ; ils ne sont pas un détecteur complet de secrets ni une analyse des blobs déjà placés dans l’index.

Les formats d’épisodes/catalogue/rapports, le banc métier, les datasets, l’entraînement et l’export seront livrés avec leurs tests dans les lots suivants. Aucun script simulant ces capacités n’a été ajouté.
