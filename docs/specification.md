> Cadrage initial conservé comme référence historique. Pour le statut et les choix actuels, lire [les décisions](decisions.md) et [les étapes](roadmap.md). Les mentions « aucun développement » décrivent la rédaction initiale.

# Spécification du pilote

Statut : proposition à approuver. Les formats ci-dessous sont des interfaces futures du compagnon ; les noms d’actions cités existent dans le checkout vérifié.

## Périmètre : 26 actions

| Famille | Actions retenues | Contraintes de scénario |
| --- | --- | --- |
| Découverte et documents — 7 | `actions.find`, `studio.state`, `documents.list`, `document.open`, `document.activate`, `document.rename`, `document.save` | Projet jetable préparé ; chemins locaux observés ; refus de confirmation testés sur renommage/sauvegarde |
| Scène — 7 | `scene.state`, `node.add`, `node.rename`, `node.transform`, `node.setVisible`, `node.setMeshMaterial`, `node.remove` | Primitives et matériaux sans texture distante ; scène active ; animation inactive au départ |
| Image — 12 | `canvas.state`, `layer.add`, `layer.remove`, `layer.select`, `layer.rename`, `layer.setOpacityBlendAndVisibility`, `layer.transform`, `layer.duplicate`, `layer.reorderInStack`, `layer.editTextLayer`, `layer.group`, `layer.ungroup` | Calques synthétiques ; police embarquée ; pas d’asset distant |

La clarification utilise `ask`, pas une 27e action. La sélection de cible peut être un identifiant découvert, sans modifier la sélection visuelle. `node.remove` et `layer.remove` ne demandent pas automatiquement un consentement selon leur engagement `none` : l’ambiguïté doit néanmoins interrompre l’action. Les essais se déroulent sur des fixtures jetables.

La liste autorisée bloque toute autre action avant son dispatch, y compris les commandes génériques pouvant contourner ce périmètre. Enregistrer l’appel interdit comme une erreur du modèle, même si le blocage a protégé le projet. `actions.find` et les ouvertures de manuels peuvent être traités dans le cerveau : les tracer séparément des actions métier. Ne pas filtrer artificiellement leur contenu en prétendant reproduire le produit actuel.

## Composants et frontières

1. **Adaptateur du checkout** : reçoit un chemin explicite et une révision attendue ; refuse une révision différente ou des sources modifiées. Lit le registre réel, `schemaOfFields`, `readInput`, `createLocalBrain` et le banc. Aucun chemin personnel codé en dur.
2. **Export du catalogue** : conserve ordre, familles, noms internes, textes traduits employés par le prompt, champs, contraintes, engagements, portée et capacités. Distingue schéma interne et schéma MCP. Un export JSON Schema ne remplace pas `readInput`, qui admet certaines normalisations.
3. **Capture locale** : enveloppe la dépendance `chat` de `createLocalBrain`. Copie les `messages` effectivement reçus, contexte demandé, options, réponse brute et durée. Exclut les objets non sérialisables (`signal`, callbacks), en enregistrant séparément arrêt et progression.
4. **Rejeu des parcours** : fournit les réponses de référence à cette même frontière, exécute les handlers et captures de résultats réels, compare état final et modifications autorisées. Aucun résultat d’outil inventé pour faire réussir la suite.
5. **Évaluation modèle** : remplace uniquement la réponse de référence par le port llama réel. Le banc et les oracles restent identiques. Libère ressources et stores entre scénarios.
6. **Préparation MLX** : transforme les tours approuvés en exemples d’apprentissage ; vérifie tokenizer, découpage et absence de fuite. Ne transmet jamais les oracles au modèle.
7. **Entraînement et livraison** : adaptateur → fusion → conversion → quantification → réévaluation cible. Logiciels d’entraînement réservés au développeur.

