# Matériaux, skybox et styles — 16 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer canaux, intensités, environnement et styles ; vérifier rendu de référence dans la VM.

## skybox.state — Lire le ciel en cours d’édition

Rend le ciel devant — sa source équirectangulaire, ses réglages d’image, la position et la couleur de son soleil, et ce que son environnement éclaire — plus ce qui l’a produit s’il vient d’une génération.

- Nom MCP : `skybox_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.state/001` | Nominal minimal : demander « Lire le ciel en cours d’édition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.setViewportOptions — Régler la façon de regarder un ciel

Choisit la projection sous laquelle le ciel est dessiné, l’ouverture de l’objectif, et si les objets d’essai s’y tiennent. C’est un état de session, comme toute façon de regarder un document, et rien n’en est enregistré.

- Nom MCP : `skybox_setViewportOptions`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `view` | choice | False | `{"options":["immersive","equirect","cross","faces"]}` |
| `fieldOfView` | number | False | `{"min":50,"max":110}` |
| `probes` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.setViewportOptions/001` | Nominal minimal : demander « Régler la façon de regarder un ciel » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.setViewportOptions/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.setViewportOptions/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.setViewportOptions/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.setViewportOptions/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.setViewportOptions/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.setViewportOptions/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.setViewportOptions/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `skybox.setViewportOptions/009` | Paramètre view absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setViewportOptions/010` | Paramètre view avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setViewportOptions/011` | Option de view : "immersive" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `skybox.setViewportOptions/012` | Option de view : "equirect" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `skybox.setViewportOptions/013` | Option de view : "cross" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `skybox.setViewportOptions/014` | Option de view : "faces" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `skybox.setViewportOptions/015` | Option inconnue de view : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `skybox.setViewportOptions/016` | Paramètre fieldOfView absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setViewportOptions/017` | Paramètre fieldOfView avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setViewportOptions/018` | Valeur de fieldOfView : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.setViewportOptions/019` | Borne min de fieldOfView = 50 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.setViewportOptions/020` | Borne max de fieldOfView = 110 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.setViewportOptions/021` | Paramètre probes absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setViewportOptions/022` | Paramètre probes avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setViewportOptions/023` | Booléen probes : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.adjustImage — Régler l’image d’un ciel

Change l’exposition, le contraste, la saturation, la température, la teinte, la rotation d’horizon ou le flou. Chaque champ est facultatif, et ce qui n’est pas donné reste tel quel.

- Nom MCP : `skybox_adjustImage`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `exposure` | number | False | `{}` |
| `contrast` | number | False | `{"min":0}` |
| `saturation` | number | False | `{"min":0}` |
| `temperature` | number | False | `{"min":-1,"max":1}` |
| `tint` | number | False | `{"min":-1,"max":1}` |
| `rotationY` | number | False | `{}` |
| `blur` | number | False | `{"min":0,"max":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.adjustImage/001` | Nominal minimal : demander « Régler l’image d’un ciel » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.adjustImage/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.adjustImage/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.adjustImage/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.adjustImage/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.adjustImage/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.adjustImage/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.adjustImage/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `skybox.adjustImage/009` | Paramètre exposure absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/010` | Paramètre exposure avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/011` | Valeur de exposure : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/012` | Paramètre contrast absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/013` | Paramètre contrast avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/014` | Valeur de contrast : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/015` | Borne min de contrast = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/016` | Paramètre saturation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/017` | Paramètre saturation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/018` | Valeur de saturation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/019` | Borne min de saturation = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/020` | Paramètre temperature absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/021` | Paramètre temperature avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/022` | Valeur de temperature : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/023` | Borne min de temperature = -1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/024` | Borne max de temperature = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/025` | Paramètre tint absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/026` | Paramètre tint avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/027` | Valeur de tint : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/028` | Borne min de tint = -1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/029` | Borne max de tint = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/030` | Paramètre rotationY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/031` | Paramètre rotationY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/032` | Valeur de rotationY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/033` | Paramètre blur absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.adjustImage/034` | Paramètre blur avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.adjustImage/035` | Valeur de blur : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.adjustImage/036` | Borne min de blur = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.adjustImage/037` | Borne max de blur = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.resetAdjustments — Remettre les réglages d’image à neutre

