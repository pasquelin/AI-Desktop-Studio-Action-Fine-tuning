# Ciblage — 1 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer l’état métier avant/après avec un lecteur indépendant, puis la persistance si l’action en prévoit une.

## target.select — Désigner une cible

Désigne dans le document ouvert ce que la suite visera — un calque, un objet de scène, un clip. Prenez l’identifiant dans la liste des cibles de ce briefing. Sans elle, il n’y a rien à viser.

- Nom MCP : `target_select`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `both`.
- Capacités : `{"targets":["layer","node","clip","track"]}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 45.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `aimId` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["aimId"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `target.select/001` | Nominal minimal : demander « Désigner une cible » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `target.select/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `target.select/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `target.select/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `target.select/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `target.select/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `target.select/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `target.select/008` | Contexte absent ou incompatible : aucune surface active, document d’un autre type, cible fermée ; vérifier la précondition réelle et une explication exploitable. |
| `target.select/009` | Paramètre aimId absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `target.select/010` | Paramètre aimId avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `target.select/011` | Texte aimId : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
