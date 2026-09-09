# Bibliothèque distante et synchronisation — 6 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer bibliothèque du compte de test et état local ; simuler puis vérifier séparément les échanges distants, sans compte personnel.

## cloud.browseAccountLibrary — Parcourir la bibliothèque distante

Rend une page de la bibliothèque du compte, filtrée par texte, tags ou nature. La pagination se fait par curseur, et il n’y a pas de total — l’API n’en donne aucun.

- Nom MCP : `cloud_browseAccountLibrary`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.1, 54.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `text` | text | False | `{}` |
| `tags` | text | False | `{"repeated":true}` |
| `types` | choice | False | `{"options":["image","video","audio","mesh","skybox","animation"],"repeated":true}` |
| `cursor` | text | False | `{}` |
| `pageSize` | integer | False | `{"min":1}` |
| `order` | choice | False | `{"options":["newest","relevance"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.browseAccountLibrary/001` | Nominal minimal : demander « Parcourir la bibliothèque distante » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.browseAccountLibrary/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.browseAccountLibrary/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.browseAccountLibrary/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.browseAccountLibrary/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.browseAccountLibrary/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.browseAccountLibrary/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.browseAccountLibrary/008` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/009` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/010` | Texte text : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.browseAccountLibrary/011` | Paramètre tags absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/012` | Paramètre tags avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/013` | Texte tags : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.browseAccountLibrary/014` | Liste tags : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `cloud.browseAccountLibrary/015` | Paramètre types absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/016` | Paramètre types avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/017` | Option de types : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/018` | Option de types : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/019` | Option de types : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/020` | Option de types : "mesh" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/021` | Option de types : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/022` | Option de types : "animation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/023` | Option inconnue de types : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `cloud.browseAccountLibrary/024` | Liste types : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `cloud.browseAccountLibrary/025` | Paramètre cursor absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/026` | Paramètre cursor avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/027` | Texte cursor : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.browseAccountLibrary/028` | Paramètre pageSize absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/029` | Paramètre pageSize avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/030` | Paramètre order absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.browseAccountLibrary/031` | Paramètre order avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.browseAccountLibrary/032` | Option de order : "newest" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/033` | Option de order : "relevance" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.browseAccountLibrary/034` | Option inconnue de order : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cloud.explorePublicFeed — Parcourir ce que tout le monde a publié

Rend une page du flux public d’une nature donnée, du plus récent au plus ancien. Ces assets ne sont pas les vôtres, et les regarder n’en rapatrie aucun. cloud.pull est ce qui en fait descendre une dans le projet, octets compris.

- Nom MCP : `cloud_explorePublicFeed`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `type` | choice | True | `{"options":["image","video","audio","mesh","skybox","animation"]}` |
| `cursor` | text | False | `{}` |
| `pageSize` | integer | False | `{"min":1}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["type"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.explorePublicFeed/001` | Nominal minimal : demander « Parcourir ce que tout le monde a publié » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.explorePublicFeed/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.explorePublicFeed/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.explorePublicFeed/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.explorePublicFeed/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.explorePublicFeed/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.explorePublicFeed/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.explorePublicFeed/008` | Paramètre type absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.explorePublicFeed/009` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.explorePublicFeed/010` | Option de type : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/011` | Option de type : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/012` | Option de type : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/013` | Option de type : "mesh" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/014` | Option de type : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/015` | Option de type : "animation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.explorePublicFeed/016` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `cloud.explorePublicFeed/017` | Paramètre cursor absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.explorePublicFeed/018` | Paramètre cursor avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.explorePublicFeed/019` | Texte cursor : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.explorePublicFeed/020` | Paramètre pageSize absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `cloud.explorePublicFeed/021` | Paramètre pageSize avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cloud.findSimilarPublished — Chercher ce qui ressemble à un asset

Rend les assets publiés qui ressemblent à celui nommé, celui-ci étant retiré de ses propres résultats. La référence est au choix de l’appelant.

- Nom MCP : `cloud_findSimilarPublished`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.findSimilarPublished/001` | Nominal minimal : demander « Chercher ce qui ressemble à un asset » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.findSimilarPublished/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.findSimilarPublished/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.findSimilarPublished/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.findSimilarPublished/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.findSimilarPublished/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.findSimilarPublished/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.findSimilarPublished/008` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.findSimilarPublished/009` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.findSimilarPublished/010` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cloud.previewSync — Prévoir ce qu’une synchronisation ferait

Dit ce qu’un envoi ou un rapatriement ferait de chaque asset nommé, avant que cela ne coûte la moindre requête. Rien n’est envoyé ni rapatrié.

- Nom MCP : `cloud_previewSync`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |
| `policy` | choice | True | `{"options":["push","pull","two-way"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetIds","policy"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.previewSync/001` | Nominal minimal : demander « Prévoir ce qu’une synchronisation ferait » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.previewSync/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.previewSync/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.previewSync/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.previewSync/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.previewSync/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.previewSync/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.previewSync/008` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.previewSync/009` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.previewSync/010` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.previewSync/011` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `cloud.previewSync/012` | Paramètre policy absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.previewSync/013` | Paramètre policy avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.previewSync/014` | Option de policy : "push" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.previewSync/015` | Option de policy : "pull" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.previewSync/016` | Option de policy : "two-way" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `cloud.previewSync/017` | Option inconnue de policy : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cloud.pull — Rapatrier des assets distants

Fait entrer des assets dans le projet, octets compris, et dit ce que chacun a donné. Un téléchargement interrompu garde ce qu’il avait déjà écrit.

- Nom MCP : `cloud_pull`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `remoteAssetIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["remoteAssetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.pull/001` | Nominal minimal : demander « Rapatrier des assets distants » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.pull/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.pull/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.pull/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.pull/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.pull/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.pull/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.pull/008` | Paramètre remoteAssetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.pull/009` | Paramètre remoteAssetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.pull/010` | Texte remoteAssetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.pull/011` | Liste remoteAssetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## cloud.push — Envoyer des assets vers le compte

Envoie des assets locaux vers la bibliothèque du compte, où ils restent. C’est le seul geste de cette famille qui laisse quelque chose derrière lui.

- Nom MCP : `cloud_push`.
- Engagement déclaré : `asset` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 54.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["assetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `cloud.push/001` | Nominal minimal : demander « Envoyer des assets vers le compte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `cloud.push/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `cloud.push/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `cloud.push/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `cloud.push/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `cloud.push/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `cloud.push/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `cloud.push/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `cloud.push/009` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `cloud.push/010` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `cloud.push/011` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `cloud.push/012` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
