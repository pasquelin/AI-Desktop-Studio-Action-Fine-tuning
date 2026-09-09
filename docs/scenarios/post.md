# Post-traitement — 17 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer ordre des effets, valeurs, activation et clés ; vérifier image témoin et état persistant.

## post.state — Lire la composition de post-traitement

Rend la pile d’effets que la scène — ou la caméra nommée — filme à travers, avec l’identifiant de chaque instance, l’effet qu’elle est, ses paramètres, si elle est active, et si la chaîne la laisse de côté.

- Nom MCP : `post_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.state/001` | Nominal minimal : demander « Lire la composition de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.state/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.state/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.state/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.add — Ajouter un effet de post-traitement

Pose un effet du catalogue au bout de la pile, sur ses valeurs par défaut. Sans caméra nommée c’est la composition de la scène qui reçoit, celle que le viewport montre déjà.

- Nom MCP : `post_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.2, 59.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effect` | choice | True | `{"options":["gtao","ssao","ssaa","bloom","dof","chromaticAberration","lensDistortion","heatHaze","colorGrading","lut","sharpen","blur","radialBlur","pixelate","posterize","dither","vignette","letterbox","filmGrain","scanlines","outline","halftone","dotScreen","kuwahara","glitch","rgbShift","crt","vhs","fxaa","smaa"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effect"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.add/001` | Nominal minimal : demander « Ajouter un effet de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.add/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.add/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.add/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.add/012` | Paramètre effect absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.add/013` | Paramètre effect avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.add/014` | Option de effect : "gtao" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/015` | Option de effect : "ssao" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/016` | Option de effect : "ssaa" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/017` | Option de effect : "bloom" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/018` | Option de effect : "dof" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/019` | Option de effect : "chromaticAberration" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/020` | Option de effect : "lensDistortion" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/021` | Option de effect : "heatHaze" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/022` | Option de effect : "colorGrading" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/023` | Option de effect : "lut" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/024` | Option de effect : "sharpen" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/025` | Option de effect : "blur" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/026` | Option de effect : "radialBlur" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/027` | Option de effect : "pixelate" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/028` | Option de effect : "posterize" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/029` | Option de effect : "dither" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/030` | Option de effect : "vignette" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/031` | Option de effect : "letterbox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/032` | Option de effect : "filmGrain" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/033` | Option de effect : "scanlines" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/034` | Option de effect : "outline" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/035` | Option de effect : "halftone" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/036` | Option de effect : "dotScreen" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/037` | Option de effect : "kuwahara" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/038` | Option de effect : "glitch" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/039` | Option de effect : "rgbShift" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/040` | Option de effect : "crt" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/041` | Option de effect : "vhs" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/042` | Option de effect : "fxaa" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/043` | Option de effect : "smaa" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.add/044` | Option inconnue de effect : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.remove — Retirer un effet de post-traitement

Enlève une instance de la pile, et avec elle les canaux de la timeline qui la pilotaient — laissés là, ils viseraient un effet que plus rien n’atteint.

- Nom MCP : `post_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.remove/001` | Nominal minimal : demander « Retirer un effet de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.remove/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.remove/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.remove/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.remove/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.remove/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.remove/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.move — Déplacer un effet dans la pile

Change la place d’une instance dans la chaîne, ce qui change l’image obtenue — un étalonnage avant un halo lumineux ne donne pas la même chose qu’après lui.

- Nom MCP : `post_move`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |
| `by` | integer | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId","by"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.move/001` | Nominal minimal : demander « Déplacer un effet dans la pile » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.move/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.move/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.move/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.move/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.move/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.move/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.move/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.move/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.move/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.move/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.move/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.move/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.move/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.move/015` | Paramètre by absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.move/016` | Paramètre by avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.set — Régler un paramètre d’un effet

Écrit une valeur sur un paramètre d’une instance, tenue aux bornes que le catalogue déclare pour ce paramètre. Le champ à remplir dépend de sa nature — un nombre, un interrupteur ou un mot.

- Nom MCP : `post_set`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |
| `param` | text | True | `{}` |
| `value` | number | False | `{}` |
| `text` | text | False | `{}` |
| `on` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId","param"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.set/001` | Nominal minimal : demander « Régler un paramètre d’un effet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.set/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.set/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.set/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.set/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.set/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.set/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.set/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.set/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.set/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.set/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.set/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.set/015` | Paramètre param absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.set/016` | Paramètre param avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/017` | Texte param : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.set/018` | Paramètre value absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.set/019` | Paramètre value avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/020` | Valeur de value : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `post.set/021` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.set/022` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/023` | Texte text : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.set/024` | Paramètre on absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.set/025` | Paramètre on avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.set/026` | Booléen on : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.setEffectEnabled — Activer ou désactiver un effet

