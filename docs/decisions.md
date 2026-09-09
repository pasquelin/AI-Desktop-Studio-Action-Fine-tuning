# Décisions actuelles — 9 septembre 2026

Cette page prévaut sur les choix provisoires du cadrage initial.

1. **Fondation seulement.** Structure, conventions, dépendances verrouillées, linter, tests et CI. Le lot 1A complet et les calculs ne sont pas inclus dans ce résultat.
2. **Multilingue mondial.** Dix langues pour l’échantillon initial, à élargir. Comparer formulations, états et ambiguïtés ; ne pas confondre langues annoncées et fiabilité des actions.
3. **Candidats : Qwen3.5-2B et Qwen3-1.7B**, annoncés Apache 2.0. Cela remplace la préférence initiale pour Qwen3-4B. Aucun poids ou révision exacte installé/verrouillé. Compatibilité avec le moteur cible à vérifier.
4. **TypeScript strict, Node 24, pnpm 12.3.4, npm 11, Biome, Vitest, Ajv.** Selon la précision utilisateur, pnpm gère les installations et son lockfile unique ; npm peut aussi lancer les scripts. Le lanceur pnpm local était cassé ; la version exacte est accessible avec npm exec/npx sans changer l’installation globale. Python et son environnement verrouillé viendront au lot d’entraînement.
5. **Configuration minimale.** Le schéma contrôle la forme des noms d’actions, pas leur existence dans le registre. Les 26 noms viennent du cadrage ; l’export futur vérifiera la source. Les limites sont des paramètres futurs, aucun exécuteur n’existe ici.
6. **Résultats honnêtes.** Les tests prouvent les validations locales, pas les performances des modèles, le succès métier ou la compatibilité de tous les matériels.

Sources : [Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B), [Qwen3-1.7B](https://huggingface.co/Qwen/Qwen3-1.7B), [Luxand](https://www.luxand.com/llm-sdk/benchmarks/), [Data Turnstile](https://arxiv.org/abs/2607.29250). Les protocoles ne sont pas interchangeables.

Le moteur de tests est verrouillé sur Vitest 3.2.7 avec Vite 6.4.3. La première tentative Vitest 5 / Vite 8 perdait son composant Rolldown lors de `npm ci` ; la combinaison retenue a été vérifiée après réinstallation propre.

Organisation Git demandée : deux branches locales, `main` et `develop`. Le travail quotidien reste sur `develop` dans le dossier principal ; `main` est réservée aux versions à déployer. Les anciens worktrees de cadrage sont retirés après archivage vérifié de leurs documents hors dépôt. Cette règle prévaut sur les anciens plans mentionnant une branche par lot.

Lot suivant autorisé et réalisé : export seul, depuis le registre complet, sans scénarios. Le contrôle de fraîcheur est inclus dans la validation locale configurée. Voir `export.md` pour le périmètre exact et la distinction entre export et exécution.
