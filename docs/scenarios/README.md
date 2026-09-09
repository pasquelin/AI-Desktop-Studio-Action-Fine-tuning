# Inventaire des scénarios — AI Desktop Studio

Analyse statique du 9 septembre 2026 : **310 actions / 310 outils MCP / 26 familles / 638 champs internes**. Catalogue vérifié frais avant extraction. Révision `6299591dcfeff889fa40e2a7cfc1d98fe4231ab4`, empreinte catalogue `d54e899f36b850483dfa6156ba2c8012d44c67125f0637dcf45abe3c5d5109d7`.

**481 demandes existantes dans Studio**, **5165 cas proposés action par action**, puis une matrice de variantes et **63 parcours composés**. Aucun de ces nouveaux cas n’a été exécuté. Le nombre de cas proposés inclut des cas de validation de paramètres ; il ne représente pas autant de conversations complètes ni de tests prêts à lancer.

Les trois parcours décrits auparavant appartiennent au compagnon. Studio possède déjà sa propre batterie : elle doit être réutilisée et adaptée, pas réécrite aveuglément. Son en-tête annonce encore 472 demandes ; le recomptage des entrées en trouve 481.

**Couverture déclarée : 309 actions ont au moins un rang ; `animation.reopenMotion` n’en a aucun.** Son fixture doit contenir un asset de mouvement précédemment enregistré, comme l’indique coverage.test.ts. Avoir un rang associé ne prouve pas qu’un modèle appelle l’action ni que son effet est correctement mesuré.

- [Toutes les demandes existantes](existants.md)
- [Inventaire CSV de tous les outils MCP](inventaire-mcp.csv)
- [Variantes transversales](variantes.md)
- [Parcours composés proposés](parcours.md)
- [Priorités et critères de recette](recette.md)

| Famille | Actions | Cas proposés détaillés |
|---|---:|---:|
| [IA, génération et navigation](core.md) | 15 | 429 |
| [Ciblage](target.md) | 1 | 11 |
| [Documents et état](state.md) | 10 | 126 |
| [Projets et fichiers](file.md) | 21 | 239 |
| [Tâches et coûts](job.md) | 7 | 78 |
| [Catalogue des médias](asset.md) | 9 | 134 |
| [Bibliothèque distante et synchronisation](cloud.md) | 6 | 105 |
| [Images, calques et dessin](canvas.md) | 27 | 585 |
| [Montage audio et vidéo](montage.md) | 17 | 238 |
| [Matériaux, skybox et styles](material.md) | 16 | 330 |
| [Scène 3D, caméra et monde](scene.md) | 49 | 1007 |
| [Post-traitement](post.md) | 17 | 287 |
| [Squelette et animation](rig.md) | 25 | 427 |
| [Versionnement Git](git.md) | 24 | 246 |
| [Composants de jeu](game.md) | 3 | 105 |
| [Exécution du jeu](play.md) | 8 | 64 |
| [Scripts](script.md) | 3 | 33 |
| [Découverte et lots d’actions](studio.md) | 3 | 30 |
| [Déroulement des scènes](timeline.md) | 3 | 64 |
| [Assemblage et préfabs](assembly.md) | 3 | 45 |
| [Export du jeu](export.md) | 1 | 40 |
| [Contrôles et graphes](project.md) | 7 | 90 |
| [Fiches du projet](context.md) | 3 | 40 |
| [Mémoire de l’assistant](memory.md) | 5 | 82 |
| [Réglages et comptes](settings.md) | 6 | 87 |
| [Fenêtres, système et dictée](shell.md) | 21 | 243 |

## Portée de l’analyse

Les fiches reproduisent les champs, choix, bornes, capacités et engagements exportés. Les résultats précis des cas limites restent à fixer en lisant le handler lors de leur implémentation. Les callbacks dynamiques ne sont pas développés par cet inventaire. Une énumération finie ne couvre pas toutes les conversations et combinaisons possibles.

Sources lues : registre et outils via le catalogue, scripts/banc/BATTERIE.md, coverage.ts, coverage.test.ts, batterie.test.ts, scénarios et types du banc. Les 481 demandes sont extraites de la batterie documentaire ; la parité avec la liste exécutable est encadrée par batterie.test.ts mais n’a pas été réexécutée ici.
