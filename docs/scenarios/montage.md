# Montage audio et vidéo — 17 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer pistes, clips, temps source/destination, durée, gain et liens ; écouter/rendre une fixture connue pour la validation média réelle.

## sequence.state — Lire le montage en cours d’édition

Répond le montage en avant — ses réglages, sa durée, la tête de lecture et ce qui est sélectionné — puis chaque piste avec ses clips, leurs bornes, leur entrée dans la source, leur vitesse, leurs fondus et leur niveau. Un champ À SON DÉFAUT est omis, et son absence signifie ce défaut : une piste s’entend et n’est pas verrouillée, un clip va à la vitesse 1 depuis son début, sans fondu et au niveau enregistré.

- Nom MCP : `sequence_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 1.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `sequence.state/001` | Nominal minimal : demander « Lire le montage en cours d’édition » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `sequence.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `sequence.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `sequence.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `sequence.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `sequence.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `sequence.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `sequence.state/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## sequence.seek — Placer la tête de lecture

Déplace la tête de lecture du montage devant à l’instant donné, en microsecondes. Ce n’est pas une modification, donc rien n’entre dans l’historique et l’annulation ne la ramène pas.

- Nom MCP : `sequence_seek`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `time` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["time"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `sequence.seek/001` | Nominal minimal : demander « Placer la tête de lecture » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `sequence.seek/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `sequence.seek/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `sequence.seek/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `sequence.seek/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `sequence.seek/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `sequence.seek/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `sequence.seek/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `sequence.seek/009` | Paramètre time absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `sequence.seek/010` | Paramètre time avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.add — Poser un bloc sur le montage

Pose un asset de la bibliothèque sur une piste du montage devant, à l’instant donné ou sous la tête de lecture. Ouvre les pistes qui manquent, et lie l’image à son son quand la prise en porte un.

- Nom MCP : `clip_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{"uses":["projectAssetCandidates"]}`.
- Batterie existante : 15.1, 15.2, 15.5, 16.1, 17.1, 23.1, 24.1, 32.1, 33.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{"reference":"asset"}` |
| `trackId` | text | False | `{}` |
| `start` | integer | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.add/001` | Nominal minimal : demander « Poser un bloc sur le montage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.add/009` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.add/010` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.add/011` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.add/012` | Cible assetId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `clip.add/013` | Paramètre trackId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `clip.add/014` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.add/015` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.add/016` | Paramètre start absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `clip.add/017` | Paramètre start avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.remove — Retirer un bloc du montage

Enlève un bloc de sa piste, et avec lui la moitié qui lui est liée. La place qu’il occupait reste vide plutôt que de se refermer sur ses voisins.

- Nom MCP : `clip_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.remove/001` | Nominal minimal : demander « Retirer un bloc du montage » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.remove/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.remove/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.remove/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.move — Déplacer un bloc

Porte un bloc sur une piste et à un instant donnés, en recouvrant ce qui se trouve là. Une piste verrouillée ou d’une autre nature n’accepte rien.

- Nom MCP : `clip_move`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 15.4, 17.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `trackId` | text | True | `{}` |
| `start` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","trackId","start"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.move/001` | Nominal minimal : demander « Déplacer un bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.move/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.move/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.move/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.move/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.move/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.move/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.move/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.move/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.move/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.move/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.move/012` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.move/013` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.move/014` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.move/015` | Paramètre start absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.move/016` | Paramètre start avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.trim — Rogner un bord de bloc

Tire le point d’entrée ou de sortie d’un clip jusqu’à l’instant donné, jamais au-delà de la source derrière lui. Une image fixe n’a pas de source à dépasser et s’étire librement. « at » est un instant sur la TIMELINE, jamais une durée : pour rallonger un clip de deux secondes, lire son « end » et envoyer cette valeur plus 2000000.

- Nom MCP : `clip_trim`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 15.3, 16.5, 24.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `edge` | choice | True | `{"options":["in","out"]}` |
| `at` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","edge","at"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.trim/001` | Nominal minimal : demander « Rogner un bord de bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.trim/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.trim/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.trim/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.trim/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.trim/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.trim/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.trim/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.trim/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.trim/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.trim/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.trim/012` | Paramètre edge absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.trim/013` | Paramètre edge avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.trim/014` | Option de edge : "in" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `clip.trim/015` | Option de edge : "out" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `clip.trim/016` | Option inconnue de edge : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `clip.trim/017` | Paramètre at absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.trim/018` | Paramètre at avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.split — Couper un bloc en deux

Coupe un bloc à l’instant donné et laisse les deux moitiés bout à bout. Un instant hors du bloc n’a rien à couper, et se voit refusé plutôt que rapporté comme fait.

- Nom MCP : `clip_split`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `at` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","at"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.split/001` | Nominal minimal : demander « Couper un bloc en deux » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.split/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.split/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.split/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.split/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.split/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.split/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.split/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.split/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.split/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.split/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.split/012` | Paramètre at absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.split/013` | Paramètre at avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.fade — Régler un fondu de bloc

Donne au fondu d’entrée ou de sortie d’un BLOC DE MONTAGE la longueur demandée — il faut donc un montage vidéo ou audio ouvert devant. Deux rampes plus longues que le bloc lui-même sont ramenées à ce qu’il peut porter. Pour un fondu dans la cinématique d’une scène 3D, c’est timeline.addSceneCue.

- Nom MCP : `clip_fade`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 16.3, 16.4, 17.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `edge` | choice | True | `{"options":["in","out"]}` |
| `length` | integer | True | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","edge","length"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.fade/001` | Nominal minimal : demander « Régler un fondu de bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.fade/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.fade/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.fade/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.fade/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.fade/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.fade/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.fade/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.fade/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.fade/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.fade/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.fade/012` | Paramètre edge absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.fade/013` | Paramètre edge avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.fade/014` | Option de edge : "in" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `clip.fade/015` | Option de edge : "out" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `clip.fade/016` | Option inconnue de edge : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `clip.fade/017` | Paramètre length absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.fade/018` | Paramètre length avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.gain — Régler le niveau d’un bloc

Change le niveau d’un bloc en décibels, zéro laissant la prise telle qu’elle a été enregistrée. La valeur est bornée à ce que la lecture sait tenir.

- Nom MCP : `clip_gain`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 16.2, 17.3, 17.4, 24.7, 28.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `gain` | number | True | `{"min":-60,"max":12}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","gain"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.gain/001` | Nominal minimal : demander « Régler le niveau d’un bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.gain/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.gain/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.gain/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.gain/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.gain/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.gain/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.gain/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.gain/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.gain/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.gain/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.gain/012` | Paramètre gain absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.gain/013` | Paramètre gain avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.gain/014` | Valeur de gain : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `clip.gain/015` | Borne min de gain = -60 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `clip.gain/016` | Borne max de gain = 12 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.speed — Régler la vitesse d’un bloc

Change la vitesse de lecture d’un bloc, un pour la vitesse d’origine. La durée sur le montage suit, la source lue restant la même.

- Nom MCP : `clip_speed`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 15.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |
| `speed` | number | True | `{"min":0.25,"max":4}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId","speed"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.speed/001` | Nominal minimal : demander « Régler la vitesse d’un bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.speed/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.speed/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.speed/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.speed/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.speed/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.speed/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.speed/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.speed/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.speed/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.speed/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `clip.speed/012` | Paramètre speed absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.speed/013` | Paramètre speed avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.speed/014` | Valeur de speed : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `clip.speed/015` | Borne min de speed = 0.25 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |
| `clip.speed/016` | Borne max de speed = 4 : valeur exacte et valeurs de part et d’autre ; vérifier rejet ou clamp selon le contrat réel, et le résultat effectivement stocké. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.unlink — Détacher l’image de son son

Sépare les deux moitiés d’une prise, de sorte que déplacer, rogner ou couper l’une n’atteigne plus l’autre. Rien ne les relie de nouveau ensuite.

- Nom MCP : `clip_unlink`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 52.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.unlink/001` | Nominal minimal : demander « Détacher l’image de son son » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.unlink/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.unlink/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.unlink/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.unlink/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.unlink/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.unlink/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.unlink/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.unlink/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.unlink/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.unlink/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## clip.select — Désigner un bloc

Désigne le bloc sur lequel l’inspecteur et les gestes sans cible vont porter. Ce n’est pas une modification, et l’annulation ne la reprend pas.

- Nom MCP : `clip_select`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `clipId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["clipId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `clip.select/001` | Nominal minimal : demander « Désigner un bloc » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `clip.select/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `clip.select/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `clip.select/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `clip.select/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `clip.select/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `clip.select/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `clip.select/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `clip.select/009` | Paramètre clipId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `clip.select/010` | Paramètre clipId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `clip.select/011` | Texte clipId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## track.add — Ajouter une piste

Ouvre une piste image ou son sous les autres. Une piste image ne peut rien porter d’un son, et l’inverse est vrai aussi.

- Nom MCP : `track_add`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 16.1, 17.1, 32.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `kind` | choice | True | `{"options":["video","audio"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["kind"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `track.add/001` | Nominal minimal : demander « Ajouter une piste » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `track.add/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `track.add/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `track.add/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `track.add/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `track.add/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `track.add/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `track.add/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `track.add/009` | Paramètre kind absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.add/010` | Paramètre kind avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.add/011` | Option de kind : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `track.add/012` | Option de kind : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `track.add/013` | Option inconnue de kind : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## track.remove — Retirer une piste

Enlève une piste du montage, et tous les blocs qu’elle portait avec elle. Une piste verrouillée n’est pas retirée.

- Nom MCP : `track_remove`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `track.remove/001` | Nominal minimal : demander « Retirer une piste » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `track.remove/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `track.remove/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `track.remove/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `track.remove/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `track.remove/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `track.remove/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `track.remove/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `track.remove/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.remove/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.remove/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## track.reorderTracks — Changer l’ordre des pistes

Déplace une piste du nombre de rangs donné, ce qui change ce qui recouvre quoi. Les rangs se comptent depuis le HAUT, donc un nombre négatif la monte et un positif la descend — sequence.state les répond dans cet ordre, la première étant la plus haute.

- Nom MCP : `track_reorderTracks`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 52.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |
| `by` | integer | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId","by"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `track.reorderTracks/001` | Nominal minimal : demander « Changer l’ordre des pistes » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `track.reorderTracks/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `track.reorderTracks/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `track.reorderTracks/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `track.reorderTracks/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `track.reorderTracks/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `track.reorderTracks/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `track.reorderTracks/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `track.reorderTracks/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.reorderTracks/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.reorderTracks/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `track.reorderTracks/012` | Paramètre by absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.reorderTracks/013` | Paramètre by avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## track.rename — Renommer une piste

Donne son nom à une piste, celui que porte la colonne des en-têtes. L’identifiant, lui, ne change jamais.

- Nom MCP : `track_rename`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `track.rename/001` | Nominal minimal : demander « Renommer une piste » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `track.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `track.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `track.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `track.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `track.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `track.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `track.rename/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `track.rename/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.rename/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.rename/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `track.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## track.setMuteSoloLockHeight — Régler comment une piste se travaille

Change le silence, le solo, le verrou ou la hauteur d’une piste. Ces quatre-là disent comment on travaille et non ce qu’on a fait, et n’entrent donc jamais dans l’historique.

- Nom MCP : `track_setMuteSoloLockHeight`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["sequence"],"documentAffinity":"required"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 40.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `trackId` | text | True | `{}` |
| `muted` | boolean | False | `{}` |
| `solo` | boolean | False | `{}` |
| `locked` | boolean | False | `{}` |
| `height` | integer | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["trackId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `track.setMuteSoloLockHeight/001` | Nominal minimal : demander « Régler comment une piste se travaille » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `track.setMuteSoloLockHeight/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `track.setMuteSoloLockHeight/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `track.setMuteSoloLockHeight/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `track.setMuteSoloLockHeight/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `track.setMuteSoloLockHeight/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `track.setMuteSoloLockHeight/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `track.setMuteSoloLockHeight/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `track.setMuteSoloLockHeight/009` | Paramètre trackId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `track.setMuteSoloLockHeight/010` | Paramètre trackId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.setMuteSoloLockHeight/011` | Texte trackId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `track.setMuteSoloLockHeight/012` | Paramètre muted absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `track.setMuteSoloLockHeight/013` | Paramètre muted avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.setMuteSoloLockHeight/014` | Booléen muted : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `track.setMuteSoloLockHeight/015` | Paramètre solo absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `track.setMuteSoloLockHeight/016` | Paramètre solo avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.setMuteSoloLockHeight/017` | Booléen solo : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `track.setMuteSoloLockHeight/018` | Paramètre locked absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `track.setMuteSoloLockHeight/019` | Paramètre locked avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `track.setMuteSoloLockHeight/020` | Booléen locked : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `track.setMuteSoloLockHeight/021` | Paramètre height absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `track.setMuteSoloLockHeight/022` | Paramètre height avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
