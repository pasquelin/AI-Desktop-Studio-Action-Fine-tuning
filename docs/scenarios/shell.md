# Fenêtres, système et dictée — 21 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Lire l’état de la fenêtre, des panneaux ou de la dictée invités ; contrôler visuellement ce qui ne peut pas être prouvé par l’état seul.

## auth.state — Savoir si le studio est connecté

Dit si une clé API est en place et sur quel compte le studio travaille. Ne rend jamais la clé elle-même, qui ne quitte pas le processus principal.

- Nom MCP : `auth_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `auth.state/001` | Nominal minimal : demander « Savoir si le studio est connecté » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `auth.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `auth.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `auth.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `auth.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `auth.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `auth.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## window.state — Lire l’état de la fenêtre

Rend la taille de la fenêtre, si elle est agrandie ou en plein écran, et la langue dans laquelle elle dessine — celle que le processus principal a réellement retenue.

- Nom MCP : `window_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `window.state/001` | Nominal minimal : demander « Lire l’état de la fenêtre » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `window.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `window.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `window.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `window.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `window.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `window.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## window.fullScreen — Basculer le plein écran

Fait entrer la fenêtre en plein écran, ou l’en fait sortir. C’est un basculement, il n’y a pas de façon de demander l’un des deux états.

- Nom MCP : `window_fullScreen`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `window.fullScreen/001` | Nominal minimal : demander « Basculer le plein écran » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `window.fullScreen/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `window.fullScreen/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `window.fullScreen/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `window.fullScreen/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `window.fullScreen/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `window.fullScreen/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## settings.open — Ouvrir les réglages sur une section

Ouvre la fenêtre des réglages sur la section demandée, ou l’y amène si elle est déjà ouverte. Lire et écrire un réglage ne demande pas de l’ouvrir.

- Nom MCP : `settings_open`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `section` | choice | True | `{"options":["general","account","appearance","generation","ai","ai.image","ai.video","ai.3d","ai.audio","ai.material","ai.skybox","ai.code","ai.upscale","ai.background-removal","ai.vectorization","spaces","spaces.three","input","shortcuts","dictation","media","git","mcp","memory","memory.graph","storage","advanced"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["section"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `settings.open/001` | Nominal minimal : demander « Ouvrir les réglages sur une section » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `settings.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `settings.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `settings.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `settings.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `settings.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `settings.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `settings.open/008` | Paramètre section absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `settings.open/009` | Paramètre section avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `settings.open/010` | Option de section : "general" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/011` | Option de section : "account" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/012` | Option de section : "appearance" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/013` | Option de section : "generation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/014` | Option de section : "ai" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/015` | Option de section : "ai.image" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/016` | Option de section : "ai.video" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/017` | Option de section : "ai.3d" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/018` | Option de section : "ai.audio" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/019` | Option de section : "ai.material" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/020` | Option de section : "ai.skybox" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/021` | Option de section : "ai.code" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/022` | Option de section : "ai.upscale" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/023` | Option de section : "ai.background-removal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/024` | Option de section : "ai.vectorization" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/025` | Option de section : "spaces" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/026` | Option de section : "spaces.three" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/027` | Option de section : "input" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/028` | Option de section : "shortcuts" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/029` | Option de section : "dictation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/030` | Option de section : "media" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/031` | Option de section : "git" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/032` | Option de section : "mcp" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/033` | Option de section : "memory" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/034` | Option de section : "memory.graph" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/035` | Option de section : "storage" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/036` | Option de section : "advanced" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.open/037` | Option inconnue de section : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## updates.state — Lire l’état des mises à jour

Dit où en est la mise à jour de l’application — rien en vue, en cours de téléchargement, ou prête à s’installer à la prochaine fermeture. updates.install est ce qui l’installe et redémarre le studio.