L’import direct des modules du banc dépend d’alias TypeScript, de ports de test et du runtime natif. Le lot 1A doit en démontrer le chargement sans copie du métier. Si ce n’est pas possible proprement, une petite entrée de banc dans un worktree de l’application devra être autorisée séparément ; ne pas reconstruire son exécuteur dans le compagnon.

## Contrats de fichiers proposés

| Fichier / version | Champs obligatoires et règles |
| --- | --- |
| `catalogue.v1.json` | `schemaVersion`, `appRevision`, `sourceHashes`, `catalogueHash`, `language`, `actions[]` ; chaque entrée conserve `name`, `family`, `fields`, `commitment`, `reach`, descriptions et capacités disponibles |
| `episode.v1.json` | `schemaVersion`, `episodeId`, `familyId`, `splitGroup`, `executionPath`, `appRevision`, `catalogueHash`, `fixtureId`, `fixtureHash`, `utterances`, `turns`, `provenance`, `oracle` |
| Un élément `turns` | `turnId`, `attemptId`, `request` sérialisée, `rawReply`, `parsedReply` ou faute, `executions[]`, `elapsedMs`, `termination` ; chaque exécution porte index causal, appel, résultat intégral ou état non exécuté |
| `provenance` | Origine script/humain/enseignant, version du générateur, modèle enseignant éventuel, correction et approbation, empreinte de contenu ; aucune identité personnelle requise |
| `oracle` | Référence du vérificateur, conditions finales, différences permises, objets témoins à préserver ; accessible seulement au contrôleur |
| `run.v1.json` | Modèle/révision/hash, quantification, application, environnement, configuration d’inférence, corpus/split, métriques, résultats par épisode et causes d’échec |

Les identifiants issus du décor ne peuvent être utilisés dans une réponse de référence qu’après présence dans un message effectivement visible ou résultat exposé au modèle. Stocker un lien de provenance par référence. L’oracle a accès à l’état complet ; la conversation conserve exactement le résumé que le produit fournit. Cette séparation évite de donner au modèle des informations privilégiées.

Les traces brutes servent au diagnostic, pas toutes à l’apprentissage. Les réponses invalides ne sont jamais des cibles positives. Un exemple de récupération peut conserver un refus réel dans son entrée puis une réponse corrigée comme cible. Un jeton de consentement ne peut venir que du mécanisme autorisé ; ne pas injecter les jetons MCP dans le dialogue local, dont la confirmation passe par l’application. Refus humain : aucune modification, aucune relance identique pour contourner le refus.

## Format destiné à MLX-LM

Un parcours est une suite causale de tours ; il peut produire plusieurs lignes JSONL. Pour chaque invocation approuvée, copier les messages exacts capturés puis ajouter un dernier message `assistant` dont `content` est la réponse JSON de référence. Les résultats d’actions restent dans l’historique rendu par le produit, sans conversion en messages `tool`.

Le chargeur MLX-LM accepte `messages` ; son option de masquage du prompt permet de ne calculer la perte que sur la dernière réponse. Vérifier les tokens effectivement masqués et le token de fin dans la version retenue. Ne pas tronquer silencieusement un appel ou une réponse pour faire tenir l’exemple. [Format et masquage officiels](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md).

Exemple de **réponse**, pas de conversation d’entraînement complète :

```json
{"say":"","ask":null,"calls":[{"action":"node.add","input":{"kind":"box","name":"Repère"}}]}
```

Après exécution et vérification, une réponse terminale possible est :

```json
{"say":"Le cube Repère est ajouté.","ask":null,"calls":[]}
```

Ces réponses seules ne sont pas un corpus : leur contexte et les résultats doivent provenir du rejeu. Préférer un `say` vide avant une mutation à une réussite annoncée avant son résultat.

## Trois parcours de référence

