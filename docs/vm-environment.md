# Environnement de test macOS isolé

Statut : scripts de préparation et de build implémentés ; recette réelle non exécutée. Voir [le mode d’emploi et les limites](vm-usage.md). Aucun scénario métier ni entraînement lancé.

## Choix retenus

Tart sur le Mac hôte, image macOS Sequoia vanilla. L’image préparée contiendra uniquement le système et les outils nécessaires au build de Studio. Le premier démarrage devra confirmer la compatibilité réelle de Studio, de ses modules natifs et de son rendu 3D. Cette VM Apple Silicon ne valide pas les Mac Intel ni toutes les versions de macOS.

Une seule VM de test à la fois, proposition initiale de 4 CPU et 16 Gio de RAM, à ajuster après mesure. Ces limites ne garantissent pas l’absence de ralentissement sur le Mac hôte.

## Cycle d’une série

1. Vérifier Tart, l’image locale, la place disponible et l’absence d’une autre série active.
2. Créer une copie jetable de l’image de référence, identifiée comme appartenant à ce dépôt. Ne jamais travailler dans l’image de référence.
3. Via une copie temporaire dédiée sur l’hôte, récupérer la tête distante de `develop` de Studio. Enregistrer sa révision exacte puis utiliser cette révision pendant toute la série, même si la branche évolue.
4. Installer les dépendances avec le lockfile de cette révision et sa version déclarée de pnpm. Construire Studio dans la VM. Un échec arrête la série ; ne pas revenir silencieusement à une ancienne version.
5. Avant le transfert des sources, régénérer le catalogue depuis ce même checkout et vérifier sa fraîcheur. Aucun catalogue d’une autre révision ne doit servir à évaluer cette version.
6. Pour le futur lot de scénarios, lancer Studio dans la VM avec ses données et projets de test. Collecter les résultats dans un dossier propre à la série.
7. Extraire les rapports autorisés puis arrêter la copie. Après succès, la supprimer ; après échec, conserver au plus une copie arrêtée pour diagnostic. Le nettoyage ne vise que les copies enregistrées par cet orchestrateur.

`develop` signifie dernière version publiée en développement, pas version garantie stable. Les modifications locales non poussées ne sont pas incluses.

## Isolation

- Aucun montage du dossier personnel, du checkout de travail ou des projets réels dans la VM.
- Aucun transfert du trousseau, de session iCloud ou de clés SSH personnelles.
- Si le dépôt privé exige une authentification, prévoir un accès de lecture dédié et révocable ; ne pas l’intégrer à l’image de référence ni aux rapports.
- La VM possède son propre compte, son profil Studio et son disque. Les projets jetables sont créés sur ce disque.
- Des ports et points de connexion distincts doivent empêcher le pilote de joindre le Studio de l’hôte. Vérifier l’identité de l’instance avant toute action.
- L’absence de dossiers partagés ne coupe pas le réseau. Autoriser le réseau pour la préparation ; définir et vérifier séparément les restrictions réseau du futur lot de scénarios.
- Le téléchargement du code et des dépendances nécessite Internet. L’entraînement supervisé ultérieur lit des exemples enregistrés ; il est séparé de cette VM.

## Préparation de l’image

Installer Git et les outils de compilation Apple en ligne de commande, Node et pnpm aux versions compatibles avec le projet. Ne pas installer Xcode complet sans besoin démontré. Ne pas télécharger de modèles.

Le script de préparation devra être relançable, vérifier les versions et journaliser ses étapes. Les autorisations macOS requises au premier démarrage seront listées lorsqu’elles seront effectivement rencontrées.

La lecture du manifeste actuel de Studio montre un postinstall pour son identité de développement et ses décodeurs, des modules natifs, ainsi qu’une récupération de sources du moteur dans la commande de démarrage. Le provisionnement doit examiner ces scripts avant exécution : la procédure `--ignore-scripts` du compagnon ne suffit pas à produire automatiquement une installation fonctionnelle de Studio.

Après recette, figer l’image avec une version et une empreinte. Ne pas tirer une nouvelle image `latest` à chaque série ; mettre à jour explicitement la référence, puis refaire sa recette.

## Traçabilité et erreurs

Un rapport de préparation doit enregistrer : image et empreinte, version macOS, architecture, versions des outils, révision Studio, empreinte du lockfile, empreinte du catalogue, ressources affectées, étapes réussies ou échouées et codes de sortie. Aucun secret dans les arguments journalisés.

Distinguer préparation réussie, build réussi et scénarios réussis. Avant que les scénarios existent, aucun rapport ne peut annoncer une réussite métier.

## Lots à implémenter

1. Contrat de configuration et vérification des prérequis, avec tests hors ligne des entrées invalides et des refus de ciblage.
2. Provisionnement relançable de la copie de préparation, puis recette réelle dans la VM téléchargée.
3. Orchestration des copies jetables, verrou d’exécution, récupération de révision, build, rapports et nettoyage contrôlé ; tests des échecs et interruptions.
4. Scénarios métier dans un lot distinct, après preuve d’isolation et de sauvegarde sur le disque invité.

La recette réelle reste nécessaire : les tests unitaires de l’orchestrateur ne prouvent ni le rendu graphique ni l’isolation effective.

Sources des images : https://tart.run/quick-start/ et https://github.com/cirruslabs/macos-image-templates.
