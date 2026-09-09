# Images, calques et dessin — 27 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer pile de calques, identifiants, texte, géométrie, visibilité et pixels ciblés ; vérifier dimensions et pixels témoins.

## canvas.state — Lire l’image en cours d’édition

Répond l’image en avant — sa taille, sa résolution, ses repères, et chaque calque de la pile à plat : identifiant, nom, sorte, et ce que chacun porte. Un champ À SON DÉFAUT est omis, et son absence signifie ce défaut : un calque est visible, opaque, déverrouillé, en fondu normal, non rogné et non transformé.

- Nom MCP : `canvas_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.1, 68.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.state/001` | Nominal minimal : demander « Lire l’image en cours d’édition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.setDocumentProperties — Régler les propriétés du document image

Change la résolution d’impression, le mode colorimétrique ou la profondeur de bits de l’image devant. Lire d’abord canvas.state ; les valeurs non nommées restent inchangées.

- Nom MCP : `canvas_setDocumentProperties`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `dpi` | number | False | `{"min":1}` |
| `colorMode` | choice | False | `{"options":["rgb","grayscale"]}` |
| `bitDepth` | choice | False | `{"options":[8,16,32]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.setDocumentProperties/001` | Nominal minimal : demander « Régler les propriétés du document image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.setDocumentProperties/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.setDocumentProperties/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.setDocumentProperties/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.setDocumentProperties/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.setDocumentProperties/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.setDocumentProperties/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.setDocumentProperties/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.setDocumentProperties/009` | Paramètre dpi absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setDocumentProperties/010` | Paramètre dpi avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setDocumentProperties/011` | Valeur de dpi : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `canvas.setDocumentProperties/012` | Borne min de dpi = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `canvas.setDocumentProperties/013` | Paramètre colorMode absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setDocumentProperties/014` | Paramètre colorMode avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setDocumentProperties/015` | Option de colorMode : "rgb" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.setDocumentProperties/016` | Option de colorMode : "grayscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.setDocumentProperties/017` | Option inconnue de colorMode : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `canvas.setDocumentProperties/018` | Paramètre bitDepth absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setDocumentProperties/019` | Paramètre bitDepth avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setDocumentProperties/020` | Option de bitDepth : 8 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.setDocumentProperties/021` | Option de bitDepth : 16 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.setDocumentProperties/022` | Option de bitDepth : 32 ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.setDocumentProperties/023` | Option inconnue de bitDepth : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.add — Ajouter un calque

Pose un calque de pixels, de texte ou de réglage au sommet de la pile de l’image devant, et répond avec l’identifiant qui lui a été donné. Un calque de réglage doit nommer le réglage qu’il porte.

- Nom MCP : `layer_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 19.1, 28.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | True | `{"options":["pixel","text","adjustment","shape"]}` |
| `name` | text | True | `{}` |
| `text` | longText | False | `{}` |
| `shape` | choice | False | `{"options":["rectangle","line","arrow","ellipse","polygon","star"]}` |
| `width` | number | False | `{}` |
| `height` | number | False | `{}` |
| `sides` | integer | False | `{"min":3,"max":12}` |
| `fill` | color | False | `{}` |
| `adjustment` | choice | False | `{"options":["exposure","contrast","saturation","temperature"]}` |
| `x` | number | False | `{}` |
| `y` | number | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["kind","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.add/001` | Nominal minimal : demander « Ajouter un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.add/009` | Paramètre kind absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.add/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/011` | Option de kind : "pixel" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/012` | Option de kind : "text" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/013` | Option de kind : "adjustment" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/014` | Option de kind : "shape" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/015` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `layer.add/016` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.add/017` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/018` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.add/019` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/020` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/021` | Paramètre shape absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/022` | Paramètre shape avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/023` | Option de shape : "rectangle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/024` | Option de shape : "line" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/025` | Option de shape : "arrow" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/026` | Option de shape : "ellipse" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/027` | Option de shape : "polygon" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/028` | Option de shape : "star" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/029` | Option inconnue de shape : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `layer.add/030` | Paramètre width absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/031` | Paramètre width avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/032` | Valeur de width : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.add/033` | Paramètre height absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/034` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/035` | Valeur de height : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.add/036` | Paramètre sides absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/037` | Paramètre sides avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/038` | Paramètre fill absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/039` | Paramètre fill avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/040` | Paramètre adjustment absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/041` | Paramètre adjustment avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/042` | Option de adjustment : "exposure" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/043` | Option de adjustment : "contrast" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/044` | Option de adjustment : "saturation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/045` | Option de adjustment : "temperature" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.add/046` | Option inconnue de adjustment : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `layer.add/047` | Paramètre x absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/048` | Paramètre x avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/049` | Valeur de x : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.add/050` | Paramètre y absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.add/051` | Paramètre y avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.add/052` | Valeur de y : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.remove — Retirer un calque

