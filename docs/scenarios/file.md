# Projets et fichiers — 21 actions

Statut : catalogue de conception, non exécuté. Les références de batterie sont des correspondances déclarées dans Studio, pas des résultats de test.

Comparer arborescence et octets sur disque invité, chemin du projet actif et historique annuler/rétablir ; ne pas se contenter de la liste affichée.

## projects.list — Lister les projets récents

Rend les projets récents dans l’ordre où le studio les affiche, chacun avec le chemin absolu qui l’ouvre — passer ce chemin à project.open.

- Nom MCP : `projects_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `projects.list/001` | Nominal minimal : demander « Lister les projets récents » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `projects.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `projects.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `projects.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `projects.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `projects.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `projects.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.open — Ouvrir un dossier de projet

Ouvre un projet depuis un chemin absolu de cette machine, sans lever le dialogue système qu’une personne utiliserait. Répond si le dossier était bien un projet.

- Nom MCP : `project_open`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.7, 41.11.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{"picks":"folder"}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.open/001` | Nominal minimal : demander « Ouvrir un dossier de projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.open/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `project.open/009` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.open/010` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.open/011` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.open/012` | Cible path : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.close — Fermer le projet ouvert

Referme le projet ouvert et laisse le studio sans projet : les panneaux se vident et le catalogue cesse de répondre. Le dossier n’est pas touché et reste dans les projets récents.

- Nom MCP : `project_close`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"asksItself":true}`.
- Batterie existante : 41.9.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.close/001` | Nominal minimal : demander « Fermer le projet ouvert » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.close/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.close/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.close/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.close/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.close/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.close/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.close/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.create — Créer un dossier de projet

Crée un projet et l’ouvre, sans lever le dialogue système qu’une personne utiliserait. Un NOM suffit — le studio le pose là où cette personne range ses projets, indiqué plus haut. Le champ folder dit dans quel dossier le créer, quand la phrase en nomme un. Pour laisser le choix de l’emplacement, appeler quand même l’action : sa confirmation porte un bouton qui ouvre le sélecteur du système et remplit le champ folder.

- Nom MCP : `project_create`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.6, 41.10.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `name` | text | True | `{}` |
| `folder` | text | False | `{"picks":"folder"}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.create/001` | Nominal minimal : demander « Créer un dossier de projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.create/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.create/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.create/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.create/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.create/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.create/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.create/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `project.create/009` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.create/010` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.create/011` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.create/012` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `project.create/013` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.create/014` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.create/015` | Cible folder : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.forget — Retirer un projet des projets récents

Retire un projet de la liste des projets récents, qui n’est qu’une liste de raccourcis. LE DOSSIER N’EST PAS TOUCHÉ et rien n’est effacé : rouvrir le projet remet la ligne. Pour mettre le dossier à la corbeille, c’est project.trash. Nommé par le chemin absolu que projects.list rend.

- Nom MCP : `project_forget`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.12.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{"picks":"folder"}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.forget/001` | Nominal minimal : demander « Retirer un projet des projets récents » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.forget/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.forget/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.forget/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.forget/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.forget/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.forget/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.forget/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `project.forget/009` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.forget/010` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.forget/011` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.forget/012` | Cible path : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.trash — Mettre un projet à la corbeille

Met à la corbeille du système le DOSSIER du projet et tout ce qu’il contient — documents, assets, catalogue. Rien dans le studio ne revient dessus : seule la corbeille du système peut le rendre. Le projet est refermé s’il était ouvert, et sa ligne quitte les projets récents. Pour seulement retirer la ligne sans toucher au dossier, c’est project.forget. Nommé par le chemin absolu que projects.list rend.

- Nom MCP : `project_trash`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.13.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{"picks":"folder"}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.trash/001` | Nominal minimal : demander « Mettre un projet à la corbeille » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.trash/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.trash/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.trash/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.trash/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.trash/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.trash/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.trash/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `project.trash/009` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.trash/010` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.trash/011` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.trash/012` | Cible path : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## file.open — Ouvrir un fichier du projet

Ouvre n’importe quel fichier du dossier du projet — une image, un modèle 3D, une matière, un document — dans l’espace qui l’édite, comme un double-clic dans l’Explorateur. Un fichier qu’aucun éditeur d’ici ne prend est confié au programme auquel il appartient.

