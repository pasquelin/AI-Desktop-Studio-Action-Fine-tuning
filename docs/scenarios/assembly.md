# Assemblage et préfabs — 3 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer l’état métier avant/après avec un lecteur indépendant, puis la persistance si l’action en prévoit une.

## game.applyTemplate — Poser un modèle de jeu

Pose dans la scène ouverte le sol, le personnage et les objets d’un genre de jeu, et règle la caméra et la pesanteur avec. Une seule annulation défait tout.

- Nom MCP : `game_applyTemplate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 63.1, 63.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `template` | choice | True | `{"options":["firstPerson","thirdPerson","topDown"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["template"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `game.applyTemplate/001` | Nominal minimal : demander « Poser un modèle de jeu » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `game.applyTemplate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `game.applyTemplate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `game.applyTemplate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `game.applyTemplate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `game.applyTemplate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `game.applyTemplate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `game.applyTemplate/008` | Paramètre template absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `game.applyTemplate/009` | Paramètre template avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.applyTemplate/010` | Option de template : "firstPerson" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.applyTemplate/011` | Option de template : "thirdPerson" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.applyTemplate/012` | Option de template : "topDown" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.applyTemplate/013` | Option inconnue de template : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## prefab.define — Nommer un prefab

Inscrit une scène du projet dans game.json comme pièce réutilisable, sous le nom donné. Sans document, c’est la scène en face.

- Nom MCP : `prefab_define`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 63.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `name` | text | True | `{}` |
| `document` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `prefab.define/001` | Nominal minimal : demander « Nommer un prefab » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `prefab.define/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `prefab.define/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `prefab.define/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `prefab.define/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `prefab.define/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `prefab.define/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `prefab.define/008` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `prefab.define/009` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.define/010` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `prefab.define/011` | Paramètre document absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `prefab.define/012` | Paramètre document avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.define/013` | Texte document : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## prefab.instantiate — Instancier un prefab

Pose dans la scène ouverte les objets d’un autre document de scène du projet, avec des identifiants neufs, à l’endroit demandé. Une partie déjà EN COURS s’envoie dans une autre scène par play.loadScene, ce que ceci ne fait pas.

- Nom MCP : `prefab_instantiate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 63.4, 63.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `prefab` | text | True | `{}` |
| `positionX` | number | False | `{}` |
| `positionY` | number | False | `{}` |
| `positionZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["prefab"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `prefab.instantiate/001` | Nominal minimal : demander « Instancier un prefab » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `prefab.instantiate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `prefab.instantiate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `prefab.instantiate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `prefab.instantiate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `prefab.instantiate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `prefab.instantiate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `prefab.instantiate/008` | Paramètre prefab absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `prefab.instantiate/009` | Paramètre prefab avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.instantiate/010` | Texte prefab : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `prefab.instantiate/011` | Paramètre positionX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `prefab.instantiate/012` | Paramètre positionX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.instantiate/013` | Valeur de positionX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `prefab.instantiate/014` | Paramètre positionY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `prefab.instantiate/015` | Paramètre positionY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.instantiate/016` | Valeur de positionY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `prefab.instantiate/017` | Paramètre positionZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `prefab.instantiate/018` | Paramètre positionZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `prefab.instantiate/019` | Valeur de positionZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
