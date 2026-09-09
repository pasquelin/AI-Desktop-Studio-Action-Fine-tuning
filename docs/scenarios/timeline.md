# Déroulement des scènes — 3 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer l’état métier avant/après avec un lecteur indépendant, puis la persistance si l’action en prévoit une.

## timeline.addSceneCue — Poser un événement, un média ou un fondu sur la timeline

Ajoute un événement, un son, une vidéo ou une transition à la timeline de la SCÈNE 3D. Un événement est un NOM diffusé sur le bus au moment dit, qu’un script entend par onMessage — c’est ainsi qu’on fait arriver quelque chose à un instant de cinématique, plutôt qu’en posant des clés d’animation. Un fondu de cinématique se pose ici, avec list=transitions et what=fade. Ce que le troisième champ désigne dépend de la liste — un nom d’événement, un identifiant d’asset, ou un genre de transition. Pour un fondu sur un bloc de montage, c’est clip.fade.

- Nom MCP : `timeline_addSceneCue`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["timeline"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 62.1, 62.2, 64.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `list` | choice | True | `{"options":["events","audio","video","transitions"]}` |
| `at` | number | True | `{}` |
| `what` | text | True | `{}` |
| `duration` | number | False | `{}` |
| `entity` | text | False | `{}` |
| `scene` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["list","at","what"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `timeline.addSceneCue/001` | Nominal minimal : demander « Poser un événement, un média ou un fondu sur la timeline » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `timeline.addSceneCue/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `timeline.addSceneCue/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `timeline.addSceneCue/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `timeline.addSceneCue/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `timeline.addSceneCue/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `timeline.addSceneCue/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `timeline.addSceneCue/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `timeline.addSceneCue/009` | Paramètre list absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.addSceneCue/010` | Paramètre list avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/011` | Option de list : "events" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.addSceneCue/012` | Option de list : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.addSceneCue/013` | Option de list : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.addSceneCue/014` | Option de list : "transitions" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.addSceneCue/015` | Option inconnue de list : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `timeline.addSceneCue/016` | Paramètre at absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.addSceneCue/017` | Paramètre at avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/018` | Valeur de at : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `timeline.addSceneCue/019` | Paramètre what absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.addSceneCue/020` | Paramètre what avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/021` | Texte what : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `timeline.addSceneCue/022` | Paramètre duration absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `timeline.addSceneCue/023` | Paramètre duration avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/024` | Valeur de duration : zéro, négative, fractionnaire et très grande mais finie ; vérifier unité, précision et contraintes métier, sans présumer qu’elles sont toutes valides. |
| `timeline.addSceneCue/025` | Paramètre entity absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `timeline.addSceneCue/026` | Paramètre entity avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/027` | Texte entity : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `timeline.addSceneCue/028` | Paramètre scene absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `timeline.addSceneCue/029` | Paramètre scene avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.addSceneCue/030` | Texte scene : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## timeline.removeSceneCue — Retirer un repère de la timeline

Retire un repère de la timeline de la SCÈNE 3D — un événement, un son, une vidéo ou une transition, dont un fondu de cinématique. L’identifiant se lit dans le membre cues que scene.state rend, jamais ailleurs. Pour retirer un fondu d’un bloc de montage, c’est clip.fade avec une longueur nulle.

- Nom MCP : `timeline_removeSceneCue`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["timeline"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 62.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `list` | choice | True | `{"options":["events","audio","video","transitions"]}` |
| `id` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["list","id"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `timeline.removeSceneCue/001` | Nominal minimal : demander « Retirer un repère de la timeline » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `timeline.removeSceneCue/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `timeline.removeSceneCue/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `timeline.removeSceneCue/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `timeline.removeSceneCue/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `timeline.removeSceneCue/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `timeline.removeSceneCue/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `timeline.removeSceneCue/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `timeline.removeSceneCue/009` | Paramètre list absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.removeSceneCue/010` | Paramètre list avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.removeSceneCue/011` | Option de list : "events" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.removeSceneCue/012` | Option de list : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.removeSceneCue/013` | Option de list : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.removeSceneCue/014` | Option de list : "transitions" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.removeSceneCue/015` | Option inconnue de list : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `timeline.removeSceneCue/016` | Paramètre id absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.removeSceneCue/017` | Paramètre id avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.removeSceneCue/018` | Texte id : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## timeline.setPanelRows — Choisir ce que la timeline offre

Décide quelles rangées le panneau propose. Ne retire jamais rien au moteur, qui joue toute la timeline quoi qu’il arrive.

- Nom MCP : `timeline_setPanelRows`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["scene"],"documentAffinity":"required","targets":["timeline"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 62.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `template` | choice | True | `{"options":["cinematic","dialogue","intro","gameplay","custom"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["template"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `timeline.setPanelRows/001` | Nominal minimal : demander « Choisir ce que la timeline offre » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `timeline.setPanelRows/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `timeline.setPanelRows/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `timeline.setPanelRows/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `timeline.setPanelRows/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `timeline.setPanelRows/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `timeline.setPanelRows/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `timeline.setPanelRows/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `timeline.setPanelRows/009` | Paramètre template absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `timeline.setPanelRows/010` | Paramètre template avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `timeline.setPanelRows/011` | Option de template : "cinematic" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.setPanelRows/012` | Option de template : "dialogue" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.setPanelRows/013` | Option de template : "intro" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.setPanelRows/014` | Option de template : "gameplay" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.setPanelRows/015` | Option de template : "custom" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `timeline.setPanelRows/016` | Option inconnue de template : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