- Nom MCP : `updates_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `updates.state/001` | Nominal minimal : demander « Lire l’état des mises à jour » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `updates.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `updates.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `updates.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `updates.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `updates.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `updates.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## media.capabilities — Savoir ce que le studio sait décoder

Dit de quoi la machine est capable côté média, ce qui dépend de la présence de ffmpeg. Sans lui, l’import fonctionne mais l’interface annonce ce qu’elle ne peut pas faire.

- Nom MCP : `media_capabilities`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `media.capabilities/001` | Nominal minimal : demander « Savoir ce que le studio sait décoder » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `media.capabilities/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `media.capabilities/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `media.capabilities/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `media.capabilities/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `media.capabilities/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `media.capabilities/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## media.indexFileInPlace — Donner une ligne de catalogue à un fichier

Fait entrer dans le catalogue un fichier que le dossier du projet contient déjà, sans le copier. C’est la moitié de l’import qui n’ouvre pas de dialogue système.

- Nom MCP : `media_indexFileInPlace`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `media.indexFileInPlace/001` | Nominal minimal : demander « Donner une ligne de catalogue à un fichier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `media.indexFileInPlace/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `media.indexFileInPlace/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `media.indexFileInPlace/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `media.indexFileInPlace/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `media.indexFileInPlace/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `media.indexFileInPlace/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `media.indexFileInPlace/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `media.indexFileInPlace/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `media.indexFileInPlace/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## fonts.list — Lister les polices installées

Rend les polices dans lesquelles un texte peut être écrit, celles livrées avec le studio d’abord, puis celles installées sur la machine. Chacune vient avec sa provenance, que poser une police réclame autant que son nom.