Sort un calque de la pile de l’image devant. S’annule comme n’importe quelle autre édition de ce document.

- Nom MCP : `layer_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 19.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.remove/001` | Nominal minimal : demander « Retirer un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.remove/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.remove/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.remove/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.select — Armer un calque

Fait d’un calque celui qui est armé, c’est-à-dire celui sur lequel agissent les outils de l’espace Image. C’est une façon de regarder la pile plutôt qu’une édition, donc rien ne s’ajoute à l’historique.

- Nom MCP : `layer_select`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.select/001` | Nominal minimal : demander « Armer un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.select/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.select/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.select/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.select/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.select/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.select/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.select/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.select/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.select/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.select/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.rename — Renommer un calque

Appelle autrement un calque de l’image devant. L’identifiant ne change pas, donc rien de ce qui le désignait n’est perdu.

- Nom MCP : `layer_rename`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 19.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.rename/001` | Nominal minimal : demander « Renommer un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.rename/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.rename/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.rename/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.rename/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.setOpacityBlendAndVisibility — Régler la composition d’un calque

Change l’opacité d’un calque, son opacité de fond, son mode de fusion, sa visibilité ou son écrêtage. Chaque champ est facultatif, et ce qui n’est pas donné reste exactement tel quel. C’EST ELLE qui cache un calque et le remontre — « masque ce calque » met la visibilité à faux, et n’a rien à voir avec un masque.

- Nom MCP : `layer_setOpacityBlendAndVisibility`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 18.3, 19.3, 19.5, 19.6, 28.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `opacity` | number | False | `{"min":0,"max":1}` |
| `fillOpacity` | number | False | `{"min":0,"max":1}` |
| `blend` | choice | False | `{"options":["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"]}` |
| `visible` | boolean | False | `{}` |
| `clipped` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.setOpacityBlendAndVisibility/001` | Nominal minimal : demander « Régler la composition d’un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.setOpacityBlendAndVisibility/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.setOpacityBlendAndVisibility/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.setOpacityBlendAndVisibility/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.setOpacityBlendAndVisibility/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.setOpacityBlendAndVisibility/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.setOpacityBlendAndVisibility/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.setOpacityBlendAndVisibility/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.setOpacityBlendAndVisibility/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.setOpacityBlendAndVisibility/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.setOpacityBlendAndVisibility/012` | Paramètre opacity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setOpacityBlendAndVisibility/013` | Paramètre opacity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/014` | Valeur de opacity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setOpacityBlendAndVisibility/015` | Borne min de opacity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setOpacityBlendAndVisibility/016` | Borne max de opacity = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setOpacityBlendAndVisibility/017` | Paramètre fillOpacity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setOpacityBlendAndVisibility/018` | Paramètre fillOpacity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/019` | Valeur de fillOpacity : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setOpacityBlendAndVisibility/020` | Borne min de fillOpacity = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setOpacityBlendAndVisibility/021` | Borne max de fillOpacity = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setOpacityBlendAndVisibility/022` | Paramètre blend absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setOpacityBlendAndVisibility/023` | Paramètre blend avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/024` | Option de blend : "normal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/025` | Option de blend : "multiply" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/026` | Option de blend : "screen" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/027` | Option de blend : "overlay" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/028` | Option de blend : "darken" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/029` | Option de blend : "lighten" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/030` | Option de blend : "color-dodge" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/031` | Option de blend : "color-burn" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/032` | Option de blend : "hard-light" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/033` | Option de blend : "soft-light" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/034` | Option de blend : "difference" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/035` | Option de blend : "exclusion" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/036` | Option de blend : "hue" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/037` | Option de blend : "saturation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/038` | Option de blend : "color" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/039` | Option de blend : "luminosity" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.setOpacityBlendAndVisibility/040` | Option inconnue de blend : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `layer.setOpacityBlendAndVisibility/041` | Paramètre visible absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setOpacityBlendAndVisibility/042` | Paramètre visible avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/043` | Booléen visible : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.setOpacityBlendAndVisibility/044` | Paramètre clipped absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setOpacityBlendAndVisibility/045` | Paramètre clipped avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setOpacityBlendAndVisibility/046` | Booléen clipped : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.transform — Déplacer, redimensionner ou tourner un calque