Ramène d’un coup tous les réglages d’image du ciel à leur valeur neutre, en une seule entrée d’historique. La source et le soleil ne bougent pas.

- Nom MCP : `skybox_resetAdjustments`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.resetAdjustments/001` | Nominal minimal : demander « Remettre les réglages d’image à neutre » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.resetAdjustments/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.resetAdjustments/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.resetAdjustments/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.resetAdjustments/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.resetAdjustments/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.resetAdjustments/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.resetAdjustments/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.setSun — Placer et régler le soleil

Change l’élévation, l’azimut, l’intensité ou la couleur du soleil du ciel devant. Les deux angles sont en radians, comme partout dans la scène.

- Nom MCP : `skybox_setSun`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `elevation` | number | False | `{}` |
| `azimuth` | number | False | `{}` |
| `intensity` | number | False | `{"min":0}` |
| `color` | color | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.setSun/001` | Nominal minimal : demander « Placer et régler le soleil » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.setSun/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.setSun/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.setSun/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.setSun/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.setSun/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.setSun/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.setSun/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `skybox.setSun/009` | Paramètre elevation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setSun/010` | Paramètre elevation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setSun/011` | Valeur de elevation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.setSun/012` | Paramètre azimuth absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setSun/013` | Paramètre azimuth avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setSun/014` | Valeur de azimuth : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.setSun/015` | Paramètre intensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setSun/016` | Paramètre intensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setSun/017` | Valeur de intensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.setSun/018` | Borne min de intensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.setSun/019` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setSun/020` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.setPreviewLighting — Régler ce que le ciel éclaire

Change l’intensité de l’éclairage que le ciel donne aux objets d’essai, et décide si l’image est dessinée derrière eux ou se contente de les éclairer.

- Nom MCP : `skybox_setPreviewLighting`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 37.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `intensity` | number | False | `{"min":0}` |
| `showBackground` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.setPreviewLighting/001` | Nominal minimal : demander « Régler ce que le ciel éclaire » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.setPreviewLighting/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.setPreviewLighting/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.setPreviewLighting/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.setPreviewLighting/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.setPreviewLighting/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.setPreviewLighting/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.setPreviewLighting/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `skybox.setPreviewLighting/009` | Paramètre intensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setPreviewLighting/010` | Paramètre intensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setPreviewLighting/011` | Valeur de intensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `skybox.setPreviewLighting/012` | Borne min de intensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `skybox.setPreviewLighting/013` | Paramètre showBackground absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `skybox.setPreviewLighting/014` | Paramètre showBackground avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setPreviewLighting/015` | Booléen showBackground : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## skybox.setSourceImage — Choisir l’image d’un ciel

Accroche une image équirectangulaire de la bibliothèque dans le ciel devant. L’asset doit avoir un fichier sur la machine, une image restée dans le nuage n’ayant rien à décoder.

- Nom MCP : `skybox_setSourceImage`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{"uses":["projectAssetCandidates"]}`.
- Batterie existante : 37.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{"reference":"asset"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `skybox.setSourceImage/001` | Nominal minimal : demander « Choisir l’image d’un ciel » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `skybox.setSourceImage/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `skybox.setSourceImage/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `skybox.setSourceImage/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `skybox.setSourceImage/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `skybox.setSourceImage/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `skybox.setSourceImage/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `skybox.setSourceImage/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `skybox.setSourceImage/009` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `skybox.setSourceImage/010` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `skybox.setSourceImage/011` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `skybox.setSourceImage/012` | Cible assetId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## material.state — Lire la matière en cours d’édition

Rend la matière devant — les huit canaux et ce qui les remplit, tous les réglages de rendu comme la couleur, la rugosité et le pavage, et la façon dont l’aperçu est présenté.

- Nom MCP : `material_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 38.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `material.state/001` | Nominal minimal : demander « Lire la matière en cours d’édition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `material.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `material.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `material.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `material.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `material.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `material.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `material.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## material.setSurfaceSettings — Régler une matière

Change la teinte, la rugosité, le métal, le relief, l’occlusion, l’émission, le pavage, le décalage ou la rotation de la matière devant. Chaque champ est facultatif.

- Nom MCP : `material_setSurfaceSettings`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 38.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `color` | color | False | `{}` |
| `roughness` | number | False | `{"min":0,"max":1}` |
| `metalness` | number | False | `{"min":0,"max":1}` |
| `roughnessMin` | number | False | `{"min":0,"max":1}` |
| `roughnessMax` | number | False | `{"min":0,"max":1}` |
| `metalnessMin` | number | False | `{"min":0,"max":1}` |
| `metalnessMax` | number | False | `{"min":0,"max":1}` |
| `normalScale` | number | False | `{}` |
| `heightScale` | number | False | `{}` |
| `aoIntensity` | number | False | `{"min":0}` |
| `edgeIntensity` | number | False | `{"min":0}` |
| `emissive` | color | False | `{}` |
| `emissiveIntensity` | number | False | `{"min":0}` |
| `tilingX` | number | False | `{}` |
| `tilingY` | number | False | `{}` |
| `offsetX` | number | False | `{}` |
| `offsetY` | number | False | `{}` |
| `rotation` | number | False | `{}` |
| `invertNormalGreen` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `material.setSurfaceSettings/001` | Nominal minimal : demander « Régler une matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `material.setSurfaceSettings/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `material.setSurfaceSettings/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `material.setSurfaceSettings/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `material.setSurfaceSettings/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `material.setSurfaceSettings/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `material.setSurfaceSettings/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `material.setSurfaceSettings/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `material.setSurfaceSettings/009` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/010` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/011` | Paramètre roughness absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/012` | Paramètre roughness avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/013` | Valeur de roughness : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/014` | Borne min de roughness = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/015` | Borne max de roughness = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/016` | Paramètre metalness absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/017` | Paramètre metalness avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/018` | Valeur de metalness : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/019` | Borne min de metalness = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/020` | Borne max de metalness = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/021` | Paramètre roughnessMin absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/022` | Paramètre roughnessMin avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/023` | Valeur de roughnessMin : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/024` | Borne min de roughnessMin = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/025` | Borne max de roughnessMin = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/026` | Paramètre roughnessMax absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/027` | Paramètre roughnessMax avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/028` | Valeur de roughnessMax : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/029` | Borne min de roughnessMax = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/030` | Borne max de roughnessMax = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/031` | Paramètre metalnessMin absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/032` | Paramètre metalnessMin avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/033` | Valeur de metalnessMin : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/034` | Borne min de metalnessMin = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/035` | Borne max de metalnessMin = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/036` | Paramètre metalnessMax absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/037` | Paramètre metalnessMax avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/038` | Valeur de metalnessMax : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/039` | Borne min de metalnessMax = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/040` | Borne max de metalnessMax = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/041` | Paramètre normalScale absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/042` | Paramètre normalScale avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/043` | Valeur de normalScale : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/044` | Paramètre heightScale absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/045` | Paramètre heightScale avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/046` | Valeur de heightScale : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/047` | Paramètre aoIntensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/048` | Paramètre aoIntensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/049` | Valeur de aoIntensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/050` | Borne min de aoIntensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/051` | Paramètre edgeIntensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/052` | Paramètre edgeIntensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/053` | Valeur de edgeIntensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/054` | Borne min de edgeIntensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/055` | Paramètre emissive absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/056` | Paramètre emissive avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/057` | Paramètre emissiveIntensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/058` | Paramètre emissiveIntensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/059` | Valeur de emissiveIntensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/060` | Borne min de emissiveIntensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setSurfaceSettings/061` | Paramètre tilingX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/062` | Paramètre tilingX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/063` | Valeur de tilingX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/064` | Paramètre tilingY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/065` | Paramètre tilingY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/066` | Valeur de tilingY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/067` | Paramètre offsetX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/068` | Paramètre offsetX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/069` | Valeur de offsetX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/070` | Paramètre offsetY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/071` | Paramètre offsetY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/072` | Valeur de offsetY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/073` | Paramètre rotation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/074` | Paramètre rotation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/075` | Valeur de rotation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setSurfaceSettings/076` | Paramètre invertNormalGreen absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setSurfaceSettings/077` | Paramètre invertNormalGreen avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setSurfaceSettings/078` | Booléen invertNormalGreen : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## material.setPreviewDisplay — Régler l’aperçu d’une matière

Change l’intensité et la rotation de l’environnement qui éclaire l’aperçu, l’affichage du fond, la rotation automatique et la mise en évidence des coutures.

- Nom MCP : `material_setPreviewDisplay`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 38.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `envIntensity` | number | False | `{"min":0}` |
| `envRotation` | number | False | `{}` |
| `showBackground` | boolean | False | `{}` |
| `autoSpin` | boolean | False | `{}` |
| `showSeam` | boolean | False | `{}` |
| `shape` | choice | False | `{"options":["sphere","box","cylinder","plane","torusKnot"]}` |
| `tilingPreview` | integer | False | `{"min":1,"max":4}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `material.setPreviewDisplay/001` | Nominal minimal : demander « Régler l’aperçu d’une matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `material.setPreviewDisplay/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `material.setPreviewDisplay/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `material.setPreviewDisplay/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `material.setPreviewDisplay/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `material.setPreviewDisplay/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `material.setPreviewDisplay/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `material.setPreviewDisplay/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `material.setPreviewDisplay/009` | Paramètre envIntensity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/010` | Paramètre envIntensity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/011` | Valeur de envIntensity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setPreviewDisplay/012` | Borne min de envIntensity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `material.setPreviewDisplay/013` | Paramètre envRotation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/014` | Paramètre envRotation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/015` | Valeur de envRotation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `material.setPreviewDisplay/016` | Paramètre showBackground absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/017` | Paramètre showBackground avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/018` | Booléen showBackground : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `material.setPreviewDisplay/019` | Paramètre autoSpin absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/020` | Paramètre autoSpin avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/021` | Booléen autoSpin : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `material.setPreviewDisplay/022` | Paramètre showSeam absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/023` | Paramètre showSeam avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/024` | Booléen showSeam : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `material.setPreviewDisplay/025` | Paramètre shape absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/026` | Paramètre shape avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewDisplay/027` | Option de shape : "sphere" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewDisplay/028` | Option de shape : "box" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewDisplay/029` | Option de shape : "cylinder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewDisplay/030` | Option de shape : "plane" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewDisplay/031` | Option de shape : "torusKnot" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewDisplay/032` | Option inconnue de shape : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `material.setPreviewDisplay/033` | Paramètre tilingPreview absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewDisplay/034` | Paramètre tilingPreview avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## material.setPreviewEnvironment — Choisir ce qui éclaire l’aperçu d’une matière

Éclaire l’aperçu par le studio procédural, par une image du projet nommée par son identifiant d’asset, ou par un document ciel nommé par son titre — l’aperçu prend alors son image étalonnée et son intensité, comme une scène le fait.

- Nom MCP : `material_setPreviewEnvironment`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 38.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | False | `{"options":["studio","skybox","sky"]}` |
| `assetId` | text | False | `{}` |
| `sky` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `material.setPreviewEnvironment/001` | Nominal minimal : demander « Choisir ce qui éclaire l’aperçu d’une matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `material.setPreviewEnvironment/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `material.setPreviewEnvironment/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `material.setPreviewEnvironment/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `material.setPreviewEnvironment/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `material.setPreviewEnvironment/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `material.setPreviewEnvironment/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `material.setPreviewEnvironment/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `material.setPreviewEnvironment/009` | Paramètre kind absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewEnvironment/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewEnvironment/011` | Option de kind : "studio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewEnvironment/012` | Option de kind : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewEnvironment/013` | Option de kind : "sky" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setPreviewEnvironment/014` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `material.setPreviewEnvironment/015` | Paramètre assetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewEnvironment/016` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewEnvironment/017` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `material.setPreviewEnvironment/018` | Paramètre sky absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setPreviewEnvironment/019` | Paramètre sky avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setPreviewEnvironment/020` | Texte sky : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## material.setChannelImage — Remplir ou vider un canal

Met une image de la bibliothèque dans un des huit canaux de la matière devant. Sans asset nommé, le canal est vidé plutôt que rempli.

- Nom MCP : `material_setChannelImage`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 38.3, 38.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `channel` | choice | True | `{"options":["baseColor","normal","roughness","metalness","ao","height","emissive","edge"]}` |
| `assetId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["channel"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `material.setChannelImage/001` | Nominal minimal : demander « Remplir ou vider un canal » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `material.setChannelImage/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `material.setChannelImage/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `material.setChannelImage/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `material.setChannelImage/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `material.setChannelImage/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `material.setChannelImage/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `material.setChannelImage/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `material.setChannelImage/009` | Paramètre channel absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `material.setChannelImage/010` | Paramètre channel avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setChannelImage/011` | Option de channel : "baseColor" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/012` | Option de channel : "normal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/013` | Option de channel : "roughness" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/014` | Option de channel : "metalness" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/015` | Option de channel : "ao" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/016` | Option de channel : "height" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/017` | Option de channel : "emissive" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/018` | Option de channel : "edge" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `material.setChannelImage/019` | Option inconnue de channel : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `material.setChannelImage/020` | Paramètre assetId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `material.setChannelImage/021` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `material.setChannelImage/022` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## styles.list — Lister les styles de matière

Rend les styles de matière enregistrés, avec leur identifiant, leur nom et les valeurs qu’ils gardent. Ils vivent hors de tout projet et suivent la machine.

- Nom MCP : `styles_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 53.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `styles.list/001` | Nominal minimal : demander « Lister les styles de matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `styles.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `styles.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `styles.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `styles.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `styles.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `styles.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `styles.list/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## style.save — Enregistrer la matière comme style

Enregistre la matière du document devant sous le nom donné. Le nom sert de base, le studio le rendant unique s’il est déjà pris.

- Nom MCP : `style_save`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 53.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `style.save/001` | Nominal minimal : demander « Enregistrer la matière comme style » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `style.save/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `style.save/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `style.save/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `style.save/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `style.save/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `style.save/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `style.save/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `style.save/009` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `style.save/010` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `style.save/011` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## style.rename — Renommer un style de matière

Donne son nom à un style enregistré. Rien d’autre du style ne bouge, et son identifiant reste le même.

- Nom MCP : `style_rename`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 53.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `styleId` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["styleId","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `style.rename/001` | Nominal minimal : demander « Renommer un style de matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `style.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `style.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `style.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `style.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `style.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `style.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `style.rename/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `style.rename/009` | Paramètre styleId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `style.rename/010` | Paramètre styleId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `style.rename/011` | Texte styleId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `style.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `style.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `style.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## style.remove — Supprimer un style de matière

Retire un style enregistré. Il vit hors de tout projet, donc rien ne le rend — ni l’annulation, ni l’Explorateur.

- Nom MCP : `style_remove`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["material"],"documentAffinity":"required","targets":["document"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 53.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `styleId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["styleId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `style.remove/001` | Nominal minimal : demander « Supprimer un style de matière » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `style.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `style.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `style.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `style.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `style.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `style.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `style.remove/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `style.remove/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `style.remove/010` | Paramètre styleId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `style.remove/011` | Paramètre styleId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `style.remove/012` | Texte styleId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