- Nom MCP : `file_open`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `both`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"uses":["projectFilePaths"]}`.
- Batterie existante : 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 22.3, 66.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `file.open/001` | Nominal minimal : demander « Ouvrir un fichier du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `file.open/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `file.open/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `file.open/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `file.open/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `file.open/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `file.open/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `file.open/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `file.open/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `file.open/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.list — Lister un dossier

Rend les entrées d’un dossier du projet ouvert, fichiers comme dossiers, avec le chemin sous lequel chacune est connue. Sans dossier donné, liste la racine du projet.

- Nom MCP : `files_list`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"returns":["projectFilePaths"]}`.
- Batterie existante : 1.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `folder` | text | False | `{}` |
| `hidden` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.list/001` | Nominal minimal : demander « Lister un dossier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.list/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.list/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.list/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.list/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.list/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.list/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.list/008` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `files.list/009` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.list/010` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.list/011` | Paramètre hidden absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `files.list/012` | Paramètre hidden avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.list/013` | Booléen hidden : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.search — Chercher dans les fichiers du projet

Cherche dans tout le projet ouvert par le nom et rend les entrées trouvées avec leur chemin. Ne change rien à l’écran. Trouver n’est pas ouvrir : file.open ouvre ce qui a été trouvé, et file.rename le renomme.

- Nom MCP : `files_search`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{"returns":["projectFilePaths"]}`.
- Batterie existante : 1.2, 3.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `query` | text | True | `{}` |
| `hidden` | boolean | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["query"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.search/001` | Nominal minimal : demander « Chercher dans les fichiers du projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.search/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.search/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.search/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.search/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.search/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.search/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.search/008` | Paramètre query absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `files.search/009` | Paramètre query avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.search/010` | Texte query : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.search/011` | Paramètre hidden absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `files.search/012` | Paramètre hidden avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.search/013` | Booléen hidden : vrai puis faux avec état initial opposé ; vérifier les deux effets et ne pas traiter faux comme un paramètre absent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.move — Déplacer des fichiers

Déplace des fichiers et des dossiers du projet vers un autre de ses dossiers. Le disque change, mais l’Explorateur peut encore l’annuler ensuite.