**Ajouter puis renommer.** Décor : scène active et un objet témoin. Demande : « Ajoute un cube nommé Repère, puis appelle-le Socle. » Appel `node.add` avec `kind: "box"`, `name: "Repère"`. Le handler renvoie notamment `data.nodeId` en cas de succès. Le tour suivant utilise cet identifiant observé dans `node.rename` avec `name: "Socle"`, puis lit `scene.state`. Oracle : exactement un objet ajouté, type box, même identifiant renommé, témoin inchangé. Une seconde création ou un simple texte de succès échoue.

**Position relative à un autre objet.** Décor : cube à x=1 et sphère à x=-3, mêmes y/z ; demande « Place la sphère deux mètres à droite du cube. » Lire `scene.state`, identifier les deux objets, puis appeler `node.transform` sur la sphère avec `positionX: 3` et `relative: false`. Oracle : x=3 à 0,01 près, y/z et cube inchangés. `relative: true, positionX: 2` serait un déplacement depuis la sphère et doit échouer. Les scénarios animés restent hors du premier lot.

**Cible ambiguë.** Deux documents image contiennent un calque « Texte ». Demande sans document déterminable : « Renomme Texte en Titre. » Lire les documents/états accessibles puis retourner `ask` avec leurs noms et `calls: []`. Aucune mutation avant réponse. Tester réponse, annulation et absence de réponse. `play` ne consomme pas `Scenario.replies` comme `playMission` : adapter explicitement le pilotage de `useAssistant.choose` pour le chemin legacy, avec un délai borné, avant de qualifier ce scénario.

## Configuration reproductible proposée

Premier calcul : LoRA, rang 8, learning rate 1e-5, batch 1, graine 42, 20 étapes de preuve, checkpoints à 10 et 20 ; couches cibles et échelle rendues explicites après inspection du modèle MLX chargé. Ce sont des paramètres de départ à mesurer, pas une recette de qualité. Longueur : jusqu’à 8 192 tokens, à choisir selon les captures ; aucun exemple dépassant la limite sans décision explicite. Garder une marge pour la réponse dans le contexte total.

Versionner révision du modèle et tokenizer, empreinte du modèle de conversation, Python, MLX, MLX-LM, bibliothèques résolues, OS, matériel, paramètres complets et hashes des données. Désactiver le suivi distant. Le nombre d’étapes de l’adaptation réelle dépendra de la validation et du débit mesuré ; ne pas choisir les checkpoints sur le test réservé.

## Export, distribution et maintenance

Prouver d’abord la conversion de la base, puis celle d’un adaptateur réellement modifié par quelques étapes. Fusionner en poids non quantifiés avec configuration/tokenizer ; inspecter noms, formes et embeddings liés ; conversion llama.cpp F16/BF16 supportée, puis Q4_K_M candidat. Vérifier les messages multi-tours, le modèle de conversation réellement sélectionné, EOS et la grammaire dans node-llama-cpp 3.20.0. La simple présence d’un fichier GGUF ne suffit pas.

Comparer MLX base+adaptateur, poids fusionnés, GGUF non quantifié et GGUF quantifié sur un petit jeu d’export séparé du test final. Ne pas exiger une identité de texte entre moteurs ; exiger des réponses lisibles et les mêmes assertions fonctionnelles, puis mesurer les écarts.

Le paquet proposé contient GGUF, manifeste de compatibilité application/catalogue, hash, licence, notices et rapport. Modèles, checkpoints, logs bruts et données sensibles restent hors Git dans un répertoire utilisateur configurable. Seuls petits exemples synthétiques revus, schémas et configurations entrent dans Git. Conserver le paquet précédent et sa configuration ; une activation échouée revient au modèle précédent sans téléchargement implicite.

À chaque évolution du registre : comparer noms, champs, contraintes, descriptions et engagements ; invalider les familles d’exemples touchées ; régénérer et réévaluer. Ne réentraîner que si les mesures le justifient. Un changement de prompt ou de format invalide aussi la fidélité des captures. Les poids n’acquièrent jamais le pouvoir de contourner les validateurs.
