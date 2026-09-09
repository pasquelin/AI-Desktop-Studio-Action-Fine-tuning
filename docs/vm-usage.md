# Scripts VM — mode d’emploi

Statut : préparation, build et chargement de l’interface vérifiés dans une VM Sequoia. Le téléchargement de l’image et une première connexion SSH sont nécessaires. Aucun scénario métier ni modèle n’est lancé par ces commandes.

## Prérequis

Mac Apple Silicon, Tart, Git/SSH fonctionnels sur l’hôte et dépendances du compagnon installées. Accès en lecture au dépôt privé Studio avec l’identité habituelle de l’hôte. Image vanilla téléchargée comme VM locale, arrêtée, compte `admin` et connexion SSH activée (configuration des images Cirrus Labs). Au moins 30 Gio libres sur le volume des rapports ; vérifier aussi le volume Tart si différent. Ce seuil n’est pas une estimation du téléchargement ni une garantie de place suffisante pour tous les builds.

## Commandes

Depuis ce dépôt, dans un terminal interactif :

```sh
npm run vm -- check
npm run vm -- prepare --source NOM_LOCAL_IMAGE_TELECHARGEE
```

La préparation clone l’image locale sans la modifier, démarre la copie sans fenêtre ni partage, puis demande le mot de passe du compte invité une fois. Le mot de passe n’est ni stocké ni transmis dans les arguments. Une clé SSH réservée à ce banc est générée : seule sa partie publique entre dans la VM. Homebrew installe les outils de compilation Apple si nécessaires, puis Node 24, CMake, Python 3.13, pnpm et node-gyp — ces deux derniers dans un préfixe explicite. Une interaction macOS ou un échec d’installation reste possible et sera à résoudre lors de la recette réelle.

Le nom de la référence préparée apparaît dans le rapport. Pour construire la dernière version publiée de Studio :

```sh
npm run vm -- build --base NOM_REFERENCE_PREPAREE
```

Le dépôt privé est cloné temporairement sur l’hôte dans `artifacts/vm`, sans modifier le checkout de travail ni transférer ses identifiants à la VM. Le catalogue est automatiquement régénéré depuis cette révision précise, puis les sources sont transférées par SSH. L’installation et le build s’exécutent dans l’invité. Le catalogue et le rapport restent sur l’hôte, hors Git. Aucun remplacement du catalogue de travail du compagnon.

La série utilise les scripts et la politique de dépendances de cette version de Studio ; elle nécessite le réseau pour les dépendances. Les sous-modules et Git LFS ne sont pas pris en charge dans ce premier transfert : leur détection bloque la série.

Après succès, la copie de build est arrêtée et supprimée. La référence préparée est conservée arrêtée. Après erreur, une copie est conservée et bloque une nouvelle série tant qu’elle n’a pas été nettoyée :

```sh
npm run vm -- cleanup --name NOM_COPIE_EN_ECHEC
```

Le nettoyage refuse les VM non enregistrées comme appartenant à ce dépôt. Il conserve les rapports et la clé dédiée ; ne pas publier le dossier `artifacts`. Un verrou exclusif interdit deux opérations simultanées. Après un arrêt brutal du processus, vérifier et arrêter la VM concernée avant de retirer manuellement le verrou `artifacts/vm/active.lock`.

## Limites de cette livraison

- Le chargement de l’interface Studio est vérifié par son renderer local. Aucun test de rendu 3D ni de sauvegarde réelle effectué ; les scénarios métier restent à implémenter.
- Image référencée localement par un nom unique et un manifeste, sans vérification cryptographique complète de son disque. Ne pas la démarrer ni la modifier entre les séries ; une publication par digest OCI reste un lot ultérieur.
- Réseau NAT de Tart, sans pare-feu d’évaluation. Pas de partage de fichiers, de presse-papiers ou de son ; ce n’est pas une isolation réseau complète.
- La préparation choisit la dernière révision disponible de Node 24 via Homebrew ; ses dépendances ne constituent pas encore une image reproductible bit à bit. La référence préparée doit être conservée pour les comparaisons.
- SIGINT/SIGTERM interrompent les commandes locales puis déclenchent l’arrêt de la copie ; une interruption brutale ou une panne de Tart peut nécessiter un arrêt manuel.
- La première confiance SSH est enregistrée dans un fichier réservé à la copie, puis exigée lors du transfert. Aucun fichier SSH personnel n’est modifié.

Voir [le cadrage](vm-environment.md). Les scripts constituent le premier lot de préparation et de build, pas encore le banc d’évaluation complet.


## Enchaînement automatique

