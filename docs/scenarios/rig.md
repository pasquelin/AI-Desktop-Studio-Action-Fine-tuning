# Squelette et animation — 25 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer os, parentage, rôles, IK et clés à des temps connus ; contrôler la pose et les sujets non ciblés.

## rig.state — Lire le squelette d’un personnage

Rend les os d’un modèle avec leurs rôles, les poignées que ses articulations atteignent, les blocs posés sur sa bande, et ce que le moteur a mesuré de la maille.

- Nom MCP : `rig_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `rig.state/001` | Nominal minimal : demander « Lire le squelette d’un personnage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `rig.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `rig.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `rig.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `rig.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `rig.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `rig.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `rig.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## rig.fit — Rendre un modèle animable

Pose sur la maille le squelette que le studio ajuste à ce qu’il en a mesuré. Refuse tant que le moteur n’a pas lu le modèle, ce qui est une attente et non une faute.

- Nom MCP : `rig_fit`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `rig.fit/001` | Nominal minimal : demander « Rendre un modèle animable » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `rig.fit/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `rig.fit/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `rig.fit/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `rig.fit/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `rig.fit/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `rig.fit/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `rig.fit/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## rig.clear — Retirer le squelette d’un modèle

Rend le modèle à son état de maille, sans os ni poignées. Le geste s’annule comme tous les autres de la scène.

- Nom MCP : `rig_clear`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `rig.clear/001` | Nominal minimal : demander « Retirer le squelette d’un modèle » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `rig.clear/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `rig.clear/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `rig.clear/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `rig.clear/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `rig.clear/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `rig.clear/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `rig.clear/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## rig.configureHands — Ajouter les os des doigts

Pose les trente os de doigts au repos sur les mains que le squelette porte déjà. Sans mains reconnues, rien n’est écrit.