- Nom MCP : `fonts_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `fonts.list/001` | Nominal minimal : demander « Lister les polices installées » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `fonts.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `fonts.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `fonts.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `fonts.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `fonts.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `fonts.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## favorites.listPinnedRecipes — Lister les recettes épinglées

Rend les recettes épinglées au projet, avec le modèle qui les a produites et l’espace qui sait les refaire. Une recette garde de quoi relancer une génération.

- Nom MCP : `favorites_listPinnedRecipes`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `favorites.listPinnedRecipes/001` | Nominal minimal : demander « Lister les recettes épinglées » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `favorites.listPinnedRecipes/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `favorites.listPinnedRecipes/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `favorites.listPinnedRecipes/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `favorites.listPinnedRecipes/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `favorites.listPinnedRecipes/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `favorites.listPinnedRecipes/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## favorite.pinAssetRecipe — Épingler la recette d’un asset

Épingle ce qui a produit un asset du projet ouvert, pour pouvoir le refaire. Un asset que personne n’a généré n’a pas de recette à garder.

- Nom MCP : `favorite_pinAssetRecipe`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `assetId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["assetId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `favorite.pinAssetRecipe/001` | Nominal minimal : demander « Épingler la recette d’un asset » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `favorite.pinAssetRecipe/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `favorite.pinAssetRecipe/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `favorite.pinAssetRecipe/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `favorite.pinAssetRecipe/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `favorite.pinAssetRecipe/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `favorite.pinAssetRecipe/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `favorite.pinAssetRecipe/008` | Paramètre assetId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `favorite.pinAssetRecipe/009` | Paramètre assetId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `favorite.pinAssetRecipe/010` | Texte assetId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## favorite.unpinAssetRecipe — Retirer une recette épinglée

Enlève une recette de la liste des épinglées. L’asset qu’elle avait produit, lui, ne bouge pas.

- Nom MCP : `favorite_unpinAssetRecipe`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `favoriteId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["favoriteId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `favorite.unpinAssetRecipe/001` | Nominal minimal : demander « Retirer une recette épinglée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `favorite.unpinAssetRecipe/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `favorite.unpinAssetRecipe/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `favorite.unpinAssetRecipe/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `favorite.unpinAssetRecipe/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `favorite.unpinAssetRecipe/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `favorite.unpinAssetRecipe/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `favorite.unpinAssetRecipe/008` | Paramètre favoriteId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `favorite.unpinAssetRecipe/009` | Paramètre favoriteId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `favorite.unpinAssetRecipe/010` | Texte favoriteId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## fileInfo.openWindow — Ouvrir les informations d’un fichier

Ouvre la fenêtre qui décrit un fichier du projet — sa taille, sa nature, son historique et ce que le catalogue en sait.

- Nom MCP : `fileInfo_openWindow`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `fileInfo.openWindow/001` | Nominal minimal : demander « Ouvrir les informations d’un fichier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `fileInfo.openWindow/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `fileInfo.openWindow/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `fileInfo.openWindow/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `fileInfo.openWindow/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `fileInfo.openWindow/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `fileInfo.openWindow/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `fileInfo.openWindow/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `fileInfo.openWindow/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `fileInfo.openWindow/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## mirror.openVideoReturnWindow — Ouvrir le retour vidéo

Ouvre la fenêtre de retour, ou la ramène devant si elle est déjà là. Elle montre ce que le montage joue, sans rien porter du travail.

- Nom MCP : `mirror_openVideoReturnWindow`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.7.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `mirror.openVideoReturnWindow/001` | Nominal minimal : demander « Ouvrir le retour vidéo » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `mirror.openVideoReturnWindow/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `mirror.openVideoReturnWindow/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `mirror.openVideoReturnWindow/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `mirror.openVideoReturnWindow/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `mirror.openVideoReturnWindow/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `mirror.openVideoReturnWindow/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## help.openStudioWindow — Ouvrir une fenêtre du studio

Ouvre le manuel utilisateur, la fenêtre des licences, celle de la consommation, le journal ou l’accueil — ou la ramène devant si elle est déjà là. Ce sont des fenêtres du processus principal, et aucune commande du registre ne les atteint.

- Nom MCP : `help_openStudioWindow`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.8, 55.12.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `page` | choice | True | `{"options":["manual","licences","usage","journal","welcome"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["page"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `help.openStudioWindow/001` | Nominal minimal : demander « Ouvrir une fenêtre du studio » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `help.openStudioWindow/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `help.openStudioWindow/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `help.openStudioWindow/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `help.openStudioWindow/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `help.openStudioWindow/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `help.openStudioWindow/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `help.openStudioWindow/008` | Paramètre page absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `help.openStudioWindow/009` | Paramètre page avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `help.openStudioWindow/010` | Option de page : "manual" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `help.openStudioWindow/011` | Option de page : "licences" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `help.openStudioWindow/012` | Option de page : "usage" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `help.openStudioWindow/013` | Option de page : "journal" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `help.openStudioWindow/014` | Option de page : "welcome" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `help.openStudioWindow/015` | Option inconnue de page : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## updates.install — Installer la mise à jour téléchargée

Quitte le studio et relance la version déjà téléchargée. Ne fait quelque chose qu’une fois la mise à jour prête, et ce qui n’est pas enregistré part avec la fermeture.

- Nom MCP : `updates_install`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `updates.install/001` | Nominal minimal : demander « Installer la mise à jour téléchargée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `updates.install/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `updates.install/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `updates.install/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `updates.install/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `updates.install/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `updates.install/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `updates.install/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## dictation.state — Lire l’état de la dictée

Dit où en est la reconnaissance vocale — au repos, en écoute, en attente d’autorisation ou de modèle — et ce qui a échoué le cas échéant.

- Nom MCP : `dictation_state`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `dictation.state/001` | Nominal minimal : demander « Lire l’état de la dictée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `dictation.state/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `dictation.state/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `dictation.state/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `dictation.state/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `dictation.state/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `dictation.state/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## dictation.start — Démarrer la dictée

Ouvre le micro et écrit ce qu’il entend là où le curseur se trouve. Sans champ actif, la dictée n’a nulle part où écrire, et le curseur se pose donc avant l’appel.

- Nom MCP : `dictation_start`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `dictation.start/001` | Nominal minimal : demander « Démarrer la dictée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `dictation.start/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `dictation.start/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `dictation.start/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `dictation.start/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `dictation.start/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `dictation.start/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## dictation.stop — Arrêter la dictée

Referme le micro. Garde par défaut ce qui a été entendu, et peut le jeter à la place — les deux gestes diffèrent exactement là.

- Nom MCP : `dictation_stop`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 56.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `discard` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `dictation.stop/001` | Nominal minimal : demander « Arrêter la dictée » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `dictation.stop/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `dictation.stop/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `dictation.stop/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `dictation.stop/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `dictation.stop/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `dictation.stop/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `dictation.stop/008` | Paramètre discard absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `dictation.stop/009` | Paramètre discard avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `dictation.stop/010` | Booléen discard : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## panels.list — Lister les panneaux

Rend les panneaux que la surface au premier plan sait afficher, et dit lesquels sont ouverts. Un panneau qu’une surface ne sert pas n’y figure pas, puisqu’il ne peut pas y être ouvert.

- Nom MCP : `panels_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `panels.list/001` | Nominal minimal : demander « Lister les panneaux » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `panels.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `panels.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `panels.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `panels.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `panels.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `panels.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## panel.open — Ouvrir un panneau

Amène un panneau devant, à l’endroit que la surface au premier plan lui réserve. Un panneau déjà visible reçoit le focus plutôt que d’être réécrit.

- Nom MCP : `panel_open`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `panel` | choice | True | `{"options":["generator","assets","explorer","assistant","layers","text","scene","guiTree","lights","meshes","world","inspector","timeline","problems","projects","git","context","history"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["panel"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `panel.open/001` | Nominal minimal : demander « Ouvrir un panneau » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `panel.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `panel.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `panel.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `panel.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `panel.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `panel.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `panel.open/008` | Paramètre panel absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `panel.open/009` | Paramètre panel avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `panel.open/010` | Option de panel : "generator" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/011` | Option de panel : "assets" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/012` | Option de panel : "explorer" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/013` | Option de panel : "assistant" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/014` | Option de panel : "layers" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/015` | Option de panel : "text" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/016` | Option de panel : "scene" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/017` | Option de panel : "guiTree" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/018` | Option de panel : "lights" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/019` | Option de panel : "meshes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/020` | Option de panel : "world" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/021` | Option de panel : "inspector" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/022` | Option de panel : "timeline" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/023` | Option de panel : "problems" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/024` | Option de panel : "projects" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/025` | Option de panel : "git" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/026` | Option de panel : "context" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/027` | Option de panel : "history" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.open/028` | Option inconnue de panel : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## panel.close — Fermer un panneau

Vide la demi-zone où la surface au premier plan range ce panneau. La disposition des autres panneaux ne bouge pas.

- Nom MCP : `panel_close`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 55.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `panel` | choice | True | `{"options":["generator","assets","explorer","assistant","layers","text","scene","guiTree","lights","meshes","world","inspector","timeline","problems","projects","git","context","history"]}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["panel"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `panel.close/001` | Nominal minimal : demander « Fermer un panneau » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `panel.close/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `panel.close/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `panel.close/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `panel.close/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `panel.close/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `panel.close/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `panel.close/008` | Paramètre panel absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `panel.close/009` | Paramètre panel avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `panel.close/010` | Option de panel : "generator" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/011` | Option de panel : "assets" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/012` | Option de panel : "explorer" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/013` | Option de panel : "assistant" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/014` | Option de panel : "layers" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/015` | Option de panel : "text" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/016` | Option de panel : "scene" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/017` | Option de panel : "guiTree" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/018` | Option de panel : "lights" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/019` | Option de panel : "meshes" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/020` | Option de panel : "world" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/021` | Option de panel : "inspector" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/022` | Option de panel : "timeline" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/023` | Option de panel : "problems" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/024` | Option de panel : "projects" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/025` | Option de panel : "git" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/026` | Option de panel : "context" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/027` | Option de panel : "history" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `panel.close/028` | Option inconnue de panel : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
