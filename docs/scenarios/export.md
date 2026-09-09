# Export du jeu — 1 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Vérifier fichiers exportés, manifeste et lancement de l’artefact dans la cible ; existence d’un dossier seule insuffisante.

## game.export — Exporter le jeu

Écrit dans un dossier un jeu qui tourne dans un navigateur sans le studio, avec la page, le runtime, les scènes, les scripts transpilés et les seuls assets qu’ils atteignent.

- Nom MCP : `game_export`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 65.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `entryScene` | text | False | `{}` |
| `title` | text | False | `{}` |
| `folder` | text | False | `{}` |
| `generateLods` | boolean | False | `{}` |
| `geometrySimplification` | choice | False | `{"options":["off","conservative","balanced","aggressive"]}` |
| `textureCompression` | choice | False | `{"options":["off","conservative","balanced","aggressive"]}` |
| `textureReduction` | choice | False | `{"options":["off","half","quarter"]}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `game.export/001` | Nominal minimal : demander « Exporter le jeu » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `game.export/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `game.export/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `game.export/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `game.export/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `game.export/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `game.export/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `game.export/008` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `game.export/009` | Paramètre entryScene absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/010` | Paramètre entryScene avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/011` | Texte entryScene : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `game.export/012` | Paramètre title absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/013` | Paramètre title avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/014` | Texte title : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `game.export/015` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/016` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/017` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `game.export/018` | Paramètre generateLods absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/019` | Paramètre generateLods avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/020` | Booléen generateLods : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |
| `game.export/021` | Paramètre geometrySimplification absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/022` | Paramètre geometrySimplification avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/023` | Option de geometrySimplification : "off" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/024` | Option de geometrySimplification : "conservative" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/025` | Option de geometrySimplification : "balanced" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/026` | Option de geometrySimplification : "aggressive" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/027` | Option inconnue de geometrySimplification : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `game.export/028` | Paramètre textureCompression absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/029` | Paramètre textureCompression avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/030` | Option de textureCompression : "off" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/031` | Option de textureCompression : "conservative" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/032` | Option de textureCompression : "balanced" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/033` | Option de textureCompression : "aggressive" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/034` | Option inconnue de textureCompression : vérifier rejet, pas de sélection silencieuse d’une option voisine. |
| `game.export/035` | Paramètre textureReduction absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `game.export/036` | Paramètre textureReduction avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `game.export/037` | Option de textureReduction : "off" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/038` | Option de textureReduction : "half" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/039` | Option de textureReduction : "quarter" ; fixture compatible, vérifier précisément la branche métier correspondante. |
| `game.export/040` | Option inconnue de textureReduction : vérifier rejet, pas de sélection silencieuse d’une option voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
