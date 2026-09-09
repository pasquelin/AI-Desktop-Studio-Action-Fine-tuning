# Scène 3D, caméra et monde — 49 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer arbre de scène, transformations dans le bon repère, matériau et caméra ; prévoir une vérification graphique pour le rendu.

## scene.state — Lire la scène en cours d’édition

Répond chaque objet du document 3D en avant — son identifiant, son nom, son type, son parent, sa visibilité et sa transformation, avec la géométrie, la matière ou la lumière qu’il porte — plus ce qui est sélectionné, les plans de caméra et le réglage de la scène. Un champ À SON DÉFAUT est omis, et son absence signifie ce défaut : aucun parent, visible, à l’origine sans rotation ni échelle, la couleur du studio, une forme divisée comme sa sorte l’est toujours. Les mesures ne sont jamais omises. Une liste qui ne tient rien est omise entière. Pour décrire UN objet avec ses composants et ce qu’on peut encore lui ajouter, studio.describe.

- Nom MCP : `scene_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 1.5, 1.6, 1.7, 9.6, 12.1, 14.4, 26.1, 26.3, 27.1, 27.4, 71.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `scene.state/001` | Nominal minimal : demander « Lire la scène en cours d’édition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `scene.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `scene.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `scene.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `scene.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `scene.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `scene.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `scene.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.add — Ajouter un objet à la scène

Pose une primitive, une lumière, une caméra, un sprite ou un texte dans le document 3D devant, à la position donnée. Répond avec l’identifiant reçu par l’objet à sa naissance. Un modèle du projet, ou celui qu’une génération vient de rendre, entre par node.addModel ; ceci fabrique une primitive.

