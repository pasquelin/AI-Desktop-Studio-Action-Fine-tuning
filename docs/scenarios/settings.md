# Réglages et comptes — 6 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer réglages autorisés du profil invité ; ne jamais modifier ni exposer les comptes de l’hôte.

## settings.read — Lire les réglages

Répond { settings, choices } : sous settings, tous les réglages du studio, section par section ; sous choices, ce que chaque réglage à liste fermée accepte, avec son titre et son aide. Ce que la vue DESSINE vit ici — la grille, les ombres, les repères — comme les unités, le thème et la langue. Aucune action de scène ne les active.

- Nom MCP : `settings_read`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image","scene","sequence","audio","skybox","material","script","gui","character"],"documentAffinity":"relevant"}`.
- Préconditions/dépendances déclarées : `{"returns":["settingsState"]}`.
- Batterie existante : 57.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `settings.read/001` | Nominal minimal : demander « Lire les réglages » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `settings.read/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `settings.read/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `settings.read/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `settings.read/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `settings.read/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `settings.read/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `settings.read/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## settings.write — Changer les réglages

Écrit un ou plusieurs réglages, section par section. C’est ainsi que la grille et les ombres s’activent ou se règlent — les lire d’abord, un changement qui ne nomme rien de connu étant refusé plutôt qu’écrit à l’aveugle. Ce qui n’est pas nommé est laissé tel quel.

- Nom MCP : `settings_write`.
- Engagement déclaré : `studio` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"documentKinds":["image","scene","sequence","audio","skybox","material","script","gui","character"],"documentAffinity":"relevant"}`.
- Préconditions/dépendances déclarées : `{"inputs":["settingsState"]}`.
- Batterie existante : 10.1, 10.4, 10.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `settings` | record | True | `{"options":["general","home","workspaces","input","appearance","generation","ai","three","storage","shortcuts","advanced","media","git","assistant","mcp","onboarding","dictation"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["settings"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `settings.write/001` | Nominal minimal : demander « Changer les réglages » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `settings.write/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `settings.write/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `settings.write/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `settings.write/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `settings.write/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `settings.write/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `settings.write/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `settings.write/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `settings.write/010` | Paramètre settings absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `settings.write/011` | Paramètre settings avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `settings.write/012` | Option de settings : "general" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/013` | Option de settings : "home" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/014` | Option de settings : "workspaces" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/015` | Option de settings : "input" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/016` | Option de settings : "appearance" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/017` | Option de settings : "generation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/018` | Option de settings : "ai" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/019` | Option de settings : "three" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/020` | Option de settings : "storage" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/021` | Option de settings : "shortcuts" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/022` | Option de settings : "advanced" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/023` | Option de settings : "media" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/024` | Option de settings : "git" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/025` | Option de settings : "assistant" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/026` | Option de settings : "mcp" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/027` | Option de settings : "onboarding" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/028` | Option de settings : "dictation" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.write/029` | Option inconnue de settings : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## accounts.list — Lister les comptes

Rend les comptes de génération que porte ce studio, en disant lequel est actif et lesquels peuvent être renommés ou retirés. Aucune clé ni aucun secret n’est jamais rendu.

- Nom MCP : `accounts_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `accounts.list/001` | Nominal minimal : demander « Lister les comptes » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `accounts.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `accounts.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `accounts.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `accounts.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `accounts.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `accounts.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## accounts.activate — Changer de compte

Fait de l’un des comptes détenus celui par lequel le studio génère. Tout ce qui part ensuite le fait avec ses identifiants.

- Nom MCP : `accounts_activate`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `accountId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["accountId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `accounts.activate/001` | Nominal minimal : demander « Changer de compte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `accounts.activate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `accounts.activate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `accounts.activate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `accounts.activate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `accounts.activate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `accounts.activate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `accounts.activate/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `accounts.activate/009` | Paramètre accountId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `accounts.activate/010` | Paramètre accountId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `accounts.activate/011` | Texte accountId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## accounts.rename — Renommer un compte

Change l’étiquette sous laquelle un compte apparaît dans le studio. Ni la clé ni le secret ne traversent cette frontière, dans un sens comme dans l’autre.

- Nom MCP : `accounts_rename`.
- Engagement déclaré : `studio` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 43.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `accountId` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["accountId","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `accounts.rename/001` | Nominal minimal : demander « Renommer un compte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `accounts.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `accounts.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `accounts.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `accounts.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `accounts.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `accounts.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `accounts.rename/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `accounts.rename/009` | Paramètre accountId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `accounts.rename/010` | Paramètre accountId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `accounts.rename/011` | Texte accountId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `accounts.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `accounts.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `accounts.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## settings.triggerAction — Actionner un bouton des réglages

Déclenche l’un des boutons de la fenêtre des réglages — révéler un fichier, ouvrir les outils de développement, copier la commande de connexion, installer la passerelle, tout remettre à zéro. Les deux derniers laissent quelque chose derrière eux et sont demandés à l’écran.

- Nom MCP : `settings_triggerAction`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 57.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `action` | choice | True | `{"options":["advanced.openSettingsFile","advanced.openLogFolder","advanced.openDevtools","mcp.copyCommand","mcp.copyConfig","advanced.installResolveBridge","advanced.reset"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["action"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `settings.triggerAction/001` | Nominal minimal : demander « Actionner un bouton des réglages » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `settings.triggerAction/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `settings.triggerAction/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `settings.triggerAction/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `settings.triggerAction/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `settings.triggerAction/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `settings.triggerAction/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `settings.triggerAction/008` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `settings.triggerAction/009` | Paramètre action absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `settings.triggerAction/010` | Paramètre action avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `settings.triggerAction/011` | Option de action : "advanced.openSettingsFile" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/012` | Option de action : "advanced.openLogFolder" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/013` | Option de action : "advanced.openDevtools" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/014` | Option de action : "mcp.copyCommand" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/015` | Option de action : "mcp.copyConfig" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/016` | Option de action : "advanced.installResolveBridge" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/017` | Option de action : "advanced.reset" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `settings.triggerAction/018` | Option inconnue de action : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
