# Plan d’implémentation du pilote assistant local

> Exécution future par un seul intervenant, lot par lot, après accord utilisateur. Aucun sous-agent, installation, téléchargement, entraînement, commit ou modification source n’est autorisé par ce plan.

**Objectif :** démontrer une spécialisation utile et distribuable sans reconstruire l’assistant existant.

**Architecture :** le compagnon importe les contrats et le banc d’un checkout identifié. Il capture la frontière `chat` du vrai cerveau local et évalue les effets avec le vrai exécuteur sur des fixtures. Le calcul MLX reste séparé du moteur d’inférence final.

**Technologies proposées :** TypeScript pour contrats/banc, Python et MLX-LM pour apprentissage, llama.cpp pour conversion, node-llama-cpp 3.20.0 pour la preuve cible.

**Spécification :** [specification.md](../../specification.md). **Critères :** [evaluation.md](../../evaluation.md).

## Contraintes globales

- Écrire seulement dans le compagnon autorisé. Toute modification de l’application passe par un worktree source autorisé et ses instructions propres.
- Ne pas modifier l’identité Git. Aucun commit, push ou fusion sans demande ultérieure.
- Aucune requête réseau pendant un épisode ; logiciels et modèles provisionnés dans un lot explicitement autorisé.
- Réutiliser `createLocalBrain`, `readReply`, `readInput`, le registre et les handlers. Ne pas recopier les prompts dans un second moteur.
- Identifier révision, données, tokenizer, configuration et poids de chaque résultat.
- Distinguer `legacy` et `mission` ; le premier pilote cible `legacy`.
- Tous les fichiers ci-dessous sont **prévus**, pas créés à cette étape documentaire.

## Arborescence cible simple

```text
docs/                         dossier présent
package.json                  commandes du compagnon
tsconfig.json                 alias explicites du checkout
vitest.config.ts              environnement et ports du banc
configs/
  pilot.json                  source attendue, 26 actions, limites
  training.yaml               paramètres MLX complets
  evaluation.json             seuils et réglages figés
schemas/
  catalogue.schema.json
  episode.schema.json
  run.schema.json
tools/
  appAdapter.ts               imports contrôlés, révision et validations
  catalogue.ts                export et comparaison du registre
  capture.ts                  requêtes exactes et causalité
  replay.ts                   références, confirmations et oracles
  evaluate.ts                 parcours avec inférence réelle
  dataset.ts                  qualification, dédoublonnage, splits, JSONL
  train.py                    lancement local reproductible
  export.py                   fusion, conversion et manifeste
tests/
  contracts.test.ts
  replay.test.ts
  dataset.test.ts
  export.test.ts
fixtures/pilot/               12 décors et références synthétiques
manifests/                    provenance, hashes et décisions de versions
reports/                      petits rapports relus, sans traces sensibles
```

Prévoir un `artifactRoot` local configurable, hors dépôt : poids, adaptateurs, corpus privé, checkpoints, traces brutes. Ajouter au lot 1A un `.gitignore` pour environnements, caches et sorties accidentelles ; un contrôle refuse les gros binaires et données privées dans les fichiers destinés à Git. Pas de gros fichiers dans Git LFS par défaut.

## Lot 1A — catalogue fidèle et 12 parcours sans modèle

**Autorisation demandée maintenant : développement du compagnon uniquement, sans installation ni calcul modèle.** Utiliser les dépendances déjà disponibles si elles conviennent ; si elles manquent, produire le diagnostic et demander le provisionnement précis. Un test non exécuté reste explicitement non exécuté.