- Nom MCP : `node_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.1, 6.6, 6.8, 8.1, 8.4, 9.1, 25.1, 25.3, 31.1, 71.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | True | `{"options":["box","capsule","circle","cylinder","dodecahedron","icosahedron","lathe","octahedron","plane","ribbon","ring","sphere","tetrahedron","torus","torusKnot","tube","ambient","directional","hemisphere","point","spot","humanoid","sprite","text","camera","path","player"]}` |
| `name` | text | False | `{}` |
| `positionX` | number | False | `{}` |
| `positionY` | number | False | `{}` |
| `positionZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["kind"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.add/001` | Nominal minimal : demander « Ajouter un objet à la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.add/009` | Paramètre kind absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.add/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.add/011` | Option de kind : "box" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/012` | Option de kind : "capsule" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/013` | Option de kind : "circle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/014` | Option de kind : "cylinder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/015` | Option de kind : "dodecahedron" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/016` | Option de kind : "icosahedron" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/017` | Option de kind : "lathe" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/018` | Option de kind : "octahedron" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/019` | Option de kind : "plane" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/020` | Option de kind : "ribbon" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/021` | Option de kind : "ring" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/022` | Option de kind : "sphere" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/023` | Option de kind : "tetrahedron" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/024` | Option de kind : "torus" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/025` | Option de kind : "torusKnot" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/026` | Option de kind : "tube" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/027` | Option de kind : "ambient" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/028` | Option de kind : "directional" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/029` | Option de kind : "hemisphere" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/030` | Option de kind : "point" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/031` | Option de kind : "spot" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/032` | Option de kind : "humanoid" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/033` | Option de kind : "sprite" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/034` | Option de kind : "text" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/035` | Option de kind : "camera" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/036` | Option de kind : "path" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/037` | Option de kind : "player" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.add/038` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `node.add/039` | Paramètre name absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.add/040` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.add/041` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.add/042` | Paramètre positionX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.add/043` | Paramètre positionX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.add/044` | Valeur de positionX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.add/045` | Paramètre positionY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.add/046` | Paramètre positionY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.add/047` | Valeur de positionY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.add/048` | Paramètre positionZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.add/049` | Paramètre positionZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.add/050` | Valeur de positionZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.addModel — Placer un modèle de la bibliothèque

Pose un modèle 3D de la bibliothèque du projet dans la scène devant, nommé d’après son asset. C’est ainsi qu’une maille générée entre dans une scène.

- Nom MCP : `node_addModel`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 11.1, 11.5, 22.4, 23.2, 24.2, 31.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{}` |
| `name` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.addModel/001` | Nominal minimal : demander « Placer un modèle de la bibliothèque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.addModel/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.addModel/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.addModel/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.addModel/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.addModel/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.addModel/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.addModel/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.addModel/009` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.addModel/010` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.addModel/011` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.addModel/012` | Paramètre name absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.addModel/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.addModel/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.markAsCuttingTool — Marquer des objets comme outils

Marque des objets de la scène devant, ou la retire avec « negative » à FAUX : un objet marqué est CREUSÉ dans les autres au pli suivant, quel que soit le pli demandé et quel que soit l’ordre des identifiants. Sans marque, la plus grosse forme est la matière.

- Nom MCP : `node_markAsCuttingTool`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.14, 6.15.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | True | `{"repeated":true}` |
| `negative` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.markAsCuttingTool/001` | Nominal minimal : demander « Marquer des objets comme outils » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.markAsCuttingTool/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.markAsCuttingTool/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.markAsCuttingTool/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.markAsCuttingTool/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.markAsCuttingTool/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.markAsCuttingTool/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.markAsCuttingTool/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.markAsCuttingTool/009` | Paramètre nodeIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.markAsCuttingTool/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.markAsCuttingTool/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.markAsCuttingTool/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `node.markAsCuttingTool/013` | Paramètre negative absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.markAsCuttingTool/014` | Paramètre negative avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.markAsCuttingTool/015` | Booléen negative : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.combineIntoSolid — Percer, fusionner ou croiser des objets

Plie plusieurs objets de la scène devant en un seul solide. L’ORDRE DES IDENTIFIANTS NE COMPTE PAS : la matière est la plus grosse forme, sauf si « matterId » la nomme, et un objet marqué par « node.markAsCuttingTool » est toujours un outil. Les formes d’origine sont conservées dans le solide et « node.separate » les rend. Répond avec l’identifiant du solide. « intersect » ne garde que ce qu’ils partagent, le chevauchement.

- Nom MCP : `node_combineIntoSolid`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.10, 6.11, 6.12, 6.13, 6.14.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | True | `{"repeated":true}` |
| `operation` | choice | True | `{"options":["subtract","unite","intersect"]}` |
| `matterId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeIds","operation"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.combineIntoSolid/001` | Nominal minimal : demander « Percer, fusionner ou croiser des objets » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.combineIntoSolid/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.combineIntoSolid/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.combineIntoSolid/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.combineIntoSolid/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.combineIntoSolid/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.combineIntoSolid/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.combineIntoSolid/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.combineIntoSolid/009` | Paramètre nodeIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.combineIntoSolid/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.combineIntoSolid/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.combineIntoSolid/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `node.combineIntoSolid/013` | Paramètre operation absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.combineIntoSolid/014` | Paramètre operation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.combineIntoSolid/015` | Option de operation : "subtract" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.combineIntoSolid/016` | Option de operation : "unite" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.combineIntoSolid/017` | Option de operation : "intersect" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.combineIntoSolid/018` | Option inconnue de operation : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `node.combineIntoSolid/019` | Paramètre matterId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.combineIntoSolid/020` | Paramètre matterId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.combineIntoSolid/021` | Texte matterId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.swapSolidMatterAndTool — Inverser un pli

Refait le pli d’un solide de la scène devant dans l’autre sens : ce qui avait été creusé devient la matière, et la matière devient l’outil. Pour le pli qui est parti à l’envers, sans annuler.

- Nom MCP : `node_swapSolidMatterAndTool`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.16.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.swapSolidMatterAndTool/001` | Nominal minimal : demander « Inverser un pli » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.swapSolidMatterAndTool/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.swapSolidMatterAndTool/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.swapSolidMatterAndTool/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.swapSolidMatterAndTool/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.swapSolidMatterAndTool/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.swapSolidMatterAndTool/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.swapSolidMatterAndTool/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.swapSolidMatterAndTool/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.swapSolidMatterAndTool/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.swapSolidMatterAndTool/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.swapSolidMatterAndTool/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.separate — Séparer un solide

Défait un solide de la scène devant et rend les formes dont il a été fait, chacune là où elle se trouvait. Répond avec les identifiants des objets rendus.

- Nom MCP : `node_separate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.13.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.separate/001` | Nominal minimal : demander « Séparer un solide » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.separate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.separate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.separate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.separate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.separate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.separate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.separate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.separate/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.separate/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.separate/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.separate/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.remove — Retirer un objet

Sort un objet de la scène devant, avec ce qui pend sous lui. S’annule comme n’importe quelle autre édition de ce document.

- Nom MCP : `node_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 25.7, 29.4, 29.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.remove/001` | Nominal minimal : demander « Retirer un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.remove/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.remove/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.remove/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.remove/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.attach — Accrocher un objet à un personnage

Accroche un objet au point d’attache du personnage dont il dépend — une épée dans la main. Sans point nommé, l’objet suit le personnage entier.

- Nom MCP : `node_attach`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.12.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `socket` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.attach/001` | Nominal minimal : demander « Accrocher un objet à un personnage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.attach/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.attach/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.attach/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.attach/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.attach/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.attach/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.attach/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.attach/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.attach/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.attach/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.attach/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.attach/013` | Paramètre socket absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.attach/014` | Paramètre socket avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.attach/015` | Texte socket : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.rename — Renommer un objet

Appelle autrement un objet de la scène devant. L’identifiant ne change pas, donc rien de ce qui le désignait n’est perdu.

- Nom MCP : `node_rename`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.2, 6.9, 8.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.rename/001` | Nominal minimal : demander « Renommer un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.rename/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.rename/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.rename/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.rename/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.rename/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.rename/013` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.rename/014` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.rename/015` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.transform — Placer un objet

Déplace, oriente ou redimensionne un objet. Les rotations sont des angles d’Euler en radians, et tout axe omis garde la valeur que l’objet avait déjà.

- Nom MCP : `node_transform`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 6.3, 6.4, 6.5, 6.7, 7.1, 7.2, 7.3, 7.4, 7.5, 9.2, 9.4, 11.2, 11.3, 22.5, 22.6, 24.3, 25.2, 25.4, 25.5, 25.6, 25.8, 26.2, 28.2, 29.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `positionX` | number | False | `{}` |
| `positionY` | number | False | `{}` |
| `positionZ` | number | False | `{}` |
| `rotationX` | number | False | `{}` |
| `rotationY` | number | False | `{}` |
| `rotationZ` | number | False | `{}` |
| `scaleX` | number | False | `{}` |
| `scaleY` | number | False | `{}` |
| `scaleZ` | number | False | `{}` |
| `relative` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.transform/001` | Nominal minimal : demander « Placer un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.transform/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.transform/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.transform/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.transform/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.transform/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.transform/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.transform/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.transform/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.transform/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.transform/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.transform/013` | Paramètre positionX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/014` | Paramètre positionX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/015` | Valeur de positionX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/016` | Paramètre positionY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/017` | Paramètre positionY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/018` | Valeur de positionY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/019` | Paramètre positionZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/020` | Paramètre positionZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/021` | Valeur de positionZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/022` | Paramètre rotationX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/023` | Paramètre rotationX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/024` | Valeur de rotationX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/025` | Paramètre rotationY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/026` | Paramètre rotationY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/027` | Valeur de rotationY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/028` | Paramètre rotationZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/029` | Paramètre rotationZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/030` | Valeur de rotationZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/031` | Paramètre scaleX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/032` | Paramètre scaleX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/033` | Valeur de scaleX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/034` | Paramètre scaleY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/035` | Paramètre scaleY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/036` | Valeur de scaleY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/037` | Paramètre scaleZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/038` | Paramètre scaleZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/039` | Valeur de scaleZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.transform/040` | Paramètre relative absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.transform/041` | Paramètre relative avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.transform/042` | Booléen relative : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setVisible — Montrer ou cacher un objet

Sort un objet de ce qui est dessiné, ou l’y remet. Il reste dans la scène dans les deux cas, et c’est ce qui distingue cacher de retirer.

- Nom MCP : `node_setVisible`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 8.6, 8.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `visible` | boolean | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","visible"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setVisible/001` | Nominal minimal : demander « Montrer ou cacher un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setVisible/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setVisible/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setVisible/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setVisible/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setVisible/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setVisible/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setVisible/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setVisible/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setVisible/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setVisible/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setVisible/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setVisible/013` | Paramètre visible absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setVisible/014` | Paramètre visible avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setVisible/015` | Booléen visible : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setMeshMaterial — Régler la matière d’un objet

Change la couleur, la rugosité, l’aspect métallique, la densité de tuilage et les cinq cartes d’une maille ou d’un texte. Une carte nommée avec un identifiant vide est une carte retirée. Le tuilage est refusé sur un texte, dont le contour n’est pas une primitive.

- Nom MCP : `node_setMeshMaterial`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 23.3, 24.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `color` | color | False | `{}` |
| `roughness` | number | False | `{"min":0,"max":1}` |
| `metalness` | number | False | `{"min":0,"max":1}` |
| `tilesPerMetre` | number | False | `{"min":0.05,"max":20}` |
| `textures` | record | False | `{"options":["map","normalMap","roughnessMap","metalnessMap","aoMap","emissiveMap","displacementMap"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setMeshMaterial/001` | Nominal minimal : demander « Régler la matière d’un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setMeshMaterial/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setMeshMaterial/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setMeshMaterial/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setMeshMaterial/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setMeshMaterial/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setMeshMaterial/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setMeshMaterial/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setMeshMaterial/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setMeshMaterial/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setMeshMaterial/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setMeshMaterial/013` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setMeshMaterial/014` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/015` | Paramètre roughness absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setMeshMaterial/016` | Paramètre roughness avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/017` | Valeur de roughness : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setMeshMaterial/018` | Borne min de roughness = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/019` | Borne max de roughness = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/020` | Paramètre metalness absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setMeshMaterial/021` | Paramètre metalness avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/022` | Valeur de metalness : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setMeshMaterial/023` | Borne min de metalness = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/024` | Borne max de metalness = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/025` | Paramètre tilesPerMetre absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setMeshMaterial/026` | Paramètre tilesPerMetre avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/027` | Valeur de tilesPerMetre : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setMeshMaterial/028` | Borne min de tilesPerMetre = 0.05 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/029` | Borne max de tilesPerMetre = 20 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setMeshMaterial/030` | Paramètre textures absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setMeshMaterial/031` | Paramètre textures avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setMeshMaterial/032` | Option de textures : "map" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/033` | Option de textures : "normalMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/034` | Option de textures : "roughnessMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/035` | Option de textures : "metalnessMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/036` | Option de textures : "aoMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/037` | Option de textures : "emissiveMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/038` | Option de textures : "displacementMap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setMeshMaterial/039` | Option inconnue de textures : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setPrimitiveParameters — Régler les paramètres d’une primitive

Change les mesures et les découpages de la forme dont une maille a été construite. Chaque primitive porte les siens, que la lecture de la scène rend — un champ qui n’appartient pas à la forme est refusé plutôt qu’ignoré.

- Nom MCP : `node_setPrimitiveParameters`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `width` | number | False | `{"min":0.001}` |
| `height` | number | False | `{"min":0.001}` |
| `depth` | number | False | `{"min":0.001}` |
| `radius` | number | False | `{"min":0.001}` |
| `radiusTop` | number | False | `{"min":0}` |
| `radiusBottom` | number | False | `{"min":0}` |
| `innerRadius` | number | False | `{"min":0}` |
| `outerRadius` | number | False | `{"min":0.001}` |
| `tube` | number | False | `{"min":0.001}` |
| `segments` | integer | False | `{"min":2,"max":512}` |
| `capSegments` | integer | False | `{"min":1,"max":128}` |
| `radialSegments` | integer | False | `{"min":1,"max":128}` |
| `widthSegments` | integer | False | `{"min":3,"max":128}` |
| `heightSegments` | integer | False | `{"min":1,"max":128}` |
| `tubularSegments` | integer | False | `{"min":3,"max":128}` |
| `p` | integer | False | `{"min":1,"max":20}` |
| `q` | integer | False | `{"min":1,"max":20}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setPrimitiveParameters/001` | Nominal minimal : demander « Régler les paramètres d’une primitive » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setPrimitiveParameters/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setPrimitiveParameters/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setPrimitiveParameters/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setPrimitiveParameters/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setPrimitiveParameters/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setPrimitiveParameters/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setPrimitiveParameters/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setPrimitiveParameters/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setPrimitiveParameters/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setPrimitiveParameters/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setPrimitiveParameters/013` | Paramètre width absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/014` | Paramètre width avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/015` | Valeur de width : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/016` | Borne min de width = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/017` | Paramètre height absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/018` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/019` | Valeur de height : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/020` | Borne min de height = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/021` | Paramètre depth absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/022` | Paramètre depth avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/023` | Valeur de depth : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/024` | Borne min de depth = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/025` | Paramètre radius absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/026` | Paramètre radius avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/027` | Valeur de radius : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/028` | Borne min de radius = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/029` | Paramètre radiusTop absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/030` | Paramètre radiusTop avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/031` | Valeur de radiusTop : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/032` | Borne min de radiusTop = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/033` | Paramètre radiusBottom absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/034` | Paramètre radiusBottom avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/035` | Valeur de radiusBottom : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/036` | Borne min de radiusBottom = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/037` | Paramètre innerRadius absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/038` | Paramètre innerRadius avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/039` | Valeur de innerRadius : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/040` | Borne min de innerRadius = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/041` | Paramètre outerRadius absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/042` | Paramètre outerRadius avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/043` | Valeur de outerRadius : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/044` | Borne min de outerRadius = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/045` | Paramètre tube absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/046` | Paramètre tube avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/047` | Valeur de tube : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPrimitiveParameters/048` | Borne min de tube = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPrimitiveParameters/049` | Paramètre segments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/050` | Paramètre segments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/051` | Paramètre capSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/052` | Paramètre capSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/053` | Paramètre radialSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/054` | Paramètre radialSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/055` | Paramètre widthSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/056` | Paramètre widthSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/057` | Paramètre heightSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/058` | Paramètre heightSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/059` | Paramètre tubularSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/060` | Paramètre tubularSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/061` | Paramètre p absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/062` | Paramètre p avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPrimitiveParameters/063` | Paramètre q absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPrimitiveParameters/064` | Paramètre q avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setShadowCastAndReceive — Régler les ombres d’un objet

Dit si un objet projette une ombre et s’il reçoit celles des autres. Une lumière n’en reçoit aucune, un panneau ne fait ni l’un ni l’autre, et le champ que l’objet ne peut pas porter est refusé.

- Nom MCP : `node_setShadowCastAndReceive`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 10.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `castShadow` | boolean | False | `{}` |
| `receiveShadow` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setShadowCastAndReceive/001` | Nominal minimal : demander « Régler les ombres d’un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setShadowCastAndReceive/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setShadowCastAndReceive/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setShadowCastAndReceive/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setShadowCastAndReceive/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setShadowCastAndReceive/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setShadowCastAndReceive/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setShadowCastAndReceive/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setShadowCastAndReceive/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setShadowCastAndReceive/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setShadowCastAndReceive/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setShadowCastAndReceive/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setShadowCastAndReceive/013` | Paramètre castShadow absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setShadowCastAndReceive/014` | Paramètre castShadow avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setShadowCastAndReceive/015` | Booléen castShadow : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `node.setShadowCastAndReceive/016` | Paramètre receiveShadow absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setShadowCastAndReceive/017` | Paramètre receiveShadow avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setShadowCastAndReceive/018` | Booléen receiveShadow : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setSpriteSettings — Régler un panneau

Change la teinte, l’opacité et l’image d’un panneau, qui fait toujours face à la caméra. Un identifiant vide retire l’image et laisse le carré coloré.

- Nom MCP : `node_setSpriteSettings`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `color` | color | False | `{}` |
| `opacity` | number | False | `{"min":0,"max":1}` |
| `map` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setSpriteSettings/001` | Nominal minimal : demander « Régler un panneau » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setSpriteSettings/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setSpriteSettings/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setSpriteSettings/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setSpriteSettings/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setSpriteSettings/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setSpriteSettings/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setSpriteSettings/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setSpriteSettings/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setSpriteSettings/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setSpriteSettings/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setSpriteSettings/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setSpriteSettings/013` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setSpriteSettings/014` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setSpriteSettings/015` | Paramètre opacity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setSpriteSettings/016` | Paramètre opacity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setSpriteSettings/017` | Valeur de opacity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setSpriteSettings/018` | Borne min de opacity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setSpriteSettings/019` | Borne max de opacity = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setSpriteSettings/020` | Paramètre map absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setSpriteSettings/021` | Paramètre map avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setSpriteSettings/022` | Texte map : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setTextSettings — Régler un texte 3D

Change les mots, la police, le corps, l’épaisseur du relief et la finesse des courbes d’un texte. Sa matière se règle par l’action de matière, comme celle d’une maille.

- Nom MCP : `node_setTextSettings`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `value` | text | False | `{}` |
| `fontFamily` | text | False | `{}` |
| `fontSource` | choice | False | `{"options":["embedded","system"]}` |
| `textSize` | number | False | `{"min":0.001}` |
| `textDepth` | number | False | `{"min":0}` |
| `curveSegments` | integer | False | `{"min":1,"max":32}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setTextSettings/001` | Nominal minimal : demander « Régler un texte 3D » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setTextSettings/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setTextSettings/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setTextSettings/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setTextSettings/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setTextSettings/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setTextSettings/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setTextSettings/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setTextSettings/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setTextSettings/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setTextSettings/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setTextSettings/013` | Paramètre value absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/014` | Paramètre value avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/015` | Texte value : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setTextSettings/016` | Paramètre fontFamily absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/017` | Paramètre fontFamily avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/018` | Texte fontFamily : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setTextSettings/019` | Paramètre fontSource absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/020` | Paramètre fontSource avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/021` | Option de fontSource : "embedded" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setTextSettings/022` | Option de fontSource : "system" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `node.setTextSettings/023` | Option inconnue de fontSource : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `node.setTextSettings/024` | Paramètre textSize absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/025` | Paramètre textSize avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/026` | Valeur de textSize : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setTextSettings/027` | Borne min de textSize = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setTextSettings/028` | Paramètre textDepth absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/029` | Paramètre textDepth avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setTextSettings/030` | Valeur de textDepth : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setTextSettings/031` | Borne min de textDepth = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setTextSettings/032` | Paramètre curveSegments absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setTextSettings/033` | Paramètre curveSegments avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setPathShape — Régler la forme d’un chemin

Change la tension d’un chemin, de 0 anguleux à 1 arrondi, et le fait qu’il se referme sur lui-même. Ses points de contrôle s’ajoutent, se déplacent et se retirent par les trois actions voisines.

- Nom MCP : `node_setPathShape`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `tension` | number | False | `{"min":0,"max":1}` |
| `closed` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setPathShape/001` | Nominal minimal : demander « Régler la forme d’un chemin » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setPathShape/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setPathShape/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setPathShape/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setPathShape/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setPathShape/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setPathShape/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setPathShape/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setPathShape/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setPathShape/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPathShape/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setPathShape/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setPathShape/013` | Paramètre tension absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPathShape/014` | Paramètre tension avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPathShape/015` | Valeur de tension : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setPathShape/016` | Borne min de tension = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPathShape/017` | Borne max de tension = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setPathShape/018` | Paramètre closed absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setPathShape/019` | Paramètre closed avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setPathShape/020` | Booléen closed : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## path.addPoint — Ajouter un point à un chemin

Pose un point de contrôle. Avec des coordonnées, il est ajouté après le dernier, là où il est visé. Avec un rang, il est glissé juste après ce point, à mi-distance du suivant. Sans rien, il prolonge le chemin par le bout.

- Nom MCP : `path_addPoint`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `index` | integer | False | `{"min":0}` |
| `pointX` | number | False | `{}` |
| `pointY` | number | False | `{}` |
| `pointZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `path.addPoint/001` | Nominal minimal : demander « Ajouter un point à un chemin » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `path.addPoint/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `path.addPoint/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `path.addPoint/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `path.addPoint/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `path.addPoint/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `path.addPoint/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `path.addPoint/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `path.addPoint/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `path.addPoint/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.addPoint/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `path.addPoint/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `path.addPoint/013` | Paramètre index absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.addPoint/014` | Paramètre index avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.addPoint/015` | Paramètre pointX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.addPoint/016` | Paramètre pointX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.addPoint/017` | Valeur de pointX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `path.addPoint/018` | Paramètre pointY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.addPoint/019` | Paramètre pointY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.addPoint/020` | Valeur de pointY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `path.addPoint/021` | Paramètre pointZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.addPoint/022` | Paramètre pointZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.addPoint/023` | Valeur de pointZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## path.movePoint — Déplacer un point d’un chemin

Change les coordonnées d’un point de contrôle, dans le repère propre du chemin — bouger le chemin bouge donc toute la trajectoire. Un rang qui ne désigne aucun point est refusé.

- Nom MCP : `path_movePoint`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `index` | integer | True | `{"min":0}` |
| `pointX` | number | False | `{}` |
| `pointY` | number | False | `{}` |
| `pointZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","index"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `path.movePoint/001` | Nominal minimal : demander « Déplacer un point d’un chemin » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `path.movePoint/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `path.movePoint/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `path.movePoint/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `path.movePoint/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `path.movePoint/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `path.movePoint/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `path.movePoint/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `path.movePoint/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `path.movePoint/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.movePoint/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `path.movePoint/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `path.movePoint/013` | Paramètre index absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `path.movePoint/014` | Paramètre index avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.movePoint/015` | Paramètre pointX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.movePoint/016` | Paramètre pointX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.movePoint/017` | Valeur de pointX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `path.movePoint/018` | Paramètre pointY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.movePoint/019` | Paramètre pointY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.movePoint/020` | Valeur de pointY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `path.movePoint/021` | Paramètre pointZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `path.movePoint/022` | Paramètre pointZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.movePoint/023` | Valeur de pointZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## path.removePoint — Retirer un point d’un chemin

Retire un point de contrôle. Un chemin ne descend jamais sous deux points, car un point n’est pas une ligne, et la demande est alors refusée.

- Nom MCP : `path_removePoint`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `index` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","index"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `path.removePoint/001` | Nominal minimal : demander « Retirer un point d’un chemin » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `path.removePoint/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `path.removePoint/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `path.removePoint/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `path.removePoint/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `path.removePoint/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `path.removePoint/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `path.removePoint/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `path.removePoint/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `path.removePoint/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `path.removePoint/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `path.removePoint/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `path.removePoint/013` | Paramètre index absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `path.removePoint/014` | Paramètre index avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.analyze — Analyser l’optimisation de la scène

Répond l’analyse déterministe des optimisations possibles sur les objets nommés, ou sur toute la scène si aucun n’est nommé. Ne modifie rien.

- Nom MCP : `optimization_analyze`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | False | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.analyze/001` | Nominal minimal : demander « Analyser l’optimisation de la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.analyze/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.analyze/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.analyze/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.analyze/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.analyze/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.analyze/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.analyze/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `optimization.analyze/009` | Paramètre nodeIds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `optimization.analyze/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `optimization.analyze/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `optimization.analyze/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.report — Lire le rapport d’optimisation

Répond les coûts mesurés de la scène séparément des gains runtime SAFE estimés.

- Nom MCP : `optimization_report`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | False | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.report/001` | Nominal minimal : demander « Lire le rapport d’optimisation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.report/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.report/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.report/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.report/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.report/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.report/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.report/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `optimization.report/009` | Paramètre nodeIds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `optimization.report/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `optimization.report/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `optimization.report/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.selection — Optimiser la sélection

Place les objets sélectionnés en optimisation runtime SAFE automatique tout en gardant chaque objet auteur éditable.

- Nom MCP : `optimization_selection`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.selection/001` | Nominal minimal : demander « Optimiser la sélection » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.selection/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.selection/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.selection/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.selection/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.selection/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.selection/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.selection/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.world — Optimiser la scène

Place chaque objet en optimisation runtime SAFE automatique sans modifier la scène auteur.

- Nom MCP : `optimization_world`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.world/001` | Nominal minimal : demander « Optimiser la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.world/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.world/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.world/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.world/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.world/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.world/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.world/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.clearCache — Vider le cache d’optimisation

Jette la représentation optimisée du viewport afin qu’elle soit reconstruite depuis l’état auteur.

- Nom MCP : `optimization_clearCache`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.clearCache/001` | Nominal minimal : demander « Vider le cache d’optimisation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.clearCache/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.clearCache/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.clearCache/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.clearCache/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.clearCache/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.clearCache/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.clearCache/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.exclude — Exclure des objets de l’optimisation

Conserve les objets logiques nommés individuellement dans le rendu optimisé.

- Nom MCP : `optimization_exclude`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.exclude/001` | Nominal minimal : demander « Exclure des objets de l’optimisation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.exclude/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.exclude/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.exclude/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.exclude/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.exclude/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.exclude/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.exclude/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `optimization.exclude/009` | Paramètre nodeIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `optimization.exclude/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `optimization.exclude/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `optimization.exclude/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## optimization.setMode — Régler le mode d’optimisation

Règle Auto, Forcer individuel, Forcer instance, Forcer batch ou Exclure sur les objets nommés.

- Nom MCP : `optimization_setMode`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 69.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | True | `{"repeated":true}` |
| `mode` | choice | True | `{"options":["auto","individual","instance","batch","exclude"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeIds","mode"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `optimization.setMode/001` | Nominal minimal : demander « Régler le mode d’optimisation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `optimization.setMode/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `optimization.setMode/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `optimization.setMode/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `optimization.setMode/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `optimization.setMode/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `optimization.setMode/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `optimization.setMode/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `optimization.setMode/009` | Paramètre nodeIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `optimization.setMode/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `optimization.setMode/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `optimization.setMode/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `optimization.setMode/013` | Paramètre mode absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `optimization.setMode/014` | Paramètre mode avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `optimization.setMode/015` | Option de mode : "auto" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `optimization.setMode/016` | Option de mode : "individual" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `optimization.setMode/017` | Option de mode : "instance" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `optimization.setMode/018` | Option de mode : "batch" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `optimization.setMode/019` | Option de mode : "exclude" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `optimization.setMode/020` | Option inconnue de mode : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## model.setMaterialDocument — Habiller un modèle d’une matière

Fait porter à un modèle importé une matière du projet, nommée par le titre de son document. Le modèle suit ensuite cette matière, si bien qu’en éditer un canal ou un réglage le repeint, sans rien redemander ici. Un titre vide la lui retire, et il retrouve ce que son propre fichier porte.

- Nom MCP : `model_setMaterialDocument`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 12.8, 12.9, 12.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `material` | text | False | `{}` |
| `slot` | integer | False | `{"min":0,"max":63}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `model.setMaterialDocument/001` | Nominal minimal : demander « Habiller un modèle d’une matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `model.setMaterialDocument/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `model.setMaterialDocument/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `model.setMaterialDocument/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `model.setMaterialDocument/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `model.setMaterialDocument/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `model.setMaterialDocument/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `model.setMaterialDocument/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `model.setMaterialDocument/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `model.setMaterialDocument/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `model.setMaterialDocument/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `model.setMaterialDocument/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `model.setMaterialDocument/013` | Paramètre material absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `model.setMaterialDocument/014` | Paramètre material avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `model.setMaterialDocument/015` | Texte material : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `model.setMaterialDocument/016` | Paramètre slot absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `model.setMaterialDocument/017` | Paramètre slot avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## model.setBaseColorImage — Recouvrir un modèle d’une image

Pose une seule image du projet sur tout un modèle importé, comme sa couleur de base — la façon simple de l’habiller. Elle exclut les matières : un modèle recouvert d’une image ne porte plus aucune matière, et l’inverse. Aucun autre canal n’en est déduit. Sans image, l’habillage est retiré et le modèle retrouve ce que son propre fichier porte.

- Nom MCP : `model_setBaseColorImage`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 12.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `assetId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `model.setBaseColorImage/001` | Nominal minimal : demander « Recouvrir un modèle d’une image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `model.setBaseColorImage/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `model.setBaseColorImage/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `model.setBaseColorImage/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `model.setBaseColorImage/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `model.setBaseColorImage/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `model.setBaseColorImage/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `model.setBaseColorImage/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `model.setBaseColorImage/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `model.setBaseColorImage/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `model.setBaseColorImage/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `model.setBaseColorImage/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `model.setBaseColorImage/013` | Paramètre assetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `model.setBaseColorImage/014` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `model.setBaseColorImage/015` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setLightSettings — Régler une lumière

Change tout ce que porte la sorte de lumière visée — sa couleur, son intensité, sa portée, son atténuation, l’ouverture et le fondu de son cône, sa cible, et les deux couleurs d’une lumière hémisphérique. Un champ que la sorte ne porte pas est refusé. Un halo, un bloom ou tout autre effet n’est pas une lumière : post.set écrit un paramètre d’un effet et post.reset le remet.

- Nom MCP : `node_setLightSettings`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 8.3, 8.5, 24.4, 26.4, 26.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `color` | color | False | `{}` |
| `skyColor` | color | False | `{}` |
| `groundColor` | color | False | `{}` |
| `intensity` | number | False | `{"min":0}` |
| `relative` | boolean | False | `{}` |
| `distance` | number | False | `{"min":0}` |
| `decay` | number | False | `{"min":0,"max":4}` |
| `angle` | number | False | `{"min":0.01,"max":1.5707963267948966}` |
| `penumbra` | number | False | `{"min":0,"max":1}` |
| `targetX` | number | False | `{}` |
| `targetY` | number | False | `{}` |
| `targetZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setLightSettings/001` | Nominal minimal : demander « Régler une lumière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setLightSettings/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setLightSettings/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setLightSettings/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setLightSettings/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setLightSettings/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setLightSettings/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setLightSettings/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setLightSettings/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setLightSettings/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setLightSettings/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setLightSettings/013` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/014` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/015` | Paramètre skyColor absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/016` | Paramètre skyColor avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/017` | Paramètre groundColor absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/018` | Paramètre groundColor avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/019` | Paramètre intensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/020` | Paramètre intensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/021` | Valeur de intensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/022` | Borne min de intensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/023` | Paramètre relative absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/024` | Paramètre relative avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/025` | Booléen relative : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `node.setLightSettings/026` | Paramètre distance absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/027` | Paramètre distance avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/028` | Valeur de distance : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/029` | Borne min de distance = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/030` | Paramètre decay absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/031` | Paramètre decay avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/032` | Valeur de decay : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/033` | Borne min de decay = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/034` | Borne max de decay = 4 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/035` | Paramètre angle absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/036` | Paramètre angle avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/037` | Valeur de angle : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/038` | Borne min de angle = 0.01 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/039` | Borne max de angle = 1.5707963267948966 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/040` | Paramètre penumbra absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/041` | Paramètre penumbra avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/042` | Valeur de penumbra : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/043` | Borne min de penumbra = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/044` | Borne max de penumbra = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setLightSettings/045` | Paramètre targetX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/046` | Paramètre targetX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/047` | Valeur de targetX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/048` | Paramètre targetY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/049` | Paramètre targetY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/050` | Valeur de targetY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setLightSettings/051` | Paramètre targetZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setLightSettings/052` | Paramètre targetZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setLightSettings/053` | Valeur de targetZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.setCameraLens — Régler l’objectif d’une caméra

Change l’angle de vue et les distances proche et lointaine d’une caméra. Où elle se tient se règle par la transformation, comme pour n’importe quel objet.

- Nom MCP : `node_setCameraLens`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 9.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `fov` | number | False | `{"min":1,"max":170}` |
| `near` | number | False | `{"min":0}` |
| `far` | number | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.setCameraLens/001` | Nominal minimal : demander « Régler l’objectif d’une caméra » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.setCameraLens/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.setCameraLens/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.setCameraLens/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.setCameraLens/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.setCameraLens/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.setCameraLens/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.setCameraLens/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.setCameraLens/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.setCameraLens/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setCameraLens/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.setCameraLens/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.setCameraLens/013` | Paramètre fov absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setCameraLens/014` | Paramètre fov avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setCameraLens/015` | Valeur de fov : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setCameraLens/016` | Borne min de fov = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setCameraLens/017` | Borne max de fov = 170 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setCameraLens/018` | Paramètre near absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setCameraLens/019` | Paramètre near avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setCameraLens/020` | Valeur de near : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setCameraLens/021` | Borne min de near = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `node.setCameraLens/022` | Paramètre far absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.setCameraLens/023` | Paramètre far avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.setCameraLens/024` | Valeur de far : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `node.setCameraLens/025` | Borne min de far = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## camera.addShot — Mettre une caméra à l’antenne

Ouvre un plan pour cette caméra, à partir de l’instant donné en secondes, et répond son identifiant. La ligne où il se pose suit la règle de la bande, où une caméra qui n’y figurait pas encore arrive au-dessus. Une caméra qui a un plan est la caméra ACTIVE, celle par laquelle la scène est vue.

- Nom MCP : `camera_addShot`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{"returns":["cameraShots"]}`.
- Batterie existante : 9.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `startSeconds` | number | False | `{"min":0}` |
| `durationSeconds` | number | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `camera.addShot/001` | Nominal minimal : demander « Mettre une caméra à l’antenne » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `camera.addShot/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `camera.addShot/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `camera.addShot/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `camera.addShot/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `camera.addShot/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `camera.addShot/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `camera.addShot/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `camera.addShot/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.addShot/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.addShot/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.addShot/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `camera.addShot/013` | Paramètre startSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.addShot/014` | Paramètre startSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.addShot/015` | Valeur de startSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.addShot/016` | Borne min de startSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `camera.addShot/017` | Paramètre durationSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.addShot/018` | Paramètre durationSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.addShot/019` | Valeur de durationSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.addShot/020` | Borne min de durationSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## camera.bindPathToShot — Faire courir une caméra sur un chemin

Lie un chemin au plan désigné, que la caméra parcourt alors pendant toute la durée du plan, à vitesse régulière le long de sa longueur. Sans chemin, le plan ne déplace plus la caméra. Un départ plus grand que l’arrivée fait rouler le chemin à l’envers.

- Nom MCP : `camera_bindPathToShot`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{"uses":["cameraShots"]}`.
- Batterie existante : 47.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `shotId` | text | True | `{"reference":"shot"}` |
| `pathId` | text | False | `{}` |
| `from` | number | False | `{}` |
| `to` | number | False | `{}` |
| `easing` | choice | False | `{"options":["linear","easeIn","easeOut","easeInOut"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["shotId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `camera.bindPathToShot/001` | Nominal minimal : demander « Faire courir une caméra sur un chemin » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `camera.bindPathToShot/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `camera.bindPathToShot/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `camera.bindPathToShot/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `camera.bindPathToShot/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `camera.bindPathToShot/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `camera.bindPathToShot/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `camera.bindPathToShot/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `camera.bindPathToShot/009` | Paramètre shotId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.bindPathToShot/010` | Paramètre shotId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.bindPathToShot/011` | Texte shotId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.bindPathToShot/012` | Cible shotId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `camera.bindPathToShot/013` | Paramètre pathId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.bindPathToShot/014` | Paramètre pathId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.bindPathToShot/015` | Texte pathId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.bindPathToShot/016` | Paramètre from absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.bindPathToShot/017` | Paramètre from avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.bindPathToShot/018` | Valeur de from : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.bindPathToShot/019` | Paramètre to absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.bindPathToShot/020` | Paramètre to avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.bindPathToShot/021` | Valeur de to : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.bindPathToShot/022` | Paramètre easing absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.bindPathToShot/023` | Paramètre easing avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.bindPathToShot/024` | Option de easing : "linear" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `camera.bindPathToShot/025` | Option de easing : "easeIn" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `camera.bindPathToShot/026` | Option de easing : "easeOut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `camera.bindPathToShot/027` | Option de easing : "easeInOut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `camera.bindPathToShot/028` | Option inconnue de easing : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## camera.createAndBindPath — Poser un chemin sous une caméra

Crée un chemin là où la caméra se tient, orienté dans sa ligne de visée, et le lie au plan en un seul geste. L’action voisine lie un chemin qui existe déjà, quand celle-ci en fabrique un — un chemin ne conduit rien sans un plan pour le parcourir.

- Nom MCP : `camera_createAndBindPath`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{"uses":["cameraShots"]}`.
- Batterie existante : 47.1, 47.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `shotId` | text | True | `{"reference":"shot"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["shotId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `camera.createAndBindPath/001` | Nominal minimal : demander « Poser un chemin sous une caméra » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `camera.createAndBindPath/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `camera.createAndBindPath/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `camera.createAndBindPath/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `camera.createAndBindPath/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `camera.createAndBindPath/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `camera.createAndBindPath/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `camera.createAndBindPath/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `camera.createAndBindPath/009` | Paramètre shotId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.createAndBindPath/010` | Paramètre shotId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.createAndBindPath/011` | Texte shotId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.createAndBindPath/012` | Cible shotId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## camera.reorder — Changer le rang d’une caméra sur la bande

Monte ou descend la ligne d’une caméra, ce qui décide de ce que le film regarde quand deux plans se recouvrent. Le nombre est un nombre de rangs, négatif pour descendre, et la réponse dit de combien la ligne a pu bouger.

- Nom MCP : `camera_reorder`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 47.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `by` | integer | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","by"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `camera.reorder/001` | Nominal minimal : demander « Changer le rang d’une caméra sur la bande » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `camera.reorder/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `camera.reorder/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `camera.reorder/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `camera.reorder/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `camera.reorder/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `camera.reorder/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `camera.reorder/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `camera.reorder/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.reorder/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.reorder/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.reorder/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `camera.reorder/013` | Paramètre by absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.reorder/014` | Paramètre by avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## camera.aimShotAt — Donner une cible à une caméra

Oriente la caméra du plan désigné vers un objet — qu’elle suit même s’il est animé — ou vers un point fixe. Sans objet ni point, la caméra reste orientée par sa seule rotation.

- Nom MCP : `camera_aimShotAt`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{"uses":["cameraShots"]}`.
- Batterie existante : 9.3, 9.4, 14.2, 24.5, 24.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `shotId` | text | True | `{"reference":"shot"}` |
| `targetId` | text | False | `{}` |
| `atX` | number | False | `{}` |
| `atY` | number | False | `{}` |
| `atZ` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["shotId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `camera.aimShotAt/001` | Nominal minimal : demander « Donner une cible à une caméra » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `camera.aimShotAt/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `camera.aimShotAt/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `camera.aimShotAt/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `camera.aimShotAt/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `camera.aimShotAt/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `camera.aimShotAt/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `camera.aimShotAt/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `camera.aimShotAt/009` | Paramètre shotId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `camera.aimShotAt/010` | Paramètre shotId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.aimShotAt/011` | Texte shotId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.aimShotAt/012` | Cible shotId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `camera.aimShotAt/013` | Paramètre targetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.aimShotAt/014` | Paramètre targetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.aimShotAt/015` | Texte targetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `camera.aimShotAt/016` | Paramètre atX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.aimShotAt/017` | Paramètre atX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.aimShotAt/018` | Valeur de atX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.aimShotAt/019` | Paramètre atY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.aimShotAt/020` | Paramètre atY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.aimShotAt/021` | Valeur de atY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `camera.aimShotAt/022` | Paramètre atZ absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `camera.aimShotAt/023` | Paramètre atZ avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `camera.aimShotAt/024` | Valeur de atZ : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.reparent — Rattacher un objet

Accroche un objet sous un autre, ou sous la scène elle-même quand aucun parent n’est donné, et le place où on veut parmi ses nouveaux voisins. Donner une place sans donner de parent remonte donc l’objet à la scène : répéter le parent pour ne changer que la place. L’objet garde sa transformation, qui se lit alors relativement à son nouveau parent.

- Nom MCP : `node_reparent`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 46.8, 46.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `parentId` | text | False | `{}` |
| `index` | integer | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.reparent/001` | Nominal minimal : demander « Rattacher un objet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.reparent/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.reparent/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.reparent/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.reparent/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.reparent/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.reparent/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.reparent/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.reparent/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.reparent/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.reparent/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.reparent/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `node.reparent/013` | Paramètre parentId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.reparent/014` | Paramètre parentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.reparent/015` | Texte parentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.reparent/016` | Paramètre index absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `node.reparent/017` | Paramètre index avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## node.select — Sélectionner des objets

Fait de ces objets la sélection que lit l’inspecteur et que déplace le manipulateur. Une sélection n’est pas une édition, donc rien ne s’ajoute à l’historique.

- Nom MCP : `node_select`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 28.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `node.select/001` | Nominal minimal : demander « Sélectionner des objets » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `node.select/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `node.select/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `node.select/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `node.select/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `node.select/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `node.select/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `node.select/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `node.select/009` | Paramètre nodeIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `node.select/010` | Paramètre nodeIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `node.select/011` | Texte nodeIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `node.select/012` | Liste nodeIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## view.direction — Regarder la scène depuis une face

Place la caméra de la vue principale face au dessus, au dessous, à l’avant, à l’arrière, à la gauche ou à la droite de la scène. C’est un déplacement, donc rien ne s’ajoute à l’historique.

- Nom MCP : `view_direction`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 47.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `direction` | choice | True | `{"options":["front","back","left","right","top","bottom"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["direction"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `view.direction/001` | Nominal minimal : demander « Regarder la scène depuis une face » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `view.direction/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `view.direction/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `view.direction/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `view.direction/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `view.direction/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `view.direction/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `view.direction/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `view.direction/009` | Paramètre direction absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `view.direction/010` | Paramètre direction avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `view.direction/011` | Option de direction : "front" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/012` | Option de direction : "back" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/013` | Option de direction : "left" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/014` | Option de direction : "right" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/015` | Option de direction : "top" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/016` | Option de direction : "bottom" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.direction/017` | Option inconnue de direction : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## view.setDisplayMode — Choisir la façon de dessiner la scène

Passe la vue principale en ombré, en fil de fer, en matière seule ou dans l’une des autres façons de dessiner. La commande de menu ne fait que tourner d’une à l’autre, quand celle-ci nomme laquelle.

- Nom MCP : `view_setDisplayMode`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 47.5, 71.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `mode` | choice | True | `{"options":["shaded","wireframe","both","solid","material","studio","matcap","density","ghost","skeleton"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["mode"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `view.setDisplayMode/001` | Nominal minimal : demander « Choisir la façon de dessiner la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `view.setDisplayMode/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `view.setDisplayMode/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `view.setDisplayMode/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `view.setDisplayMode/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `view.setDisplayMode/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `view.setDisplayMode/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `view.setDisplayMode/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `view.setDisplayMode/009` | Paramètre mode absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `view.setDisplayMode/010` | Paramètre mode avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `view.setDisplayMode/011` | Option de mode : "shaded" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/012` | Option de mode : "wireframe" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/013` | Option de mode : "both" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/014` | Option de mode : "solid" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/015` | Option de mode : "material" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/016` | Option de mode : "studio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/017` | Option de mode : "matcap" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/018` | Option de mode : "density" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/019` | Option de mode : "ghost" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/020` | Option de mode : "skeleton" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `view.setDisplayMode/021` | Option inconnue de mode : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## scene.capture — Prendre une image de la vue 3D

Écrit une image de ce que la vue montre dans les images du projet, à la définition demandée. Le cadrage ne change jamais — seul le nombre de pixels bouge, sinon la capture montrerait autre chose que l’écran.

- Nom MCP : `scene_capture`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 47.6, 71.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `quality` | choice | False | `{"options":["view","fullHd","quadHd","ultraHd"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `scene.capture/001` | Nominal minimal : demander « Prendre une image de la vue 3D » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `scene.capture/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `scene.capture/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `scene.capture/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `scene.capture/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `scene.capture/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `scene.capture/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `scene.capture/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `scene.capture/009` | Paramètre quality absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `scene.capture/010` | Paramètre quality avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `scene.capture/011` | Option de quality : "view" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `scene.capture/012` | Option de quality : "fullHd" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `scene.capture/013` | Option de quality : "quadHd" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `scene.capture/014` | Option de quality : "ultraHd" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `scene.capture/015` | Option inconnue de quality : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.applyPreset — Appliquer un décor tout prêt

Règle d’un coup l’éclairage, le fond, la brume et le rendu d’une scène pour un genre de rendu. Chaque décor n’écrit que les champs dont il parle et laisse le reste tel quel, donc un sol allumé le reste.

- Nom MCP : `world_applyPreset`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 48.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `preset` | choice | True | `{"options":["neutral","studio","product","outdoor","night"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["preset"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.applyPreset/001` | Nominal minimal : demander « Appliquer un décor tout prêt » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.applyPreset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.applyPreset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.applyPreset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.applyPreset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.applyPreset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.applyPreset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.applyPreset/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.applyPreset/009` | Paramètre preset absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `world.applyPreset/010` | Paramètre preset avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.applyPreset/011` | Option de preset : "neutral" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.applyPreset/012` | Option de preset : "studio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.applyPreset/013` | Option de preset : "product" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.applyPreset/014` | Option de preset : "outdoor" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.applyPreset/015` | Option de preset : "night" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.applyPreset/016` | Option inconnue de preset : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setSceneLighting — Choisir ce qui éclaire la scène

Éclaire la scène par le studio procédural, par une image du projet nommée par son identifiant d’asset, ou par un document ciel nommé par son titre — la scène prend alors son image étalonnée, son soleil et son intensité. Règle aussi l’intensité de cet éclairage et sa rotation autour de la verticale, posées par-dessus.

- Nom MCP : `world_setSceneLighting`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 10.2, 10.3, 10.7, 23.2, 27.3, 31.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | False | `{"options":["studio","skybox","sky"]}` |
| `assetId` | text | False | `{}` |
| `sky` | text | False | `{}` |
| `intensity` | number | False | `{"min":0,"max":3}` |
| `rotation` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setSceneLighting/001` | Nominal minimal : demander « Choisir ce qui éclaire la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setSceneLighting/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setSceneLighting/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setSceneLighting/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setSceneLighting/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setSceneLighting/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setSceneLighting/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setSceneLighting/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setSceneLighting/009` | Paramètre kind absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setSceneLighting/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setSceneLighting/011` | Option de kind : "studio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setSceneLighting/012` | Option de kind : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setSceneLighting/013` | Option de kind : "sky" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setSceneLighting/014` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `world.setSceneLighting/015` | Paramètre assetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setSceneLighting/016` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setSceneLighting/017` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `world.setSceneLighting/018` | Paramètre sky absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setSceneLighting/019` | Paramètre sky avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setSceneLighting/020` | Texte sky : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `world.setSceneLighting/021` | Paramètre intensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setSceneLighting/022` | Paramètre intensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setSceneLighting/023` | Valeur de intensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setSceneLighting/024` | Borne min de intensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setSceneLighting/025` | Borne max de intensity = 3 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setSceneLighting/026` | Paramètre rotation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setSceneLighting/027` | Paramètre rotation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setSceneLighting/028` | Valeur de rotation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setBackground — Choisir ce qui est derrière la scène

Pose derrière la scène l’environnement lui-même, une couleur unie, ou rien du tout — ce dernier cas laissant le fond transparent, ce que veut une capture destinée à être posée sur autre chose.

- Nom MCP : `world_setBackground`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 10.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | True | `{"options":["environment","color","transparent"]}` |
| `color` | color | False | `{}` |
| `blur` | number | False | `{"min":0,"max":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["kind"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setBackground/001` | Nominal minimal : demander « Choisir ce qui est derrière la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setBackground/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setBackground/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setBackground/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setBackground/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setBackground/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setBackground/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setBackground/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setBackground/009` | Paramètre kind absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `world.setBackground/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setBackground/011` | Option de kind : "environment" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setBackground/012` | Option de kind : "color" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setBackground/013` | Option de kind : "transparent" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setBackground/014` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `world.setBackground/015` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setBackground/016` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setBackground/017` | Paramètre blur absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setBackground/018` | Paramètre blur avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setBackground/019` | Valeur de blur : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setBackground/020` | Borne min de blur = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setBackground/021` | Borne max de blur = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setFog — Régler la brume de la scène

Éteint la brume, la fait fondre entre deux distances, ou l’épaissit avec la profondeur. La couleur et les distances ne valent que pour la forme choisie, et sont laissées telles quelles sinon.

- Nom MCP : `world_setFog`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 48.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | True | `{"options":["none","linear","exp2"]}` |
| `color` | color | False | `{}` |
| `near` | number | False | `{}` |
| `far` | number | False | `{}` |
| `density` | number | False | `{"min":0.001,"max":0.2}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["kind"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setFog/001` | Nominal minimal : demander « Régler la brume de la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setFog/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setFog/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setFog/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setFog/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setFog/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setFog/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setFog/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setFog/009` | Paramètre kind absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `world.setFog/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setFog/011` | Option de kind : "none" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setFog/012` | Option de kind : "linear" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setFog/013` | Option de kind : "exp2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setFog/014` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `world.setFog/015` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setFog/016` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setFog/017` | Paramètre near absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setFog/018` | Paramètre near avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setFog/019` | Valeur de near : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setFog/020` | Paramètre far absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setFog/021` | Paramètre far avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setFog/022` | Valeur de far : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setFog/023` | Paramètre density absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setFog/024` | Paramètre density avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setFog/025` | Valeur de density : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setFog/026` | Borne min de density = 0.001 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setFog/027` | Borne max de density = 0.2 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setGroundPlane — Régler le sol de la scène

Montre ou masque le sol que la scène possède, et règle sa couleur, son côté, son opacité et si les ombres s’y posent. C’est ainsi qu’un sol s’AJOUTE à une scène : une surface ajoutée comme objet reste un objet parmi les autres, pas le sol. Ce sol appartient au document, contrairement à la grille, qui est un réglage de l’application.

- Nom MCP : `world_setGroundPlane`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 48.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `visible` | boolean | False | `{}` |
| `color` | color | False | `{}` |
| `size` | number | False | `{"min":1,"max":500}` |
| `opacity` | number | False | `{"min":0,"max":1}` |
| `receiveShadow` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setGroundPlane/001` | Nominal minimal : demander « Régler le sol de la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setGroundPlane/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setGroundPlane/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setGroundPlane/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setGroundPlane/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setGroundPlane/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setGroundPlane/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setGroundPlane/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setGroundPlane/009` | Paramètre visible absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setGroundPlane/010` | Paramètre visible avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setGroundPlane/011` | Booléen visible : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `world.setGroundPlane/012` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setGroundPlane/013` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setGroundPlane/014` | Paramètre size absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setGroundPlane/015` | Paramètre size avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setGroundPlane/016` | Valeur de size : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setGroundPlane/017` | Borne min de size = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setGroundPlane/018` | Borne max de size = 500 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setGroundPlane/019` | Paramètre opacity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setGroundPlane/020` | Paramètre opacity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setGroundPlane/021` | Valeur de opacity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setGroundPlane/022` | Borne min de opacity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setGroundPlane/023` | Borne max de opacity = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setGroundPlane/024` | Paramètre receiveShadow absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setGroundPlane/025` | Paramètre receiveShadow avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setGroundPlane/026` | Booléen receiveShadow : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setLayers — Remplacer les couches de relief et de semis

Remplace la liste complète et validée des couches de relief et de semis de la scène. Lire d’abord les couches présentes avec scene.state avant d’en modifier une.

- Nom MCP : `world_setLayers`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 48.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layers` | raw | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layers"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setLayers/001` | Nominal minimal : demander « Remplacer les couches de relief et de semis » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setLayers/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setLayers/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setLayers/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setLayers/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setLayers/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setLayers/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setLayers/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setLayers/009` | Paramètre layers absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `world.setLayers/010` | Paramètre layers avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setLayers/011` | Liste layers : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## world.setToneMapping — Régler le rendu de la scène

Choisit comment la plage dynamique est ramenée sur l’écran, et de combien de diaphragmes elle est exposée. Les deux appartiennent au document, pas à la fenêtre qui le regarde.

- Nom MCP : `world_setToneMapping`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 48.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `toneMapping` | choice | False | `{"options":["none","linear","reinhard","cineon","aces"]}` |
| `exposure` | number | False | `{"min":0,"max":3}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `world.setToneMapping/001` | Nominal minimal : demander « Régler le rendu de la scène » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `world.setToneMapping/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `world.setToneMapping/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `world.setToneMapping/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `world.setToneMapping/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `world.setToneMapping/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `world.setToneMapping/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `world.setToneMapping/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `world.setToneMapping/009` | Paramètre toneMapping absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setToneMapping/010` | Paramètre toneMapping avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setToneMapping/011` | Option de toneMapping : "none" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setToneMapping/012` | Option de toneMapping : "linear" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setToneMapping/013` | Option de toneMapping : "reinhard" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setToneMapping/014` | Option de toneMapping : "cineon" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setToneMapping/015` | Option de toneMapping : "aces" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `world.setToneMapping/016` | Option inconnue de toneMapping : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `world.setToneMapping/017` | Paramètre exposure absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `world.setToneMapping/018` | Paramètre exposure avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `world.setToneMapping/019` | Valeur de exposure : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `world.setToneMapping/020` | Borne min de exposure = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `world.setToneMapping/021` | Borne max de exposure = 3 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
