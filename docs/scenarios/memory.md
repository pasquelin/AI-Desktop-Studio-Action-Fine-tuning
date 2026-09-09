# Mémoire de l’assistant — 5 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer entrées, liens et portée de rappel ; prouver qu’un projet voisin et les données personnelles restent inchangés.

## memory.recall — Retrouver ce qui a été appris

Cherche ce que l’assistant a CONSTATÉ en travaillant et répond les résumés trouvés, avec leurs identifiants. Ce que la personne dit du projet vit dans les fiches de contexte.

- Nom MCP : `memory_recall`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["memory"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 67.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `query` | text | True | `{}` |
| `limit` | integer | False | `{"min":1,"max":100}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["query"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `memory.recall/001` | Nominal minimal : demander « Retrouver ce qui a été appris » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `memory.recall/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `memory.recall/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `memory.recall/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `memory.recall/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `memory.recall/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `memory.recall/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `memory.recall/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `memory.recall/009` | Paramètre query absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.recall/010` | Paramètre query avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.recall/011` | Texte query : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `memory.recall/012` | Paramètre limit absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `memory.recall/013` | Paramètre limit avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## memory.read — Lire une mémoire en entier

Répond le DÉTAIL d’un souvenir — ce à quoi il se rapporte et d’où il vient — à partir d’un identifiant que memory.recall a rendu. Le rappel donne les résumés ; ceci est ce que « donne-moi le détail » demande.

- Nom MCP : `memory_read`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["memory"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 67.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `memoryId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["memoryId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `memory.read/001` | Nominal minimal : demander « Lire une mémoire en entier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `memory.read/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `memory.read/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `memory.read/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `memory.read/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `memory.read/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `memory.read/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `memory.read/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `memory.read/009` | Paramètre memoryId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.read/010` | Paramètre memoryId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.read/011` | Texte memoryId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## memory.write — Retenir quelque chose du projet

Note une règle de travail de ce projet, ou ce que l’assistant a constaté en agissant — comment une chose se fait ici, à quoi sert un fichier ou un objet. Ce que la personne dit que le projet EST ou VISE est une fiche de contexte. Remplace celui qui portait déjà la même référence.

- Nom MCP : `memory_write`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["memory"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 67.1, 67.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `type` | text | True | `{"options":["decision","architecture","feature","entity","script","problem","intent","convention"]}` |
| `summary` | text | True | `{"max":200}` |
| `body` | longText | False | `{"max":2000}` |
| `importance` | integer | False | `{"min":1,"max":5}` |
| `file` | text | False | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["type","summary"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `memory.write/001` | Nominal minimal : demander « Retenir quelque chose du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `memory.write/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `memory.write/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `memory.write/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `memory.write/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `memory.write/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `memory.write/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `memory.write/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `memory.write/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `memory.write/010` | Paramètre type absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.write/011` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.write/012` | Option de type : "decision" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/013` | Option de type : "architecture" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/014` | Option de type : "feature" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/015` | Option de type : "entity" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/016` | Option de type : "script" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/017` | Option de type : "problem" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/018` | Option de type : "intent" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/019` | Option de type : "convention" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `memory.write/020` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `memory.write/021` | Texte type : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `memory.write/022` | Paramètre summary absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.write/023` | Paramètre summary avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.write/024` | Texte summary : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `memory.write/025` | Paramètre body absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `memory.write/026` | Paramètre body avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.write/027` | Paramètre importance absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `memory.write/028` | Paramètre importance avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.write/029` | Paramètre file absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `memory.write/030` | Paramètre file avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.write/031` | Texte file : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## memory.forget — Oublier une mémoire

Marque comme oublié ce que l’assistant avait constaté. Rien n’est effacé du fichier : ce qui a été appris reste traçable.

- Nom MCP : `memory_forget`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["memory"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 67.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `memoryId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["memoryId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `memory.forget/001` | Nominal minimal : demander « Oublier une mémoire » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `memory.forget/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `memory.forget/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `memory.forget/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `memory.forget/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `memory.forget/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `memory.forget/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `memory.forget/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `memory.forget/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `memory.forget/010` | Paramètre memoryId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.forget/011` | Paramètre memoryId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.forget/012` | Texte memoryId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## memory.link — Relier deux mémoires

Ajoute un lien d’une mémoire vers une autre, pour dire que l’une éclaire l’autre.

- Nom MCP : `memory_link`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["memory"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 67.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `memoryId` | text | True | `{}` |
| `toMemoryId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["memoryId","toMemoryId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `memory.link/001` | Nominal minimal : demander « Relier deux mémoires » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `memory.link/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `memory.link/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `memory.link/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `memory.link/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `memory.link/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `memory.link/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `memory.link/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `memory.link/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `memory.link/010` | Paramètre memoryId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.link/011` | Paramètre memoryId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.link/012` | Texte memoryId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `memory.link/013` | Paramètre toMemoryId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `memory.link/014` | Paramètre toMemoryId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `memory.link/015` | Texte toMemoryId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
