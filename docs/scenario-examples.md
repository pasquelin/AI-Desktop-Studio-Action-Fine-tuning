# Exemples précis : contrats et parcours métier

`node tools/prepare-examples.ts` reconstruit `artifacts/examples/` depuis l'inventaire complet, les contrats internes et les **schémas MCP publiés**. Aucun appel à Studio n'est envoyé.

L'ensemble couvre 5 165 cas et 63 parcours. Il développe 8 737 requêtes avec arguments explicites : 2 422 sont refusées par le schéma MCP et 6 315 l'acceptent. Ce sont des résultats de validation de forme, pas des preuves métier. Chaque refus conserve le chemin, la règle et les paramètres Ajv ; les scénarios acceptés peuvent encore être refusés par Studio, demander un consentement ou nécessiter une ressource réelle.

Les entrées contenant `fixture` restent des paramètres de conception : elles ne représentent aucun identifiant ou fichier existant. Toutes les fiches métier restent bloquées jusqu'au raccordement de leur état initial, leur oracle spécifique et leur exécution. Les 63 parcours conservent leur demande et résultat attendu, sans inventer une suite d'arguments à partir d'une simple liste d'actions candidates.

## Premier parcours concret

`datasets/examples/project-scene-cube.fr.json` contient sept demandes françaises avec contexte synthétique complet pour sélectionner l'action : création de projet, scène, cube, renommage, déplacement, sauvegarde et réouverture. Les appels sont dérivés du parcours réel `tools/vm/scenarios/project.mjs`. Les résultats attendus sont écrits séparément de la réponse du modèle.

Ce lot est un exemple de sélection d'outils, pas une trace de réussite en VM. Ses identifiants synthétiques doivent être remplacés par les identifiants réellement lus dans la VM ; le dossier de test doit être créé et isolé par l'exécuteur. La confirmation appartient au contrôleur d'exécution et ne doit jamais être fabriquée dans une conversation d'entraînement.

Les sept demandes appartiennent à un même groupe sémantique. Leurs traductions, reformulations et variantes doivent rester dans la même partition. Ce lot est déjà visible dans le développement : ne pas le présenter comme test inédit.

## Ce qui empêche encore l'entraînement

- Une demande technique de validation de schéma n'est pas une conversation utilisateur.
- Les traductions sont référencées avec un état de relecture, sans approbation automatique.
- Les références aux 481 fixtures Studio sont validées par leur rang et empreinte, mais leur adaptation exacte à chaque cas reste à réaliser.
- Aucune ligne produite ici n'est approuvée pour LoRA ; aucune exécution Studio n'est revendiquée.

Les sorties générées sont ignorées par Git. Les sources, le compilateur et le petit lot synthétique sont versionnables. Le manifeste contient les empreintes des sources ; la fraîcheur du catalogue reste une porte indépendante.