Coupe une instance sans la retirer, ce qui la sort du calcul et non seulement de l’image. Ses paramètres restent où ils sont, prêts à être rallumés.

- Nom MCP : `post_setEffectEnabled`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |
| `enabled` | boolean | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId","enabled"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.setEffectEnabled/001` | Nominal minimal : demander « Activer ou désactiver un effet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.setEffectEnabled/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.setEffectEnabled/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.setEffectEnabled/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.setEffectEnabled/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.setEffectEnabled/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.setEffectEnabled/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.setEffectEnabled/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.setEffectEnabled/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.setEffectEnabled/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setEffectEnabled/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.setEffectEnabled/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.setEffectEnabled/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setEffectEnabled/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.setEffectEnabled/015` | Paramètre enabled absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.setEffectEnabled/016` | Paramètre enabled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setEffectEnabled/017` | Booléen enabled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.setWholeStackEnabled — Couper toute la composition

Éteint ou rallume la pile entière d’un coup, sans rien perdre — le Avant/Après, en une valeur du document que ⌘Z sait reprendre.

- Nom MCP : `post_setWholeStackEnabled`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `enabled` | boolean | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["enabled"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.setWholeStackEnabled/001` | Nominal minimal : demander « Couper toute la composition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.setWholeStackEnabled/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.setWholeStackEnabled/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.setWholeStackEnabled/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.setWholeStackEnabled/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.setWholeStackEnabled/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.setWholeStackEnabled/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.setWholeStackEnabled/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.setWholeStackEnabled/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.setWholeStackEnabled/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setWholeStackEnabled/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.setWholeStackEnabled/012` | Paramètre enabled absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.setWholeStackEnabled/013` | Paramètre enabled avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setWholeStackEnabled/014` | Booléen enabled : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.applyPreset — Appliquer un préréglage de post-traitement

Remplace la pile par une composition prête — un ensemble d’effets, dans un ordre, sur des valeurs qui vont ensemble. Le document reçoit la pile elle-même, jamais une référence au préréglage.

- Nom MCP : `post_applyPreset`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.6, 59.12, 59.17.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `preset` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["preset"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.applyPreset/001` | Nominal minimal : demander « Appliquer un préréglage de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.applyPreset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.applyPreset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.applyPreset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.applyPreset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.applyPreset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.applyPreset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.applyPreset/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.applyPreset/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.applyPreset/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.applyPreset/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.applyPreset/012` | Paramètre preset absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.applyPreset/013` | Paramètre preset avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.applyPreset/014` | Texte preset : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.listPresets — Lister les préréglages de post-traitement

Rend les compositions prêtes que le studio fournit et celles enregistrées sur cette machine, avec leur nom. C’est à cette liste que post.applyPreset sait répondre.

- Nom MCP : `post_listPresets`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.17.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.listPresets/001` | Nominal minimal : demander « Lister les préréglages de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.listPresets/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.listPresets/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.listPresets/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.listPresets/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.listPresets/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.listPresets/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.listPresets/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.duplicate — Dupliquer un effet de post-traitement

Pose une copie de l’effet juste après lui, sur les mêmes valeurs et sous une identité neuve. Refusé pour un effet dont une seconde instance ne veut rien dire — un anticrénelage, une occlusion.

- Nom MCP : `post_duplicate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.13.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.duplicate/001` | Nominal minimal : demander « Dupliquer un effet de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.duplicate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.duplicate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.duplicate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.duplicate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.duplicate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.duplicate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.duplicate/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.duplicate/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.duplicate/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.duplicate/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.duplicate/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.duplicate/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.duplicate/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.reset — Réinitialiser un effet de post-traitement

Ramène tous les paramètres de cet effet à ce que le catalogue déclare, sans le retirer de la pile ni toucher à sa place.

- Nom MCP : `post_reset`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.14.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.reset/001` | Nominal minimal : demander « Réinitialiser un effet de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.reset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.reset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.reset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.reset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.reset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.reset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.reset/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.reset/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.reset/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.reset/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.reset/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.reset/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.reset/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.addKeyframe — Poser une clé sur un paramètre de post-traitement

Ouvre un canal d’animation sur ce paramètre s’il n’en a pas, et y pose une clé à la tête. La valeur donnée est celle qu’on veut VOIR, et l’écart avec la pile est calculé ici.

- Nom MCP : `post_addKeyframe`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.15.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |
| `param` | text | True | `{}` |
| `value` | number | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId","param","value"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.addKeyframe/001` | Nominal minimal : demander « Poser une clé sur un paramètre de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.addKeyframe/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.addKeyframe/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.addKeyframe/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.addKeyframe/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.addKeyframe/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.addKeyframe/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.addKeyframe/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.addKeyframe/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.addKeyframe/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.addKeyframe/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.addKeyframe/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.addKeyframe/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.addKeyframe/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.addKeyframe/015` | Paramètre param absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.addKeyframe/016` | Paramètre param avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.addKeyframe/017` | Texte param : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.addKeyframe/018` | Paramètre value absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.addKeyframe/019` | Paramètre value avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.addKeyframe/020` | Valeur de value : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.removeKeyframe — Retirer une clé de post-traitement

Retire la clé posée à la tête sur ce paramètre. Le canal reste en place, comme lorsqu’on retire une clé depuis la bande.

- Nom MCP : `post_removeKeyframe`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.16.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `effectId` | text | True | `{}` |
| `param` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["effectId","param"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.removeKeyframe/001` | Nominal minimal : demander « Retirer une clé de post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.removeKeyframe/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.removeKeyframe/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.removeKeyframe/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.removeKeyframe/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.removeKeyframe/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.removeKeyframe/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.removeKeyframe/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.removeKeyframe/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.removeKeyframe/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.removeKeyframe/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.removeKeyframe/012` | Paramètre effectId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.removeKeyframe/013` | Paramètre effectId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.removeKeyframe/014` | Texte effectId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.removeKeyframe/015` | Paramètre param absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.removeKeyframe/016` | Paramètre param avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.removeKeyframe/017` | Texte param : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.savePreset — Enregistrer la composition comme préréglage

Garde la pile en cours sous un nom, sur cette machine. Rien n’est écrit dans le document ni dans le projet.

- Nom MCP : `post_savePreset`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.18.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cameraId` | text | False | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.savePreset/001` | Nominal minimal : demander « Enregistrer la composition comme préréglage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.savePreset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.savePreset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.savePreset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.savePreset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.savePreset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.savePreset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.savePreset/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.savePreset/009` | Paramètre cameraId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `post.savePreset/010` | Paramètre cameraId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.savePreset/011` | Texte cameraId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.savePreset/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.savePreset/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.savePreset/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.renamePreset — Renommer un préréglage enregistré

Change le nom d’un préréglage de cette machine, désigné par son identifiant ou par son nom actuel. Ce qu’il contient ne bouge pas.

- Nom MCP : `post_renamePreset`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.19.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `preset` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["preset","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.renamePreset/001` | Nominal minimal : demander « Renommer un préréglage enregistré » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.renamePreset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.renamePreset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.renamePreset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.renamePreset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.renamePreset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.renamePreset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.renamePreset/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.renamePreset/009` | Paramètre preset absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.renamePreset/010` | Paramètre preset avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.renamePreset/011` | Texte preset : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.renamePreset/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.renamePreset/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.renamePreset/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.deleteSavedPreset — Oublier un préréglage enregistré

Retire de cette machine un préréglage enregistré. Les compositions déjà appliquées ne changent pas, un document tenant sa pile plutôt qu’une référence.

- Nom MCP : `post_deleteSavedPreset`.
- Engagement déclaré : `studio` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.20.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `preset` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["preset"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.deleteSavedPreset/001` | Nominal minimal : demander « Oublier un préréglage enregistré » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.deleteSavedPreset/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.deleteSavedPreset/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.deleteSavedPreset/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.deleteSavedPreset/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.deleteSavedPreset/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.deleteSavedPreset/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.deleteSavedPreset/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `post.deleteSavedPreset/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.deleteSavedPreset/010` | Paramètre preset absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.deleteSavedPreset/011` | Paramètre preset avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.deleteSavedPreset/012` | Texte preset : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## post.setCameraStackMode — Dire ce qu’une caméra fait du post-traitement

Choisit si cette caméra suit la composition de la scène, porte la sienne, ou n’en applique aucune. Passer à la sienne la démarre sur ce qu’elle filmait déjà.

- Nom MCP : `post_setCameraStackMode`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 59.9, 59.10, 59.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `nodeId` | text | True | `{"picks":"node","reference":"node"}` |
| `mode` | choice | True | `{"options":["inherit","override","disabled"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["nodeId","mode"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `post.setCameraStackMode/001` | Nominal minimal : demander « Dire ce qu’une caméra fait du post-traitement » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `post.setCameraStackMode/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `post.setCameraStackMode/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `post.setCameraStackMode/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `post.setCameraStackMode/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `post.setCameraStackMode/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `post.setCameraStackMode/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `post.setCameraStackMode/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `post.setCameraStackMode/009` | Paramètre nodeId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.setCameraStackMode/010` | Paramètre nodeId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setCameraStackMode/011` | Texte nodeId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `post.setCameraStackMode/012` | Cible nodeId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `post.setCameraStackMode/013` | Paramètre mode absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `post.setCameraStackMode/014` | Paramètre mode avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `post.setCameraStackMode/015` | Option de mode : "inherit" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.setCameraStackMode/016` | Option de mode : "override" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.setCameraStackMode/017` | Option de mode : "disabled" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `post.setCameraStackMode/018` | Option inconnue de mode : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
