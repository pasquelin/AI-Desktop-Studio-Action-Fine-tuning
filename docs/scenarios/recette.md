# Priorisation et passage à des tests exécutables

## Ordre proposé

1. **P0 — confinement et honnêteté** : aucun accès au Studio hôte, fichiers jetables, refus utilisateur, bonne cible, catalogue frais, échecs sans fausse réussite. Valider la VM réellement avant scénarios.
2. **P1 — usage quotidien** : lecture, projet, fichiers, documents, cube/transformations, calques, sauvegarde et réouverture. Réutiliser les cas de Studio avec leurs oracles, relus pour distinguer setup et effet testé.
3. **P2 — composition** : hiérarchies, montage, matériaux, animation, scripts et runtime. Ajouter les dépendances d’identifiants et les interruptions entre étapes.
4. **P3 — services et effets sensibles** : génération, cloud, Git distant, réglages système et dictée, avec comptes/périphériques de test. Séparer banc à ports contrôlés et vraie intégration réseau.
5. **P4 — robustesse et performance** : langues, formulation, tailles extrêmes, ressources contraintes, longue conversation et différences de versions.

Ces priorités ne dispensent aucune des 310 actions d’une couverture explicite. Une action hors du premier lot doit rester marquée non testée.

## Fiche nécessaire pour chaque scénario retenu

- Identifiant stable ; actions visées ; révision Studio/catalogue.
- Demande et variantes linguistiques relues.
- Décor initial déterministe, fichiers de fixture, objets témoins.
- Réponses utilisateur, permissions et confirmations attendues.
- Dépendances entre étapes ; identifiants découverts, jamais devinés.
- Effet final, tolérances, effets interdits et oracle indépendant.
- Injection d’erreur ciblée et état acceptable après interruption.
- Réinitialisation et contrôle des traces laissées après test.
- Niveau de preuve : contrat, handler avec ports contrôlés, VM réelle ou service distant de test.
- Statut explicite : proposé, fixture prête, implémenté, exécuté, réussi/échoué, bloqué.

## Ce que cette analyse établit

L’inventaire couvre les 310 noms du registre et leurs équivalents MCP. Les 638 champs déclarés, choix et bornes alimentent 5 165 cas candidats. Les 481 demandes documentées dans Studio et leurs associations sont référencées. Une action n’a aucun rang déclaré : animation.reopenMotion.

Les noms MCP remplacent les points par des underscores. Il s’agit de 310 outils d’un catalogue, pas de 310 serveurs MCP.

## Ce qu’elle ne prouve pas

Aucun score de modèle, aucune réussite des 481 demandes et aucune exécution des nouveaux cas ne sont établis ici. La lecture statique d’un schéma ne décrit pas toutes les branches d’un handler : les callbacks dynamiques, les préconditions implicites et la normalisation seront vérifiés lors de la mise en œuvre. Les tests de fondation du compagnon ne comptent pas comme scénarios métier.

## Maintenance

Cette documentation est un instantané de conception lié à sa révision. Le contrôle catalogue existant détecte les changements de Studio ; il ne régénère pas automatiquement ces fiches. Au raccordement des scénarios, ajouter un manifeste de couverture par identifiant d’action : action nouvelle/supprimée, champs modifiés et absence de scénario deviennent des écarts visibles. Ne pas masquer un trou par un simple total de tests.

Mesurer séparément la couverture déclarée et les outils effectivement appelés pendant le replay. Exiger que l’oracle détecte volontairement : mauvaise cible, seconde création, succès seulement verbal, mutation après refus et résultat déjà produit par le décor.


## Avertissement de fraîcheur implémenté

`npm run freshness:check` est lancé en premier par `npm run validate`, pour afficher l’avertissement même si un contrôle suivant échoue. Il compare le checkout Studio configuré aux deux références indépendantes de `configs/freshness.json` : rédaction des scénarios et entraînement du modèle. La référence d’entraînement est actuellement nulle : aucun modèle entraîné n’est annoncé à tort.

Une nouvelle révision, même sans modification des schémas MCP, ou des modifications locales déclenchent une alerte. Le contrôle est volontairement conservateur : un changement documentaire peut aussi demander une revue. Il indique les fichiers modifiés lorsque l’historique est disponible ; il n’établit pas automatiquement quels scénarios doivent changer.

L’alerte est un warning, pas un blocage supplémentaire. Une configuration invalide ou une vérification impossible pour un checkout configuré échoue explicitement. Sans checkout configuré (par exemple en CI), un warning indique que la comparaison n’a pas pu être faite.

La régénération du catalogue n’efface pas cette alerte. Mettre à jour la référence des scénarios seulement après revue effective ; renseigner la référence d’entraînement uniquement après un véritable entraînement documenté. Aucune remise à jour automatique de ces références.

Ce contrôle est local et hors ligne : il ne détecte pas un commit distant non récupéré et n’affiche pas de notification macOS lorsque le dépôt est inactif. L’avertissement apparaît au lancement de la validation, pas en surveillance permanente.
