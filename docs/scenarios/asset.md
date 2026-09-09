# Catalogue des médias — 9 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer métadonnées, fichiers médias et références du catalogue ; vérifier absence d’effacement collatéral.

## assets.searchProjectCatalogue — Chercher dans le catalogue du projet

Cherche par texte, par nature et par tags dans le catalogue de CE projet, sur cette machine, et peut se restreindre à ce qui a été généré. Le catalogue porte des assets, pas les fichiers du projet : un fichier que la personne nomme se trouve en cherchant dans les fichiers du projet. La bibliothèque distante du compte est encore ailleurs. Ce que le catalogue porte SUR un asset — d’où il vient, comment il est étiqueté — est asset.get, sur les ids que ceci rend.

- Nom MCP : `assets_searchProjectCatalogue`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"returns":["projectAssetCandidates"]}`.
- Batterie existante : 3.2, 3.3, 3.5, 3.6, 20.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `text` | text | False | `{}` |
| `type` | choice | False | `{"options":["image","video","audio","mesh","skybox","animation"]}` |
| `tags` | text | False | `{"repeated":true}` |
| `generated` | boolean | False | `{}` |
| `limit` | integer | False | `{"min":1,"max":500}` |
| `offset` | integer | False | `{"min":0}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `assets.searchProjectCatalogue/001` | Nominal minimal : demander « Chercher dans le catalogue du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `assets.searchProjectCatalogue/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `assets.searchProjectCatalogue/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `assets.searchProjectCatalogue/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `assets.searchProjectCatalogue/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `assets.searchProjectCatalogue/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `assets.searchProjectCatalogue/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `assets.searchProjectCatalogue/008` | Paramètre text absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/009` | Paramètre text avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.searchProjectCatalogue/010` | Texte text : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `assets.searchProjectCatalogue/011` | Paramètre type absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/012` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.searchProjectCatalogue/013` | Option de type : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/014` | Option de type : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/015` | Option de type : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/016` | Option de type : "mesh" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/017` | Option de type : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/018` | Option de type : "animation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `assets.searchProjectCatalogue/019` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `assets.searchProjectCatalogue/020` | Paramètre tags absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/021` | Paramètre tags avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.searchProjectCatalogue/022` | Texte tags : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `assets.searchProjectCatalogue/023` | Liste tags : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `assets.searchProjectCatalogue/024` | Paramètre generated absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/025` | Paramètre generated avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.searchProjectCatalogue/026` | Booléen generated : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `assets.searchProjectCatalogue/027` | Paramètre limit absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/028` | Paramètre limit avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.searchProjectCatalogue/029` | Paramètre offset absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.searchProjectCatalogue/030` | Paramètre offset avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## assets.counts — Compter le catalogue du projet

Rend le nombre d’images, de vidéos, d’assets audio, de modèles 3D, de skyboxes et d’animations que ce projet porte sur cette machine, compté dans le catalogue plutôt qu’en les listant. Chaque nature est rendue, même lorsque son compte vaut zéro.

- Nom MCP : `assets_counts`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 1.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `assets.counts/001` | Nominal minimal : demander « Compter le catalogue du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `assets.counts/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `assets.counts/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `assets.counts/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `assets.counts/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `assets.counts/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `assets.counts/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## asset.get — Lire des assets

Rend tout ce que le catalogue sait des assets nommés — où ils sont, d’où ils viennent, comment ils sont étiquetés. C’est ce qu’il faut appeler sur les identifiants qu’une génération finie a rendus.