Déplace, redimensionne ou fait tourner un calque dans le cadre. La rotation se donne en degrés, et tout champ omis garde la valeur que le calque avait déjà.

- Nom MCP : `layer_transform`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required","targets":["layer"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 18.4, 18.5, 18.6, 18.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `x` | number | False | `{}` |
| `y` | number | False | `{}` |
| `scaleX` | number | False | `{}` |
| `scaleY` | number | False | `{}` |
| `rotation` | number | False | `{}` |
| `relative` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.transform/001` | Nominal minimal : demander « Déplacer, redimensionner ou tourner un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.transform/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.transform/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.transform/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.transform/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.transform/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.transform/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.transform/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.transform/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.transform/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.transform/012` | Paramètre x absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/013` | Paramètre x avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/014` | Valeur de x : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.transform/015` | Paramètre y absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/016` | Paramètre y avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/017` | Valeur de y : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.transform/018` | Paramètre scaleX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/019` | Paramètre scaleX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/020` | Valeur de scaleX : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.transform/021` | Paramètre scaleY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/022` | Paramètre scaleY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/023` | Valeur de scaleY : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.transform/024` | Paramètre rotation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/025` | Paramètre rotation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/026` | Valeur de rotation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.transform/027` | Paramètre relative absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.transform/028` | Paramètre relative avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.transform/029` | Booléen relative : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.editTextLayer — Régler les mots d’un calque de texte

Change ce que dit un calque de texte, la police et la taille dans lesquelles il le dit, sa couleur, son alignement et son cadre. Refuse un calque qui porte des pixels plutôt que des mots, que la commande laisserait sinon intact.

- Nom MCP : `layer_editTextLayer`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `text` | longText | False | `{}` |
| `size` | number | False | `{"min":1}` |
| `color` | color | False | `{}` |
| `align` | choice | False | `{"options":["left","center","right","justify"]}` |
| `width` | number | False | `{"min":1}` |
| `height` | number | False | `{"min":1}` |
| `lineHeight` | number | False | `{}` |
| `tracking` | number | False | `{}` |
| `fontFamily` | text | False | `{}` |
| `fontSource` | choice | False | `{"options":["embedded","system"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.editTextLayer/001` | Nominal minimal : demander « Régler les mots d’un calque de texte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.editTextLayer/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.editTextLayer/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.editTextLayer/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.editTextLayer/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.editTextLayer/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.editTextLayer/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.editTextLayer/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.editTextLayer/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.editTextLayer/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.editTextLayer/012` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/013` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/014` | Paramètre size absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/015` | Paramètre size avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/016` | Valeur de size : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editTextLayer/017` | Borne min de size = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.editTextLayer/018` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/019` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/020` | Paramètre align absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/021` | Paramètre align avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/022` | Option de align : "left" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/023` | Option de align : "center" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/024` | Option de align : "right" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/025` | Option de align : "justify" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/026` | Option inconnue de align : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `layer.editTextLayer/027` | Paramètre width absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/028` | Paramètre width avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/029` | Valeur de width : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editTextLayer/030` | Borne min de width = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.editTextLayer/031` | Paramètre height absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/032` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/033` | Valeur de height : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editTextLayer/034` | Borne min de height = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.editTextLayer/035` | Paramètre lineHeight absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/036` | Paramètre lineHeight avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/037` | Valeur de lineHeight : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editTextLayer/038` | Paramètre tracking absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/039` | Paramètre tracking avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/040` | Valeur de tracking : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editTextLayer/041` | Paramètre fontFamily absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/042` | Paramètre fontFamily avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/043` | Texte fontFamily : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.editTextLayer/044` | Paramètre fontSource absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editTextLayer/045` | Paramètre fontSource avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editTextLayer/046` | Option de fontSource : "embedded" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/047` | Option de fontSource : "system" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `layer.editTextLayer/048` | Option inconnue de fontSource : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.reorderInStack — Réordonner un calque

Déplace un calque ailleurs dans la pile, et dans un groupe ou hors d’un groupe. L’indice zéro est le bas de la pile, c’est-à-dire ce que l’œil voit en dernier.

- Nom MCP : `layer_reorderInStack`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 19.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `index` | integer | True | `{"min":0}` |
| `parentId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId","index"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.reorderInStack/001` | Nominal minimal : demander « Réordonner un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.reorderInStack/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.reorderInStack/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.reorderInStack/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.reorderInStack/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.reorderInStack/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.reorderInStack/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.reorderInStack/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.reorderInStack/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.reorderInStack/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.reorderInStack/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.reorderInStack/012` | Paramètre index absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.reorderInStack/013` | Paramètre index avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.reorderInStack/014` | Paramètre parentId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.reorderInStack/015` | Paramètre parentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.reorderInStack/016` | Texte parentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.duplicate — Dupliquer un calque

Copie un calque juste au-dessus de lui-même, enfants compris, chaque copie recevant un identifiant neuf. Répond avec l’identifiant de la copie. Le FICHIER de l’image se copie par files.duplicate ; ceci copie un calque à l’intérieur.

- Nom MCP : `layer_duplicate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `name` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.duplicate/001` | Nominal minimal : demander « Dupliquer un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.duplicate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.duplicate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.duplicate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.duplicate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.duplicate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.duplicate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.duplicate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.duplicate/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.duplicate/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.duplicate/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.duplicate/012` | Paramètre name absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.duplicate/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.duplicate/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.group — Grouper des calques

Rassemble des calques de premier niveau en un groupe, qui se déplace ensuite d’un bloc. Répond avec l’identifiant du groupe.

- Nom MCP : `layer_group`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerIds` | text | True | `{"repeated":true}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerIds","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.group/001` | Nominal minimal : demander « Grouper des calques » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.group/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.group/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.group/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.group/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.group/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.group/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.group/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.group/009` | Paramètre layerIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.group/010` | Paramètre layerIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.group/011` | Texte layerIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.group/012` | Liste layerIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `layer.group/013` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.group/014` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.group/015` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.ungroup — Dissoudre un groupe

Défait un groupe en laissant ses enfants là où le groupe se tenait dans la pile.

- Nom MCP : `layer_ungroup`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.ungroup/001` | Nominal minimal : demander « Dissoudre un groupe » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.ungroup/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.ungroup/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.ungroup/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.ungroup/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.ungroup/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.ungroup/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.ungroup/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.ungroup/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.ungroup/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.ungroup/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.mergeDown — Fusionner un calque vers le bas

Replie un calque dans celui qui est sous lui, à l’intérieur de son propre niveau de pile. Le résultat garde l’identité du calque du dessous.

- Nom MCP : `layer_mergeDown`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.mergeDown/001` | Nominal minimal : demander « Fusionner un calque vers le bas » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.mergeDown/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.mergeDown/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.mergeDown/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.mergeDown/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.mergeDown/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.mergeDown/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.mergeDown/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.mergeDown/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.mergeDown/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.mergeDown/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.resize — Redimensionner l’image

Change le cadre de l’image devant. Redimensionne les calques avec lui quand on le demande, et les laisse en place sinon, ce qui est toute la différence entre taille de l’image et taille du canevas.

- Nom MCP : `canvas_resize`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `width` | integer | True | `{"min":1}` |
| `height` | integer | True | `{"min":1}` |
| `scalePixels` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["width","height"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.resize/001` | Nominal minimal : demander « Redimensionner l’image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.resize/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.resize/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.resize/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.resize/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.resize/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.resize/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.resize/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.resize/009` | Paramètre width absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.resize/010` | Paramètre width avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.resize/011` | Paramètre height absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.resize/012` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.resize/013` | Paramètre scalePixels absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.resize/014` | Paramètre scalePixels avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.resize/015` | Booléen scalePixels : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.setPixelArt — Régler le mode pixel art

Met l’image devant sur une grille de pixel art, ou l’en retire. Avec un nombre de colonnes et de lignes, redimensionne le document pour que l’œuvre mesure exactement cela en cellules. 🛑 Un redimensionnement efface l’historique des pixels — les traits déjà posés restent, mais ⌘Z ne les défait plus. Redimensionner et poser la grille sont DEUX annulations : un premier ⌘Z retire la grille et laisse la taille.

- Nom MCP : `canvas_setPixelArt`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 68.1, 68.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `enabled` | boolean | True | `{}` |
| `columns` | integer | False | `{"min":1}` |
| `rows` | integer | False | `{"min":1}` |
| `cell` | integer | False | `{"min":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["enabled"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.setPixelArt/001` | Nominal minimal : demander « Régler le mode pixel art » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.setPixelArt/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.setPixelArt/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.setPixelArt/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.setPixelArt/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.setPixelArt/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.setPixelArt/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.setPixelArt/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.setPixelArt/009` | Paramètre enabled absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.setPixelArt/010` | Paramètre enabled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setPixelArt/011` | Booléen enabled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `canvas.setPixelArt/012` | Paramètre columns absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setPixelArt/013` | Paramètre columns avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setPixelArt/014` | Paramètre rows absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setPixelArt/015` | Paramètre rows avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.setPixelArt/016` | Paramètre cell absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.setPixelArt/017` | Paramètre cell avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.drawPixels — Dessiner des pixels

Pose des cellules sur l’image devant, en une seule fois et une seule annulation — des cellules nommées une à une, une ligne, un rectangle plein ou creux, ou un remplissage. Les coordonnées sont en cellules de la grille, pas en pixels du document.

- Nom MCP : `canvas_drawPixels`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 68.3, 68.4, 68.5, 68.6, 68.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `shape` | choice | True | `{"options":["points","line","rectangle","fill"]}` |
| `cells` | text | False | `{"repeated":true}` |
| `x` | integer | False | `{"min":0}` |
| `y` | integer | False | `{"min":0}` |
| `toX` | integer | False | `{"min":0}` |
| `toY` | integer | False | `{"min":0}` |
| `filled` | boolean | False | `{}` |
| `color` | color | False | `{}` |
| `erase` | boolean | False | `{}` |
| `layerId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["shape"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.drawPixels/001` | Nominal minimal : demander « Dessiner des pixels » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.drawPixels/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.drawPixels/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.drawPixels/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.drawPixels/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.drawPixels/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.drawPixels/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.drawPixels/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.drawPixels/009` | Paramètre shape absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.drawPixels/010` | Paramètre shape avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/011` | Option de shape : "points" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.drawPixels/012` | Option de shape : "line" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.drawPixels/013` | Option de shape : "rectangle" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.drawPixels/014` | Option de shape : "fill" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.drawPixels/015` | Option inconnue de shape : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `canvas.drawPixels/016` | Paramètre cells absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/017` | Paramètre cells avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/018` | Texte cells : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `canvas.drawPixels/019` | Liste cells : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `canvas.drawPixels/020` | Paramètre x absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/021` | Paramètre x avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/022` | Paramètre y absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/023` | Paramètre y avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/024` | Paramètre toX absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/025` | Paramètre toX avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/026` | Paramètre toY absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/027` | Paramètre toY avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/028` | Paramètre filled absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/029` | Paramètre filled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/030` | Booléen filled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `canvas.drawPixels/031` | Paramètre color absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/032` | Paramètre color avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/033` | Paramètre erase absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/034` | Paramètre erase avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/035` | Booléen erase : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `canvas.drawPixels/036` | Paramètre layerId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `canvas.drawPixels/037` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.drawPixels/038` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.crop — Recadrer l’image

Referme le cadre sur un rectangle donné en coordonnées du document. Les calques gardent leur place, donc ce qui tombe dehors est ce qui est coupé.

- Nom MCP : `canvas_crop`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `x` | number | True | `{}` |
| `y` | number | True | `{}` |
| `width` | number | True | `{"min":1}` |
| `height` | number | True | `{"min":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["x","y","width","height"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.crop/001` | Nominal minimal : demander « Recadrer l’image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.crop/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.crop/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.crop/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.crop/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.crop/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.crop/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.crop/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.crop/009` | Paramètre x absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.crop/010` | Paramètre x avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.crop/011` | Valeur de x : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `canvas.crop/012` | Paramètre y absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.crop/013` | Paramètre y avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.crop/014` | Valeur de y : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `canvas.crop/015` | Paramètre width absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.crop/016` | Paramètre width avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.crop/017` | Valeur de width : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `canvas.crop/018` | Borne min de width = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `canvas.crop/019` | Paramètre height absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.crop/020` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.crop/021` | Valeur de height : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `canvas.crop/022` | Borne min de height = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.lock — Verrouiller un calque

Pose ou retire les trois verrous d’un calque, celui de ses pixels, celui de sa place et celui de sa transparence. Ils arrêtent la main sur le canevas. Une valeur écrite par une autre action passe outre, comme elle le fait depuis les panneaux.

- Nom MCP : `layer_lock`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 39.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `pixels` | boolean | False | `{}` |
| `position` | boolean | False | `{}` |
| `alpha` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.lock/001` | Nominal minimal : demander « Verrouiller un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.lock/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.lock/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.lock/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.lock/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.lock/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.lock/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.lock/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.lock/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.lock/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.lock/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.lock/012` | Paramètre pixels absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.lock/013` | Paramètre pixels avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.lock/014` | Booléen pixels : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.lock/015` | Paramètre position absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.lock/016` | Paramètre position avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.lock/017` | Booléen position : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.lock/018` | Paramètre alpha absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.lock/019` | Paramètre alpha avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.lock/020` | Booléen alpha : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.editShapeLayer — Repeindre une forme

Change le remplissage, le contour, l’épaisseur du trait et le nombre de côtés d’une forme déjà dessinée, sans la redessiner. Retirer le remplissage et le contour à la fois est refusé, cela ne laisserait rien à voir.

- Nom MCP : `layer_editShapeLayer`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `filled` | boolean | False | `{}` |
| `fill` | color | False | `{}` |
| `stroked` | boolean | False | `{}` |
| `stroke` | color | False | `{}` |
| `strokeWidth` | number | False | `{"min":1}` |
| `sides` | integer | False | `{"min":3,"max":12}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.editShapeLayer/001` | Nominal minimal : demander « Repeindre une forme » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.editShapeLayer/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.editShapeLayer/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.editShapeLayer/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.editShapeLayer/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.editShapeLayer/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.editShapeLayer/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.editShapeLayer/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.editShapeLayer/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.editShapeLayer/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.editShapeLayer/012` | Paramètre filled absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/013` | Paramètre filled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/014` | Booléen filled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.editShapeLayer/015` | Paramètre fill absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/016` | Paramètre fill avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/017` | Paramètre stroked absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/018` | Paramètre stroked avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/019` | Booléen stroked : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.editShapeLayer/020` | Paramètre stroke absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/021` | Paramètre stroke avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/022` | Paramètre strokeWidth absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/023` | Paramètre strokeWidth avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.editShapeLayer/024` | Valeur de strokeWidth : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.editShapeLayer/025` | Borne min de strokeWidth = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.editShapeLayer/026` | Paramètre sides absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.editShapeLayer/027` | Paramètre sides avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.setAdjustmentAmount — Régler un calque de correction

Déplace le cadran que porte un calque de correction — exposition, contraste, saturation ou température. Nommer un autre cadran que le sien est refusé plutôt qu’ignoré en silence.

- Nom MCP : `layer_setAdjustmentAmount`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `exposure` | number | False | `{"min":-3,"max":3}` |
| `contrast` | number | False | `{"min":0,"max":2}` |
| `saturation` | number | False | `{"min":0,"max":2}` |
| `temperature` | number | False | `{"min":-1,"max":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.setAdjustmentAmount/001` | Nominal minimal : demander « Régler un calque de correction » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.setAdjustmentAmount/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.setAdjustmentAmount/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.setAdjustmentAmount/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.setAdjustmentAmount/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.setAdjustmentAmount/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.setAdjustmentAmount/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.setAdjustmentAmount/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.setAdjustmentAmount/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.setAdjustmentAmount/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setAdjustmentAmount/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.setAdjustmentAmount/012` | Paramètre exposure absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setAdjustmentAmount/013` | Paramètre exposure avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setAdjustmentAmount/014` | Valeur de exposure : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setAdjustmentAmount/015` | Borne min de exposure = -3 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/016` | Borne max de exposure = 3 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/017` | Paramètre contrast absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setAdjustmentAmount/018` | Paramètre contrast avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setAdjustmentAmount/019` | Valeur de contrast : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setAdjustmentAmount/020` | Borne min de contrast = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/021` | Borne max de contrast = 2 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/022` | Paramètre saturation absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setAdjustmentAmount/023` | Paramètre saturation avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setAdjustmentAmount/024` | Valeur de saturation : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setAdjustmentAmount/025` | Borne min de saturation = 0 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/026` | Borne max de saturation = 2 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/027` | Paramètre temperature absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setAdjustmentAmount/028` | Paramètre temperature avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setAdjustmentAmount/029` | Valeur de temperature : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `layer.setAdjustmentAmount/030` | Borne min de temperature = -1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `layer.setAdjustmentAmount/031` | Borne max de temperature = 1 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## canvas.flipOrRotate — Retourner ou pivoter l’image

Reflète l’image selon un axe, ou la fait pivoter d’un quart de tour dans un sens ou dans l’autre. Un quart de tour échange la largeur et la hauteur du cadre, donc un portrait devient un paysage.

- Nom MCP : `canvas_flipOrRotate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `turn` | choice | True | `{"options":["flipHorizontal","flipVertical","rotateClockwise","rotateAnticlockwise"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["turn"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `canvas.flipOrRotate/001` | Nominal minimal : demander « Retourner ou pivoter l’image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `canvas.flipOrRotate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `canvas.flipOrRotate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `canvas.flipOrRotate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `canvas.flipOrRotate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `canvas.flipOrRotate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `canvas.flipOrRotate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `canvas.flipOrRotate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `canvas.flipOrRotate/009` | Paramètre turn absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `canvas.flipOrRotate/010` | Paramètre turn avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `canvas.flipOrRotate/011` | Option de turn : "flipHorizontal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.flipOrRotate/012` | Option de turn : "flipVertical" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.flipOrRotate/013` | Option de turn : "rotateClockwise" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.flipOrRotate/014` | Option de turn : "rotateAnticlockwise" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `canvas.flipOrRotate/015` | Option inconnue de turn : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## layer.setMaskOptions — Régler le masque d’un calque

Dit si un MASQUE — une forme creusée dans une sélection, qu’un calque porte — cache ce qu’il couvre et s’il suit le calque, ou le retire tout à fait. Cacher le calque LUI-MÊME, c’est layer.setOpacityBlendAndVisibility. Un calque qui n’en porte aucun est refusé : creuser un masque appartient au moteur, par la commande qui en fait un depuis la sélection.

- Nom MCP : `layer_setMaskOptions`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `layerId` | text | True | `{}` |
| `enabled` | boolean | False | `{}` |
| `linked` | boolean | False | `{}` |
| `remove` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["layerId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `layer.setMaskOptions/001` | Nominal minimal : demander « Régler le masque d’un calque » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `layer.setMaskOptions/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `layer.setMaskOptions/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `layer.setMaskOptions/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `layer.setMaskOptions/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `layer.setMaskOptions/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `layer.setMaskOptions/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `layer.setMaskOptions/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `layer.setMaskOptions/009` | Paramètre layerId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `layer.setMaskOptions/010` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setMaskOptions/011` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `layer.setMaskOptions/012` | Paramètre enabled absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setMaskOptions/013` | Paramètre enabled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setMaskOptions/014` | Booléen enabled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.setMaskOptions/015` | Paramètre linked absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setMaskOptions/016` | Paramètre linked avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setMaskOptions/017` | Booléen linked : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `layer.setMaskOptions/018` | Paramètre remove absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `layer.setMaskOptions/019` | Paramètre remove avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `layer.setMaskOptions/020` | Booléen remove : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## guide.add — Poser un repère

Pose un repère vertical ou horizontal à l’endroit donné, en coordonnées du document, et répond l’identifiant qu’il vient de recevoir. Les deux actions voisines le déplacent et le retirent par cet identifiant.

- Nom MCP : `guide_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `axis` | choice | True | `{"options":["x","y"]}` |
| `position` | number | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["axis","position"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `guide.add/001` | Nominal minimal : demander « Poser un repère » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `guide.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `guide.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `guide.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `guide.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `guide.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `guide.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `guide.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `guide.add/009` | Paramètre axis absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `guide.add/010` | Paramètre axis avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `guide.add/011` | Option de axis : "x" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `guide.add/012` | Option de axis : "y" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `guide.add/013` | Option inconnue de axis : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `guide.add/014` | Paramètre position absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `guide.add/015` | Paramètre position avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `guide.add/016` | Valeur de position : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## guide.move — Déplacer un repère

Change la place d’un repère, en coordonnées du document, comme le ferait un glissé depuis la règle. Un identifiant que rien ne porte est refusé.

- Nom MCP : `guide_move`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `guideId` | text | True | `{}` |
| `position` | number | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["guideId","position"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `guide.move/001` | Nominal minimal : demander « Déplacer un repère » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `guide.move/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `guide.move/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `guide.move/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `guide.move/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `guide.move/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `guide.move/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `guide.move/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `guide.move/009` | Paramètre guideId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `guide.move/010` | Paramètre guideId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `guide.move/011` | Texte guideId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `guide.move/012` | Paramètre position absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `guide.move/013` | Paramètre position avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `guide.move/014` | Valeur de position : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## guide.remove — Retirer un repère

Enlève un repère de l’image, comme le fait un glissé qui le ramène sur sa règle. Retirer tous les repères d’un coup est une commande du registre, à lancer autrement.

- Nom MCP : `guide_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 51.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `guideId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["guideId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `guide.remove/001` | Nominal minimal : demander « Retirer un repère » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `guide.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `guide.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `guide.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `guide.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `guide.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `guide.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `guide.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `guide.remove/009` | Paramètre guideId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `guide.remove/010` | Paramètre guideId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `guide.remove/011` | Texte guideId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## img.pin — Gérer les commentaires de génération sur l’image

Ajoute, modifie ou retire une instruction pour la prochaine génération sur l’image devant. Les coordonnées et le polygone facultatif sont en pixels du document. Un identifiant de calque limite une nouvelle note à ce calque ; sans lui, elle porte sur l’image entière. canvas.state rend les commentaires en attente et leurs identifiants.

- Nom MCP : `img_pin`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 70.1, 70.2, 70.3, 70.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `action` | choice | True | `{"options":["add","update","remove"]}` |
| `x` | number | False | `{}` |
| `y` | number | False | `{}` |
| `text` | longText | False | `{"max":2000}` |
| `layerId` | text | False | `{}` |
| `outline` | raw | False | `{}` |
| `commentId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["action"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `img.pin/001` | Nominal minimal : demander « Gérer les commentaires de génération sur l’image » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `img.pin/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `img.pin/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `img.pin/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `img.pin/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `img.pin/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `img.pin/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `img.pin/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `img.pin/009` | Paramètre action absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `img.pin/010` | Paramètre action avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/011` | Option de action : "add" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `img.pin/012` | Option de action : "update" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `img.pin/013` | Option de action : "remove" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `img.pin/014` | Option inconnue de action : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `img.pin/015` | Paramètre x absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/016` | Paramètre x avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/017` | Valeur de x : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `img.pin/018` | Paramètre y absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/019` | Paramètre y avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/020` | Valeur de y : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `img.pin/021` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/022` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/023` | Paramètre layerId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/024` | Paramètre layerId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/025` | Texte layerId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `img.pin/026` | Paramètre outline absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/027` | Paramètre outline avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/028` | Paramètre commentId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `img.pin/029` | Paramètre commentId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `img.pin/030` | Texte commentId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