**Fichiers :** `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `configs/pilot.json`, les trois `schemas/`, `tools/appAdapter.ts`, `tools/catalogue.ts`, `tools/capture.ts`, `tools/replay.ts`, `tests/contracts.test.ts`, `tests/replay.test.ts`, `fixtures/pilot/`, `reports/lot-1a.md`.

**Interfaces proposées :** `loadApp(sourceRoot, expectedRevision)` expose registre, `schemaOfFields`, `readInput`, constructeur du cerveau, banc et types existants ; `exportCatalogue(app)` produit le catalogue v1 ; `captureChat(chat, sink)` garde la signature `ChatRequest → Promise<string>` ; `replayEpisode(app, episode)` produit un rapport v1 avec résultats des oracles. Ne pas charger le port natif pendant l’export du catalogue.

- [ ] Lire le checkout et ses règles ; vérifier révision et propreté sans exécuter ses points d’entrée HTTP. Configurer les alias et imports dans le compagnon. Prouver un import du registre sans effet de bord.
- [ ] Exporter toutes les actions avec l’ordre du registre et les descriptions réelles ; dériver séparément le schéma interne et le schéma MCP. Détecter les divergences entre union statique, registre et portée publiée, sans imposer aveuglément le nombre 310.
- [ ] Valider noms, champs, énumérations, contraintes, références et engagements. Cas négatifs explicites : action inexistante, champ inconnu, mauvais type, valeur hors borne, référence absente et champ MCP `consent` introduit dans un appel local.
- [ ] Capturer chaque appel `chat`, y compris les reprises internes, sans reformater les messages. Lier appels proposés, exécutés, refusés et non exécutés par identifiants causaux.
- [ ] Construire les 12 parcours du plan d’évaluation à partir de `Scenario.setup` et des handlers réels. Vérifier la découverte des identifiants avant usage. Oracles indépendants de `say`.
- [ ] Ajouter la liste autorisée avant dispatch et un arrêt borné. Vérifier le traitement particulier de `actions.find` dans le cerveau. Piloter une question legacy avec `choose`, puis annulation ; ne pas attendre indéfiniment une réponse utilisateur dans un test.
- [ ] Contrôler chaque oracle avec un faux succès intentionnel ; clôturer les ressources dans un `finally` après succès, refus, erreur et délai dépassé.
- [ ] Produire le rapport 1A : contrat exporté, 12 résultats, fidélité des messages, limitations du banc, éventuel besoin d’un point d’entrée source.

**Tests observables proposés**, à écrire puis vérifier sur l’implémentation finale :

```text
export(registre) conserve chaque nom, champ, engagement et famille
captureChat(requête) conserve les messages à l’identique, dans le même ordre
readInput(node.add, {kind: "teapot"}) refuse
rejeu(ask + appel valide) ne modifie aucun objet
rejeu(appel hors liste) ne rejoint jamais le handler
oracle renommage refuse un objet différent portant le nom attendu
oracle ajout refuse deux nouveaux cubes au lieu d’un
```

**Contrôle de sortie :** seuil 1A de l’évaluation. Les commandes futures du compagnon seront `catalogue:export`, `episodes:check`, `episodes:replay` et `test`, déclarées dans `package.json` ; elles n’existent pas encore. Pas de lancement de la suite de l’application pendant ce cadrage.

## Lot 1B — première évaluation réellement locale

**Dépendance :** 1A accepté ; accord explicite pour dépendances et poids manquants. Pas d’apprentissage.

**Fichiers :** `tools/evaluate.ts`, `configs/evaluation.json`, `manifests/runtime.json`, compléments `tests/replay.test.ts`, `reports/baseline.md`.

**Interface :** `evaluate(app, modelArtifact, episodes, config)` renvoie le même rapport que le rejeu, plus mesures. `modelArtifact` contient chemin local, hash, taille et format ; aucune résolution automatique distante.

- [ ] Inventorier modèle/binaire déjà disponibles, sinon présenter tailles et versions à acquérir. Verrouiller celles approuvées dans le manifeste.
- [ ] Raccorder la dépendance `chat` au vrai `electronLlamaPort`/runtime et à un chemin local. Vérifier chargement, EOS, historique de plusieurs messages `user`, grammaire et limites d’arrêt.
- [ ] Exécuter les 12 cas, trois fois, avec capture et réseau refusé. Rapporter temps froid/chaud, mémoire et chaque échec.
- [ ] Comparer avec les références scriptées et vérifier le seuil 1B. Si Qwen2.5 7B est disponible, même protocole en comparateur distinct.

**Livrable observable :** une demande locale provoque une modification contrôlée via le vrai moteur, et une demande ambiguë attend. La réussite du banc reste distincte de celle de l’interface graphique.

## Lot 1C — prouver très tôt l’export

**Dépendance :** 1B exploitable ; accord explicite pour environnement MLX, convertisseur et micro-entraînement de 20 étapes. Ce lot précède le gros corpus.

**Fichiers :** `tools/train.py`, `tools/export.py`, `configs/training.yaml`, `tests/export.test.ts`, `manifests/export.json`, `reports/export.md`.

**Interface :** le lancement reçoit uniquement chemins locaux, verrou de versions et configuration ; l’export rend un manifeste liant base, adaptateur, poids fusionnés et GGUF par hashes. Aucun upload.

- [ ] Verrouiller révisions exactes du modèle, tokenizer, MLX-LM et convertisseur ; vérifier les options de ces versions. Inspecter les paramètres LoRA effectifs et enregistrer le masque des tokens de réponse.
- [ ] Convertir la base non adaptée et vérifier son chargement dans le moteur cible avant apprentissage.
- [ ] Faire le micro-apprentissage autorisé, sauvegarder l’adaptateur et constater que ses paramètres ont effectivement évolué ; mesurer mémoire et secondes par étape.
- [ ] Fusionner sans `--export-gguf` MLX pour Qwen ; inspecter poids/configuration Hugging Face, notamment embeddings liés ; convertir ensuite avec llama.cpp, puis quantifier.
- [ ] Exécuter les dix cas d’export à chaque étape, contrôler tokenizer/template/EOS et seuils 1C. Conserver les logs et tailles ; ne pas utiliser le test final pour réparer l’export.

**Livrable observable :** le moteur actuel lit une réponse issue de poids réellement adaptés et convertis. Cela prouve la chaîne, pas un gain de qualité. Si cette chaîne échoue, arrêter avant d’investir dans le corpus et proposer un changement ciblé de version ou de voie d’entraînement.

## Lot 2 — corpus qualifié et réserve indépendante

**Dépendance :** 1C accepté ; accord sur le volume et la provenance.

**Fichiers :** `tools/dataset.ts`, `tests/dataset.test.ts`, `manifests/dataset.json`, `manifests/splits.json`, `reports/dataset.md`.

**Interface :** `buildDataset(approvedEpisodes, splitManifest)` écrit `train.jsonl`, `valid.jsonl`, `test.jsonl` sous `artifactRoot` et un rapport de rejet. Aucun oracle dans les `messages`.

- [ ] Étendre les familles jusqu’aux 26 actions, varier formulations et états, maintenir les témoins et refus ; qualifier chaque famille avant multiplication.
- [ ] Rejouer les références ; rejeter identifiants inventés, réponses non canoniques et contrôles faibles. Réviser les démonstrations sans inventer des résultats d’exécuteur.
- [ ] Grouper les lignées avant split, rechercher doublons, geler la réserve. Tester qu’une reformulation ne passe pas dans un autre jeu et que chaque exemple conserve sa provenance.
- [ ] Exporter un exemple par invocation, prompt masqué et réponse finale complète ; compter tokens, rejeter toute troncature silencieuse et fuite d’oracle.

**Livrable :** 500–1 500 parcours acceptés ou inventaire explicite des écarts, volumes en tokens et rapport de qualité. Un corpus plus petit mais fiable peut justifier un premier essai, sans prétendre respecter l’enveloppe initiale.

## Lot 3 — adaptation et comparaison contrôlée

**Dépendance :** données et budget calcul approuvés ; seuils gelés.

**Fichiers :** compléments `tools/train.py`, `tools/evaluate.ts`, `configs/training.yaml`, `reports/pilote.md`, `manifests/model.json`.

- [ ] Estimer la durée sur les mesures 1C avec longueurs représentatives. Fixer plafond d’étapes et critères d’arrêt ; conserver base et meilleur checkpoint de validation.
- [ ] Entraîner localement sans suivi distant ; sélectionner sur validation et non sur test.
- [ ] Exporter base et modèle adapté avec la même précision et le même protocole ; exécuter le test réservé répété.
- [ ] Rapporter réussite, régressions, incertitude, performance et causes d’échec. Appliquer les critères de poursuite/arrêt avant de proposer une intégration.

**Livrable :** preuve de gain ou conclusion documentée que l’adaptation n’apporte pas assez. Aucun succès n’est garanti.

## Lot 4 — proposition d’intégration, distincte du compagnon

**Dépendance :** pilote accepté et autorisation spécifique de modifier l’application dans un worktree isolé. Relire `AGENTS.md` et les règles source applicables ; y exécuter les validations prescrites après les derniers changements.

| Modification source éventuellement nécessaire | Justification et contrôle |
| --- | --- |
| Nouvelle entrée `scripts/banc/assistantLocal.banc.ts`, configuration du banc si import externe impraticable | Expose un lancement local réutilisant `play`, sans recopier le métier ; contrat d’export stable vers le compagnon |
| Capture dans `brainLocal.ts` seulement si envelopper `chat` depuis le banc ne suffit pas | Journal exact facultatif et désactivé par défaut ; vérifier qu’il ne change pas les messages ni ne collecte de données utilisateurs sans activation |
| `src/shared/domain/localModels.json` et assets/catalogue associés selon les règles source | Déclare le paquet validé et son hash ; test de chargement hors ligne et retour au modèle précédent |
| Ajustement du prompt/périmètre, seulement si les tests démontrent le besoin | Résoudre la tension hors périmètre ; nouvelle baseline avant de comparer l’apprentissage |

Ces modifications sont des alternatives conditionnelles, pas un lot de refonte autorisé. Le premier essai de chargement peut utiliser un chemin local dans le banc sans modifier le catalogue utilisateur.

- [ ] Préparer le manifeste du modèle et ses notices, sans publier le paquet.
- [ ] Réaliser les dix vérifications Electron décrites dans l’évaluation, avec ouverture/réouverture réelle et réseau refusé.
- [ ] Prouver activation et retour arrière, documenter profils matériels mesurés.
- [ ] Présenter l’intégration et les contrôles à l’utilisateur avant toute décision de commit, fusion ou diffusion.

## Revue du plan

Ce plan couvre catalogue, données fidèles, 26 actions, clarification/consentement, entraînement reproductible, export, évaluation, maintenance et ressources. Les inconnues d’import et de conversion ont chacune un lot de preuve avant investissement important. Aucun résultat modèle n’a été produit. **Décision suivante : autoriser 1A seulement.**