`npm run vm:run` réutilise la référence préparée disponible, ou la prépare depuis l’image locale `sequoia-vanilla`, puis construit automatiquement la dernière version publiée de Studio. Aucun build manuel. En présence de plusieurs références prêtes, la sélection explicite reste nécessaire pour éviter un choix silencieux.

La préparation a été exécutée avec succès dans la VM Sequoia le 9 septembre 2026 (Node 24.20.0 et pnpm 12.3.4). La construction et le chargement de l’interface ont ensuite réussi dans une copie jetable.


### Recette réelle du 9 septembre 2026

La copie de build a récupéré Studio à la révision `8031cd23b2c81bc26a63d9d4f8235653a140355c`, installé ses dépendances et produit 674 fichiers dans `out`. Le renderer a répondu avec un document chargé, une racine montée et le titre AI Desktop Studio. Le contenu de `results/` de l’invité est rapatrié dans `artifacts/vm/<nom>/results/`, en succès comme en échec : `build.json`, `startup.json` et les journaux `build.log` et `startup.log`. Les deux rapports indiquent explicitement qu’aucun scénario métier n’a été exécuté.

Corrections issues de cette recette : chemin du fichier SSH de confiance correctement cité lorsqu’il contient des espaces, installation de pnpm dans un préfixe explicite, node-gyp disponible pour les modules natifs, arrêt macOS avec synchronisation du disque, nettoyage acceptant une copie déjà arrêtée. La copie de build a été supprimée après succès ; l’image initiale et la référence préparée sont arrêtées.

Chaque build démarre désormais Studio pour vérifier que son interface monte. Il ne s’agit pas encore d’une validation fonctionnelle de l’ensemble de l’application.

## Observer le bureau invité

Le suivi démarre automatiquement avec `npm start` (ou `pnpm start`). `npm run vm:run` conserve le contrôle de démarrage seul. L’adresse complète est affichée dans le terminal. Un serveur local déjà actif est réutilisé ; il reste accessible après la fin du test. La commande séparée `npm run vm:observe` est facultative.

Le parcours prend une capture après chaque action, avec son résultat. L’observateur consulte cette liste sans déclencher de photos. L’ordre est chronologique, avec la dernière en bas ; un clic ouvre la modale. Seule la dernière session est conservée, et fermer la page ne stoppe pas le test.

Le suivi visuel se met à jour après chaque action du parcours : aucune capture périodique, aucun bouton de rafraîchissement. La consultation régulière de la liste ne crée pas de nouvelles images. Les captures portent le nom de l’action et son résultat, et seule la dernière session est conservée. La palette et le logo de l’observateur proviennent du thème sombre de Studio.

## Premier parcours métier

`npm run vm:scenario` construit la dernière révision distante de `develop` dans une copie jetable, puis exécute le parcours de référence : créer un projet, créer une scène, ajouter/renommer/déplacer un cube, sauvegarder, rouvrir, renommer le projet, retirer/remettre dans les récents et mettre à la corbeille. Les actions passent par le serveur MCP de Studio et les confirmations attendues sont acceptées explicitement dans son interface. Aucun modèle ni entraînement n'est utilisé.

Le parcours refuse de fonctionner hors d'une VM macOS ou si ses projets existent déjà. Il utilise un profil dédié et un dossier de projets jetables dans la VM. Le rapport `results/scenario.json` distingue les étapes réussies et échouées ; les journaux sont rapatriés même en cas d'échec. Une VM en échec est arrêtée et conservée pour diagnostic.

Les scripts invités sont figés au démarrage et conservés avec le rapport. Une relecture peut donc continuer pendant l'exécution ; une correction ultérieure nécessite une nouvelle exécution. Un résultat ne valide que la version exécutée.

## Écran et captures

Chaque nouvelle copie utilise un espace de travail de 1920 × 1080 points, fixe même si le panneau d’observation change de taille. macOS peut produire davantage de pixels physiques en mode Retina.

Avant chaque capture, la fenêtre de Studio ou de Welcome est mise au premier plan et ses animations sont attendues via le moteur de rendu. L’image elle-même est prise par `screencapture`, lancé dans la session Aqua de l’invité : **la VM de référence doit avoir accordé l’autorisation macOS « Enregistrement de l’écran »**, sans quoi la première capture échoue. Une capture couvre donc l’écran, pas uniquement la fenêtre mise au premier plan.

Au premier lancement, le banc parcourt les étapes Welcome et vérifie la persistance de sa fin avant d’attendre Studio visible. Cela couvre le chemin Continuer/Terminer avec les options initiales, pas toutes les variantes de configuration proposées.
