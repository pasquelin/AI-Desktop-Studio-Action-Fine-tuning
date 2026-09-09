# Parcours P044 à P063

Vingt parcours déclaratifs, 155 étapes, avec paramètres du catalogue et lecteurs réels. Aucun identifiant d'objet, de document, de compte ou de mémoire n'est inventé : les valeurs viennent des réponses précédentes par référence. Chaque projet est créé dans le bac à sable invité. Aucune exécution n'est revendiquée par ce document.

## Huit parcours sans blocage métier déclaré

- **P044** : carte clavier/manette concrète, écriture/lecture identique et carte témoin intacte.
- **P047** : ajout de Movement, vitesse à 3, lecture par `studio.describe`, retrait ciblé. `scene.state` ne publie pas les composants : ce lecteur ne peut pas servir d'oracle pour eux.
- **P052** : initialisation Git locale, index limité au fichier Hero, commit exact et liste des fichiers du commit. Requiert une identité Git configurée dans l'invité.
- **P055** : modification de priorité, stash, lecture de la version restaurée, pop et absence de stash restant. Même prérequis Git.
- **P056** : deux mémoires propres au projet, liaison, relecture, rappel, carte de contexte.
- **P057** : oubli d'une mémoire et suppression de sa carte, conservation d'une mémoire témoin. `memory.read` lit la ligne archivée avec l'état `dropped` : l'oubli n'est pas une suppression physique.
- **P061** : découverte du contrat de modification de composant et documentation de Movement depuis le catalogue courant.
- **P062** : refus attendu à la deuxième action d'un lot invalide, puis contrôle du témoin distinctif seul, inchangé. Le lot MCP est validé intégralement avant effets ; ce cas ne prétend pas démontrer l'atomicité face à une erreur métier survenant après cette validation.

Sans blocage déclaré ne signifie pas réussite : le banc doit exécuter les actions et vérifier toutes les assertions dans la VM. Tous les fichiers gardent `trainingApproved: false`.

## Douze parcours préparés mais bloqués

| Parcours | Ce qui manque pour une preuve complète |
| --- | --- |
| P045 | Personnage riggé et animation Idle réellement importés, mesure de retargeting disponible. Le graphe est spécifié et relisible. |
| P046 | Oracle d'identifiants distincts et de référence partagée, composition jouable. Le nombre de nœuds seul est insuffisant. |
| P048 | Signal explicite de disponibilité du runtime après `play.start`, qui répond volontairement avant le démarrage effectif. |
| P049 | Liaison du script au personnage, démarrage et mesure du comportement ; le round-trip du texte est déjà spécifié. |
| P050 | Jeu prêt et contrôle indépendant des transitions, de la cible et du témoin. Utilise la liste `transitions` et le type `cut`, car un événement simple ignore le champ scène. |
| P051 | Ressources d'export et lancement effectif du jeu exporté ; confirmer le chemin de sortie retourné. |
| P053 | Dépôt bare local et deux clones jetables produisant un conflit contrôlé ; empreintes initiales pour l'annulation. |
| P054 | Distant bare sous le bac à sable, branche autorisée et comparaison réelle de sa référence. Aucun distant réseau autorisé. |
| P058 | Compte invité dédié et choix concret d'un réglage à modifier avec témoin ; aucun compte de l'hôte. |
| P059 | Lecture indépendante de l'état plein écran et restauration de l'état initial. Les panneaux sont déjà vérifiés par `panels.list`. |
| P060 | Microphone synthétique, autorisation invitée, état et transcription attendus. Aucun micro personnel. |
| P063 | Véritable arrêt/redémarrage du processus Studio entre fermeture et réouverture, contrôle des octets persistés et absence de rejeu. Fermer le projet n'est pas redémarrer Studio. |

Un parcours bloqué ne doit pas exécuter silencieusement son préambule et être marqué réussi : le moteur doit signaler son blocage avant tout effet.

## Sources vérifiées en lecture seule

Catalogue exporté du compagnon et handlers Studio : `projectHandlers.ts`, `gameHandlers.ts`, `assemblyHandlers.ts`, `playHandlers.ts`, `scriptHandlers.ts`, `gitHandlers.ts`, `memoryHandlers.ts`, `contextHandlers.ts`, `settingsHandlers.ts`, `shellHandlers.ts`, `studioHandlers.ts`, `executor.ts`, `timelineHandlers.ts`, `sceneStateHandler.ts`. Formes métier : `inputMap.ts`, `animationGraph.ts`, `componentRegistry.ts`, `git.ts`, `memoryStatements.ts`, `projectJsonStore.ts`.

La vérification statique confirme que les 155 actions existent, que leurs paramètres nommés existent et que leurs champs obligatoires sont présents. Elle ne remplace ni la résolution réelle des références ni les validations métier dans la VM.

## Liaisons et vérification statique complémentaire

Les vingt fichiers déclarent `requiredBindings: []` : leurs références proviennent exclusivement de `sandbox`/`projectPath`, fournis par le moteur, ou d'une réponse/observation enregistrée par une étape précédente. Les prérequis de ressource restent dans `requires`/`blockers` ; une recherche de personnage dans une scène vide n'est pas considérée comme une fixture disponible.

Vérification supplémentaire : 160 champs littéraux respectent leur schéma MCP ; 47 champs dynamiques ont une référence racine déjà disponible, mais leur type et leur valeur ne pourront être validés qu'après résolution dans la VM. Les paramètres obligatoires et les noms de champs ont aussi été contrôlés. Le JSON du lot volontairement invalide de P062 reste une chaîne conforme au schéma externe ; son deuxième appel doit être refusé par Studio.

## Audit contre les retours à un état par défaut

P062 pouvait accepter une scène vide après un refus : une lecture retombée sur DEFAULT aurait satisfait zéro nœud. Il contient maintenant un témoin `Batch Witness` à (7, 2, -4), lu avant le lot puis relu après avec même document, même nœud et même position ; le nombre attendu est un. Une évaluation locale de l'oracle avec `nodes: []` est rejetée. Source : `sceneStateHandler.ts` publie `documentId`, `nodes` et les transformations distinctes ; `executor.ts/planCall` refuse le deuxième enum avant effet.

Tous les préambules de création vérifient maintenant `studio.state.project.path` et `projectKnown` avant toute opération métier, au lieu de se contenter de l'existence du dossier. Source : `stateHandlers.ts/studioSnapshot` publie le projet actif et son état connu.

P044 et P055 comparent également le JSON lu directement sur disque à leurs cartes explicitement non vides et leurs priorités distinctives. Source : `projectJsonStore.ts` écrit le document JSON validé dans le chemin relatif fourni. P047 utilisait déjà vitesse 3 plutôt que la valeur Movement par défaut 1 ; son oracle décrit le même identifiant et ses composants.

P061 inclut désormais `Discovery Witness` et vérifie l'identité de la scène décrite ; une description générique du studio ou une scène vide ne suffit plus. P063 porte une position non nulle (7, 2, -4) en plus du nom du cube ; son blocage de redémarrage réel reste présent. Les autres parcours bloqués ne sont pas devenus exécutables par ces renforcements. Les vérifications restent statiques : aucun résultat VM n'est déduit.
