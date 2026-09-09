# Modèle local : premier essai de propositions

Le lot utilise [Qwen3.5-2B dans Ollama](https://ollama.com/library/qwen3.5:2b), annoncé Apache 2.0, quantifié Q8_0, environ 2,7 Go. Ollama sert à l’inférence locale ; aucun fine-tuning n’est effectué. Le téléchargement du modèle a été explicitement demandé. Le modèle est conservé dans le stockage Ollama habituel, pas dans Git.

## Commandes

- `npm run model:pull` : téléchargement explicite. Nécessite Internet et Ollama démarré.
- `npm run model:check` : présence locale et empreinte du modèle.
- `npm run model:eval` : propositions et rapport ; ne télécharge pas automatiquement de modèle.

`pnpm model:pull`, `pnpm model:check` et `pnpm model:eval` sont équivalents. L’évaluation contacte uniquement Ollama sur `127.0.0.1:11434`, sans API distante et sans client MCP Studio. Elle réutilise le moteur existant, sans modifier ses réglages globaux. Après les requêtes, le modèle a une rétention demandée de deux minutes ; cela ne stoppe pas le service Ollama.

## Mesure

Le catalogue local exporté fournit six schémas réels : création de projet, ouverture d’espace, ajout, renommage et déplacement d’objet, sauvegarde. Les requêtes testent la sélection parmi ces six outils, pas parmi les 310.

Deux demandes par langue (projet et cube), dans les quinze langues actuellement exposées par Studio, plus quatre cas français couvrant les autres outils. Les formulations sont synthétiques, à relire par des locuteurs avant d’en tirer une conclusion sur la qualité multilingue.

Le protocole utilise une seule proposition, température zéro, graine 42, réflexion désactivée, contexte de 8192 tokens et sortie limitée à 256 tokens. Une proposition n’est exacte que si l’action et les arguments correspondent exactement à l’attendu, respectent le schéma et ne comportent aucun appel supplémentaire. Des arguments optionnels équivalents peuvent donc être classés « à revoir » : ce score est strict, pas une mesure de réussite métier.

Aucune proposition n’est exécutée, aucun consentement n’est accordé et aucun exemple n’entre automatiquement dans un dataset d’apprentissage. Le chemin `/vm/projects` n’est qu’une donnée de la consigne.

## Traçabilité

`artifacts/model/baseline.json` conserve les demandes, attentes, réponses brutes, durées, empreinte du modèle installé, version et métadonnées Ollama, protocole et empreinte du fichier catalogue. `baseline.md` est la synthèse lisible. Ces deux fichiers sont remplacés au prochain essai.

La première requête comprend potentiellement le chargement du modèle : sa durée ne se compare pas directement aux suivantes. Le tag Ollama peut évoluer lors d’un prochain téléchargement ; comparer les empreintes des rapports et conserver une copie d’un rapport avant une nouvelle mesure si nécessaire. Ne pas mettre à jour le modèle pendant un essai.

Le catalogue peut représenter une révision antérieure de Studio : l’évaluation mesure ce snapshot, dont l’empreinte est enregistrée. Le contrôle de fraîcheur reste requis avant de brancher une exécution réelle. Les erreurs de prédiction sont des résultats du banc ; elles ne font pas échouer sa commande. Une panne du service ou une réponse incorrecte est consignée comme échec du cas, jamais comme succès.

## Suite

Après correction de la disponibilité des documents dans Studio, valider à nouveau le parcours de référence dans la VM, puis évaluer l’exécution des propositions. Constituer ensuite seulement les exemples vérifiés destinés au fine-tuning. MLX ou un autre moteur d’entraînement reste à intégrer séparément.