- Nom MCP : `files_move`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `paths` | text | True | `{"repeated":true}` |
| `folder` | text | False | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["paths"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.move/001` | Nominal minimal : demander « Déplacer des fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.move/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.move/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.move/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.move/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.move/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.move/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.move/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `files.move/009` | Paramètre paths absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `files.move/010` | Paramètre paths avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.move/011` | Texte paths : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.move/012` | Liste paths : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `files.move/013` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `files.move/014` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.move/015` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.copy — Copier des fichiers

Copie des fichiers et des dossiers du projet vers un autre de ses dossiers, en laissant les originaux où ils sont.

- Nom MCP : `files_copy`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `paths` | text | True | `{"repeated":true}` |
| `folder` | text | False | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["paths"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.copy/001` | Nominal minimal : demander « Copier des fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.copy/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.copy/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.copy/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.copy/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.copy/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.copy/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.copy/008` | Paramètre paths absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `files.copy/009` | Paramètre paths avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.copy/010` | Texte paths : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.copy/011` | Liste paths : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |
| `files.copy/012` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `files.copy/013` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.copy/014` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.duplicate — Dupliquer des fichiers

Crée une copie de chaque fichier ou dossier nommé, à côté de lui, sous un nom que le studio choisit pour n’écraser personne.

- Nom MCP : `files_duplicate`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.3, 18.1.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `paths` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["paths"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.duplicate/001` | Nominal minimal : demander « Dupliquer des fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.duplicate/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.duplicate/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.duplicate/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.duplicate/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.duplicate/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.duplicate/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.duplicate/008` | Paramètre paths absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `files.duplicate/009` | Paramètre paths avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.duplicate/010` | Texte paths : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.duplicate/011` | Liste paths : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.trash — Mettre des fichiers à la corbeille

Envoie des fichiers et des dossiers du projet à la corbeille du système. Ce qui a été emporté figure dans l’activité récente.

- Nom MCP : `files_trash`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.7, 4.8, 30.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `paths` | text | True | `{"repeated":true}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["paths"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.trash/001` | Nominal minimal : demander « Mettre des fichiers à la corbeille » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.trash/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.trash/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.trash/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.trash/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.trash/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.trash/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.trash/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `files.trash/009` | Paramètre paths absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `files.trash/010` | Paramètre paths avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `files.trash/011` | Texte paths : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `files.trash/012` | Liste paths : vide, singleton, plusieurs éléments, doublons et un élément invalide ; vérifier ordre, déduplication et atomicité réellement prévus. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## file.rename — Renommer un fichier

Donne un autre nom à un fichier ou un dossier du projet, dans le dossier où il se trouve déjà. Un autre programme le connaît peut-être sous l’ancien.

- Nom MCP : `file_rename`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.4, 18.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["path","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `file.rename/001` | Nominal minimal : demander « Renommer un fichier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `file.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `file.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `file.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `file.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `file.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `file.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `file.rename/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `file.rename/009` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `file.rename/010` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `file.rename/011` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `file.rename/012` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `file.rename/013` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `file.rename/014` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## file.facts — Lire les faits d’un fichier

Rend ce que le disque consigne d’une entrée — sa nature, sa taille en octets, sa création et sa dernière modification. Ne change rien à l’écran.

- Nom MCP : `file_facts`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `file.facts/001` | Nominal minimal : demander « Lire les faits d’un fichier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `file.facts/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `file.facts/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `file.facts/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `file.facts/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `file.facts/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `file.facts/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `file.facts/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `file.facts/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `file.facts/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## folder.new — Créer un dossier

Crée un dossier dans un dossier du projet ouvert. Répond avec le chemin qui lui a été donné, qui peut différer si le nom était pris.

- Nom MCP : `folder_new`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 4.1, 4.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `folder` | text | False | `{}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `folder.new/001` | Nominal minimal : demander « Créer un dossier » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `folder.new/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `folder.new/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `folder.new/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `folder.new/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `folder.new/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `folder.new/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `folder.new/008` | Paramètre folder absent : vérifier la valeur par défaut réelle ou la conservation de la valeur courante ; ne pas en inventer une. |
| `folder.new/009` | Paramètre folder avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `folder.new/010` | Texte folder : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `folder.new/011` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `folder.new/012` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `folder.new/013` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.undoFileOperation — Annuler le dernier lot de fichiers

Reprend le dernier déplacement, renommage ou duplication de fichiers du projet. La pile vit dans le processus principal et vaut pour toutes les fenêtres, mais une mise à la corbeille ne se reprend pas.

- Nom MCP : `files_undoFileOperation`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 29.2, 29.3, 29.5, 29.6.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.undoFileOperation/001` | Nominal minimal : demander « Annuler le dernier lot de fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.undoFileOperation/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.undoFileOperation/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.undoFileOperation/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.undoFileOperation/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.undoFileOperation/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.undoFileOperation/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.undoFileOperation/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.redoFileOperation — Refaire le dernier lot de fichiers

Rejoue le lot de fichiers qui venait d’être annulé, exactement comme le fait l’Explorateur. Répond avec ce qui a bougé et ce qui a été refusé.

- Nom MCP : `files_redoFileOperation`.
- Engagement déclaré : `files` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.4.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.redoFileOperation/001` | Nominal minimal : demander « Refaire le dernier lot de fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.redoFileOperation/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.redoFileOperation/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.redoFileOperation/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.redoFileOperation/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.redoFileOperation/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.redoFileOperation/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `files.redoFileOperation/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## files.canUndoRedo — Lire la pile des gestes de fichiers

Dit si annuler ou refaire ferait quelque chose, sans rien tenter. C’est ce qui grise les deux entrées de menu avant qu’on ne clique dessus.

- Nom MCP : `files_canUndoRedo`.
- Engagement déclaré : `none` ; répétable : `true` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.2.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| Aucun | — | — | — |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `[]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `files.canUndoRedo/001` | Nominal minimal : demander « Lire la pile des gestes de fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `files.canUndoRedo/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `files.canUndoRedo/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `files.canUndoRedo/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `files.canUndoRedo/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `files.canUndoRedo/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `files.canUndoRedo/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## file.reveal — Montrer un fichier dans le gestionnaire de fichiers

Ouvre le Finder ou l’explorateur du système sur le fichier nommé, sélectionné. Le chemin ne sort jamais du processus principal.

- Nom MCP : `file_reveal`.
- Engagement déclaré : `none` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 42.5.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{}` |

Champs MCP supplémentaires : `{}`. Champs requis sur le fil MCP : `["path"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `file.reveal/001` | Nominal minimal : demander « Montrer un fichier dans le gestionnaire de fichiers » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `file.reveal/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `file.reveal/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `file.reveal/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `file.reveal/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `file.reveal/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `file.reveal/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `file.reveal/008` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `file.reveal/009` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `file.reveal/010` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.

## project.rename — Renommer un projet

Renomme un projet, ce qui DÉPLACE son dossier : un projet est nommé par son dossier et par rien d’autre. Le contenu suit, rien n’est effacé. Nommé par le chemin absolu que projects.list rend, donc même fermé — et le chemin répondu est le NOUVEAU.

- Nom MCP : `project_rename`.
- Engagement déclaré : `studio` ; répétable : `false` ; portée : `mcp`.
- Capacités : `{}`.
- Préconditions/dépendances déclarées : `{}`.
- Batterie existante : 41.8.

| Paramètre interne | Type | Requis | Contraintes déclarées |
|---|---|---|---|
| `path` | text | True | `{"picks":"folder"}` |
| `name` | text | True | `{}` |

Champs MCP supplémentaires : `{"consent":{"type":"string","description":"Token from an earlier needsConsent refusal. Single-use, 5 minutes, answers for this call alone"}}`. Champs requis sur le fil MCP : `["path","name"]`. Les schémas et la normalisation métier peuvent différer.

| Cas proposé | Mise en situation et résultat à contrôler |
|---|---|
| `project.rename/001` | Nominal minimal : demander « Renommer un projet » dans un décor valide, fournir seulement les paramètres obligatoires ; vérifier le résultat décrit ci-dessus avec un lecteur métier indépendant. |
| `project.rename/002` | Nominal complet : renseigner tous les paramètres compatibles, comparer chacun au résultat ; ne pas combiner des options mutuellement exclusives sans consulter le handler. |
| `project.rename/003` | Champ inconnu sur le fil MCP : vérifier le refus prévu par additionalProperties=false ; distinguer ce rejet de la normalisation du moteur interne. |
| `project.rename/004` | Échec de l’exécuteur : injecter une erreur déterministe du port concerné ; réponse explicite, aucune annonce de réussite et aucune mutation collatérale. |
| `project.rename/005` | Retour perdu ou requête répétée : observer les effets avant une éventuelle relance ; ne pas confondre répétable avec idempotent, ne pas dupliquer un effet non demandé. |
| `project.rename/006` | État concurrent : modifier la cible ou fermer le document entre lecture et action ; relire ou refuser explicitement, sans agir sur un autre objet. |
| `project.rename/007` | Demande annulée avant exécution : ne pas lancer l’action ; tester séparément une annulation tardive, qui ne garantit pas l’annulation d’un effet déjà réalisé. |
| `project.rename/008` | Consentement : accord, refus, absence de réponse et modification de la demande après accord ; vérifier le mécanisme réel de confirmation avant effets sensibles, sans inventer un champ consent. |
| `project.rename/009` | Paramètre path absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.rename/010` | Paramètre path avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.rename/011` | Texte path : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |
| `project.rename/012` | Cible path : identifiant valide, absent, obsolète, autre document/projet et deux noms identiques ; résoudre l’identifiant réel, clarifier l’ambiguïté, protéger la cible voisine. |
| `project.rename/013` | Paramètre name absent : vérifier refus ou clarification avant l’appel utile, selon le contrat. |
| `project.rename/014` | Paramètre name avec null et type incompatible : vérifier la validation du fil MCP puis, séparément, celle du handler ; résultat sans effet partiel non prévu. |
| `project.rename/015` | Texte name : vide, espaces, accents, Unicode, nom long et caractères de ponctuation ; vérifier validation et conservation selon la sémantique du champ. |

Variantes transversales à appliquer selon les capacités : voir [la matrice](variantes.md). Les cas ci-dessus sont des spécifications à compléter avec fixtures et résultats exacts ; ils ne constituent pas un corpus d’entraînement.
