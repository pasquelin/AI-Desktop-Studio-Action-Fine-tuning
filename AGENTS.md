# Travail dans ce dépôt

Lire `README.md`, `CONTRIBUTING.md` et `docs/decisions.md` avant modification.

- Respecter le lot demandé ; la fondation ne contient ni entraînement ni exécution de l’application.
- Réutiliser les contrats métier lors de l’intégration, sans copie simplifiée présentée comme équivalente.
- Aucun téléchargement de poids ou entraînement implicite.
- Tests de fondation hors ligne après installation.
- Tester les nouvelles règles et leurs rejets avant correction.
- Exécuter `npm run validate` après les derniers changements ; signaler les contrôles non exécutés.
- Pas de sous-agents ou de tâches multiples sans demande de l’utilisateur.
- Aucun commit, push ou merge sans autorisation.

## Organisation Git

Travail courant sur `develop` dans le dossier principal. `main` est réservée au déploiement. Aucun worktree additionnel ni branche de tâche sans demande explicite de l’utilisateur.
