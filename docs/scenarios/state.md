# Documents et état — 10 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer documents ouverts, identifiants, état actif et contenu sauvegardé ; rouvrir le fichier lorsqu’une persistance est attendue.

## studio.state — Lire l’état du studio

Rend le projet ouvert, l’espace et la surface actifs, tous les documents ouverts avec celui qui est devant, le modèle armé par famille, et si le studio est connecté. À demander avant de lancer une commande, car une commande n’atteint que la surface active.

- Nom MCP : `studio_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 1.1, 1.4, 1.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `studio.state/001` | Nominal minimal : demander « Lire l’état du studio » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `studio.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `studio.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `studio.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `studio.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `studio.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `studio.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## documents.list — Lister les documents du projet

Rend les documents éditables que porte le dossier du projet — images en calques, scènes, montages, matières — ouverts dans un onglet ou non. Les autres fichiers du projet, images et modèles compris, ne sont pas là.

- Nom MCP : `documents_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 1.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `documents.list/001` | Nominal minimal : demander « Lister les documents du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `documents.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `documents.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `documents.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `documents.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `documents.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `documents.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.open — Ouvrir un document

Ouvre un document du dossier du projet par son chemin et le met devant, en basculant d’espace si besoin. Le chemin est celui qu’un listage a rendu.

- Nom MCP : `document_open`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.open/001` | Nominal minimal : demander « Ouvrir un document » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.open/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.open/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.open/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.activate — Mettre un document devant

Fait d’un document déjà ouvert l’onglet actif, pour que les commandes de sa surface l’atteignent. C’est la réponse à une commande refusée parce qu’elle s’adressait à une autre surface. Nommez-le par son identifiant, par son chemin, ou par le titre que le studio affiche entre guillemets — un titre que deux documents partagent n’en nomme aucun. « Rouvre X », « reviens sur X » pour un document déjà ouvert, c’est ceci, pas file.open.

- Nom MCP : `document_activate`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 2.7, 5.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `documentId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["documentId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.activate/001` | Nominal minimal : demander « Mettre un document devant » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.activate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.activate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.activate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.activate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.activate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.activate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.activate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `document.activate/009` | Paramètre documentId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.activate/010` | Paramètre documentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.activate/011` | Texte documentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.close — Fermer un document

Ferme l’onglet d’un document ouvert. Ce qui n’a jamais atteint le disque est perdu avec lui.

- Nom MCP : `document_close`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"asksItself":true}`.
- Batterie existante : 5.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `documentId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["documentId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.close/001` | Nominal minimal : demander « Fermer un document » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.close/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.close/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.close/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.close/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.close/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.close/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.close/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `document.close/009` | Paramètre documentId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.close/010` | Paramètre documentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.close/011` | Texte documentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.rename — Renommer un document

Appelle un document autrement, sur le disque et à l’écran d’un même geste. Le document garde son identité, et un onglet ouvert se renomme sans se fermer.

- Nom MCP : `document_rename`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `documentId` | text | True | `{}` |
| `title` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["documentId","title"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.rename/001` | Nominal minimal : demander « Renommer un document » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.rename/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `document.rename/009` | Paramètre documentId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.rename/010` | Paramètre documentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.rename/011` | Texte documentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `document.rename/012` | Paramètre title absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.rename/013` | Paramètre title avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.rename/014` | Texte title : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.save — Enregistrer un document

Écrit le document nommé dans le projet, et attend que ce soit fait. Sans identifiant, c’est celui qui est devant. Répond si quelque chose a été écrit, car un onglet intact n’a rien à écrire et ce n’est pas un échec.

- Nom MCP : `document_save`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `documentId` | text | False | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.save/001` | Nominal minimal : demander « Enregistrer un document » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.save/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.save/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.save/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.save/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.save/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.save/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.save/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `document.save/009` | Paramètre documentId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.save/010` | Paramètre documentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.save/011` | Texte documentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.deleteFromDisk — Supprimer un document

Retire du projet le fichier du document, puis ferme son onglet. Le travail non enregistré part avec lui, puisque le fichier s’en va — l’enregistrer avant de le détruire n’aurait pas de sens.

- Nom MCP : `document_deleteFromDisk`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `documentId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["documentId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.deleteFromDisk/001` | Nominal minimal : demander « Supprimer un document » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.deleteFromDisk/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.deleteFromDisk/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.deleteFromDisk/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.deleteFromDisk/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.deleteFromDisk/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.deleteFromDisk/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.deleteFromDisk/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `document.deleteFromDisk/009` | Paramètre documentId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `document.deleteFromDisk/010` | Paramètre documentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.deleteFromDisk/011` | Texte documentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## document.export — Exporter le document devant dans le projet

Écrit le document devant — image, scène, ciel, matière ou montage — dans un dossier du projet, portant son titre à défaut d’un nom donné. Un montage sort en OpenTimelineIO, c’est-à-dire la coupe et non un film — le rendu image par image demande une session que rien d’extérieur ne peut tenir. La destination ne peut pas sortir du projet.

- Nom MCP : `document_export`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `folder` | text | False | `{}` |
| `format` | choice | False | `{"options":["glb","gltf","usdz","obj","ply","stl"]}` |
| `scope` | choice | False | `{"options":["scene","selection"]}` |
| `target` | choice | False | `{"options":["gltf","unity","unreal","roblox","raw"]}` |
| `size` | integer | False | `{"min":1}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `document.export/001` | Nominal minimal : demander « Exporter le document devant dans le projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `document.export/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `document.export/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `document.export/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `document.export/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `document.export/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `document.export/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `document.export/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `document.export/009` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.export/010` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.export/011` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `document.export/012` | Paramètre format absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.export/013` | Paramètre format avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.export/014` | Option de format : "glb" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/015` | Option de format : "gltf" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/016` | Option de format : "usdz" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/017` | Option de format : "obj" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/018` | Option de format : "ply" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/019` | Option de format : "stl" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/020` | Option inconnue de format : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `document.export/021` | Paramètre scope absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.export/022` | Paramètre scope avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.export/023` | Option de scope : "scene" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/024` | Option de scope : "selection" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/025` | Option inconnue de scope : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `document.export/026` | Paramètre target absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.export/027` | Paramètre target avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `document.export/028` | Option de target : "gltf" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/029` | Option de target : "unity" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/030` | Option de target : "unreal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/031` | Option de target : "roblox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/032` | Option de target : "raw" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `document.export/033` | Option inconnue de target : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `document.export/034` | Paramètre size absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `document.export/035` | Paramètre size avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## activity.recent — Lire l’activité récente

Rend ce que le studio a consigné dernièrement — générations, opérations sur les fichiers, échecs — du plus récent au plus ancien. C’est ainsi qu’on apprend ce qu’une action a réellement fait. Comment une génération s’est PASSÉE est job.readCloudGeneration, qui la rend entière.

- Nom MCP : `activity_recent`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `limit` | integer | False | `{"min":1,"max":200}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `activity.recent/001` | Nominal minimal : demander « Lire l’activité récente » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `activity.recent/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `activity.recent/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `activity.recent/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `activity.recent/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `activity.recent/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `activity.recent/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `activity.recent/008` | Paramètre limit absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `activity.recent/009` | Paramètre limit avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