- Nom MCP : `rig_configureHands`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `rig.configureHands/001` | Nominal minimal : demander « Ajouter les os des doigts » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `rig.configureHands/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `rig.configureHands/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `rig.configureHands/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `rig.configureHands/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `rig.configureHands/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `rig.configureHands/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `rig.configureHands/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## bone.add — Ajouter un os

Accroche un os sous celui qui est nommé, exactement à sa place — le manipulateur est ce qui le met où il doit aller. Son nom est composé de celui du parent.

- Nom MCP : `bone_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `parent` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["parent"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `bone.add/001` | Nominal minimal : demander « Ajouter un os » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `bone.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `bone.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `bone.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `bone.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `bone.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `bone.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `bone.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `bone.add/009` | Paramètre parent absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `bone.add/010` | Paramètre parent avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.add/011` | Texte parent : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## bone.remove — Retirer un os

Sort un os du squelette et raccroche ses enfants là où il était accroché, de sorte qu’un coude s’en aille et que la main reste.

- Nom MCP : `bone_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `bone` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["bone"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `bone.remove/001` | Nominal minimal : demander « Retirer un os » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `bone.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `bone.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `bone.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `bone.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `bone.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `bone.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `bone.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `bone.remove/009` | Paramètre bone absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `bone.remove/010` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.remove/011` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## bone.rename — Renommer un os

Change le nom d’un os, ses enfants suivant tout seuls. Un nom déjà pris est refusé plutôt qu’écrit à moitié.

- Nom MCP : `bone_rename`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `bone` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["bone","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `bone.rename/001` | Nominal minimal : demander « Renommer un os » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `bone.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `bone.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `bone.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `bone.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `bone.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `bone.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `bone.rename/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `bone.rename/009` | Paramètre bone absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `bone.rename/010` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.rename/011` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `bone.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `bone.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## socket.add — Poser un point d’attache

Pose sur un os du personnage devant un point qu’un objet d’une scène peut suivre — une main, un dos. Le point vit dans le fichier du personnage.

- Nom MCP : `socket_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `bone` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["bone","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `socket.add/001` | Nominal minimal : demander « Poser un point d’attache » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `socket.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `socket.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `socket.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `socket.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `socket.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `socket.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `socket.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `socket.add/009` | Paramètre bone absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `socket.add/010` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `socket.add/011` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `socket.add/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `socket.add/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `socket.add/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## socket.remove — Retirer un point d’attache

Retire un point d’attache du personnage devant. Ce qui le suivait retombe sur le personnage lui-même.

- Nom MCP : `socket_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.13.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `socket.remove/001` | Nominal minimal : demander « Retirer un point d’attache » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `socket.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `socket.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `socket.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `socket.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `socket.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `socket.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `socket.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `socket.remove/009` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `socket.remove/010` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `socket.remove/011` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## bone.setRole — Dire quelle articulation un os EST

Rattache un os à l’une des articulations du standard humanoïde, ou à aucune quand le rôle est laissé vide. L’os qui tenait ce rôle le perd dans le même mouvement.

- Nom MCP : `bone_setRole`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `bone` | text | True | `{}` |
| `role` | choice | False | `{"options":["Hips","Spine","Chest","UpperChest","Neck","Head","LeftShoulder","LeftUpperArm","LeftLowerArm","LeftHand","RightShoulder","RightUpperArm","RightLowerArm","RightHand","LeftUpperLeg","LeftLowerLeg","LeftFoot","LeftToes","RightUpperLeg","RightLowerLeg","RightFoot","RightToes","LeftThumb1","LeftThumb2","LeftThumb3","LeftIndex1","LeftIndex2","LeftIndex3","LeftMiddle1","LeftMiddle2","LeftMiddle3","LeftRing1","LeftRing2","LeftRing3","LeftLittle1","LeftLittle2","LeftLittle3","RightThumb1","RightThumb2","RightThumb3","RightIndex1","RightIndex2","RightIndex3","RightMiddle1","RightMiddle2","RightMiddle3","RightRing1","RightRing2","RightRing3","RightLittle1","RightLittle2","RightLittle3"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["bone"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `bone.setRole/001` | Nominal minimal : demander « Dire quelle articulation un os EST » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `bone.setRole/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `bone.setRole/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `bone.setRole/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `bone.setRole/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `bone.setRole/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `bone.setRole/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `bone.setRole/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `bone.setRole/009` | Paramètre bone absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `bone.setRole/010` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.setRole/011` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `bone.setRole/012` | Paramètre role absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `bone.setRole/013` | Paramètre role avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `bone.setRole/014` | Option de role : "Hips" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/015` | Option de role : "Spine" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/016` | Option de role : "Chest" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/017` | Option de role : "UpperChest" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/018` | Option de role : "Neck" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/019` | Option de role : "Head" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/020` | Option de role : "LeftShoulder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/021` | Option de role : "LeftUpperArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/022` | Option de role : "LeftLowerArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/023` | Option de role : "LeftHand" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/024` | Option de role : "RightShoulder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/025` | Option de role : "RightUpperArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/026` | Option de role : "RightLowerArm" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/027` | Option de role : "RightHand" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/028` | Option de role : "LeftUpperLeg" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/029` | Option de role : "LeftLowerLeg" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/030` | Option de role : "LeftFoot" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/031` | Option de role : "LeftToes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/032` | Option de role : "RightUpperLeg" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/033` | Option de role : "RightLowerLeg" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/034` | Option de role : "RightFoot" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/035` | Option de role : "RightToes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/036` | Option de role : "LeftThumb1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/037` | Option de role : "LeftThumb2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/038` | Option de role : "LeftThumb3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/039` | Option de role : "LeftIndex1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/040` | Option de role : "LeftIndex2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/041` | Option de role : "LeftIndex3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/042` | Option de role : "LeftMiddle1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/043` | Option de role : "LeftMiddle2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/044` | Option de role : "LeftMiddle3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/045` | Option de role : "LeftRing1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/046` | Option de role : "LeftRing2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/047` | Option de role : "LeftRing3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/048` | Option de role : "LeftLittle1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/049` | Option de role : "LeftLittle2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/050` | Option de role : "LeftLittle3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/051` | Option de role : "RightThumb1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/052` | Option de role : "RightThumb2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/053` | Option de role : "RightThumb3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/054` | Option de role : "RightIndex1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/055` | Option de role : "RightIndex2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/056` | Option de role : "RightIndex3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/057` | Option de role : "RightMiddle1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/058` | Option de role : "RightMiddle2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/059` | Option de role : "RightMiddle3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/060` | Option de role : "RightRing1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/061` | Option de role : "RightRing2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/062` | Option de role : "RightRing3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/063` | Option de role : "RightLittle1" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/064` | Option de role : "RightLittle2" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/065` | Option de role : "RightLittle3" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `bone.setRole/066` | Option inconnue de role : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## ik.add — Poser une poignée sur une articulation

Ajoute une poignée qu’une articulation atteint, et la chaîne qui la suit — les deux os au-dessus tournent pour l’accompagner, ce qui pose un pied au sol ou une main sur une prise.

- Nom MCP : `ik_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `bone` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["bone"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `ik.add/001` | Nominal minimal : demander « Poser une poignée sur une articulation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `ik.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `ik.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `ik.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `ik.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `ik.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `ik.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `ik.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `ik.add/009` | Paramètre bone absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `ik.add/010` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ik.add/011` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## ik.remove — Retirer une poignée

Enlève une chaîne et la poignée qu’elle atteignait, toutes les deux, car une poignée laissée derrière serait un os que rien ne pilote.

- Nom MCP : `ik_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 50.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `chainId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["chainId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `ik.remove/001` | Nominal minimal : demander « Retirer une poignée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `ik.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `ik.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `ik.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `ik.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `ik.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `ik.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `ik.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `ik.remove/009` | Paramètre chainId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `ik.remove/010` | Paramètre chainId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `ik.remove/011` | Texte chainId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animations.list — Lister ce qu’un personnage peut jouer

Répond les trois provenances d’un mouvement — les clips que le fichier du modèle porte, les animations livrées avec le studio, et celles que la bibliothèque du projet garde. C’est ce qui répond à « quelles animations porte cette scène » ; les clés d’une bande se lisent avec scene.state.

- Nom MCP : `animations_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animations.list/001` | Nominal minimal : demander « Lister ce qu’un personnage peut jouer » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animations.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animations.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animations.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animations.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animations.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animations.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animations.list/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animations.list/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animations.list/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animations.list/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animations.list/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.reopenMotion — Rouvrir un mouvement de personnage

Remplace l’atelier d’animation par le mouvement enregistré dans un asset d’animation pour le modèle nommé. L’asset doit porter des données de mouvement créées par ce studio.

- Nom MCP : `animation_reopenMotion`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : **Aucune correspondance déclarée — priorité de conception.**.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `assetId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.reopenMotion/001` | Nominal minimal : demander « Rouvrir un mouvement de personnage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.reopenMotion/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.reopenMotion/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.reopenMotion/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.reopenMotion/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.reopenMotion/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.reopenMotion/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.reopenMotion/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.reopenMotion/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.reopenMotion/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.reopenMotion/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.reopenMotion/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `animation.reopenMotion/013` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.reopenMotion/014` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.reopenMotion/015` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.addBlock — Poser un bloc d’animation

Pose sur la bande d’un personnage un mouvement venu de l’une des trois provenances. L’identifiant nomme un asset de la bibliothèque, le nom nomme les deux autres, et un seul des deux appartient à un appel. La bande est créée si le personnage n’en avait aucune.

- Nom MCP : `animation_addBlock`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 13.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `source` | choice | False | `{"options":["embedded","bundled","asset"]}` |
| `assetId` | text | False | `{}` |
| `clipName` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.addBlock/001` | Nominal minimal : demander « Poser un bloc d’animation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.addBlock/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.addBlock/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.addBlock/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.addBlock/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.addBlock/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.addBlock/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.addBlock/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.addBlock/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.addBlock/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.addBlock/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.addBlock/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `animation.addBlock/013` | Paramètre source absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.addBlock/014` | Paramètre source avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.addBlock/015` | Option de source : "embedded" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.addBlock/016` | Option de source : "bundled" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.addBlock/017` | Option de source : "asset" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.addBlock/018` | Option inconnue de source : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `animation.addBlock/019` | Paramètre assetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.addBlock/020` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.addBlock/021` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.addBlock/022` | Paramètre clipName absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.addBlock/023` | Paramètre clipName avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.addBlock/024` | Texte clipName : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.removeBlock — Retirer un bloc d’animation

Enlève un bloc de la bande, où qu’il se trouve. La bande reste, vide s’il le faut.

- Nom MCP : `animation_removeBlock`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 13.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `clipId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","clipId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.removeBlock/001` | Nominal minimal : demander « Retirer un bloc d’animation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.removeBlock/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.removeBlock/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.removeBlock/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.removeBlock/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.removeBlock/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.removeBlock/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.removeBlock/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.removeBlock/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.removeBlock/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.removeBlock/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.removeBlock/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `animation.removeBlock/013` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.removeBlock/014` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.removeBlock/015` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.setBlockSettings — Régler un bloc d’animation

Change la place d’un bloc sur la bande, son départ à l’intérieur du mouvement, sa vitesse, sa boucle, la longueur de ses fondus, ce qu’il fait du déplacement de la racine et la partie du corps qu’il pilote. Le bloc est réécrit sur place, les autres couches restant intactes.

- Nom MCP : `animation_setBlockSettings`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `clipId` | text | True | `{}` |
| `startSeconds` | number | False | `{"min":0}` |
| `offsetSeconds` | number | False | `{"min":0}` |
| `speed` | number | False | `{"min":0.1,"max":4}` |
| `loop` | boolean | False | `{}` |
| `fadeSeconds` | number | False | `{"min":0,"max":1}` |
| `rootMotion` | choice | False | `{"options":["inPlace","travel","auto"]}` |
| `part` | choice | False | `{"options":["all","upper","lower"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","clipId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.setBlockSettings/001` | Nominal minimal : demander « Régler un bloc d’animation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.setBlockSettings/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.setBlockSettings/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.setBlockSettings/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.setBlockSettings/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.setBlockSettings/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.setBlockSettings/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.setBlockSettings/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.setBlockSettings/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.setBlockSettings/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.setBlockSettings/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `animation.setBlockSettings/013` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.setBlockSettings/014` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/015` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `animation.setBlockSettings/016` | Paramètre startSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/017` | Paramètre startSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/018` | Valeur de startSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `animation.setBlockSettings/019` | Borne min de startSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/020` | Paramètre offsetSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/021` | Paramètre offsetSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/022` | Valeur de offsetSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `animation.setBlockSettings/023` | Borne min de offsetSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/024` | Paramètre speed absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/025` | Paramètre speed avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/026` | Valeur de speed : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `animation.setBlockSettings/027` | Borne min de speed = 0.1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/028` | Borne max de speed = 4 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/029` | Paramètre loop absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/030` | Paramètre loop avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/031` | Booléen loop : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `animation.setBlockSettings/032` | Paramètre fadeSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/033` | Paramètre fadeSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/034` | Valeur de fadeSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `animation.setBlockSettings/035` | Borne min de fadeSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/036` | Borne max de fadeSeconds = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBlockSettings/037` | Paramètre rootMotion absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/038` | Paramètre rootMotion avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/039` | Option de rootMotion : "inPlace" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/040` | Option de rootMotion : "travel" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/041` | Option de rootMotion : "auto" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/042` | Option inconnue de rootMotion : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `animation.setBlockSettings/043` | Paramètre part absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBlockSettings/044` | Paramètre part avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBlockSettings/045` | Option de part : "all" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/046` | Option de part : "upper" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/047` | Option de part : "lower" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `animation.setBlockSettings/048` | Option inconnue de part : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.setBandLengthAndRate — Régler la bande d’animation

Change la durée de la bande, sa cadence en images par seconde, ou les deux. Ce qui n’est pas nommé n’est pas touché.

- Nom MCP : `animation_setBandLengthAndRate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 13.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `durationSeconds` | number | False | `{"min":0}` |
| `fps` | integer | False | `{"min":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.setBandLengthAndRate/001` | Nominal minimal : demander « Régler la bande d’animation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.setBandLengthAndRate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.setBandLengthAndRate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.setBandLengthAndRate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.setBandLengthAndRate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.setBandLengthAndRate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.setBandLengthAndRate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.setBandLengthAndRate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.setBandLengthAndRate/009` | Paramètre durationSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBandLengthAndRate/010` | Paramètre durationSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.setBandLengthAndRate/011` | Valeur de durationSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `animation.setBandLengthAndRate/012` | Borne min de durationSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `animation.setBandLengthAndRate/013` | Paramètre fps absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `animation.setBandLengthAndRate/014` | Paramètre fps avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## animation.autoKey — Activer la pose automatique de clés

Décide si déplacer un os écrit une clé au passage. C’est un état de session, comme toute façon de regarder une scène, et rien n’en est enregistré avec le document.

- Nom MCP : `animation_autoKey`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `on` | boolean | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["on"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `animation.autoKey/001` | Nominal minimal : demander « Activer la pose automatique de clés » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `animation.autoKey/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `animation.autoKey/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `animation.autoKey/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `animation.autoKey/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `animation.autoKey/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `animation.autoKey/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `animation.autoKey/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `animation.autoKey/009` | Paramètre on absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `animation.autoKey/010` | Paramètre on avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `animation.autoKey/011` | Booléen on : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## key.writePoseKeys — Poser une clé sur un sujet

Écrit une clé sur chaque canal d’un objet ou d’un os, à l’instant donné ou à la tête de lecture, en tenant la pose affichée à la tête de lecture — celle que node.transform a posée. Sur un objet animé, node.transform pose une clé à la tête de lecture elle-même ; pour poser un autre instant, y écrire la clé d’abord, puis placer l’objet avec la tête dessus. Les canaux qui manquent sont ouverts au passage, puisque exiger une piste d’abord serait réclamer ce qui se tient déjà dans la vue.

- Nom MCP : `key_writePoseKeys`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required","targets":["node"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 13.2, 13.3, 13.4, 14.1, 14.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `bone` | text | False | `{}` |
| `timeSeconds` | number | False | `{"min":0}` |
| `property` | choice | False | `{"options":["position","rotation","scale","fov"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `key.writePoseKeys/001` | Nominal minimal : demander « Poser une clé sur un sujet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `key.writePoseKeys/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `key.writePoseKeys/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `key.writePoseKeys/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `key.writePoseKeys/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `key.writePoseKeys/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `key.writePoseKeys/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `key.writePoseKeys/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `key.writePoseKeys/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `key.writePoseKeys/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.writePoseKeys/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `key.writePoseKeys/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `key.writePoseKeys/013` | Paramètre bone absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.writePoseKeys/014` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.writePoseKeys/015` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `key.writePoseKeys/016` | Paramètre timeSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.writePoseKeys/017` | Paramètre timeSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.writePoseKeys/018` | Valeur de timeSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `key.writePoseKeys/019` | Borne min de timeSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `key.writePoseKeys/020` | Paramètre property absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.writePoseKeys/021` | Paramètre property avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.writePoseKeys/022` | Option de property : "position" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `key.writePoseKeys/023` | Option de property : "rotation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `key.writePoseKeys/024` | Option de property : "scale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `key.writePoseKeys/025` | Option de property : "fov" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `key.writePoseKeys/026` | Option inconnue de property : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## key.removeSubjectKeys — Retirer les clés d’un sujet

Reprend la clé que chaque canal d’un objet ou d’un os tient à cet instant. Sans ce geste une pose serait sans retour, et rien d’autre du panneau n’en enlève une.

- Nom MCP : `key_removeSubjectKeys`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `bone` | text | False | `{}` |
| `timeSeconds` | number | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `key.removeSubjectKeys/001` | Nominal minimal : demander « Retirer les clés d’un sujet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `key.removeSubjectKeys/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `key.removeSubjectKeys/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `key.removeSubjectKeys/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `key.removeSubjectKeys/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `key.removeSubjectKeys/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `key.removeSubjectKeys/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `key.removeSubjectKeys/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `key.removeSubjectKeys/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `key.removeSubjectKeys/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.removeSubjectKeys/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `key.removeSubjectKeys/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `key.removeSubjectKeys/013` | Paramètre bone absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.removeSubjectKeys/014` | Paramètre bone avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.removeSubjectKeys/015` | Texte bone : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `key.removeSubjectKeys/016` | Paramètre timeSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.removeSubjectKeys/017` | Paramètre timeSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.removeSubjectKeys/018` | Valeur de timeSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `key.removeSubjectKeys/019` | Borne min de timeSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## key.writeKeysOnOpenChannels — Poser une clé sur tout ce qui est animé

Écrit une clé sur chaque canal déjà ouvert de la scène, à l’instant donné ou à la tête de lecture. N’en ouvre aucun, ce qui distingue ce geste de la pose sur un sujet.

- Nom MCP : `key_writeKeysOnOpenChannels`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `timeSeconds` | number | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `key.writeKeysOnOpenChannels/001` | Nominal minimal : demander « Poser une clé sur tout ce qui est animé » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `key.writeKeysOnOpenChannels/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `key.writeKeysOnOpenChannels/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `key.writeKeysOnOpenChannels/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `key.writeKeysOnOpenChannels/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `key.writeKeysOnOpenChannels/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `key.writeKeysOnOpenChannels/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `key.writeKeysOnOpenChannels/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `key.writeKeysOnOpenChannels/009` | Paramètre timeSeconds absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `key.writeKeysOnOpenChannels/010` | Paramètre timeSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.writeKeysOnOpenChannels/011` | Valeur de timeSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `key.writeKeysOnOpenChannels/012` | Borne min de timeSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## key.move — Déplacer une clé

Fait glisser une clé le long de son canal, en gardant sa valeur. Une clé qui arrive sur un instant qu’une autre occupe la remplace, deux clés sur une image étant un état qu’aucune lecture ne saurait relire.

- Nom MCP : `key_move`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required","targets":["node","track"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |
| `fromSeconds` | number | True | `{"min":0}` |
| `toSeconds` | number | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId","fromSeconds","toSeconds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `key.move/001` | Nominal minimal : demander « Déplacer une clé » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `key.move/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `key.move/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `key.move/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `key.move/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `key.move/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `key.move/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `key.move/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `key.move/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `key.move/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.move/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `key.move/012` | Paramètre fromSeconds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `key.move/013` | Paramètre fromSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.move/014` | Valeur de fromSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `key.move/015` | Borne min de fromSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `key.move/016` | Paramètre toSeconds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `key.move/017` | Paramètre toSeconds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `key.move/018` | Valeur de toSeconds : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `key.move/019` | Borne min de toSeconds = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## channel.remove — Retirer un canal d’animation

Enlève un canal et les clés qu’il portait. Un canal verrouillé est refusé plutôt que laissé en place en silence.

- Nom MCP : `channel_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 13.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `channel.remove/001` | Nominal minimal : demander « Retirer un canal d’animation » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `channel.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `channel.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `channel.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `channel.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `channel.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `channel.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `channel.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `channel.remove/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `channel.remove/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `channel.remove/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## channel.setMuteSoloLock — Régler les fanions d’un canal

Rend un canal muet, le met en solo, ou le verrouille. C’est une façon de travailler et non une modification du document, donc rien ne s’ajoute à l’historique.

- Nom MCP : `channel_setMuteSoloLock`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene","character"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 49.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |
| `muted` | boolean | False | `{}` |
| `solo` | boolean | False | `{}` |
| `locked` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `channel.setMuteSoloLock/001` | Nominal minimal : demander « Régler les fanions d’un canal » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `channel.setMuteSoloLock/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `channel.setMuteSoloLock/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `channel.setMuteSoloLock/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `channel.setMuteSoloLock/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `channel.setMuteSoloLock/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `channel.setMuteSoloLock/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `channel.setMuteSoloLock/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `channel.setMuteSoloLock/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `channel.setMuteSoloLock/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `channel.setMuteSoloLock/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `channel.setMuteSoloLock/012` | Paramètre muted absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `channel.setMuteSoloLock/013` | Paramètre muted avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `channel.setMuteSoloLock/014` | Booléen muted : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `channel.setMuteSoloLock/015` | Paramètre solo absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `channel.setMuteSoloLock/016` | Paramètre solo avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `channel.setMuteSoloLock/017` | Booléen solo : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `channel.setMuteSoloLock/018` | Paramètre locked absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `channel.setMuteSoloLock/019` | Paramètre locked avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `channel.setMuteSoloLock/020` | Booléen locked : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
