# Export du catalogue

Lot autorisé : export uniquement, sans scénario, modèle ou modification d’AI Desktop Studio.

## Contrat retenu

- Lire un checkout explicite, propre, à une révision Git complète attendue.
- Charger le registre et les fonctions de schéma de l’application avec Vite, sans sa configuration de build et sans démarrer de serveur.
- Exporter l’ordre et les familles, les descripteurs complets, le schéma interne et la liste MCP réelle. Conserver les traductions disponibles.
- Signaler les fonctions de métadonnées comme non sérialisables ; ne pas prétendre reproduire leur comportement en JSON.
- Vérifier l’accord entre l’union des noms déclarés, les familles et le registre. Un changement incohérent doit faire échouer l’export.
- Associer révision et empreintes des sources au résultat déterministe. Refuser un checkout modifié pendant l’export.
- Régénérer le fichier de sortie par remplacement atomique ; ce fichier est un artefact généré.

Les tests emploient un petit registre synthétique pour contrôler l’exporteur, puis un export réel est vérifié séparément. Ils ne simulent pas le fonctionnement métier de l’application.

## Étapes du lot

1. Tests des noms manquants, doublons, fonctions de métadonnées et révision incorrecte.
2. Chargeur isolé, validation, empreintes et commande d’export.
3. Export réel, contrôle de reproductibilité et validation complète du compagnon.


## Commandes

```sh
pnpm run catalogue:export --source /chemin/vers/AI-Desktop-Studio --revision SHA_COMPLET
pnpm run catalogue:check
pnpm run validate
```

Avec npm, séparer les arguments : `npm run catalogue:export -- --source /chemin/vers/Studio`. La révision est facultative : sans elle, l’export capture le HEAD propre actuel. Aucun nombre d’actions ni liste de noms n’est codé en dur dans l’exporteur.

La sortie par défaut est `artifacts/catalogue.json`. Elle est générée et ignorée par Git, ainsi que `.studio-source.json`, qui mémorise localement le checkout et le fichier exporté. Ne jamais utiliser un document personnel comme sortie : une régénération remplace ce fichier.

## Automatisation et limites

Chaque `validate` exécute le contrôle de fraîcheur. Sur cette machine configurée, un changement de révision, de sources, un fichier modifié ou un export altéré bloque la validation. Relancer l’export sur le checkout propre actualisé résout l’obsolescence. Le contrôle ne surveille pas le disque en arrière-plan et ne modifie jamais Studio.

Sur une machine/CI sans `.studio-source.json`, le contrôle annonce explicitement qu’il n’a pas vérifié la fraîcheur. Pour une CI reliée à Studio, il faudra fournir un checkout source et exécuter l’export ; aucun accès au dépôt source distant n’est ajouté dans ce lot.

Les empreintes couvrent l’ensemble des fichiers suivis de `src/shared` et le module MCP, donc un ensemble volontairement plus large que les seuls fichiers chargés. Les dépendances chargées hors de ces chemins sont refusées avant exécution. La configuration et les plugins de build de Studio ne sont pas chargés.

Le catalogue conserve les descripteurs, traductions, champs, bornes, engagements, portées, capacités et schémas. Les fonctions de métadonnées sont marquées `runtimeFunction: true` : leur logique reste dans le code identifié par les empreintes. Le JSON Schema interne dérive de `schemaOfFields` ; il ne remplace pas toutes les normalisations de `readInput`. Les schémas MCP restent distincts, notamment pour `consent`.

## Résultat vérifié

Révision Studio : `ac2f0b4d9b85dc7c02874adfed03920d2d4beb10`.
310 actions, 310 outils MCP, 26 familles, 15 langues, 863 fichiers source référencés. Export de 3 081 840 octets. Deux générations identiques octet pour octet. Aucune traduction de titre, description ou champ manquante dans cet export. Sept fonctions de métadonnées signalées comme non sérialisables.

Aucun scénario ni entraînement exécuté. Avant les futurs parcours, définir un espace disque jetable, un profil indépendant et des contrôles d’écriture pour ne pas toucher aux projets de travail. L’entraînement supervisé utilisera ensuite les exemples enregistrés, sans lancer l’application.