- Nom MCP : `asset_get`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `asset.get/001` | Nominal minimal : demander « Lire des assets » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `asset.get/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `asset.get/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `asset.get/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `asset.get/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `asset.get/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `asset.get/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `asset.get/008` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `asset.get/009` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.get/010` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `asset.get/011` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## asset.update — Corriger un asset

Change le nom d’un asset, ses tags, ou la nature que le studio a lue dans son extension. Les tags sont remplacés en entier, donc une liste vide les efface vraiment.

- Nom MCP : `asset_update`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"uses":["projectAssetCandidates"]}`.
- Batterie existante : 20.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{"reference":"asset"}` |
| `name` | text | False | `{}` |
| `tags` | text | False | `{"repeated":true}` |
| `type` | choice | False | `{"options":["image","video","audio","mesh","skybox","animation"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `asset.update/001` | Nominal minimal : demander « Corriger un asset » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `asset.update/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `asset.update/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `asset.update/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `asset.update/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `asset.update/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `asset.update/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `asset.update/008` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `asset.update/009` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.update/010` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `asset.update/011` | Cible assetId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `asset.update/012` | Paramètre name absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `asset.update/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.update/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `asset.update/015` | Paramètre tags absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `asset.update/016` | Paramètre tags avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.update/017` | Texte tags : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `asset.update/018` | Liste tags : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `asset.update/019` | Paramètre type absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `asset.update/020` | Paramètre type avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.update/021` | Option de type : "image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/022` | Option de type : "video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/023` | Option de type : "audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/024` | Option de type : "mesh" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/025` | Option de type : "skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/026` | Option de type : "animation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `asset.update/027` | Option inconnue de type : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## assets.removeFromLibrary — Retirer des assets

Sort des assets de la bibliothèque du projet, et de la bibliothèque distante quand on le demande. Ce qui a été retiré figure dans l’activité récente.

- Nom MCP : `assets_removeFromLibrary`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 43.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |
| `alsoRemote` | boolean | False | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["assetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `assets.removeFromLibrary/001` | Nominal minimal : demander « Retirer des assets » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `assets.removeFromLibrary/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `assets.removeFromLibrary/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `assets.removeFromLibrary/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `assets.removeFromLibrary/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `assets.removeFromLibrary/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `assets.removeFromLibrary/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `assets.removeFromLibrary/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `assets.removeFromLibrary/009` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `assets.removeFromLibrary/010` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `assets.removeFromLibrary/011` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.removeFromLibrary/012` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `assets.removeFromLibrary/013` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `assets.removeFromLibrary/014` | Paramètre alsoRemote absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `assets.removeFromLibrary/015` | Paramètre alsoRemote avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.removeFromLibrary/016` | Booléen alsoRemote : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## assets.captionImages — Légender des images

Fait lire les images nommées par l’API et écrit ce qu’elle y voit comme nom de l’asset. Seules les images que la bibliothèque connaît peuvent l’être, donc une sélection purement locale répond zéro.

- Nom MCP : `assets_captionImages`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"uses":["projectAssetCandidates"]}`.
- Batterie existante : 43.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `assets.captionImages/001` | Nominal minimal : demander « Légender des images » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `assets.captionImages/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `assets.captionImages/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `assets.captionImages/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `assets.captionImages/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `assets.captionImages/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `assets.captionImages/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `assets.captionImages/008` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `assets.captionImages/009` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.captionImages/010` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `assets.captionImages/011` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## asset.extractTextures — Extraire les images d’un modèle

Sort les images qu’un fichier 3D transporte et les fait entrer dans la bibliothèque du projet comme des assets à part entière. Rend les lignes qui viennent d’être créées.

- Nom MCP : `asset_extractTextures`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"uses":["projectAssetCandidates"]}`.
- Batterie existante : 2.5, 3.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{"reference":"asset"}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `asset.extractTextures/001` | Nominal minimal : demander « Extraire les images d’un modèle » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `asset.extractTextures/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `asset.extractTextures/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `asset.extractTextures/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `asset.extractTextures/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `asset.extractTextures/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `asset.extractTextures/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `asset.extractTextures/008` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `asset.extractTextures/009` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.extractTextures/010` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `asset.extractTextures/011` | Cible assetId : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## asset.reveal — Montrer un asset dans le gestionnaire de fichiers

Ouvre le Finder ou l’explorateur du système sur le fichier d’un asset. Un asset qui ne vit que dans la bibliothèque distante n’a rien à montrer, et le dit.

- Nom MCP : `asset_reveal`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `asset.reveal/001` | Nominal minimal : demander « Montrer un asset dans le gestionnaire de fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `asset.reveal/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `asset.reveal/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `asset.reveal/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `asset.reveal/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `asset.reveal/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `asset.reveal/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `asset.reveal/008` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `asset.reveal/009` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `asset.reveal/010` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## assets.listMissing — Repérer les assets dont le fichier a disparu

Parmi les assets nommés, rend ceux dont le catalogue attend un fichier qui n’est plus là. Un asset qui n’a jamais eu de fichier local n’en est jamais, puisque rien n’était attendu de lui.

- Nom MCP : `assets_listMissing`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetIds` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetIds"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `assets.listMissing/001` | Nominal minimal : demander « Repérer les assets dont le fichier a disparu » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `assets.listMissing/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `assets.listMissing/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `assets.listMissing/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `assets.listMissing/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `assets.listMissing/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `assets.listMissing/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `assets.listMissing/008` | Paramètre assetIds absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `assets.listMissing/009` | Paramètre assetIds avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `assets.listMissing/010` | Texte assetIds : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `assets.listMissing/011` | Liste assetIds : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
