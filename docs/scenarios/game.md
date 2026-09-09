# Composants de jeu — 3 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer l’état métier avant/après avec un lecteur indépendant, puis la persistance si l’action en prévoit une.

## component.attach — Attacher un composant

Donne à un objet de la scène quelque chose à FAIRE pendant la partie — sa santé, son mouvement. C’est ainsi qu’un objet se met à bouger tout seul : node.transform le pose une fois quelque part et il y reste. Refusé si l’objet en porte déjà un de ce type.

- Nom MCP : `component_attach`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["node"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 60.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `type` | choice | True | `{"options":["Player","Health","Movement","Path","Follow","Orbit","LookAt","Patrol","Spin","SpringArm","Collider","RigidBody","Trigger","CharacterController","Vehicle","Aircraft","Script","Animator"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","type"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `component.attach/001` | Nominal minimal : demander « Attacher un composant » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `component.attach/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `component.attach/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `component.attach/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `component.attach/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `component.attach/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `component.attach/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `component.attach/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `component.attach/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.attach/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.attach/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `component.attach/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `component.attach/013` | Paramètre type absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.attach/014` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.attach/015` | Option de type : "Player" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/016` | Option de type : "Health" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/017` | Option de type : "Movement" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/018` | Option de type : "Path" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/019` | Option de type : "Follow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/020` | Option de type : "Orbit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/021` | Option de type : "LookAt" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/022` | Option de type : "Patrol" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/023` | Option de type : "Spin" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/024` | Option de type : "SpringArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/025` | Option de type : "Collider" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/026` | Option de type : "RigidBody" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/027` | Option de type : "Trigger" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/028` | Option de type : "CharacterController" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/029` | Option de type : "Vehicle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/030` | Option de type : "Aircraft" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/031` | Option de type : "Script" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/032` | Option de type : "Animator" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.attach/033` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## component.detach — Détacher un composant

Retire d’un objet de la scène le composant du type nommé. Refusé si l’objet ne le porte pas.

- Nom MCP : `component_detach`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["node"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 60.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `type` | choice | True | `{"options":["Player","Health","Movement","Path","Follow","Orbit","LookAt","Patrol","Spin","SpringArm","Collider","RigidBody","Trigger","CharacterController","Vehicle","Aircraft","Script","Animator"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","type"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `component.detach/001` | Nominal minimal : demander « Détacher un composant » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `component.detach/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `component.detach/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `component.detach/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `component.detach/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `component.detach/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `component.detach/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `component.detach/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `component.detach/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.detach/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.detach/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `component.detach/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `component.detach/013` | Paramètre type absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.detach/014` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.detach/015` | Option de type : "Player" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/016` | Option de type : "Health" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/017` | Option de type : "Movement" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/018` | Option de type : "Path" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/019` | Option de type : "Follow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/020` | Option de type : "Orbit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/021` | Option de type : "LookAt" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/022` | Option de type : "Patrol" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/023` | Option de type : "Spin" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/024` | Option de type : "SpringArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/025` | Option de type : "Collider" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/026` | Option de type : "RigidBody" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/027` | Option de type : "Trigger" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/028` | Option de type : "CharacterController" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/029` | Option de type : "Vehicle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/030` | Option de type : "Aircraft" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/031` | Option de type : "Script" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/032` | Option de type : "Animator" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.detach/033` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## component.setProperties — Régler un composant

Écrit un champ d’un composant que l’objet porte. Un champ que le composant ne déclare pas est ignoré.

- Nom MCP : `component_setProperties`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["node"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 60.2, 60.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `type` | choice | True | `{"options":["Player","Health","Movement","Path","Follow","Orbit","LookAt","Patrol","Spin","SpringArm","Collider","RigidBody","Trigger","CharacterController","Vehicle","Aircraft","Script","Animator"]}` |
| `field` | text | True | `{}` |
| `value` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","type","field","value"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `component.setProperties/001` | Nominal minimal : demander « Régler un composant » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `component.setProperties/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `component.setProperties/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `component.setProperties/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `component.setProperties/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `component.setProperties/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `component.setProperties/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `component.setProperties/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `component.setProperties/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.setProperties/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.setProperties/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `component.setProperties/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `component.setProperties/013` | Paramètre type absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.setProperties/014` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.setProperties/015` | Option de type : "Player" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/016` | Option de type : "Health" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/017` | Option de type : "Movement" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/018` | Option de type : "Path" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/019` | Option de type : "Follow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/020` | Option de type : "Orbit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/021` | Option de type : "LookAt" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/022` | Option de type : "Patrol" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/023` | Option de type : "Spin" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/024` | Option de type : "SpringArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/025` | Option de type : "Collider" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/026` | Option de type : "RigidBody" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/027` | Option de type : "Trigger" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/028` | Option de type : "CharacterController" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/029` | Option de type : "Vehicle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/030` | Option de type : "Aircraft" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/031` | Option de type : "Script" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/032` | Option de type : "Animator" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `component.setProperties/033` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `component.setProperties/034` | Paramètre field absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.setProperties/035` | Paramètre field avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.setProperties/036` | Texte field : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `component.setProperties/037` | Paramètre value absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `component.setProperties/038` | Paramètre value avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `component.setProperties/039` | Texte value : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
