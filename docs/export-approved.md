# Export LoRA avec approbation et preuve d'exécution

`node tools/export-approved.ts <reviewed-bundle.json> <current-scenario-manifest.json>` refuse tout le lot si une seule entrée est incomplète, périmée, non relue ou issue d'une exécution en échec. Il ne lance aucun entraînement.

Le manifeste courant fourni par l'exécuteur contient `scenarioHashes`, une table identifiant → SHA-256 du scénario exact. `catalogueHash` dans la preuve est le SHA-256 des octets du fichier catalogue, comme dans le runner VM ; le hash interne du catalogue est contrôlé séparément. Le catalogue local doit lui-même être cohérent avec son empreinte et le checkout Studio propre. Ce manifeste doit provenir du scénario actuel, jamais être reconstruit à partir d'une ancienne preuve pour la faire accepter.

## Contrat du lot

L'objet racine contient `seed` et `examples`. Chaque exemple fournit :

- `id`, `scenarioId`, `scenarioHash`, `group`, `relatedGroups` ; `split` est facultatif mais, s'il existe, doit correspondre à la partition stable.
- `messages` au format de conversation avec appels d'outils, réponses d'outils et réponse finale ; `tools` décrit les fonctions et leurs paramètres JSON Schema.
- `review` : `decision: "approved"`, `kind: "semantic-review"`, `reviewer` non vide et `contentHash`.
- `evidence` : `kind: "real-vm"`, `status: "passed"`, `runId`, `scenarioId`, `scenarioHash`, `contentHash`, `studioRevision`, `catalogueHash`, et une liste non vide de `checks` nommés, tous `passed: true`.

`approvedContentHash` calcule le SHA-256 canonique de `scenarioId`, `scenarioHash`, `group`, `relatedGroups`, `messages` et `tools`. Une correction de traduction ou d'arguments invalide donc la relecture et la preuve précédentes. Les identifiants de résultat d'outil doivent correspondre aux appels ; leurs arguments sont contrôlés avec leurs schémas.

La relecture sémantique est une décision explicite externe. Le script ne convertit jamais un statut de traduction automatique en approbation. Les métadonnées ne sont pas une signature : l'outil vérifie leur cohérence, pas l'identité du relecteur ni la véracité d'un fichier fabriqué. L'exécuteur et la personne qui approuve restent les sources de confiance.

## Partitions et publication

La partition est déterminée par `splitFor(group, seed)` ; toutes les traductions et paraphrases doivent partager ce groupe. Les groupes liés qui tomberaient dans des partitions différentes sont refusés, ainsi qu'un contenu identique présenté sous plusieurs groupes. La détection automatique ne remplace pas l'analyse sémantique des reformulations : déclarer correctement les groupes reste obligatoire.

Le lot entier est contrôlé avant écriture. Les trois fichiers `train.jsonl`, `valid.jsonl` et `test.jsonl`, ainsi qu'un manifeste de provenance, sont écrits dans un répertoire temporaire puis publiés ensemble par renommage. Chaque export possède un répertoire immuable dans `artifacts/dataset/approved-…` ; une ancienne sortie n'est jamais modifiée ni mélangée. Une partition peut être vide : cela n'autorise pas à lancer l'entraînement ou à prétendre disposer d'un jeu de validation suffisant.

Les tests utilisent uniquement des preuves synthétiques, clairement nommées. Ils démontrent le comportement du filtre, pas une réussite de Studio. Aucun corpus réel approuvé n'est fourni par ce lot.

## Rapport du banc de référence

Le parcours déclaratif enregistre les appels réellement joués et leurs réponses. Après réussite complète, il produit une conversation **en attente de revue** et un lien `conversationEvidence` avec empreinte exacte et contrôles nommés. Cette liaison ne constitue pas une approbation sémantique ; le brouillon est refusé par l'export tant qu'il reste pending. Les scénarios à refus attendu ne sont pas convertis automatiquement.

Le CLI relit le dossier VM géré, exige le succès complet et compare les preuves enregistrées au contenu demandé. Le manifeste courant est `artifacts/bench/preparation.json`, régénéré avec `npm run bench:check`. Les anciens rapports du parcours historique qui ne possèdent pas de lien de conversation restent refusés. Aucun corpus réel approuvé n'est fourni.
