# Banc avant entraînement

## Préparer et lancer

`npm run prepare:bench` régénère les fixtures locales, les fiches, les variantes de contrat, les partitions et le rapport de préparation. Cette commande ne lance ni modèle, ni entraînement, ni action Studio. `pnpm prepare:bench` appelle la même chaîne.

`npm run bench:run -- --journey P003` prépare une copie Tart, récupère la révision distante de develop, construit Studio puis joue le parcours sélectionné. Sans `--journey`, le parcours historique projet–scène–cube reste disponible. L'observateur démarre avec le lanceur. Chaque parcours utilise sa propre copie ; un échec conserve les rapports et la VM arrêtée, un succès supprime la copie. Les corrections locales non poussées de Studio ne sont donc pas incluses.

Les définitions sont dans `datasets/bench/journeys/P001.json` à `P063.json`. Le manifeste `artifacts/bench/preparation.json` donne les étapes, prérequis, variables externes, blocages et empreintes. `readyForAttempt` autorise une tentative ; `executionVerified: false` ne prétend jamais que Studio a réussi. Les 5 165 cas de conception restent distincts de ces 63 parcours : les variantes de contrat ne deviennent pas automatiquement des tests métier.

## Contrat exécutable

Chaque étape indique l'action réelle, ses arguments, le nom du résultat enregistré et des assertions. Les références `$ref` utilisent les vrais résultats précédents ; une sélection ambiguë ou absente échoue. Les observations `$file` lisent le disque du projet jetable, avec contrôle du chemin réel. Les paramètres littéraux passent les schémas MCP avant lancement ; les arguments résolus passent les schémas à l'exécution.

Le moteur commun persiste avant mutation et après chaque étape. Une assertion fausse bloque les étapes suivantes. Un refus attendu n'accepte qu'une erreur MCP explicite correspondant au scénario, jamais une panne réseau ni un simple champ de réponse. Les confirmations automatiques restent celles de la politique VM existante ; elles sont désactivées pour une étape qui doit refuser.

`requires` déclare des capacités ; `requiredBindings` déclare les variables externes encore nécessaires. Le lanceur refuse les prérequis non fournis et les blocages déclarés. La capacité `local-media-fixtures` copie quatre médias déterministes dans `Fixtures` après création du projet ; les étapes ouvrent ensuite les chemins relatifs et récupèrent les identifiants du catalogue Studio. La copie seule n'est pas un import.

## Preuves et conversations

Le rapport `results/scenario.json` garde les arguments résolus, réponses, résultats des contrôles et provenance. Les empreintes du scénario, du moteur, du catalogue et des médias transférés sont contrôlées avant les actions. Une erreur de préparation produit aussi un rapport d'échec.

Un parcours déclaratif intégralement réussi peut écrire `conversation-draft.json` et un lien `conversationEvidence` vers son contenu exact. Le brouillon reste **pending** : il faut vérifier la correspondance entre demande, actions, observations et réponse finale. Les parcours de refus ne sont pas convertis automatiquement. Les appels sont ceux du script de référence ; aucun modèle n'a produit ces actions.

Le filtre `dataset:export` refuse les brouillons, échecs, preuves périmées et groupes qui traversent les partitions. Il ne lance jamais LoRA. Voir `export-approved.md`.

## Régression trouvée pendant la recette

Un ancien essai P003 affichait passed alors que le journal signalait une erreur de chargement : avant et après étaient tous deux l'image par défaut. Ce résultat n'est pas accepté pour l'entraînement. P003 et P007 utilisent maintenant dimensions et contenu distinctifs, ainsi que l'identité réelle du document. P062 conserve un nœud témoin après le refus du lot. Les anciennes preuves restent conservées telles quelles ; la nouvelle empreinte du scénario les rend périmées pour l'export.

## Travail restant identifié

Les parcours avec médias spécifiques, comptes, modèles installés, lecture de pixels, rigging, export exécutable, redémarrage ou interactions humaines gardent leurs blocages détaillés. Les rapports `bench-family-a.md`, `bench-family-b.md` et `bench-family-c.md` décrivent leurs dépendances. Un témoin de schéma valide ou une traduction relue ne suffit pas à les approuver.
