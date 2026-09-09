# Tâches et coûts — 7 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer identifiant et transitions de tâche, consommation et annulation ; distinguer attente, échec et résultat disponible.

## models.readGenerationModelFields — Lire les entrées d’un modèle

Rend les champs qu’un modèle de génération accepte, avec leur nature et leurs bornes, tels que le studio en construit son formulaire. C’est de quoi remplir les paramètres d’une génération préparée.

- Nom MCP : `models_readGenerationModelFields`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"inputs":["generationModelCandidates"],"returns":["generationModelCandidates"]}`.
- Batterie existante : 44.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `modelId` | text | True | `{"reference":"model"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["modelId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `models.readGenerationModelFields/001` | Nominal minimal : demander « Lire les entrées d’un modèle » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `models.readGenerationModelFields/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `models.readGenerationModelFields/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `models.readGenerationModelFields/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `models.readGenerationModelFields/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `models.readGenerationModelFields/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `models.readGenerationModelFields/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `models.readGenerationModelFields/008` | Paramètre modelId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `models.readGenerationModelFields/009` | Paramètre modelId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `models.readGenerationModelFields/010` | Texte modelId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `models.readGenerationModelFields/011` | Cible modelId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cost.estimate — Estimer ce que coûterait une génération

Chiffre un modèle et un jeu de paramètres sans rien lancer. Ses paramètres prennent la forme que rend models_readGenerationModelFields. Ne répond aucun montant là où l’API refuse de chiffrer ce modèle, plutôt que d’inventer un nombre.

- Nom MCP : `cost_estimate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 44.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `modelId` | text | True | `{}` |
| `parameters` | raw | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["modelId","parameters"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cost.estimate/001` | Nominal minimal : demander « Estimer ce que coûterait une génération » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cost.estimate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cost.estimate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cost.estimate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cost.estimate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cost.estimate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cost.estimate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cost.estimate/008` | Paramètre modelId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cost.estimate/009` | Paramètre modelId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cost.estimate/010` | Texte modelId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cost.estimate/011` | Paramètre parameters absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cost.estimate/012` | Paramètre parameters avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## job.readCloudGeneration — Lire une tâche

Répond une génération entière — son état, où elle en est, ce qu’elle a produit, ce qu’elle a coûté et pourquoi elle a échoué le cas échéant. Demandé « le résultat de ma dernière génération », c’est ceci qui dit comment elle s’est PASSÉE ; l’image ou le modèle 3D qu’elle a produit est dans le catalogue du projet.

- Nom MCP : `job_readCloudGeneration`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 44.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `jobId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["jobId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `job.readCloudGeneration/001` | Nominal minimal : demander « Lire une tâche » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `job.readCloudGeneration/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `job.readCloudGeneration/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `job.readCloudGeneration/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `job.readCloudGeneration/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `job.readCloudGeneration/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `job.readCloudGeneration/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `job.readCloudGeneration/008` | Paramètre jobId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `job.readCloudGeneration/009` | Paramètre jobId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `job.readCloudGeneration/010` | Texte jobId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## job.waitForCloudGeneration — Attendre la fin d’une tâche

Attend qu’une génération réussisse, échoue ou soit annulée, puis la rend avec les assets produits. Rend la tâche telle quelle si l’attente expire, ce qui est une réponse et non un échec.

- Nom MCP : `job_waitForCloudGeneration`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 20.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `jobId` | text | True | `{}` |
| `timeoutMs` | integer | False | `{"min":1000,"max":110000}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["jobId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `job.waitForCloudGeneration/001` | Nominal minimal : demander « Attendre la fin d’une tâche » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `job.waitForCloudGeneration/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `job.waitForCloudGeneration/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `job.waitForCloudGeneration/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `job.waitForCloudGeneration/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `job.waitForCloudGeneration/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `job.waitForCloudGeneration/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `job.waitForCloudGeneration/008` | Paramètre jobId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `job.waitForCloudGeneration/009` | Paramètre jobId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `job.waitForCloudGeneration/010` | Texte jobId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `job.waitForCloudGeneration/011` | Paramètre timeoutMs absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `job.waitForCloudGeneration/012` | Paramètre timeoutMs avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## job.cancelCloudGeneration — Annuler une tâche

Arrête une génération encore en file ou en cours. Ce qui a déjà été dépensé n’est pas rendu.

- Nom MCP : `job_cancelCloudGeneration`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 44.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `jobId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["jobId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `job.cancelCloudGeneration/001` | Nominal minimal : demander « Annuler une tâche » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `job.cancelCloudGeneration/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `job.cancelCloudGeneration/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `job.cancelCloudGeneration/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `job.cancelCloudGeneration/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `job.cancelCloudGeneration/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `job.cancelCloudGeneration/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `job.cancelCloudGeneration/008` | Paramètre jobId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `job.cancelCloudGeneration/009` | Paramètre jobId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `job.cancelCloudGeneration/010` | Texte jobId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## task.cancelLocalTask — Annuler un travail local

Arrête un travail que le studio mène sur cette machine — un rendu, une importation, une indexation — et le fichier à moitié écrit avec lui. Répond si l’un tournait encore, ce qu’un identifiant déjà terminé n’est pas.

- Nom MCP : `task_cancelLocalTask`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 44.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `taskId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["taskId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `task.cancelLocalTask/001` | Nominal minimal : demander « Annuler un travail local » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `task.cancelLocalTask/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `task.cancelLocalTask/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `task.cancelLocalTask/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `task.cancelLocalTask/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `task.cancelLocalTask/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `task.cancelLocalTask/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `task.cancelLocalTask/008` | Paramètre taskId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `task.cancelLocalTask/009` | Paramètre taskId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `task.cancelLocalTask/010` | Texte taskId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## usage.report — Lire le rapport de consommation

Répond ce que le compte a dépensé sur une fenêtre de sept, trente-et-un ou cent vingt jours, telle que la fenêtre d’usage la montre. C’est ce qui répond à « combien me reste-t-il de crédits ».

- Nom MCP : `usage_report`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `days` | choice | False | `{"options":[7,31,120]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `usage.report/001` | Nominal minimal : demander « Lire le rapport de consommation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `usage.report/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `usage.report/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `usage.report/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `usage.report/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `usage.report/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `usage.report/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `usage.report/008` | Paramètre days absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `usage.report/009` | Paramètre days avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `usage.report/010` | Option de days : 7 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `usage.report/011` | Option de days : 31 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `usage.report/012` | Option de days : 120 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `usage.report/013` | Option inconnue de days : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
