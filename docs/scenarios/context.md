# Fiches du projet — 3 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer fiches et contenus du projet cible ; vérifier persistance, suppression et absence de contamination entre projets.

## context.readProjectCards — Lire le contexte du projet

Répond les fiches de contexte — ce que la PERSONNE a dit de ce projet — avec leur titre, leur texte et si elles s’appliquent.

- Nom MCP : `context_readProjectCards`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["projectContext"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 57.3.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `context.readProjectCards/001` | Nominal minimal : demander « Lire le contexte du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `context.readProjectCards/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `context.readProjectCards/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `context.readProjectCards/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `context.readProjectCards/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `context.readProjectCards/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `context.readProjectCards/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `context.readProjectCards/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## context.writeProjectCard — Écrire une fiche de contexte

Écrit ce que la PERSONNE dit que le projet EST ou VISE, dans son ensemble, en fiche durable relue à chaque tour. Une règle de travail sur la façon dont une chose se fait ici — comment les caméras bougent, comment les fichiers se nomment — est un souvenir : memory.write.

- Nom MCP : `context_writeProjectCard`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["projectContext"]}`.
- Préconditions/dépendances déclarées : `{"raises":{"runtimeFunction":true}}`.
- Batterie existante : 57.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cardId` | text | False | `{}` |
| `title` | text | False | `{"max":60}` |
| `body` | longText | False | `{"max":500}` |
| `active` | boolean | False | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `context.writeProjectCard/001` | Nominal minimal : demander « Écrire une fiche de contexte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `context.writeProjectCard/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `context.writeProjectCard/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `context.writeProjectCard/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `context.writeProjectCard/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `context.writeProjectCard/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `context.writeProjectCard/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `context.writeProjectCard/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `context.writeProjectCard/009` | Préparation ou contrainte dynamique manquante : tester chaque branche du callback du handler ; le marqueur runtimeFunction du catalogue ne révèle pas ces branches. |
| `context.writeProjectCard/010` | Paramètre cardId absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `context.writeProjectCard/011` | Paramètre cardId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `context.writeProjectCard/012` | Texte cardId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `context.writeProjectCard/013` | Paramètre title absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `context.writeProjectCard/014` | Paramètre title avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `context.writeProjectCard/015` | Texte title : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `context.writeProjectCard/016` | Paramètre body absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `context.writeProjectCard/017` | Paramètre body avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `context.writeProjectCard/018` | Paramètre active absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `context.writeProjectCard/019` | Paramètre active avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `context.writeProjectCard/020` | Booléen active : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## context.deleteProjectCard — Supprimer une fiche de contexte

Retire du contexte du projet la fiche que désigne un identifiant — ce que la personne a dit, dédit. Son texte est perdu.

- Nom MCP : `context_deleteProjectCard`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{"targets":["projectContext"],"documentAffinity":"transversal"}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 57.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `cardId` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["cardId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `context.deleteProjectCard/001` | Nominal minimal : demander « Supprimer une fiche de contexte » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `context.deleteProjectCard/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `context.deleteProjectCard/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `context.deleteProjectCard/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `context.deleteProjectCard/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `context.deleteProjectCard/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `context.deleteProjectCard/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `context.deleteProjectCard/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `context.deleteProjectCard/009` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `context.deleteProjectCard/010` | Paramètre cardId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `context.deleteProjectCard/011` | Paramètre cardId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `context.deleteProjectCard/012` | Texte cardId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
